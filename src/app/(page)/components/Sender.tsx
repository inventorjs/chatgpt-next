import type { RootState } from '../store'

import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Box, Container, Paper, InputBase, IconButton } from '@mui/material'
import {
  Send as SendIcon,
  Replay as ReplayIcon,
  Stop as StopIcon,
} from '@mui/icons-material'
import { changeContent, send, resend, abort, selectState, selectSession } from '../store/slices/chatSlice'

export const Sender = () => {
  const refShiftDown = useRef(false)
  const refInput = useRef()
  const dispatch = useDispatch()
  const { content, isProcessing } = useSelector(selectState)
  const session = useSelector(selectSession)

  const handleKeydown = (e: any) => {
    if (e.keyCode === 16) {
      refShiftDown.current = true
    }
  }

  const handleKeyup = (e: any) => {
    if (e.keyCode === 16) {
      refShiftDown.current = false
    }
    if (e.keyCode === 13 && !e.shiftKey) {
      dispatch(send())
      e.preventDefault()
    }
  }

  const handleChange = (e: any) => {
    if (e.target.value.endsWith('\n') && !refShiftDown.current) {
      e.preventDefault()
      return false
    }
    dispatch(changeContent(e.target.value))
  }

  const hasChat = session && session.chatList.length > 0

  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 0,
        bgcolor: 'background.paper',
        borderTop: '1px solid #ccc',
        borderColor: 'divider',
        pb: (theme) => theme.spacing(3),
        my: (theme) => theme.spacing(3),
        mb: 0,
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          pb: 'env(safe-area-inset-bottom)',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            alignItems: 'center',
            my: (theme) => theme.spacing(1),
          }}
        >
          {!isProcessing && hasChat && (
            <IconButton disabled={!hasChat} onClick={() => dispatch(resend())}>
              <ReplayIcon />
            </IconButton>
          )}
          <InputBase
            inputRef={refInput}
            sx={{ flex: 1, px: 1 }}
            multiline
            maxRows={3}
            inputProps={{ enterKeyHint: '发送' }}
            value={content}
            onChange={handleChange}
            onKeyUp={handleKeyup}
            onKeyDown={handleKeydown}
          />
          {isProcessing ? (
            <IconButton disabled={!hasChat} onClick={() => dispatch(abort())}>
              <StopIcon />
            </IconButton>
          ) : (
            <IconButton
              disabled={!content.trim() || isProcessing}
              onClick={() => dispatch(send())}
            >
              <SendIcon />
            </IconButton>
          )}
        </Paper>
      </Container>
    </Box>
  )
}
