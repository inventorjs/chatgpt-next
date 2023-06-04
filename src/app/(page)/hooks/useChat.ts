/**
 * 聊天交互 hooks
 */
import type { SessionItem, ChatItem, Config, ChatStore } from '@/types'

import { useEffect, useRef, useState, useMemo } from 'react'
import { produce } from 'immer'
import { OpenaiSerivce } from '../services/api-service';
import { Storage } from '../services/storage';
import {
  gptModelOptions,
  aiModeOptions,
  imageSizeOptions,
  netModeOptions,
  THEME_DARK,
  THEME_LIGHT,
  DEFAULT_SESSION_NAME,
} from '../config'
import { AxiosError } from 'axios';

export function useChat(): ChatStore {
  const [content, setContent] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSessionEdit, setIsSessionEdit] = useState(false)
  const [sessionList, setSessionList] = useState<SessionItem[]>([])
  const [sessionId, setSessionId] = useState<string>()
  const [config, setConfig] = useState<Config>({
    themeMode: THEME_DARK,
    netMode: netModeOptions[0].value,
    aiMode: aiModeOptions[0].value,
    gptModel: gptModelOptions[0].value,
    imageSize: imageSizeOptions[0].value,
    apiKey: '',
  })
  const initRef = useRef(false)
  const cancelRef = useRef(false)
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
      Storage.saveConfig(config)
    }
  }, [config])

  const session = useMemo(
    () => {
      const session = sessionList.find((session) => session.id === sessionId)
      return session
    }, [sessionList, sessionId])
  const sessionIndex = useMemo(() => {
    const sessionIndex = sessionList.findIndex((session) => session.id === sessionId)
    return sessionIndex
  }, [sessionList, sessionId])

  const startThink = (sessionList: SessionItem[], sessionIndex: number) => {
    let isStoped = false
    let thinkCount = 0
    const session = sessionList[sessionIndex]
    const chatList = produce(session?.chatList ?? [], (draft: ChatItem[]) => {
      draft.push({
        role: 'assistant',
        content: '思考中',
        status: 'think',
      })
    })
    const thinkIndex = chatList.length - 1

    function think() {
      if (isStoped) return
      const nextChatList = produce(chatList, (draft) => {
        draft[thinkIndex].content = `思考中${'.'.repeat(thinkCount)}`
      })
      setSessionList(produce(sessionList, (draft) => {
        draft[sessionIndex].chatList = nextChatList
      }))
      thinkCount = (thinkCount + 1) % 4
      setTimeout(think, 300);
    }

    think()

    return () => {
      isStoped = true
      thinkCount = 0
    }
  }

  const send = async (content: string, resend = false) => {
    const sendContent = content.trim()
    if (!resend && !sendContent || isProcessing) {
      return
    }

    const userItem: ChatItem = { role: 'user', content }
    let nextSessionList: SessionItem[]
    let nextChatList: ChatItem[]
    let nextSessionIndex = sessionIndex
    if (!~nextSessionIndex) {
      nextChatList = [userItem]
      nextSessionIndex = 0
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
          const chatList = draft[nextSessionIndex].chatList
          chatList.splice(chatList.length - 1, 1)
        } else {
          if (draft[nextSessionIndex].title === DEFAULT_SESSION_NAME) {
            draft[sessionIndex].title = sendContent
          }
          draft[nextSessionIndex].chatList.push(userItem)
        }
      })
      nextChatList = nextSessionList[nextSessionIndex].chatList
    }

    setSessionList(nextSessionList)
    setContent('')
    setIsProcessing(true)
    const stopThink = startThink(nextSessionList, nextSessionIndex)
    cancelRef.current = false
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
        signal: refAbortController.current.signal,
        baseURL: config.netMode === 'proxy' ? '^/' : '',
        headers: {
          'authorization': `Bearer ${config.apiKey}`,
        },
      })

      stopThink()

      const reader = data.getReader()
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        const content = value?.choices?.[0]?.delta?.content
        if (content) {
          const lastAnswer = nextChatList.at(-1)
          let answerContent = lastAnswer?.content
          if (lastAnswer?.status !== 'answer' || lastAnswer?.role !== 'assistant') {
            answerContent = ''
          }
          const nextContent = answerContent + content
          const nextChatItem = {
            role: 'assistant' as const,
            content: nextContent,
            status: 'answer' as const,
          }
          if (lastAnswer?.role !== 'assistant') {
            nextChatList = produce(nextChatList, (draft) => {
              draft.push(nextChatItem)
            })
          } else {
            nextChatList = produce(nextChatList, (draft) => {
              draft[draft.length - 1] = nextChatItem
            })
          }
          setSessionList(produce(nextSessionList, (draft) => {
            draft[nextSessionIndex].chatList = nextChatList
          }))
        }
      }
    } catch (err) {
      stopThink()
      if (cancelRef.current) {
        nextChatList = produce(nextChatList, (draft) => {
          draft[draft.length - 1].status = 'cancel'
        })
      } else {
        const resError = err as AxiosError<{ error: { message: string, code: string } }>
        const error = err as Error
        const detailMsg = resError?.response?.data?.error?.message ?? resError?.response?.data?.error?.code
        const message = detailMsg ?? error?.message ?? '请求服务失败, 请稍后重试'
        let lastAnswer = nextChatList.at(-1)
        const errorItem = { role: 'assistant' as const, content: message, status: 'error' as const }
        if (!lastAnswer || lastAnswer.role !== 'assistant') {
          nextChatList = produce(nextChatList, (draft) => {
            draft.push(errorItem)
          })
        } else {
          nextChatList = produce(nextChatList, (draft) => {
            draft[draft.length - 1] = errorItem
          })
        }
      }
      setSessionList(produce(nextSessionList, (draft) => {
        draft[nextSessionIndex].chatList = nextChatList
      }))
    } finally {
      setIsProcessing(false)
    }
  }

  const onSend = () => send(content)

  const onChange = (content: string) => {
    setContent(content)
  }

  const onAbort = () => {
    setIsProcessing(false)
    cancelRef.current = true
    refAbortController.current?.abort()
  }

  const onReAnswer = () => {
    send('', true)
  }

  const onSessionAdd = () => {
    const id = String(Math.random())
    const newSession = {
      id,
      title: DEFAULT_SESSION_NAME,
      chatList: [],
      createdAt: Date.now()
    }
    setSessionList(produce(sessionList, (draft) => { draft.unshift(newSession) }))
    setSessionId(id)
  }

  const onSessionChange = (nextSessionId: string) => {
    if (nextSessionId !== sessionId) {
      setSessionId(nextSessionId)
      setIsSessionEdit(false)
    }
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

  const onConfigChange = (fieldValues: Config) => {
    setConfig((config) => ({ ...config, ...fieldValues }))
  }

  const onSessionEdit = () => setIsSessionEdit(true)
  const onSessionEditFinish = () => setIsSessionEdit(false)

  const onThemeModeSwitch = () => setConfig({
    ...config,
    themeMode: config.themeMode === THEME_DARK ? THEME_LIGHT : THEME_DARK
  })

  return {
    session,
    sessionList,
    content,
    config,
    isProcessing,
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
    onThemeModeSwitch,
  }
}
