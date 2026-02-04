'use client'

import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react'
import {
  DEFAULT_DOORS_TIMINGS,
  DEFAULT_STACK_TIMINGS,
  getTransitionVariantFromEnv,
} from '@/lib/sardNavigation'

const TransitionCtx = createContext(null)

export function useTransitionUI() {
  const ctx = useContext(TransitionCtx)
  if (!ctx) throw new Error('useTransitionUI must be used within TransitionProvider')
  return ctx
}

const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()))
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export function TransitionProvider({ children }) {
  const initialVariant = getTransitionVariantFromEnv()
  const initialUI =
    initialVariant === 'stack'
      ? { visible: true, phase: 'stack_close', variant: 'stack' }
      : { visible: true, phase: 'boot', variant: 'doors' }

  const [ui, setUI] = useState(initialUI)

  const lockRef = useRef(false)
  const currentPathRef = useRef(null)
  const pathWaiterRef = useRef(null)

  const waitForPathChange = useCallback((fromPath, timeoutMs = 8000) => {
    return new Promise((resolve) => {
      if (currentPathRef.current && currentPathRef.current !== fromPath) {
        return resolve(true)
      }

      let done = false
      const timer = setTimeout(() => {
        if (done) return
        done = true
        pathWaiterRef.current = null
        resolve(false)
      }, timeoutMs)

      pathWaiterRef.current = () => {
        if (done) return
        done = true
        clearTimeout(timer)
        pathWaiterRef.current = null
        resolve(true)
      }
    })
  }, [])

  const setCurrentPath = useCallback((pathname) => {
    const prev = currentPathRef.current
    currentPathRef.current = pathname

    if (pathname !== prev && pathWaiterRef.current) {
      pathWaiterRef.current()
    }
  }, [])

  // =========================
  // DOORS SEQUENCE
  // =========================
  const runDoorsSequence = useCallback(
    async ({ onNavigate, timings, fromPath }) => {
      if (lockRef.current) return
      lockRef.current = true

      const t = { ...DEFAULT_DOORS_TIMINGS, ...timings }

      setUI((p) => ({ ...p, visible: true, phase: 'closing', variant: 'doors' }))
      await sleep(t.closeMs)

      const beforePath = fromPath ?? currentPathRef.current
      await onNavigate?.()

      setUI((p) => ({ ...p, visible: true, phase: 'logo', variant: 'doors' }))
      await Promise.all([sleep(t.logoMs), waitForPathChange(beforePath, t.maxWaitMs)])

      setUI((p) => ({ ...p, visible: true, phase: 'opening', variant: 'doors' }))
      await sleep(t.openMs)

      setUI((p) => ({ ...p, visible: true, phase: 'fading', variant: 'doors' }))
      await sleep(t.fadeMs)

      setUI((p) => ({ ...p, visible: false, phase: 'idle', variant: 'doors' }))
      lockRef.current = false
    },
    [waitForPathChange],
  )

  // =========================
  // STACK SEQUENCE
  // =========================
  const runStackSequence = useCallback(
    async ({ onNavigate, timings, fromPath }) => {
      if (lockRef.current) return
      lockRef.current = true

      const t = { ...DEFAULT_STACK_TIMINGS, ...timings }

      setUI((p) => ({ ...p, visible: true, phase: 'stack_out', variant: 'stack' }))
      await nextFrame()
      await sleep(t.outMs)

      setUI((p) => ({ ...p, visible: true, phase: 'stack_close', variant: 'stack' }))
      await sleep(t.closeMs)

      const beforePath = fromPath ?? currentPathRef.current
      await onNavigate?.()
      await waitForPathChange(beforePath, t.maxWaitMs)

      setUI((p) => ({ ...p, visible: true, phase: 'stack_open', variant: 'stack' }))
      await sleep(t.openMs)

      setUI((p) => ({ ...p, visible: true, phase: 'stack_fade', variant: 'stack' }))
      await sleep(t.fadeMs)

      setUI((p) => ({ ...p, visible: false, phase: 'idle', variant: 'stack' }))
      lockRef.current = false
    },
    [waitForPathChange],
  )

  const runEnterSequence = useCallback(async (timings, variant = 'doors') => {
    if (lockRef.current) return
    lockRef.current = true

    if (variant === 'stack') {
      const t = { fadeMs: 450, ...timings }
      setUI((p) => ({ ...p, visible: true, phase: 'stack_fade', variant: 'stack' }))
      await nextFrame()
      await sleep(t.fadeMs)
      setUI((p) => ({ ...p, visible: false, phase: 'idle', variant: 'stack' }))
      lockRef.current = false
      return
    }

    const t = { logoMs: 420, openMs: 1200, fadeMs: 650, ...timings }
    setUI((p) => ({ ...p, visible: true, phase: 'boot', variant: 'doors' }))
    await nextFrame()
    await nextFrame()
    await sleep(t.logoMs)

    setUI((p) => ({ ...p, visible: true, phase: 'opening', variant: 'doors' }))
    await sleep(t.openMs)

    setUI((p) => ({ ...p, visible: true, phase: 'fading', variant: 'doors' }))
    await sleep(t.fadeMs)

    setUI((p) => ({ ...p, visible: false, phase: 'idle', variant: 'doors' }))
    lockRef.current = false
  }, [])

  const runSequence = useCallback(
    async ({ onNavigate, timings, fromPath }) => {
      const v = getTransitionVariantFromEnv()
      if (v === 'stack') return runStackSequence({ onNavigate, timings, fromPath })
      return runDoorsSequence({ onNavigate, timings, fromPath })
    },
    [runDoorsSequence, runStackSequence],
  )

  const apiBase = useMemo(() => {
    return {
      setCurrentPath,
      runSequence,
      runEnterSequence,
    }
  }, [setCurrentPath, runSequence, runEnterSequence])

  const api = useMemo(() => ({ ui, ...apiBase }), [ui, apiBase])

  // ✅ back/forward
  useEffect(() => {
    const onPop = () => {
      const v = getTransitionVariantFromEnv()
      apiBase.runEnterSequence({ logoMs: 520, openMs: 1050, fadeMs: 550 }, v)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [apiBase])
  useEffect(() => {
    const onPageShow = (e) => {
      if (e.persisted) {
        const v = getTransitionVariantFromEnv()
        apiBase.runEnterSequence({ logoMs: 520, openMs: 1050, fadeMs: 550 }, v)
      }
    }

    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [apiBase])

  useEffect(() => {
    const v = getTransitionVariantFromEnv()
    apiBase.runEnterSequence({ logoMs: 380, openMs: 1200, fadeMs: 650 }, v)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const transitioning = ui.visible && ui.phase !== 'idle'
    document.documentElement.toggleAttribute('data-transitioning', transitioning)

    const stackOut = ui.variant === 'stack' && ui.phase === 'stack_out'
    document.documentElement.toggleAttribute('data-stack-out', stackOut)
  }, [ui.visible, ui.phase, ui.variant])

  return <TransitionCtx.Provider value={api}>{children}</TransitionCtx.Provider>
}
