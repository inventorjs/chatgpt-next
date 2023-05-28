import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
} from '@mui/material'
import { Menu as MenuIcon, Add as AddIcon } from '@mui/icons-material'
import { styled } from '@mui/material/styles'

const drawerWith = 250

export const AppBar = ({ open, chatStore: { session }, onOpen }) => (
  <MuiAppBar
    sx={{
      position: 'sticky',
      top: 0,
      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'action.hover',
    }} 
  >
    <Toolbar
      sx={{
        display: 'flex',
      }}
    >
      <IconButton onClick={onOpen} sx={{ display: { md: 'none' } }}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap sx={{ flex: 1, textAlign: 'center', color: "text.primary" }}>
        {session?.title}
      </Typography>
    </Toolbar>
  </MuiAppBar>
)
