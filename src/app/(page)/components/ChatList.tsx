import type { ChatItem as ChatItemType, Config } from '@/types'
import { useRef } from 'react'
import {
  Box,
  List,
  ListItem,
  Container,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { Cursor } from './Cursor'
import { selectState, selectSession } from '../store/slices/chatSlice'

function ChatItem({
  item,
  config,
  isActive,
}: {
  item: ChatItemType
  config: Config
  isActive: boolean
}) {
  const refText = useRef<HTMLElement>(null)
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
          <Avatar
            src={item.role === 'assistant' ? `/${config.gptModel}.png` : ''}
          />
        </ListItemAvatar>
        <ListItemText
          ref={refText}
          sx={{
            position: 'relative',
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
              '& .x-cursor': {
                bgcolor: 'grey.50',
              }
            },
          }}
        >
          {item.status === 'error' ? (
            <pre>{item.content}</pre>
          ) : (
            <>
              <ReactMarkdown>{item.content}</ReactMarkdown>
            </>
          )}
          {item.status === 'cancel' && <pre>当前响应已被停止</pre>}
          <Cursor
            isShow={isActive && item.role === 'assistant'}
            refContainer={refText}
            content={item.content}
          />
        </ListItemText>
      </Container>
    </ListItem>
  )
}

export const ChatList = () => {
  const { isProcessing, config } = useSelector(selectState)
  const session = useSelector(selectSession)
  return (
    <Box sx={{ flex: 1 }}>
      <List sx={{ pt: 0 }}>
        {session?.chatList?.map((item: any, index: any) => (
          <ChatItem
            key={index}
            item={item}
            config={config}
            isActive={index === session.chatList.length - 1 && isProcessing}
          />
        ))}
      </List>
    </Box>
  )
}
