import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
} from '@mui/material'
import {
  Menu as MenuIcon,
  MoreHoriz as MoreHorizIcon,
} from '@mui/icons-material'

const AppBarMain = ({ open, sx, chatStore: { session }, onOpen }) => (
  <MuiAppBar
    sx={{
      ...sx,
      position: 'sticky',
      top: 0,
      bgcolor: (theme) =>
        theme.palette.mode === 'dark' ? 'background.default' : 'grey.50',
    }}
  >
    <Toolbar
      sx={{
        display: 'flex',
      }}
    >
      <IconButton onClick={onOpen} sx={{ display: open ? 'none' : 'block' }}>
        <MenuIcon />
      </IconButton>
      <Typography
        variant="h6"
        noWrap
        sx={{
          flex: 1,
          textAlign: 'center',
          color: 'text.primary',
          textOverflow: 'ellipsis',
          px: (theme) => theme.spacing(1),
        }}
      >
        {session?.title}
      </Typography>
      <IconButton disabled={true} sx={{ display: 'block' }}>
        <MoreHorizIcon />
      </IconButton>
    </Toolbar>
  </MuiAppBar>
)

export const AppBar = (props) => {
  const { open, onOpen, onClose } = props
  return (
    <>
      <AppBarMain {...props} sx={{ display: { md: 'none' } }} />
      <AppBarMain
        {...props}
        sx={{ display: { xs: 'none', md: 'block' } }}
        open={!open}
        onOpen={onClose}
        onClose={onOpen}
      />
    </>
  )
}
