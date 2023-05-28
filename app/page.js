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
  const chatStore = useChat()
  const refMain = useRef()
  const { config } = chatStore

  const theme = createTheme({
    palette: {
      mode: config.themeMode,
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flex: 0 }}>
          <Sidebar
            open={open}
            chatStore={chatStore}
            themeMode={config.themeMode}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Main open={open}>
            <AppBar
              chatStore={chatStore}
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
            />
            <ChatList chatStore={chatStore} />
            <Sender chatStore={chatStore} />
          </Main>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
