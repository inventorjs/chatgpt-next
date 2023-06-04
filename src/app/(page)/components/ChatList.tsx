import { useEffect, useRef, useState } from 'react'
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

function ChatItem({ item, config }: any) {
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
          <Avatar src={item.role === 'assistant' ? `/${config.gptModel}.png` : ''} />
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
                ['error', 'cancel'].includes(item.status)
                  ? `error.${theme.palette.mode}`
                  : 'grey.50',
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
          {item.status === 'cancel' && <pre>User stop the answer</pre>}
        </ListItemText>
      </Container>
    </ListItem>
  )
}

export const ChatList = ({ chatStore: { session, isWaiting, config } }: any) => {
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
        {session?.chatList?.map((item: any, index: any) => (
          <ChatItem key={index} item={item} config={config} />
        ))}
        {isWaiting && (
          <ChatItem
            key={session?.chatList?.length}
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
