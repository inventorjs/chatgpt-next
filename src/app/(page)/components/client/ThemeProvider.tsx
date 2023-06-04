'use client'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'

export function ThemeProvider({ theme }) {
  return <MuiThemeProvider theme={theme} />
}

export { createTheme }
