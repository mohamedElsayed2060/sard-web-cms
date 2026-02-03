'use client'

import clsx from 'clsx'

export default function ScrollableChips({ items, activeKey, onChange, className }) {
  return (
    <div className={clsx('relative', className)}>
      <div
        className={clsx(
          'hide-scrollbar flex gap-4 overflow-x-auto overflow-y-hidden pb-2',
          'whitespace-nowrap ',
          'snap-x snap-mandatory',
        )}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {items.map((it) => {
          const active = it.key === activeKey
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => onChange?.(it.key)}
              className={clsx(
                'snap-start shrink-0 px-4 py-2 text-xs md:text-sm rounded-full transition-all border min-w-[100px]',
                active
                  ? 'bg-[#4A569F] text-white border-1 border-white/20'
                  : 'bg-white/70 text-black/70 border-black/10 hover:bg-white/85',
              )}
            >
              {it.label}
            </button>
          )
        })}
      </div>

      {/* Edges fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-transparent to-transparent" />
    </div>
  )
}
