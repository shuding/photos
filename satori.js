'use client'

import React from 'react'
import { findDOMNode } from 'react-dom'
import satori from 'satori'
import { motion, AnimatePresence } from 'framer-motion'

import { createIntlSegmenterPolyfill } from 'intl-segmenter-polyfill'

if (typeof window !== 'undefined') {
  ;(async function () {
    const Segmenter = await createIntlSegmenterPolyfill(
      fetch('/break_iterator.wasm')
    )

    if (typeof window.Intl === 'undefined') {
      window.Intl = {}
    }
    window.Intl.Segmenter = Segmenter
  })()
}

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
        perspective: 1000,
        contain: 'style size',
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
        <>{children}</>
      </SatoriContext.Provider>
      <SatoriImpl {...props}>{remoteChildren}</SatoriImpl>
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
}

export function SatoriEscape({ children }) {
  return (
    <SatoriContext.Provider value={false}>{children}</SatoriContext.Provider>
  )
}

export function Satori({ children }) {
  return (
    <SatoriBoundary>
      <SatoriAnimated>{children}</SatoriAnimated>
    </SatoriBoundary>
  )
}

function normalizeChildren(children) {
  if (typeof children === 'string') {
    return children
  }
  if (Array.isArray(children)) {
    return children.map(normalizeChildren)
  }
  if (typeof children === 'object' && children) {
    if (typeof children.type === 'function') {
      if (children.type === SatoriEscape) {
        return {
          type: 'div',
          props: {
            style: children.props.style,
            __kind: 'escape',
            __children: children.props.children,
          },
        }
      }
      return children
    }
    return {
      ...children,
      props: {
        ...children.props,
        children: normalizeChildren(children.props.children),
      },
    }
  }
  return children
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

function SatoriImpl({ container, children }) {
  // const [debug, setDebug] = React.useState(null)
  const [currentState, setCurrentState] = React.useState([])
  const [size, setSize] = React.useState({
    width: 0,
    height: 0,
  })
  const prevNodesRef = React.useRef([])

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

      const svg = await satori(normalizeChildren(children), {
        fonts: await loadFonts,
        width: size.width,
        height: size.height,
        onNodeDetected: (n) => {
          nodes.push(n)
        },
        debug: true,
      })

      if (cancelled) return

      const prevNodes = prevNodesRef.current
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

      prevNodesRef.current = returnNodes
      setCurrentState(returnNodes)
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
          const styles = {
            position: 'absolute',
            ...node.props.style,
            maxHeight: 'initial',
            maxWidth: 'initial',
            minHeight: 'initial',
            minWidth: 'initial',
            top: 0,
            left: 0,
            width: node.width,
            height: node.height,
            x: node.left,
            y: node.top,
            display: 'block',
            willChange: 'width, height, opacity, transform',
            contain: 'style',
          }

          if (node.props.__kind === 'escape') {
            return (
              <Type
                key={'__escape__'}
                variants={{
                  initial: {
                    opacity: 0,
                    ...styles,
                    transition: {
                      zIndex: {
                        delay: 0.5,
                      },
                    },
                  },
                  exit: {
                    opacity: 0,
                    ...styles,
                    transition: {
                      zIndex: {
                        delay: 0.5,
                      },
                    },
                  },
                  current: {
                    opacity: 1,
                    ...styles,
                  },
                }}
                animate='current'
                transition={{
                  type: 'spring',
                  damping: 17,
                  mass: 0.2,
                  velocity: -4,
                  stiffness: 100,
                  zIndex: {
                    delay: 0.8,
                  },
                }}
                initial='initial'
                exit='exit'
              >
                {node.props.__children}
              </Type>
            )
          }

          return (
            <Type
              key={typeof node.key === 'undefined' ? i : node.key}
              ref={node.ref}
              {...node.props}
              variants={{
                initial: {
                  opacity: 0,
                  ...styles,
                  transition: {},
                },
                exit: {
                  ...styles,
                  opacity: 0,
                  height: 0,
                  width: 0,
                  y: 0,
                  pointerEvents: 'none',
                  transition: {
                    type: 'tween',
                    duration: 0.3,
                    opacity: {
                      delay: 0,
                    },
                    height: {
                      delay: 0.9,
                    },
                    width: {
                      delay: 0.9,
                    },
                    y: {
                      delay: 0.9,
                    },
                  },
                },
                current: {
                  opacity: 1,
                  ...styles,
                },
              }}
              animate='current'
              transition={{
                type: 'spring',
                damping: 17,
                mass: 0.3,
                velocity: 0,
                stiffness: 100,
                opacity: {
                  type: 'tween',
                  duration: 0.25,
                  delay: Math.random() * 0.25,
                },
                zIndex: {
                  delay: 0.8,
                },
              }}
              transitionEnd={{
                zIndex: styles.zIndex,
              }}
              initial='initial'
              exit='exit'
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
