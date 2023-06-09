/**
 * 光标组件
 */
import { useEffect, useState } from 'react';
import { Box } from '@mui/material'
import { keyframes } from '@mui/system';

interface Props {
  isShow: boolean
  refContainer: {
    current: HTMLElement | null
  }
  content: string
}

const blink = keyframes`
  from {
    opacity: 0;
  }
  50% {
    opacity: 0.8;
  }
  to {
    opacity: 0;
  }
`

function findLastTextNode(parent: HTMLElement): HTMLElement | null {
  const children = parent.childNodes
  for (let idx = children.length - 1; idx >= 0; --idx) {
    const child = children[idx]
    if (child.nodeType === Node.TEXT_NODE) {
      if (child.nodeValue && /\S/.test(child.nodeValue ?? '')) {
        child.nodeValue = child.nodeValue?.replace(/\s+$/, '')
        return child as HTMLElement
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const lastTextNode = findLastTextNode(child as HTMLElement)
      if (lastTextNode) return lastTextNode
    }
  }
  return null
}

function isInCode(dom: ParentNode | null, boundaryDom: ParentNode): boolean {
  let cursorDom = dom
  while (cursorDom && cursorDom !== boundaryDom) {
    if ((cursorDom as HTMLElement).tagName === 'CODE') {
      return true
    }
    return isInCode(cursorDom.parentNode, boundaryDom)
  }
  return false
}

export function Cursor({ isShow, content, refContainer }: Props) {
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [cursorColor, setCursorColor] = useState('text.primary')
  useEffect(() => {
    let textNode: Text | null
    let lastTextNode: HTMLElement | null
    if (isShow && refContainer.current) {
      lastTextNode = findLastTextNode(refContainer.current)
      if (lastTextNode?.parentNode) {
        textNode = document.createTextNode('\u200b')
        lastTextNode.parentNode.appendChild(textNode)
        const range = document.createRange()
        range.setStart(textNode, 0)
        range.setEnd(textNode, 0)
        const { top, left } = range.getBoundingClientRect()
        const { top: pTop, left: pLeft } =
          refContainer.current.getBoundingClientRect()
        setPosition({
          top: top - pTop,
          left: left - pLeft,
        })
        if (isInCode(lastTextNode.parentNode, refContainer.current)) {
          setCursorColor('white')
        } else {
          setCursorColor('text.primary')
        }
      }
    }
    return () => {
      if (textNode && lastTextNode?.parentNode) {
        lastTextNode.parentNode.removeChild(textNode)
      }
    }
  }, [content, isShow, refContainer])
  return (
    <Box
      sx={{
        ...position,
        position: 'absolute',
        display: isShow ? 'inline-block' : 'none',
        width: '10px',
        height: '20px',
        bgcolor: cursorColor,
        verticalAlign: 'sub',
        animation: `${blink} 1s infinite ease-in-out`,
      }}
    />
  )
}
