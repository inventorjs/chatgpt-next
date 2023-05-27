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
      display: { sm: 'none', md: 'block'},
      position: 'sticky',
      top: 0,
      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : 'action.selected',
    }} 
  >
    <Toolbar
      sx={{
        display: 'flex',
      }}
    >
      <IconButton onClick={onOpen} sx={{ ...(open && { display: 'none' }) }}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap sx={{ flex: 1, textAlign: 'center', color: "text.primary" }}>
        {session?.title}
      </Typography>
      <IconButton
        onClick={onOpen}
        sx={{
          display: { sm: 'none' },
        }}
      >
        <AddIcon />
      </IconButton>
    </Toolbar>
  </MuiAppBar>
)
