import { useState, useEffect } from 'react'
import logoImg from '../../assets/images/mom-logo.png'

const navLinks = [
  { href: '#menu',  label: 'Menu'  },
  { href: '#about', label: 'About' },
  { href: '#order', label: 'Order' },
]

function smoothScrollTo(href, closeMobile) {
  const target = document.querySelector(href)
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  closeMobile()
}

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobile = () => setMobileOpen(false)

  function handlePlaceOrder(e) {
    e.preventDefault()
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' })
    closeMobile()
  }

  return (
    <nav id="navbar" className={`navbar fixed top-0 left-0 right-0 z-50${scrolled ? ' scrolled' : ''}`}>

      {/* Main bar */}
      <div className="px-4 md:px-8 py-3 flex items-center justify-between gap-3">

        {/* Logo + Brand — always show text */}
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <img src={logoImg} alt="Fikir Catering Logo" className="logo-img flex-shrink-0" />
          <div className="leading-tight min-w-0">
            <p className="font-black text-sm md:text-lg leading-none whitespace-nowrap"
               style={{ fontFamily: "'Playfair Display', serif", color: '#FFFFFF', letterSpacing: '0.5px' }}>
              Fikir Catering
            </p>
            <p className="amharic text-[10px] md:text-xs font-semibold leading-none mt-0.5"
               style={{ color: '#D4A017' }}>
              ፍቅር ካተሪንግ ጃፓን
            </p>
          </div>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-sm font-bold tracking-wide transition-colors duration-200"
              style={{ color: '#FFFFFF' }}
              onMouseEnter={(e) => e.target.style.color = '#D4A017'}
              onMouseLeave={(e) => e.target.style.color = '#FFFFFF'}
              onClick={(e) => { e.preventDefault(); smoothScrollTo(href, closeMobile) }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA + hamburger */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handlePlaceOrder}
            className="order-btn text-xs md:text-sm px-5 py-2"
          >
            Place Order
          </button>
          <button
            className="md:hidden p-1"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen
              ? <svg className="w-7 h-7" fill="none" stroke="#FFFFFF" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              : <svg className="w-7 h-7" fill="none" stroke="#FFFFFF" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            }
          </button>
        </div>
      </div>

      {/* Contact strip — no background box */}
      <div className="hidden md:flex px-4 py-1.5 items-center justify-center gap-10"
           style={{ borderTop: '1px solid rgba(212,160,23,0.08)' }}>
        <a href="tel:080-3911-8822"
           className="flex items-center gap-1.5 text-xs font-bold whitespace-nowrap text-gray-300 hover:text-white transition-colors">
          <PhoneIcon /> 080-3911-8822
        </a>
        <a href="tel:070-1182-2650"
           className="flex items-center gap-1.5 text-xs font-bold whitespace-nowrap text-gray-300 hover:text-white transition-colors">
          <PhoneIcon /> 070-1182-2650
        </a>
        <a href="https://wa.me/819039118822" target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-1.5 text-xs font-bold text-green-400 hover:text-green-300 transition-colors whitespace-nowrap">
          <WAIcon /> WhatsApp
        </a>
        <a href="https://t.me/+819039118822" target="_blank" rel="noopener noreferrer"
           className="flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors whitespace-nowrap">
          <TGIcon /> Telegram
        </a>
        <span className="flex items-center gap-1.5 text-xs font-bold whitespace-nowrap text-gray-300">
          <LocationIcon /> Anywhere in Japan
        </span>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-6 py-5 flex flex-col gap-5"
             style={{ borderTop: '1px solid rgba(212,160,23,0.08)' }}>
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-lg font-bold tracking-wide"
              style={{ color: '#FFFFFF' }}
              onClick={(e) => { e.preventDefault(); smoothScrollTo(href, closeMobile) }}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}

function PhoneIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="#D4A017" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}

function WAIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 flex-shrink-0 fill-green-700">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function TGIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 flex-shrink-0 fill-sky-700">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="#D4A017" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
