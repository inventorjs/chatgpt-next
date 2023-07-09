import type { ChatItem, SessionItem } from '@/types'
import { createSlice, createAsyncThunk, createSelector, type PayloadAction } from '@reduxjs/toolkit'
import { EMPTY_CHAR } from '../../config'
import { RootState } from '..'

interface State {
  sessionList: SessionItem[]
  sessionId: string
  content: string
  isProcessing: boolean
  config: any
}

const initialState: State = {
  sessionList: [],
  sessionId: '',
  content: '',
  isProcessing: false,
  config: {},
}

function addSessionImpl(state: State) {
  const newSession: SessionItem = {
    id: String(Math.random()),
    title: '新会话',
    chatList: [],
    createdAt: Date.now(),
  }
  state.sessionList.unshift(newSession)
  return newSession
}

function switchSessionImpl(state: State, sessionId: string) {
  state.sessionId = sessionId
}

// const send = createAsyncThunk('chat/send', async (content: string, { getState, dispatch }) => {

// })

const name = 'chat'

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    send(state) {
      const { sessionList, sessionId, isProcessing } = state
      let content = state.content
      content = content.trim()
      if (!content || isProcessing) return

      const userItem: ChatItem = { role: 'user', content }
      const assistantItem: ChatItem = { role: 'assistant', content: EMPTY_CHAR }
      let session: SessionItem | undefined = sessionList.find((session) => session.id === sessionId)
      if (!session) {
        session = addSessionImpl(state)
        switchSessionImpl(state, session.id)
      }
      state.isProcessing = true
      state.content = ''
      session.chatList.push(userItem, assistantItem)
    },
    resend() { },
    abort(state) {
      state.isProcessing = false
    },
    changeContent(state, action: PayloadAction<string>) {
      const { payload: content } = action
      state.content = content
    },
    addSession(state) {
      const session = addSessionImpl(state)
      switchSessionImpl(state, session.id)
    },
    updateSession(state, action: PayloadAction<Partial<SessionItem>>) {
      const { payload: sessionPartial } = action
      const session = state.sessionList.find((session) => session.id === state.sessionId)
      session && Object.assign(session, sessionPartial)
    },
    removeSession(state) {
      const sessionId = state.sessionId
      const index = state.sessionList.findIndex((session) => sessionId === session.id)
      if (!!~index) {
        state.sessionList.splice(index, 1)
        const nextSession = state.sessionList[index]
        if (nextSession) {
          switchSessionImpl(state, nextSession.id)
        }
      }
    },
    switchSession(state, action: PayloadAction<string>) {
      const { payload: sessionId } = action
      switchSessionImpl(state, sessionId)
    },
  },
})

export const selectState = (state: RootState) => state[name]
const selectSessionList = (state: RootState) => state[name].sessionList
const selectSessionId = (state: RootState) => state[name].sessionId
export const selectSession = createSelector([selectSessionId, selectSessionList], (sessionId, sessionList) => {
  return sessionList.find((session) => session.id === sessionId)
})

export const { send, resend, abort, changeContent, addSession, removeSession, switchSession, updateSession } = chatSlice.actions
