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
  Add as AddIcon,
} from '@mui/icons-material'

export const Sender = ({
  chatStore: {
    content,
    isProcessing,
    chatList,
    onSend,
    onChange,
    onAbort,
    onReAnswer,
    onAdd,
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

  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 0,
        bgcolor: 'white',
        borderTop: '1px solid #ccc',
        py: (theme) => theme.spacing(2),
        my: (theme) => theme.spacing(2),
      }}
    >
      <Container maxWidth="md">
        {chatList.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              p: (theme) => theme.spacing(1),
            }}
          >
            {isProcessing ? (
              <Button
                variant="outlined"
                onClick={onAbort}
                sx={{ borderColor: '#ededed', color: '#878999' }}
              >
                <StopIcon />
                停止响应
              </Button>
            ) : (
              <Button
                variant="outlined"
                onClick={onReAnswer}
                sx={{ borderColor: '#ededed', color: '#878999' }}
              >
                <ReplayIcon />
                重新生成响应
              </Button>
            )}
          </Box>
        )}
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}
        >
          <IconButton
            disabled={chatList.length < 1}
            onClick={() => {
              onAdd()
              refInput.current.focus()
            }}
          >
            <AddIcon />
          </IconButton>
          <InputBase
            ref={refInput}
            sx={{ flex: 1, color: '#545c69', px: 1 }}
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
