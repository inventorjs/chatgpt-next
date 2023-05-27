import { Fragment } from 'react'
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

export const ChatList = ({ chatStore: { session } }) => (
  <Box sx={{ flex: 1 }}>
    <List>
      {session?.chatList.map((item, index) => (
        <Fragment key={index}>
          <ListItem
            sx={{
              bgcolor: item.role === 'assistant' ? '#f7f7f8' : '#fff',
              py: (theme) => theme.spacing(2),
              borderBottom: '1px solid #ddd',
              '& p': {
                margin: 0,
              },
            }}
          >
            <Container sx={{ display: 'flex' }} disableGutters maxWidth="md">
              <ListItemAvatar>
                <Avatar src={`/${item.role}.png`} />
              </ListItemAvatar>
              <ListItemText
                sx={{
                  color: '#545c69',
                  '& *': {
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                  },    
                  '& pre': {
                    color: item.status === 'error' ? 'error.light' : '#fff',
                    backgroundColor: '#333',
                    borderRadius: 2,
                    p: 2,
                    my: (theme) =>
                      theme.spacing(item.status === 'error' ? 1 : 2),
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
        </Fragment>
      ))}
    </List>
  </Box>
)
