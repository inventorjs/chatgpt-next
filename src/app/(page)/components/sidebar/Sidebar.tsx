import { useRef, useEffect } from 'react'
import {
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  IconButton,
  Box,
  InputBase,
  Paper,
  Button,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  ChevronLeft as ChevronLeftIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  SpeakerNotes as SpeakerNotesIcon,
  Brightness2 as DarkIcon,
  LightMode as LightIcon,
} from '@mui/icons-material'
import { ConfigForm } from './ConfigForm'
import { THEME_DARK, DRAWER_WIDTH } from '../../config'

function Drawer({ sx, variant, open, themeMode, onClose, chatStore }) {
  const {
    session,
    sessionList,
    isSessionEdit,
    config,
    onConfigChange,
    onSessionChange,
    onSessionRemove,
    onSessionAdd,
    onSessionEdit,
    onSessionEditFinish,
    onSessionTitleChange,
    onThemeModeSwitch,
  } = chatStore
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (isSessionEdit && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSessionEdit])

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      onSessionEditFinish()
    }
  }

  return (
    <MuiDrawer
      sx={{
        ...sx,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          display: 'flex',
          flexDirection: 'column',
          width: DRAWER_WIDTH,
          position: 'absolute',
        },
      }}
      variant={variant}
      anchor="left"
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flex: 'none',
          height: 64,
        }}
      >
        <Button
          variant="outlined"
          fullWidth
          sx={{
            flex: 1,
            color: 'text.primary',
            borderColor: 'text.primary',
            marginLeft: (theme) => theme.spacing(2),
          }}
          disabled={!session?.chatList?.length}
          onClick={onSessionAdd}
        >
          新建会话
        </Button>
        <IconButton onClick={onClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <List sx={{ flex: 1, overflowY: 'auto', pt: 0 }}>
        <ListSubheader>会话列表</ListSubheader>
        <List sx={{ py: 0 }}>
          {sessionList.map((item, index) => (
            <ListItem
              disablePadding
              key={index}
              onClick={() => onSessionChange(item.id)}
              secondaryAction={
                item.id === session?.id && (
                  <>
                    {isSessionEdit ? (
                      <IconButton onClick={onSessionEditFinish}>
                        <SaveIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton onClick={onSessionEdit}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton onClick={() => onSessionRemove(session.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                )
              }
            >
              <ListItemButton selected={item.id === session?.id}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <SpeakerNotesIcon fontSize="small" />
                </ListItemIcon>
                {isSessionEdit && item.id === session?.id ? (
                  <InputBase
                    inputRef={inputRef}
                    value={item.title}
                    onChange={(e) => onSessionTitleChange(e.target.value)}
                    onKeyUp={handleKeyUp}
                  />
                ) : (
                  <ListItemText primary={item.title} />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </List>
      <Paper
        sx={{
          flex: 0,
          px: (theme) => theme.spacing(1),
          py: (theme) => theme.spacing(2),
        }}
      >
        <Box
          sx={{
            flex: 0,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <IconButton onClick={onThemeModeSwitch}>
            {themeMode === THEME_DARK ? <DarkIcon /> : <LightIcon />}
          </IconButton>
        </Box>

        <ConfigForm value={config} onChange={onConfigChange} />
      </Paper>
    </MuiDrawer>
  )
}

export function Sidebar(props) {
  const { open, onClose, onOpen } = props

  return (
    <>
      <Drawer {...props} sx={{ display: { md: 'none' } }} variant="temporary" />
      <Drawer
        {...props}
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          height: '100%',
          position: 'relative',
          ...(!open && {
            marginLeft: 0,
            transition: (theme) =>
              theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeIn,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }),
          ...(open && {
            marginLeft: `-${DRAWER_WIDTH}px`,
            transition: (theme) =>
              theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.leavingScreen,
              }),
          }),
        }}
        variant="permanent"
        open={!open}
        onOpen={onClose}
        onClose={onOpen}
      />
    </>
  )
}
