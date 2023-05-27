import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
} from '@mui/material'
import { Menu as MenuIcon, Add as AddIcon } from '@mui/icons-material'
import { styled } from '@mui/material/styles'

const drawerWith = 250

const AppBarWrapper = styled(MuiAppBar, {
  shouldForwardProp: (prop) => !['open'].includes(prop),
})(({ theme, open }) => ({
  [theme.breakpoints.up('sm')]: { display: 'none' },
  position: 'sticky',
  top: 0,
}))

export const AppBar = ({ open, chatStore: { session }, onOpen }) => (
  <AppBarWrapper>
    <Toolbar
      sx={{
        display: 'flex',
      }}
    >
      <IconButton onClick={onOpen} sx={{ ...(open && { display: 'none' }) }}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap sx={{ flex: 1, textAlign: 'center' }}>
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
  </AppBarWrapper>
)
