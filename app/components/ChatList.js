import { useEffect, useRef, useState } from 'react'
import { Chat } from '@mui/icons-material'
import {
  Box,
  List,
  ListItem,
  Container,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material'
import ReactMarkdown from 'react-markdown'

function ChatItem({ item }) {
  return (
    <ListItem
      sx={{
        bgcolor: () =>
          item.role === 'assistant' ? 'action.hover' : 'background.default',
        py: (theme) => theme.spacing(2),
        borderBottom: 1,
        borderColor: 'divider',
        '& p': {
          margin: 0,
        },
      }}
    >
      <Container sx={{ display: 'flex' }} disableGutters maxWidth="md">
        <ListItemAvatar>
          <Avatar src={item.role !== 'user' ? `/${item.role}.png` : ''} />
        </ListItemAvatar>
        <ListItemText
          sx={{
            color: 'text.primary',
            '& *': {
              whiteSpace: 'pre-wrap',
              overflowWrap: 'anywhere',
            },
            '& pre': {
              color: (theme) =>
                item.status === 'error'
                  ? `error.${theme.palette.mode}`
                  : 'background.default',
              bgcolor: 'grey.900',
              borderRadius: 2,
              p: 2,
              my: (theme) => theme.spacing(item.status === 'error' ? 1 : 2),
            },
          }}
        >
          {item.status === 'error' ? (
            <pre>{item.content}</pre>
          ) : (
            <ReactMarkdown>{item.content}</ReactMarkdown>
          )}
        </ListItemText>
      </Container>
    </ListItem>
  )
}

export const ChatList = ({ chatStore: { session, isWaiting } }) => {
  const chatList = session?.chatList ?? []
  const [thinkCount, setThinkCount] = useState(0)
  const thinkRef = useRef(false)

  useEffect(() => {
    function think() {
      setThinkCount((c) => (c + 1) % 4)
      if (thinkRef.current) {
        setTimeout(think, 300)
      }
    }
    if (isWaiting) {
      thinkRef.current = true
      think()
    } else {
      thinkRef.current = false
      setThinkCount(0)
    }
  }, [isWaiting])

  return (
    <Box sx={{ flex: 1 }}>
      <List sx={{ pt: 0 }}>
        {chatList.map((item, index) => (
          <ChatItem key={index} item={item} />
        ))}
        {isWaiting && (
          <ChatItem
            key={chatList.length}
            item={{
              role: 'assistant',
              content: `思考中${'.'.repeat(thinkCount)}`,
            }}
          />
        )}
      </List>
    </Box>
  )
}
