'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTransitionUI } from './TransitionProvider'

const EASE = [0.19, 1, 0.22, 1]

export default function StackOverlay() {
  const { ui } = useTransitionUI()
  const variant = ui?.variant || 'doors'
  const phase = ui?.phase || 'idle'
  const visible = !!ui?.visible

  const onStack =
    variant === 'stack' &&
    visible &&
    (phase === 'stack_out' ||
      phase === 'stack_close' ||
      phase === 'stack_open' ||
      phase === 'stack_fade')

  const isClosing = phase === 'stack_close'
  const isOpening = phase === 'stack_open' || phase === 'stack_fade'

  // ✅ overlay يطلع من تحت + يكون ضيق شوية في البداية (scaleX)
  const wrap = {
    hidden: { y: '110%', scaleX: 0.92, opacity: 1, borderRadius: 28 },
    show: {
      y: '0%',
      scaleX: 1,
      opacity: 1,
      borderRadius: 0,
      transition: { duration: 0.55, ease: EASE },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.18, ease: EASE },
    },
  }

  // ✅ الستارة: درفتين يطلعوا من النص ويقفلو (close) ثم يفتحوا (open)
  const left = {
    close: { x: 0, transition: { duration: 0.38, ease: EASE } },
    open: { x: '-105%', transition: { duration: 0.55, ease: EASE } },
  }
  const right = {
    close: { x: 0, transition: { duration: 0.38, ease: EASE } },
    open: { x: '105%', transition: { duration: 0.55, ease: EASE } },
  }

  // ✅ الدال: يظهر أثناء القفل، ويختفي ناعم أول ما الصفحة الجديدة جاهزة (stack_open)
  const dal = {
    hide: { opacity: 0, scale: 0.98, transition: { duration: 0.22, ease: EASE } },
    show: { opacity: 1, scale: 1, transition: { duration: 0.22, ease: EASE } },
  }

  return (
    <AnimatePresence>
      {onStack && (
        <motion.div className="fixed inset-0 z-[60] pointer-events-auto">
          <motion.div
            variants={wrap}
            initial="hidden"
            animate="show"
            exit="exit"
            className="absolute inset-0 bg-black"
            style={{ transformOrigin: '50% 100%' }}
          >
            {/* الستارة */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-0 bottom-0 left-0 w-1/2 bg-black"
                initial={{ x: '-100%' }}
                animate={isClosing ? 'close' : isOpening ? 'open' : 'close'}
                variants={left}
              />
              <motion.div
                className="absolute top-0 bottom-0 right-0 w-1/2 bg-black"
                initial={{ x: '100%' }}
                animate={isClosing ? 'close' : isOpening ? 'open' : 'close'}
                variants={right}
              />
            </div>

            {/* الدال */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial="hide"
              animate={isClosing ? 'show' : 'hide'}
              variants={dal}
            >
              <div className="text-[#F4E8D7] text-[64px] md:text-[84px] font-semibold select-none">
                د
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
