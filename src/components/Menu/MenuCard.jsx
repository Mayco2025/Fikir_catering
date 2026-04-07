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
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function handleOrderThis() {
    window.dispatchEvent(new CustomEvent('preselect-item', { detail: { id: item.id } }))
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })
  }

  const isPaired = Boolean(item.options)
  const isExtra  = Boolean(item.price && !item.options && !item.prices)

  return (
    <div ref={ref} className="menu-item flex flex-col p-0">

      {item.comingSoon && (
        <>
          <div className="coming-soon-badge">Coming Soon</div>
          <div className="coming-soon-overlay">
            <div className="coming-soon-overlay-text">Coming Soon</div>
          </div>
        </>
      )}

      <div className="overflow-hidden rounded-2xl mb-4 md:mb-6">
        <img
          src={item.image}
          alt={item.alt}
          className="w-full object-cover transition-transform duration-700 hover:scale-105 aspect-square"
        />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 px-3 md:px-6 lg:px-8 pb-3 md:pb-6">

        <h3 className="amharic text-2xl md:text-3xl lg:text-4xl font-black mb-2 md:mb-3 text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
          {item.name}
        </h3>

        {item.description && (
          <p className="amharic text-base md:text-lg font-medium mb-3" style={{ color: '#EAE0D0' }}>
            {item.description}
          </p>
        )}

        <div className="ethiopian-flag-line-thin mb-4" />

        {/* Injera prices */}
        {isInjera && item.prices && (
          <div className="flex-1 space-y-1 mb-2">
            {item.prices.map(({ label, price }, i) => (
              <div key={label}
                   className="flex items-center justify-between py-2.5 px-3 rounded-lg"
                   style={{ background: i % 2 === 0 ? 'rgba(212,160,23,0.06)' : 'transparent' }}>
                <span className="amharic text-base md:text-lg font-bold" style={{ color: '#F0E8D8' }}>{label}</span>
                <span className="price-tag text-lg md:text-xl font-extrabold">{price}</span>
              </div>
            ))}
          </div>
        )}

        {/* Paired options */}
        {isPaired && (
          <div className="space-y-4 flex-1">
            {item.options.map((opt, i) => (
              <div key={opt.label}
                   className="rounded-xl p-3 md:p-4"
                   style={{ background: 'rgba(212,160,23,0.05)', border: '1px solid rgba(212,160,23,0.1)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="amharic text-lg md:text-xl font-extrabold px-3 py-1 rounded-lg text-white"
                    style={{ background: 'rgba(212,160,23,0.12)', border: '1px solid rgba(212,160,23,0.15)' }}
                  >
                    {opt.label}
                  </span>
                  <span className="price-tag text-xl md:text-2xl font-black">{opt.price}</span>
                </div>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {opt.includes.map((ing) => (
                    <li key={ing} className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#D4A017' }} />
                      <span className="amharic text-base md:text-lg font-semibold" style={{ color: '#F0E4D0' }}>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Extra price */}
        {isExtra && (
          <div className="flex items-center mt-auto pt-2">
            <span className="price-tag text-2xl md:text-3xl font-black">{item.price}</span>
          </div>
        )}

        {!item.comingSoon && (
          <button onClick={handleOrderThis} className="order-btn mt-5 self-start text-sm md:text-base px-7 py-3">
            እዘዝ →
          </button>
        )}
      </div>
    </div>
  )
}
