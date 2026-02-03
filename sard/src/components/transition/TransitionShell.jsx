'use client'

import { useTransitionUI } from './TransitionProvider'
import DoorOverlay from './DoorOverlay'
import StackOverlay from './StackOverlay'
import TransitionBridge from './TransitionBridge'
import StackRouteTransition from './StackRouteTransition'

export default function TransitionShell({ children }) {
  const { ui } = useTransitionUI()
  const variant = ui?.variant || 'doors'

  return (
    <>
      {variant === 'doors' && <DoorOverlay />}
      {variant === 'stack' && <StackOverlay />}

      <TransitionBridge />

      <StackRouteTransition>{children}</StackRouteTransition>
    </>
  )
}
