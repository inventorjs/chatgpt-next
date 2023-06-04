import type { PaletteMode } from '@mui/material'

export interface ChatItem {
  role: 'user' | 'assistant' | 'system';
  content: string;
  status?: 'error' | 'answer' | 'cancel';
}

export interface SessionItem {
  id: string
  title: string
  chatList: ChatItem[]
  createdAt: number
}

export interface Config {
  themeMode: PaletteMode
  netMode: string
  aiMode: string
  gptModel: string
  imageSize: string
  apiKey: string
}

export interface ChatStore {
  session: SessionItem
  sessionList: SessionItem[]
  content: string
  config: Config
  isProcessing: boolean
  isSessionEdit: boolean
  onChange: (k: string) => void
  onSend: () => void
  onReAnswer: () => void
  onAbort: () => void
  onSessionAdd: () => void
  onSessionTitleChange: (k: string) => void
  onSessionChange: (k: string) => void
  onSessionRemove: (k: string) => void
  onConfigChange: (d: Config) => void
  onSessionEdit: () => void
  onSessionEditFinish: () => void
  onThemeModeSwitch: () => void
}
