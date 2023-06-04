'use client'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'

export function ThemeProvider({ theme }: { theme: any }) {
  return <MuiThemeProvider theme={theme} />
}

export { createTheme }
