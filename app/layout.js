import { CssBaseline } from './components/client/CssBaseline'

export const metadata = {
  title: 'chatgpt - inventorjs',
  description: 'chatgpt @ inventorjs',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>
        <CssBaseline />
        {children}
      </body>
    </html>
  )
}
