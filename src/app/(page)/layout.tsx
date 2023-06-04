import { CssBaseline } from './components/client/CssBaseline'

export const metadata = {
  title: 'chatgpt - inventorjs',
  description: 'chatgpt @ inventorjs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,viewport-fit=cover"
        />
      </head>
      <body>
        <CssBaseline />
        {children}
      </body>
    </html>
  )
}
