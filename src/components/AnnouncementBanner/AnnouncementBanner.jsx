import { useState } from 'react'
import { announcements } from '../../data/announcements'

const TYPE_STYLES = {
  info:    { bg: 'bg-blue-700',   border: 'border-blue-400',   text: 'text-blue-100'   },
  warning: { bg: 'bg-yellow-700', border: 'border-yellow-400', text: 'text-yellow-100' },
  success: { bg: 'bg-green-700',  border: 'border-green-400',  text: 'text-green-100'  },
}

function getDismissed() {
  try { return JSON.parse(localStorage.getItem('dismissed_announcements') || '[]') }
  catch { return [] }
}

function saveDismissed(ids) {
  try { localStorage.setItem('dismissed_announcements', JSON.stringify(ids)) }
  catch { /* ignore */ }
}

export default function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(getDismissed)

  const visible = announcements.filter(
    (a) => a.active && !dismissed.includes(a.id)
  )

  if (visible.length === 0) return null

  function dismiss(id) {
    const next = [...dismissed, id]
    setDismissed(next)
    saveDismissed(next)
  }

  return (
    <div className="w-full z-40">
      {visible.map((a) => {
        const styles = TYPE_STYLES[a.type] || TYPE_STYLES.info
        return (
          <div
            key={a.id}
            className={`flex items-center justify-between px-4 py-3 border-b ${styles.bg} ${styles.border} ${styles.text}`}
          >
            <p className="text-sm md:text-base font-semibold flex-1 text-center pr-8">
              {a.message}
            </p>
            <button
              onClick={() => dismiss(a.id)}
              aria-label="Dismiss announcement"
              className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity text-xl leading-none"
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
