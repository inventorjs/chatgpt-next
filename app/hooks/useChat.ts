/**
 * 聊天交互 hooks
 */
import { useEffect, useRef, useState, useMemo } from 'react'
import { produce } from 'immer'
import { OpenaiSerivce } from '../services/api-service';
import { Storage } from '../services/storage';
import {
  gptModelOptions,
  modeOptions,
  imageSizeOptions,
  netTypeOptions,
} from '../config'


interface ChatItem {
  role: 'user' | 'assistant' | 'system';
  content: string;
  status?: 'error' | 'answer';
}

interface SessionItem {
  id: string
  title: string,
  chatList: ChatItem[]
  createdAt: number,
}

export function useChat() {
  const [content, setContent] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isWaiting, setIsWaiting] = useState(false)
  const [isSessionEdit, setIsSessionEdit] = useState(false)
  const [sessionList, setSessionList] = useState<SessionItem[]>([])
  const [sessionId, setSessionId] = useState<string>()
  const [config, setConfig] = useState({
    themeMode: 'dark',
    netType: netTypeOptions[0].value,
    mode: modeOptions[0].value,
    gptModel: gptModelOptions[0].value,
    imageSize: imageSizeOptions[0].value,
    apiKey: '',
  })
  const initRef = useRef(false)
  const refAbortController = useRef<AbortController>()

  useEffect(() => {
    if (!initRef.current) {
      Promise.all([
        Storage.getSessionList(),
        Storage.getConfig(),
      ]).then(([sessionList, config]) => {
        if (sessionList) {
          setSessionList(sessionList)
        }
        if (config) {
          setConfig(config)
        }
      }).finally(() => initRef.current = true)
    }
  }, [])

  useEffect(() => {
    if (initRef.current) {
      Storage.saveSessionList(sessionList)
    }
  }, [sessionList])

  useEffect(() => {
    if (initRef.current) {
      Storage.setConfig(config)
    }
  }, [config])

  const session = useMemo(
    () => {
      const session = sessionList.find((session) => session.id === sessionId)
      return session
    }, [sessionList, sessionId])

  const send = async (content, resend = false) => {
    const sendContent = content.trim()
    if (!resend && !sendContent || isProcessing) {
      return
    }

    const userItem: ChatItem = { role: 'user', content }
    let nextSessionList: SessionItem[]
    let nextChatList: ChatItem[]
    let sessionIndex = sessionList.findIndex((session) => session.id === sessionId)
    if (!~sessionIndex) {
      nextChatList = [userItem]
      sessionIndex = 0
      const id = String(Math.random())
      const newSession = {
        id,
        title: content,
        chatList: nextChatList,
        createdAt: Date.now()
      }
      nextSessionList = [newSession, ...sessionList]
      setSessionId(id)
    } else {
      nextSessionList = produce(sessionList, (draft) => {
        if (resend) {
          const chatList = draft[sessionIndex].chatList
          chatList.splice(chatList.length - 1, 1)
        } else {
          draft[sessionIndex].chatList.push(userItem)
        }
      })
      nextChatList = nextSessionList[sessionIndex].chatList
    }

    setSessionList(nextSessionList)
    setContent('')
    setIsWaiting(true)
    setIsProcessing(true)
    refAbortController.current = new AbortController()
    try {
      const data = await OpenaiSerivce.createChatCompletion({
        stream: true,
        model: config.gptModel,
        messages: [
          { "role": "system", "content": '你是一个AI助手' },
          ...nextChatList.filter((item) => item.status !== 'error').map(({ role, content }) => ({
            role, content,
          })),
        ]
      }, {
        baseURL: '',
        headers: {
          'authorization': `Bearer ${config.apiKey}`,
        },
      }) as ReadableStream
      setIsWaiting(false)

      const reader = data.getReader()
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        const content = value?.choices?.[0]?.delta?.content
        if (content) {
          const lastAnswer = nextChatList.at(-1)
          let answerContent = lastAnswer?.content
          if (lastAnswer?.status !== 'answer') {
            answerContent = ''
          }
          const nextItem = { role: 'assistant' as const, content: answerContent + content, status: 'answer' as const }
          if (lastAnswer?.role !== 'assistant') {
            nextChatList = produce(nextChatList, (draft) => {
              draft.push(nextItem)
            })
          } else {
            nextChatList = produce(nextChatList, (draft) => {
              draft.splice(draft.length - 1, 1, nextItem)
            })
          }
          setSessionList(produce(nextSessionList, (draft) => {
            draft[sessionIndex].chatList = nextChatList
          }))
        }
      }
    } catch (err) {
      const message = err?.response?.data?.error?.message ?? err?.message ?? '请求服务失败, 请稍后重试'
      let lastAnswer = nextChatList.at(-1)
      const errorItem = { role: 'assistant' as const, content: message, status: 'error' as const }
      if (!lastAnswer || lastAnswer.role !== 'assistant') {
        nextChatList = produce(nextChatList, (draft) => {
          draft.push(errorItem)
        })
      } else {
        nextChatList = produce(nextChatList, (draft) => {
          draft.splice(draft.length - 1, 1, errorItem)
        })
      }
      setSessionList(produce(nextSessionList, (draft) => {
        draft[sessionIndex].chatList = nextChatList
      }))
    } finally {
      setIsProcessing(false)
      setIsWaiting(false)
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

  const onSessionAdd = () => {
    const id = String(Math.random())
    const newSession = {
      id,
      title: '新会话',
      chatList: [],
      createdAt: Date.now()
    }
    setSessionList(produce(sessionList, (draft) => { draft.unshift(newSession) }))
    setSessionId(id)
  }

  const onSessionChange = (sessionId: string) => {
    setSessionId(sessionId)
  }

  const onSessionTitleChange = (title: string) => {
    const sessionIndex = sessionList.findIndex((session) => session.id === sessionId)
    if (sessionIndex > -1) {
      setSessionList(produce(sessionList, (draft) => { draft[sessionIndex].title = title }))
    }
  }

  const onSessionRemove = (sessionId: string) => {
    const sessionIndex = sessionList.findIndex((session) => session.id === sessionId)
    if (sessionIndex > -1) {
      setSessionList(produce(sessionList, (draft) => { draft.splice(sessionIndex, 1) }))
      const nextSessionId = sessionList[sessionIndex + 1]?.id
        ?? sessionList[sessionIndex - 1]?.id
        ?? 0
      onSessionChange(nextSessionId)
    }
  }

  const onConfigChange = (fieldValues) => {
    setConfig((config) => ({ ...config, ...fieldValues }))
  }

  const onSessionEdit = () => setIsSessionEdit(true)
  const onSessionEditFinish = () => setIsSessionEdit(false)

  return {
    sessionId,
    session,
    sessionList,
    content,
    config,
    isProcessing,
    isWaiting,
    isSessionEdit,
    onChange,
    onSend,
    onReAnswer,
    onAbort,
    onSessionAdd,
    onSessionTitleChange,
    onSessionChange,
    onSessionRemove,
    onConfigChange,
    onSessionEdit,
    onSessionEditFinish,
  }
}
