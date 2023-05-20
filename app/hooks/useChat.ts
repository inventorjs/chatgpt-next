/**
 * 聊天交互 hooks
 */
import { useRef, useState } from 'react'
import axios from 'axios'
import sseAdapter from '@inventorjs/axios-sse-adapter'
import { produce } from 'immer'

const BASE_URL = 'https://api.openai.com:443/v1'
const DEFAULT_TITLE = '新会话'

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
  const [title, setTitle] = useState(DEFAULT_TITLE)
  const [system, setSystem] = useState('你是一个专业程序员')
  const [type, setType] = useState<'chat' | 'image'>('chat')
  const [isProcessing, setIsProcessing] = useState(false)
  const [list, setList] = useState<{ role: 'user' | 'assistant' | 'system', content: string, status?: 'error' | 'think' | 'answer' }[]>([])
  const refAbortController = useRef<AbortController>()

  const send = async (content, resend = false) => {
    if (!resend && !content.trim() || isProcessing) {
      return
    }
    const thinkItem = { role: 'assistant' as const, content: '思考中...', status: 'think' as const }
    let nextList = produce(list, (draft) => {
      if (!resend) {
        draft.push(
          { role: 'user', content },
          thinkItem,
        )
      } else {
        draft.splice(draft.length - 1, 1, thinkItem)
      }
    })
    setContent('')
    setList(nextList)
    setIsProcessing(true)
    if (!title || title === DEFAULT_TITLE) {
      const userItem = nextList.find((item) => item.role === 'user')
      userItem && setTitle(userItem.content)
    }
    refAbortController.current = new AbortController()
    try {
      const { data } = await instanse.request<ReadableStream>({
        url: '/chat/completions',
        signal: refAbortController.current.signal,
        data: {
          stream: true,
          model: 'gpt-3.5-turbo',
          messages: [
            { "role": "system", "content": system },
            ...nextList.map((item) => ({ role: item.role, content: item.content })),
          ]
        },
      })
      const reader = data.getReader()
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        const valueObj = JSON.parse(value)
        const content = valueObj?.choices?.[0]?.delta?.content
        if (content) {
          const lastAnswer = nextList.at(-1)
          let answerContent = lastAnswer?.content
          if (lastAnswer?.status !== 'answer') {
            answerContent = ''
          }
          const nextItem = { role: 'assistant' as const, content: answerContent + content, status: 'answer' as const }
          if (lastAnswer?.role !== 'assistant') {
            nextList = produce(nextList, (draft) => {
              draft.push(nextItem)
            })
          } else {
            nextList = produce(nextList, (draft) => {
              draft.splice(draft.length - 1, 1, nextItem)
            })
          }
          setList(nextList)
        }
      }
    } catch (err) {
      const message = err?.response?.data?.error?.message ?? err?.message ?? '请求服务失败, 请稍后重试'
      let lastAnswer = nextList.at(-1)
      const errorItem = { role: 'assistant' as const, content: message, status: 'error' as const }
      if (!lastAnswer || lastAnswer.role !== 'assistant') {
        nextList = produce(nextList, (draft) => {
          draft.push(errorItem)
        })
      } else {
        nextList = produce(nextList, (draft) => {
          draft.splice(draft.length - 1, 1, errorItem)
        })
      }
      setList(nextList)
    } finally {
      setIsProcessing(false)
    }
  }

  const onSend = () => send(content)

  const onChange = (content) => {
    setContent(content)
  }

  const onAbort = () => {
    setIsProcessing(false)
    refAbortController.current?.abort()
  }

  const onReAnswer = () => {
    send('', true)
  }

  return {
    list,
    content,
    title,
    isProcessing,
    onChange,
    onSend,
    onReAnswer,
    onAbort,
  }
}
