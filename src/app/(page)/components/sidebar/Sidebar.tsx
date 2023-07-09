import { useRef, useEffect, useState } from 'react'
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
import { useSelector, useDispatch } from 'react-redux'
import { ConfigForm } from './ConfigForm'
import {
  selectSession,
  selectState,
  addSession,
  removeSession,
  switchSession,
  updateSession,
} from '../../store/slices/chatSlice'
import {
  selectState as selectConfig,
  updateConfig,
} from '../../store/slices/configSlice'
import { THEME_DARK, DRAWER_WIDTH, THEME_LIGHT } from '../../config'

function Drawer({ sx, variant, open, onClose }: any) {
  const [editSessionTitle, setEditSessionTitle] = useState<string | null>(null)
  const dispatch = useDispatch()
  const { sessionList } = useSelector(selectState)
  const { themeMode, ...config } = useSelector(selectConfig)
  const session = useSelector(selectSession)
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (editSessionTitle && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editSessionTitle])

  const handleKeyUp = (e: any) => {
    if (e.keyCode === 13) {
      dispatch(updateSession({ title: e.target.value }))
      setEditSessionTitle(null)
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
          onClick={() => dispatch(addSession())}
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
          {sessionList.map((item: any, index: any) => (
            <ListItem
              disablePadding
              key={index}
              onClick={() => dispatch(switchSession(item.id))}
              secondaryAction={
                item.id === session?.id && (
                  <>
                    {editSessionTitle !== null ? (
                      <IconButton
                        onClick={() => {
                          dispatch(updateSession({ title: editSessionTitle }))
                          setEditSessionTitle(null)
                        }}
                      >
                        <SaveIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={() =>
                          session && setEditSessionTitle(session?.title)
                        }
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation()
                        dispatch(removeSession())
                      }}
                    >
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
                {editSessionTitle && item.id === session?.id ? (
                  <InputBase
                    inputRef={inputRef}
                    value={editSessionTitle}
                    onChange={(e) => setEditSessionTitle(e.target.value)}
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
          <IconButton
            onClick={() =>
              dispatch(
                updateConfig({
                  themeMode:
                    themeMode === THEME_DARK ? THEME_LIGHT : THEME_DARK,
                }),
              )
            }
          >
            {themeMode === THEME_DARK ? <DarkIcon /> : <LightIcon />}
          </IconButton>
        </Box>

        <ConfigForm value={config} onChange={(config) => dispatch(updateConfig(config)) } />
      </Paper>
    </MuiDrawer>
  )
}

export function Sidebar(props: any) {
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
            transition: (theme: any) =>
              theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeIn,
                duration: theme.transitions.duration.enteringScreen,
              }),
          }),
          ...(open && {
            marginLeft: `-${DRAWER_WIDTH}px`,
            transition: (theme: any) =>
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
