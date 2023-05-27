'use client'

import { useState, useEffect, useRef } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { ApiService } from '@inventorjs/api-service'
import { useChat } from './hooks/useChat'
import { Sidebar } from './components/sidebar/Sidebar'
import { Box, CssBaseline } from '@mui/material'
import { AppBar } from './components/AppBar'
import { Main } from './components/Main'
import { ChatList } from './components/ChatList'
import { Sender } from './components/Sender'
import * as services from './services/api-service'

!ApiService.inited && ApiService.init({ services })

export default function Home() {
  const [open, setOpen] = useState(false)
  const [themeMode, setThemeMode] = useState('light')
  const [isAutoScroll, setIsAutoScroll] = useState(false)
  const chatStore = useChat()
  const refMain = useRef()
  const { isProcessing, list } = chatStore

  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  })

  useEffect(() => {
    if (refMain.current) {
      refMain.current.addEventListener('scroll', () => {}, { passive: true })
    }
  }, [refMain.current])

  useEffect(() => {
    if (isProcessing && list && refMain.current) {
      refMain.current.scrollTo(0, refMain.current.scrollHeight)
    }
  }, [isProcessing, list])

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flex: 0 }}>
          <Sidebar
            open={open}
            chatStore={chatStore}
            themeMode={themeMode}
            onClose={() => setOpen(false)}
            onThemeToggle={() => {
              console.log('11'); setThemeMode((mode) => (mode === 'dark' ? 'light' : 'dark'))
            }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Main open={open} ref={refMain}>
            <AppBar
              chatStore={chatStore}
              open={open}
              onOpen={() => setOpen(true)}
            />
              <ChatList chatStore={chatStore} />
              <Sender chatStore={chatStore} />
          </Main>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
