import type { SessionItem } from '@/types'
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit'

interface State {
  sessionList: SessionItem[]
  sessionId: string
  content: string
  isProcessing: boolean
}

const initialState: State = {
  sessionList: [],
  sessionId: '',
  content: '',
  isProcessing: false
}

function addSession(state: State) {
  const newSession: SessionItem = {
    id: String(Math.random()),
    title: '新会话',
    chatList: [],
    createdAt: Date.now(),
  }
  state.sessionList.unshift(newSession)
  return newSession
}

function switchSession(state: State, sessionId: string) {
  state.sessionId = sessionId
}

const send = createAsyncThunk('chat/send', async (content: string, { getState, dispatch }) => {

})

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    send(state, action: PayloadAction<string>) {
      const { sessionList, sessionId } = state
      let { payload: content } = action
      content = content.trim()
      if (!content) return

      let session: SessionItem | undefined = sessionList.find((session) => session.id === sessionId)
      if (!session) {
        session = addSession(state)
        switchSession(state, session.id)
      }
      session.chatList.push({
        content: '\u200b',
        role: 'assistant',
        status: 'think',
      })
    },
    resend() { },
    changeContent() { },
    addSession(state) {
      addSession(state)
    },
    editSession() { },
    removeSession() { },
    switchSession(state, action: PayloadAction<string>) {
      const { payload: sessionId } = action
      state.sessionId = sessionId
    },
  },
})
