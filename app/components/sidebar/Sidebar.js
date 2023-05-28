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
  Divider,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  InputBase,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import {
  Delete as DeleteIcon,
  ChevronLeft as ChevronLeftIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  SpeakerNotes as SpeakerNotesIcon,
  CancelPresentation as CancelPresentationIcon,
  Brightness2 as DarkIcon,
  LightMode as LightIcon,
} from '@mui/icons-material'
import { ConfigForm } from './ConfigForm'
import { THEME_DARK } from '../../config'

const drawerWith = 250

function Drawer({
  display,
  variant,
  open,
  themeMode,
  onClose,
  chatStore,
}) {
  const {
    sessionId,
    sessionList,
    isSessionEdit,
    config,
    onConfigChange,
    onSessionChange,
    onSessionRemove,
    onSessionEdit,
    onSessionEditFinish,
    onSessionTitleChange,
    onThemeModeChange,
  } = chatStore
  const inputRef = useRef()

  useEffect(() => {
    if (isSessionEdit && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSessionEdit])

  return (
    <MuiDrawer
      sx={{
        display,
        flexShrink: 0,
        width: drawerWith,
        '& .MuiDrawer-paper': {
          display: 'flex',
          flexDirection: 'column',
          width: drawerWith,
        },
      }}
      variant={variant}
      anchor="left"
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{
          p: (theme) => theme.spacing(1),
          flex: 0,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <IconButton onClick={onThemeModeChange}>
          {themeMode === THEME_DARK ? <DarkIcon /> : <LightIcon />}
        </IconButton>
      </Box>
      <List sx={{ flex: 1, overflowY: 'auto', pt: 0 }}>
        <ListSubheader>会话列表</ListSubheader>
        <List sx={{ py: 0 }}>
          {sessionList.map((session, index) => (
            <ListItem
              disablePadding
              key={index}
              onClick={() => onSessionChange(session.id)}
              secondaryAction={
                session.id === sessionId && (
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
              <ListItemButton selected={session.id === sessionId}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <SpeakerNotesIcon fontSize="small" />
                </ListItemIcon>
                {isSessionEdit ? (
                  <InputBase
                    inputRef={inputRef}
                    value={session.title}
                    onChange={(e) => onSessionTitleChange(e.target.value)}
                  />
                ) : (
                  <ListItemText primary={session.title} />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </List>
      <Box
        sx={{
          flex: 0,
          px: (theme) => theme.spacing(1),
          py: (theme) => theme.spacing(2),
        }}
      >
        <ConfigForm value={config} onChange={onConfigChange} />
      </Box>
    </MuiDrawer>
  )
}

export function Sidebar(props) {
  return (
    <>
      <Drawer
        {...props}
        display={{ md: 'none' }}
        variant="temporary"
      />
      <Drawer
        {...props}
        display={{ xs: 'none', md: 'block' }}
        variant="permanent"
      />
    </>
  )
}
