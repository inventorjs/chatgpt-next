import { styled } from '@mui/material/styles'

const drawerWith = 250

export const Main = styled('main', {
  shouldForwardProp: (prop) => !['open'].includes(prop),
})(({ theme, open }) => ({
  position: 'relative',
  height: '100vh',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  // [theme.breakpoints.up('sm')]: { marginLeft: `-${drawerWith}px` },
  // transition: theme.transitions.create(['margin'], {
  //   easing: theme.transitions.easing.sharp,
  //   duration: theme.transitions.duration.leavingScreen,
  // }),
  // ...(open && {
  //   [theme.breakpoints.up('sm')]: { marginLeft: 0 },
  //   transition: theme.transitions.create(['margin'], {
  //     easing: theme.transitions.easing.easeOut,
  //     duration: theme.transitions.duration.enteringScreen,
  //   }),
  // }),
}))
