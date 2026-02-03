import { TransitionProvider } from '@/components/transition/TransitionProvider'
import TransitionShell from '@/components/transition/TransitionShell'

export default function FrontendLayout({ children }) {
  return (
    <TransitionProvider>
      <TransitionShell>{children}</TransitionShell>
    </TransitionProvider>
  )
}
