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
    content,
    isProcessing,
    session,
    onSend,
    onChange,
    onAbort,
    onReAnswer,
  },
}) => {
  const refShiftDown = useRef(false)
  const refInput = useRef()

  const handleKeydown = (e) => {
    if (e.keyCode === 16) {
      refShiftDown.current = true
    }
  }

  const handleKeyup = (e) => {
    if (e.keyCode === 16) {
      refShiftDown.current = false
    }
    if (e.keyCode === 13 && !e.shiftKey) {
      onSend()
      e.preventDefault()
    }
  }

  const handleChange = (e) => {
    if (e.target.value.endsWith('\n') && !refShiftDown.current) {
      e.preventDefault()
      return false
    }
    onChange(e.target.value)
  }

  const hasChatList = session?.chatList?.length > 0

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
          {isProcessing ? (
            <IconButton disabled={!hasChatList} onClick={onAbort}>
              <StopIcon />
            </IconButton>
          ) : (
            <IconButton disabled={!hasChatList} onClick={onReAnswer}>
              <ReplayIcon />
            </IconButton>
          )}
          <InputBase
            inputRef={refInput}
            sx={{ flex: 1, px: 1 }}
            multiline
            maxRows={3}
            value={content}
            onChange={handleChange}
            onKeyUp={handleKeyup}
            onKeyDown={handleKeydown}
          />
          <IconButton
            disabled={!content.trim() || isProcessing}
            onClick={onSend}
          >
            <SendIcon />
          </IconButton>
        </Paper>
      </Container>
    </Box>
  )
}
