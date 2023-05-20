'use client'

import { useState, useEffect, useRef } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useChat } from './hooks/useChat'
import { Sidebar } from './components/Sidebar'
import { Box, CssBaseline } from '@mui/material'
import { AppBar } from './components/AppBar'
import { Main } from './components/Main'
import { ChatContent } from './components/ChatContent'
import { Sender } from './components/Sender'
import { dark } from '@mui/material/styles/createPalette'

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export default function Home() {
  const [open, setOpen] = useState(false)
  const [isAutoScroll, setIsAutoScroll] = useState(false)
  const chatStore = useChat()
  const refMain = useRef()
  const { isProcessing, list } = chatStore

  useEffect(() => {
    if (refMain.current) {
      refMain.current.addEventListener(
        'scroll',
        () => {
          console.log('111')
        },
        { passive: true },
      )
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
          <Sidebar open={open} onClose={() => setOpen(false)} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Main open={open} ref={refMain}>
            <AppBar
              chatStore={chatStore}
              open={open}
              onOpen={() => setOpen(true)}
            />
            <ChatContent chatStore={chatStore} />
            <Sender chatStore={chatStore} />
          </Main>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
