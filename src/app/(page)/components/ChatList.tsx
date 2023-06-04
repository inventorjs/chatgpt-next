import type { ChatStore, ChatItem as ChatItemType, Config } from '@/types'
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

function ChatItem({ item, config }: { item: ChatItemType, config: Config }) {
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
            '& pre': {
              whiteSpace: 'pre-wrap',
              overflowWrap: 'anywhere',
              color: (theme) =>
                ['error', 'cancel'].includes(item?.status ?? '')
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

export const ChatList = ({ chatStore: { session, config } }: { chatStore: ChatStore }) => {
  return (
    <Box sx={{ flex: 1 }}>
      <List sx={{ pt: 0 }}>
        {session?.chatList?.map((item: any, index: any) => (
          <ChatItem key={index} item={item} config={config} />
        ))}
      </List>
    </Box>
  )
}
