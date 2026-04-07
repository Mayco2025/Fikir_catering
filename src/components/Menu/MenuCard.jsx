import { useEffect, useRef } from 'react'

export default function MenuCard({ item, isInjera = false }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = '1'
            el.style.transform = 'none'
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function handleImageLoad(e) {
    e.target.style.opacity = '1'
    e.target.classList.add('loaded')
  }

  function handleOrderThis() {
    window.dispatchEvent(new CustomEvent('preselect-item', { detail: { id: item.id } }))
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })
  }

  const cardClass = [
    'menu-item',
    isInjera        ? 'injera-item'       : 'menu-card-enhanced',
    item.comingSoon ? 'coming-soon'        : '',
    'bg-gray-900 rounded-xl overflow-hidden transition-all border border-gray-800 hover:border-yellow-400 relative flex flex-col',
  ].filter(Boolean).join(' ')

  const isService = Boolean(item.includes)
  const isExtra   = Boolean(item.price && !item.includes)

  return (
    <div className={cardClass} ref={ref}>
      {item.comingSoon && (
        <>
          <div className="coming-soon-badge">Coming Soon</div>
          <div className="coming-soon-overlay">
            <div className="coming-soon-overlay-text">Coming Soon</div>
          </div>
        </>
      )}

      {/* Image — full width */}
      <img
        src={item.image}
        alt={item.alt}
        className="menu-image"
        loading="lazy"
        onLoad={handleImageLoad}
      />

      {/* Card body */}
      <div className="p-5 md:p-6 flex flex-col flex-1">

        {/* ── Injera: tiered prices ── */}
        {item.prices && (
          <>
            <h3
              className="text-xl md:text-2xl font-bold mb-3 gold-text leading-snug"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {item.name}
            </h3>
            {item.description && (
              <p className="text-gray-200 text-base font-semibold mb-3">{item.description}</p>
            )}
            <div className="ethiopian-flag-line-thin mb-3" />
            <div className="space-y-2 flex-1">
              {item.prices.map(({ label, price }) => (
                <div key={label} className="flex items-center justify-between gap-2">
                  <span className="text-gray-200 text-base font-semibold">{label}</span>
                  <span className="gold-text font-bold tabular-nums text-base">{price}</span>
                </div>
              ))}
            </div>
            {!item.comingSoon && (
              <button
                onClick={handleOrderThis}
                className="mt-4 self-start text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Order →
              </button>
            )}
          </>
        )}

        {/* ── Service: name + price inline + divider + ingredients ── */}
        {isService && (
          <>
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3
                className="text-lg md:text-xl font-bold gold-text leading-snug"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {item.name}
              </h3>
              <span
                className="text-xl md:text-2xl font-black gold-text whitespace-nowrap flex-shrink-0"
                style={{ textShadow: '0 0 20px rgba(242,195,0,0.4)' }}
              >
                {item.price}
              </span>
            </div>

            <div className="ethiopian-flag-line-thin mb-3" />

            <p className="text-gray-400 text-xs uppercase tracking-widest mb-2 font-semibold">
              ፦ የሚያካትተዉ
            </p>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-2 flex-1">
              {item.includes.map((ingredient) => (
                <li key={ingredient} className="flex items-start gap-1.5 text-gray-100">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                  <span className="text-base font-semibold">{ingredient}</span>
                </li>
              ))}
            </ul>
            {!item.comingSoon && (
              <button
                onClick={handleOrderThis}
                className="mt-4 self-start text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                Order →
              </button>
            )}
          </>
        )}

        {/* ── Extra: name + divider + description + price + order button ── */}
        {isExtra && (
          <>
            <h3
              className="text-xl md:text-2xl font-bold mb-3 gold-text leading-snug"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {item.name}
            </h3>
            <div className="ethiopian-flag-line-thin mb-3" />
            <p className="text-gray-200 text-base font-semibold mb-4 flex-1">{item.description}</p>
            <div className="flex items-center justify-between">
              <span
                className="text-2xl font-black gold-text"
                style={{ textShadow: '0 0 20px rgba(242,195,0,0.4)' }}
              >
                {item.price}
              </span>
              {!item.comingSoon && (
                <button
                  onClick={handleOrderThis}
                  className="text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  Order →
                </button>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
