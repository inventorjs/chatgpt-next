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
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import {
  Delete as DeleteIcon,
  ChevronLeft as ChevronLeftIcon,
  Edit as EditIcon,
  SpeakerNotes as SpeakerNotesIcon,
  CancelPresentation as CancelPresentationIcon,
} from '@mui/icons-material'

import {
  gptModelOptions,
  modeOptions,
  imageSizeOptions,
  netTypeOptions,
} from '../config'

const drawerWith = 250

const DrawerHeader = styled('div')(() => ({
  height: 64,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
}))

function ConfigForm() {
  return (
    <form>
      <FormControl size="small" fullWidth margin="dense">
        <ToggleButtonGroup size="small" value="proxy" fullWidth>
          {netTypeOptions.map((item) => (
            <ToggleButton
              key={item.value}
              value={item.value}
              disabled={item.disabled}
            >
              {item.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </FormControl>
      <FormControl size="small" fullWidth margin="dense">
        <ToggleButtonGroup size="small" value="text" fullWidth>
          {modeOptions.map((item) => (
            <ToggleButton
              key={item.value}
              value={item.value}
              disabled={item.disabled}
            >
              {item.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </FormControl>
      <FormControl size="small" fullWidth margin="dense">
        <InputLabel>模型</InputLabel>
        <Select
          value={gptModelOptions[0].value}
          onChange={(e) => console.log(e)}
        >
          {gptModelOptions.map((item) => (
            <MenuItem
              key={item.value}
              value={item.value}
              disabled={item.disabled}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" fullWidth margin="dense">
        <InputLabel>尺寸</InputLabel>
        <Select
          value={imageSizeOptions[0].value}
          onChange={(e) => console.log(e)}
        >
          {imageSizeOptions.map((item) => (
            <MenuItem
              key={item.value}
              value={item.value}
              disabled={item.disabled}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="dense">
        <TextField label="Key" type="password" fullWidth size="small" />
      </FormControl>
    </form>
  )
}

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
      onClose={onClose}
    >
      <Box
        sx={{
          p: (theme) => theme.spacing(1),
          flex: 0,
        }}
      >
        <IconButton sx={{ position: 'absolute', right: 0 }} onClick={onClose}>
          <CancelPresentationIcon />
        </IconButton>
      </Box>
      <List sx={{ flex: 1, overflowY: 'auto', pt: 0 }}>
        <ListSubheader>会话列表</ListSubheader>
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
        <ConfigForm />
      </Box>
    </Drawer>
  )
}
