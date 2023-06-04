import { useRef, useEffect } from 'react'
import { Box } from '@mui/material'

export function Main({ children, chatStore: { session } }) {
  const refMain = useRef<HTMLDivElement>()
  const refAutoButtom = useRef(true)
  const refScrollTop = useRef(0)

  useEffect(() => {
    if (refMain.current) {
      refMain.current.addEventListener(
        'scroll',
        (e) => {
          if (!refMain.current) return
          const scrollTop = refMain.current.scrollTop
          const scrollHeight = refMain.current.scrollHeight
          const height = refMain.current.clientHeight
          if (scrollTop + height + 10 > scrollHeight) {
            refAutoButtom.current = true
          } else if (refScrollTop.current > scrollTop) {
            refAutoButtom.current = false
          }
          refScrollTop.current = scrollTop
        },
        { passive: true },
      )
    }
  }, [])

  useEffect(() => {
    if (refMain.current && refAutoButtom.current && session?.chatList?.length) {
      const scrollHeight = refMain.current.scrollHeight
      const height = refMain.current.clientHeight
      refMain.current?.scrollTo(0, scrollHeight - height)
    }
  }, [session?.chatList])

  return (
    <Box
      ref={refMain}
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
