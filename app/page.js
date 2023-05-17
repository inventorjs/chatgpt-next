'use client'

import { useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import MenuIcon from '@mui/icons-material/Menu'
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SendIcon from '@mui/icons-material/Send'
import ReplayIcon from '@mui/icons-material/Replay'

import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import useMediaQuery from '@mui/material/useMediaQuery'

const drawerWith = 250

const DrawerHeader = styled('div')(() => ({
  height: 64,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
}))

const Main = styled('main', {
  shouldForwardProp: (prop) => !['open'].includes(prop),
})(({ theme, open }) => ({
  position: 'relative',
  height: '100vh',
  overflowY: 'auto',
  flexGrow: 1,
  paddingTop: theme.spacing(10),
  transition: theme.transitions.create(['margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.up('sm')]: { marginLeft: `-${drawerWith}px` },
  ...(open && {
    [theme.breakpoints.up('sm')]: { marginLeft: 0 },
    transition: theme.transitions.create(['margin'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => !['open'].includes(prop),
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    [theme.breakpoints.down('sm')]: {
      width: `calc(100% - ${drawerWith}px)`,
    },
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = ({ open, variant, theme, sx, onClose }) => {
  return (
    <MuiDrawer
      sx={{
        flexShrink: 0,
        width: drawerWith,
        '& .MuiDrawer-paper': {
          width: drawerWith,
        },
        ...sx,
      }}
      variant={variant}
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton color="inherit" edge="start" onClick={onClose}>
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        <ListItem>
          <Button variant="outlined" sx={{ width: '100%' }}>
            新建会话
          </Button>
        </ListItem>
        <ListSubheader>今日会话</ListSubheader>
        <List sx={{ maxHeight: 300, overflowY: 'auto' }}>
          {Array.from({ length: 10 }).map((k) => (
            <ListItem
              disablePadding
              key={k}
              secondaryAction={
                <>
                  <IconButton>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              }
            >
              <ListItemButton selected={true}>
                <ListItemIcon>
                  <SpeakerNotesIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="helloxxx" />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <ListSubheader>30日会话</ListSubheader>
      </List>
    </MuiDrawer>
  )
}

export default function Home() {
  const theme = useTheme()
  const isSm = useMediaQuery(theme.breakpoints.down('sm'))
  const [open, setOpen] = useState(!isSm)

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            onClick={() => setOpen(true)}
            sx={{ ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            OpenAI
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        variant="temporary"
        theme={theme}
        sx={{
          [theme.breakpoints.up('sm')]: {
            display: 'none',
          },
        }}
      />
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        variant="persistent"
        theme={theme}
        sx={{
          [theme.breakpoints.down('sm')]: {
            display: 'none',
          },
        }}
      />
      <Main open={open}>
        <List>
          {Array.from({ length: 10 }).map(() => (
            <>
              <ListItem>
                <Container
                  sx={{ display: 'flex' }}
                  disableGutters
                  maxWidth="md"
                >
                  <ListItemAvatar>
                    <Avatar src="" />
                  </ListItemAvatar>
                  <ListItemText>
                    <Typography>
                      放假哦文件噢文件佛为Joe文件佛鳄问价格哦我就佛文件佛文件佛文件佛鳄文件佛我佛文件佛文件佛文件佛文件佛文件噢发文件佛鳄文件噢发文件噢发我就饿哦发觉我饿就佛文件佛文件佛房间问哦佛文件佛鳄问
                    </Typography>
                  </ListItemText>
                </Container>
              </ListItem>
              <ListItem sx={{ bgcolor: '#efefef' }}>
                <Container
                  sx={{ display: 'flex' }}
                  disableGutters
                  maxWidth="md"
                >
                  <ListItemAvatar>
                    <Avatar src="" />
                  </ListItemAvatar>
                  <ListItemText>
                    <Typography>
                      放假哦文件噢文件佛为Joe文件佛鳄问价格哦我就佛文件佛文件佛文件佛鳄文件佛我佛文件佛文件佛文件佛文件佛文件噢发文件佛鳄文件噢发文件噢发我就饿哦发觉我饿就佛文件佛文件佛房间问哦佛文件佛鳄问
                    </Typography>
                  </ListItemText>
                </Container>
              </ListItem>
            </>
          ))}
        </List>
        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            bgcolor: 'white',
            borderTop: '1px solid #ccc',
            mt: theme.spacing(3),
            pb: theme.spacing(3),
          }}
        >
          <Container maxWidth="md">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                p: theme.spacing(1),
                pb: theme.spacing(1),
              }}
            >
              <Button variant="outlined">
                <ReplayIcon />
                重新生成响应
              </Button>
            </Box>
            <Paper elevation={3} sx={{ display: 'flex', alignItems: 'center' }}>
              <InputBase
                sx={{ flex: 1, ml: theme.spacing(1) }}
                multiline
                maxRows={3}
              />
              <IconButton>
                <SendIcon />
              </IconButton>
            </Paper>
          </Container>
        </Box>
      </Main>
    </Box>
  )
}
