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

  function handleOrderThis() {
    window.dispatchEvent(new CustomEvent('preselect-item', { detail: { id: item.id } }))
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })
  }

  const isService = Boolean(item.includes)
  const isExtra   = Boolean(item.price && !item.includes)

  // Injera: always vertical
  // Service/Extra: horizontal on mobile (< sm), vertical on sm+
  const cardClass = [
    'menu-item',
    isInjera ? 'injera-item' : 'menu-card-enhanced',
    item.comingSoon ? 'coming-soon' : '',
    'bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-400 transition-all relative',
    isInjera ? 'flex flex-col' : 'flex flex-row sm:flex-col',
  ].filter(Boolean).join(' ')

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

      {/* ── Image ── */}
      {isInjera ? (
        // Injera: full-width, 4:3 ratio, always vertical
        <img
          src={item.image} alt={item.alt}
          className="w-full object-cover flex-shrink-0"
          style={{ aspectRatio: '4/3' }}
          loading="lazy"
        />
      ) : (
        // Service/Extra: narrow column on mobile, full-width on sm+
        <img
          src={item.image} alt={item.alt}
          className="w-24 sm:w-full flex-shrink-0 self-stretch sm:self-auto object-cover sm:h-52 md:h-60"
          loading="lazy"
        />
      )}

      {/* ── Card body ── */}
      <div className={`flex flex-col flex-1 min-w-0 ${isInjera ? 'p-4 md:p-6' : 'p-3 sm:p-5 md:p-6'}`}>

        {/* Injera: tiered prices */}
        {item.prices && (
          <>
            <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-2 gold-text leading-snug"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {item.name}
            </h3>
            {item.description && (
              <p className="text-gray-200 text-sm sm:text-base font-semibold mb-3">{item.description}</p>
            )}
            <div className="ethiopian-flag-line-thin mb-3" />
            <div className="space-y-1.5 flex-1">
              {item.prices.map(({ label, price }) => (
                <div key={label} className="flex items-center justify-between gap-1">
                  <span className="text-gray-200 text-sm sm:text-base font-semibold">{label}</span>
                  <span className="gold-text font-bold tabular-nums text-sm sm:text-base">{price}</span>
                </div>
              ))}
            </div>
            {!item.comingSoon && (
              <button onClick={handleOrderThis}
                className="mt-3 self-start text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors">
                Order →
              </button>
            )}
          </>
        )}

        {/* Service: name + price + divider + ingredients */}
        {isService && (
          <>
            {/* On mobile (horizontal card): name then price stacked. On sm+: side by side */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-0.5 sm:gap-3 mb-2">
              <h3 className="text-sm sm:text-lg md:text-xl font-bold gold-text leading-snug"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                {item.name}
              </h3>
              <span className="text-sm sm:text-xl md:text-2xl font-black gold-text sm:whitespace-nowrap sm:flex-shrink-0">
                {item.price}
              </span>
            </div>

            <div className="ethiopian-flag-line-thin mb-2" />

            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1.5 font-semibold">
              ፦ የሚያካትተዉ
            </p>
            {/* 1 col on mobile (narrow), 2 col on sm+ */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 flex-1">
              {item.includes.map((ingredient) => (
                <li key={ingredient} className="flex items-start gap-1.5">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                  <span className="text-xs sm:text-base font-semibold text-gray-100 leading-snug">{ingredient}</span>
                </li>
              ))}
            </ul>
            {!item.comingSoon && (
              <button onClick={handleOrderThis}
                className="mt-3 self-start text-xs sm:text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors">
                Order →
              </button>
            )}
          </>
        )}

        {/* Extra: name + divider + description + price */}
        {isExtra && (
          <>
            <h3 className="text-sm sm:text-xl md:text-2xl font-bold mb-2 gold-text leading-snug"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {item.name}
            </h3>
            <div className="ethiopian-flag-line-thin mb-2" />
            <p className="text-gray-200 text-xs sm:text-base font-semibold mb-2 flex-1 leading-snug">
              {item.description}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm sm:text-2xl font-black gold-text">
                {item.price}
              </span>
              {!item.comingSoon && (
                <button onClick={handleOrderThis}
                  className="text-xs sm:text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors">
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
