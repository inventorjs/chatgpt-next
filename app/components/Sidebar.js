import {
  Drawer,
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
  useMediaQuery,
  TextField,
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import {
  Delete as DeleteIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Edit as EditIcon,
  SpeakerNotes as SpeakerNotesIcon,
  CancelPresentation as CancelPresentationIcon 
} from '@mui/icons-material'

const drawerWith = 250

const DrawerHeader = styled('div')(() => ({
  height: 64,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
}))

export function Sidebar({ open, onClose }) {
  const theme = useTheme()
  const isDownSm = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Drawer
      sx={{
        flexShrink: 0,
        width: drawerWith,
        '& .MuiDrawer-paper': {
          display: 'flex',
          flexDirection: 'column',
          width: drawerWith,
        },
      }}
      variant={isDownSm ? 'temporary' : 'permanent'}
      anchor="left"
      open={open}
    >
      {/* <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <IconButton color="inherit" edge="start" onClick={onClose}>
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </Box> */}
      {/* <Divider /> */}
      <Box
        sx={{
          p: (theme) => theme.spacing(1),
          flex: 0,
        }}
      >
        <Button
          variant="outlined"
          sx={{
            width: '100%',
            borderColor: '#323232',
            color: '#dbd9d5',
            justifyContent: 'left',
          }}
        >
          + 新建会话
        </Button>
        <IconButton sx={{ position: 'absolute', right: -20 }} onClick={onClose}>
          <CancelPresentationIcon />
        </IconButton>
      </Box>
      <List sx={{ flex: 1, overflowY: 'auto', pt: 0 }}>
        <ListSubheader>
          今日会话
        </ListSubheader>
        <List sx={{ py: 0 }}>
          {Array.from({ length: 10 }).map((k, index) => (
            <ListItem
              disablePadding
              key={index}
              secondaryAction={
                <>
                  {/* <IconButton>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon fontSize="small" />
                  </IconButton> */}
                </>
              }
            >
              <ListItemButton selected={true}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <SpeakerNotesIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="helloxxx" />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <ListSubheader>
          更多会话
        </ListSubheader>
        <List sx={{ py: 0 }}>
          {Array.from({ length: 50 }).map((k, index) => (
            <ListItem
              disablePadding
              key={index}
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
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <SpeakerNotesIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="helloxxx" />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </List>
      <Box sx={{ flex: 0, px: theme.spacing(1), py: theme.spacing(2) }}>
        <FormControl size="small" fullWidth>
          <InputLabel>模型</InputLabel>
          <Select value={2} onChange={(e) => console.log(e)}>
            <MenuItem value={1}>智能聊天(3.5)</MenuItem>
            <MenuItem value={2}>智能聊天(4.0)</MenuItem>
            <MenuItem value={3}>图片生成</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Key" type="password" fullWidth size="small" sx={{ mt: 2 }}/>
      </Box>
    </Drawer>
  )
}
