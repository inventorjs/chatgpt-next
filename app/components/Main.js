import { Box } from '@mui/material'

const drawerWith = 250

export function Main({ children }) {
  return (
    <Box
      component="main"
      sx={{
        position: 'relative',
        height: '100vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        bgcolor: 'background.default',
      }}
    >
      {children}
    </Box>
  )
}
