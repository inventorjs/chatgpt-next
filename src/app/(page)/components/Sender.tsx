import { useRef } from 'react'
import {
  Box,
  Container,
  Paper,
  InputBase,
  IconButton,
  Button,
} from '@mui/material'
import {
  Send as SendIcon,
  Replay as ReplayIcon,
  Stop as StopIcon,
  CleaningServices as CleaningServicesIcon,
} from '@mui/icons-material'

export const Sender = ({
  chatStore: {
    session,
    content,
    isProcessing,
    onSend,
    onChange,
    onAbort,
    onReAnswer,
  },
}: any) => {
  const refShiftDown = useRef(false)
  const refInput = useRef()

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
      onSend()
      e.preventDefault()
    }
  }

  const handleChange = (e: any) => {
    if (e.target.value.endsWith('\n') && !refShiftDown.current) {
      e.preventDefault()
      return false
    }
    onChange(e.target.value)
  }

  const hasChat = session?.chatList?.length > 0

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
          {!isProcessing  && hasChat && (
            <IconButton disabled={!hasChat} onClick={onReAnswer}>
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
            <IconButton disabled={!hasChat} onClick={onAbort}>
              <StopIcon />
            </IconButton>
          ) : (
            <IconButton
              disabled={!content.trim() || isProcessing}
              onClick={onSend}
            >
              <SendIcon />
            </IconButton>
          )}
        </Paper>
      </Container>
    </Box>
  )
}
