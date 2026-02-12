'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function AnimatedSelect({
  label,
  placeholder = 'Select',
  value,
  onChange,
  options = [],
  isRTL = false,
  disabled = false,
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const btnRef = useRef(null)
  const menuRef = useRef(null)
  const [placement, setPlacement] = useState('bottom') // 'bottom' | 'top'

  const decidePlacement = () => {
    const btn = btnRef.current
    if (!btn) return

    const rect = btn.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top

    // ارتفاع تقريبي للقائمة (لو موجودة نقرأها، لو لا نستخدم fallback)
    const menuH = menuRef.current?.offsetHeight || 260

    // لو تحت مش مكفي + فوق مكفي → افتح فوق
    if (spaceBelow < Math.min(menuH, 260) && spaceAbove > spaceBelow) {
      setPlacement('top')
    } else {
      setPlacement('bottom')
    }
  }

  const safeOptions = useMemo(() => {
    return Array.isArray(options) ? options.filter(Boolean) : []
  }, [options])

  const selectedLabel = useMemo(() => {
    const found = safeOptions.find((o) =>
      typeof o === 'string' ? o === value : o?.value === value,
    )
    if (!found) return ''
    return typeof found === 'string' ? found : found?.label || found?.value
  }, [safeOptions, value])

  useEffect(() => {
    const onDoc = (e) => {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  //   useEffect(() => {
  //     const onKey = (e) => {
  //       if (!open) return
  //       if (e.key === 'Escape') setOpen(false)
  //     }
  //     document.addEventListener('keydown', onKey)
  //     return () => document.removeEventListener('keydown', onKey)
  //   }, [open])
  useEffect(() => {
    if (!open) return
    decidePlacement()

    const onResize = () => decidePlacement()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize, true)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onResize, true)
    }
  }, [open])

  const handlePick = (val) => {
    onChange?.(val)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      {label ? <label className="block text-[14px] text-black mb-2">{label}</label> : null}

      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={[
          'w-full rounded-[14px] border border-black/10',
          'bg-white/60 px-4 py-3 text-[14px]',
          'focus:outline-none focus:ring-2 focus:ring-black/15',
          'transition',
          disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-white/70',
          isRTL ? 'text-right' : 'text-left',
        ].join(' ')}
      >
        <span className={selectedLabel ? 'text-black/80' : 'text-black/35'}>
          {selectedLabel || placeholder}
        </span>

        <span
          className={[
            'absolute',
            isRTL ? 'left-4' : 'right-4',
            'top-1/2 -translate-y-1/2',
            'pointer-events-none mt-1',
          ].join(' ')}
        >
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.18 }}
            className="inline-flex"
          >
            <ChevronDown />
          </motion.span>
        </span>

        {/* make button relative for arrow positioning */}
        <span className="sr-only">toggle</span>
      </button>

      {/* fix positioning: wrap button in relative */}
      <style jsx>{`
        button {
          position: relative;
        }
      `}</style>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: placement === 'top' ? 6 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: placement === 'top' ? 6 : -6 }}
            transition={{ duration: 0.16 }}
            className={[
              'absolute z-50 w-full',
              placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
              'rounded-[14px] border border-black/10 bg-[#F4E8D7]',
              'shadow-[0_18px_30px_rgba(0,0,0,0.15)] overflow-hidden',
            ].join(' ')}
          >
            <div className="max-h-[260px] overflow-auto">
              <OptionRow isRTL={isRTL} active={!value} onClick={() => handlePick('')}>
                {placeholder}
              </OptionRow>

              {safeOptions.map((o, i) => {
                const val = typeof o === 'string' ? o : o?.value
                const lab = typeof o === 'string' ? o : o?.label || o?.value
                const active = val === value
                return (
                  <OptionRow
                    key={`${val}-${i}`}
                    isRTL={isRTL}
                    active={active}
                    onClick={() => handlePick(val)}
                  >
                    {lab}
                  </OptionRow>
                )
              })}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

function OptionRow({ children, onClick, active, isRTL }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full px-4 py-3 text-[14px] transition',
        'border-b border-black/10 last:border-b-0',
        active ? 'bg-black/10 text-black' : 'hover:bg-black/5 text-black/80',
        isRTL ? 'text-right' : 'text-left',
      ].join(' ')}
    >
      {children}
    </button>
  )
}

function ChevronDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20px"
      height="20px"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M4.29289 8.29289C4.68342 7.90237 5.31658 7.90237 5.70711 8.29289L12 14.5858L18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289C20.0976 8.68342 20.0976 9.31658 19.7071 9.70711L12.7071 16.7071C12.3166 17.0976 11.6834 17.0976 11.2929 16.7071L4.29289 9.70711C3.90237 9.31658 3.90237 8.68342 4.29289 8.29289Z"
        fill="#000000"
      />
    </svg>
  )
}
