'use client'

import React from 'react'
import { findDOMNode } from 'react-dom'
import satori from 'satori'
import { motion, AnimatePresence } from 'framer-motion'

async function init() {
  if (typeof window === 'undefined') return []

  const [font] =
    window.__resource ||
    (window.__resource = await Promise.all([
      fetch('/inter-latin-ext-400-normal.woff').then((res) =>
        res.arrayBuffer()
      ),
    ]))

  return [
    {
      name: 'Inter',
      data: font,
      weight: 400,
      style: 'normal',
    },
  ]
}

const loadFonts = init()

const SatoriContext = React.createContext(null)

export function SatoriBoundary({ children }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      <Container content={children}>
        <div />
      </Container>
    </div>
  )
}

function SatoriRenderer({ children, ...props }) {
  const [remoteChildren, setRemoteChildren] = React.useState(null)
  const onChildLoad = React.useCallback((e) => {
    setRemoteChildren(e)
  }, [])

  return (
    <>
      <SatoriContext.Provider value={onChildLoad}>
        {children}
      </SatoriContext.Provider>
      <Satori {...props}>{remoteChildren}</Satori>
    </>
  )
}

export function SatoriAnimated({ children }) {
  const onChildLoad = React.useContext(SatoriContext)

  React.useEffect(() => {
    if (onChildLoad) onChildLoad(children)
  }, [onChildLoad, children])

  if (!onChildLoad) return null
  return null
  return <Satori>{children}</Satori>
}

export function SatoriEscape({ children }) {
  return (
    <SatoriContext.Provider value={false}>{children}</SatoriContext.Provider>
  )
}

class Container extends React.Component {
  componentDidMount() {
    const el = findDOMNode(this).parentElement
    this.setState({
      container: el,
    })
  }
  render() {
    const state = this.state
    return (
      <>
        {this.props.children}
        {state ? (
          <SatoriRenderer container={this.state.container}>
            {this.props.content}
          </SatoriRenderer>
        ) : null}
      </>
    )
  }
}

function Satori({
  spring = {
    type: 'spring',
    damping: 17,
    mass: 0.8,
    velocity: 4,
    stiffness: 120,
    zIndex: {
      delay: 0.5,
    },
  },
  container,
  children,
}) {
  // const [debug, setDebug] = React.useState(null)
  const [currentState, setCurrentState] = React.useState([])
  const [size, setSize] = React.useState({
    width: 0,
    height: 0,
  })

  React.useEffect(() => {
    if (!container) return

    const onResize = () => {
      setSize({
        width: container.offsetWidth,
        height: container.offsetHeight,
      })
    }

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(container)
    onResize()

    return () => {
      resizeObserver.disconnect()
    }
  }, [container])

  React.useEffect(() => {
    let cancelled = false

    ;(async () => {
      const nodes = []

      const svg = await satori(children, {
        fonts: await loadFonts,
        width: size.width,
        height: size.height,
        onNodeDetected: (n) => {
          nodes.push(n)
        },
        debug: true,
      })

      if (cancelled) return
      setCurrentState((prevNodes) => {
        const prevNodesByKey = {}
        for (const node of prevNodes) {
          const k = node.originalKey
          if (typeof k === 'string') {
            const keys = k.split(' ')
            for (const key of keys) {
              if (!prevNodesByKey[key]) prevNodesByKey[key] = []
              prevNodesByKey[key].push(node)
            }
          }
        }

        const matchedNodes = new Set()
        const returnNodes = []

        while (true) {
          let matched = false
          let totalBestMatch = 0
          let a = null
          let b = null

          for (const node of nodes) {
            if (matchedNodes.has(node)) continue
            if (typeof node.key === 'string') {
              const nodeCnt = new WeakMap()
              const keys = node.key.split(' ')

              let mappedNode = null
              let bestMatch = 0

              for (const key of keys) {
                if (prevNodesByKey[key]) {
                  for (const prevNode of prevNodesByKey[key]) {
                    if (matchedNodes.has(prevNode)) continue
                    const cnt = nodeCnt.get(prevNode) || 0
                    nodeCnt.set(prevNode, cnt + 1)
                    if (cnt + 1 > bestMatch) {
                      mappedNode = prevNode
                      bestMatch = cnt + 1
                    }
                  }
                }
              }

              if (mappedNode) {
                if (bestMatch > totalBestMatch) {
                  totalBestMatch = bestMatch
                  a = node
                  b = mappedNode
                }
                matched = true
              } else {
                if (!matchedNodes.has(node)) {
                  const newNode = {
                    ...node,
                    originalKey: node.key,
                    key: Math.random(),
                  }
                  returnNodes.push(newNode)
                  matchedNodes.add(node)
                  matchedNodes.add(newNode)
                }
              }
            } else {
              if (!matchedNodes.has(node)) {
                returnNodes.push(node)
                matchedNodes.add(node)
              }
            }
          }

          if (matched) {
            returnNodes.push({
              ...a,
              originalKey: a.key,
              key: b.key,
            })
            matchedNodes.add(a)
            matchedNodes.add(b)
          }

          if (!matched) break
        }

        return returnNodes
      })
      // setDebug(svg)
    })()

    return () => {
      cancelled = true
    }
  }, [children, size])

  return (
    <>
      <AnimatePresence>
        {currentState.map((node, i) => {
          const Type = motion[node.type]
          return (
            <Type
              key={typeof node.key === 'undefined' ? i : node.key}
              {...node.props}
              animate={{
                position: 'absolute',
                top: node.top,
                left: node.left,
                width: node.width,
                height: node.height,
                opacity: 1,
                ...node.props.style,
              }}
              transition={spring}
              initial={{
                position: 'absolute',
                top: node.top,
                left: node.left,
                width: node.width,
                height: node.height,
                opacity: 0,
                ...node.props.style,
              }}
              exit={{
                position: 'absolute',
                top: node.top,
                left: node.left,
                width: node.width,
                height: node.height,
                opacity: 0,
                ...node.props.style,
              }}
            >
              {node.textContent}
            </Type>
          )
        })}
        {/* {debug ? <div dangerouslySetInnerHTML={{ __html: debug }} /> : null} */}
      </AnimatePresence>
    </>
  )
}
