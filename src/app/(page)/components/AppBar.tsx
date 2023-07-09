import type { SessionItem } from '@/types'
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
import { useSelector } from 'react-redux'
import { selectSession } from '../store/slices/chatSlice'

interface Props {
  session?: SessionItem
  open: boolean,
  sx: Record<string, unknown>
  onOpen: () => void
  onClose: () => void
}

const AppBarMain = ({ open, sx, onOpen, session }: Props) => (
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

export const AppBar = (props: Omit<Props, 'sx'>) => {
  const { open, onOpen, onClose } = props
  const session = useSelector(selectSession)

  return (
    <>
      <AppBarMain {...props} session={session} sx={{ display: { md: 'none' } }} />
      <AppBarMain
        {...props}
        session={session}
        sx={{ display: { xs: 'none', md: 'block' } }}
        open={!open}
        onOpen={onClose}
        onClose={onOpen}
      />
    </>
  )
}
