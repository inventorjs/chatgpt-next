import type { PaletteMode } from '@mui/material'
import { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { ApiService } from '@inventorjs/api-service'
import { Sidebar } from '../components/sidebar/Sidebar'
import { Box } from '@mui/material'
import { AppBar } from '../components/AppBar'
import { Main } from './Main'
import { ChatList } from './ChatList'
import { Sender } from './Sender'
import { useSelector } from 'react-redux'
import { selectState } from '../store/slices/configSlice'
import * as services from '../services/api-service'

ApiService.init({ services, config: { timeout: 30000 } })

export function App() {
  const [open, setOpen] = useState(false)
  const { themeMode } = useSelector(selectState)

  const theme = createTheme({
    palette: {
      mode: themeMode as PaletteMode,
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', bgcolor: 'background.default' }}>
        <Box sx={{ flex: 0 }}>
          <Sidebar
            open={open}
            themeMode={themeMode}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Main>
            <AppBar
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
            />
            <ChatList />
            <Sender />
          </Main>
        </Box>
      </Box>
    </ThemeProvider>
  )
}
