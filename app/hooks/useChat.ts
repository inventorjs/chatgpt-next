/**
 * 聊天交互 hooks
 */
import { useState } from 'react'
import axios from 'axios'
import sseAdapter from '@inventorjs/axios-sse-adapter'
import { produce } from 'immer'

const BASE_URL = 'https://api.openai.com:443/v1'

const instanse = axios.create({
  baseURL: BASE_URL,
  method: 'post',
  adapter: sseAdapter,
  headers: {
    'content-type': 'application/json',
  },
})

export function useChat() {
  const [content, setContent] = useState('')
  const [system, setSystem] = useState('You are a helpful assistant.')
  const [type, setType] = useState<'chat' | 'image'>('chat')
  const [isProcessing, setIsProcessing] = useState(false)
  const [list, setList] = useState<{ role: 'user' | 'assistant' | 'system', content: string }[]>([])

  const send = async () => {
    if (!content.trim()) {
      return
    }
    let nextList = produce(list, (draft) => { draft.push({ role: 'user', content }) })
    setContent('')
    setList(nextList)
    setIsProcessing(true)
    const { data } = await instanse.request<ReadableStream>({
      url: '/chat/completions',
      data: {
        stream: true,
        model: 'gpt-3.5-turbo',
        messages: [
          { "role": "system", "content": system },
          ...nextList,
        ]
      },
    })
    nextList = produce(nextList, (draft) => { draft.push({ role: 'assistant' as const, content: '' }) })
    const reader = data.getReader()
    while (true) {
      const { value, done } = await reader.read()
      const lastAnswer = nextList.at(-1)
      if (done || !lastAnswer) break
      const valueObj = JSON.parse(value)
      const content = valueObj?.choices?.[0]?.delta?.content
      if (content) {
        const nextContent = lastAnswer.content + content
        nextList = produce(nextList, (draft) => {
          draft.splice(draft.length - 1, 1, { ...lastAnswer, content: nextContent })
        })
        setList(nextList)
      }
    }
    setIsProcessing(false)
  }

  const onChange = (content) => {
    setContent(content)
  }

  return {
    send,
    list,
    content,
    isProcessing,
    onChange,
  }
}
