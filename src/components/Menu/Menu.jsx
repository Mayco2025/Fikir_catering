import { injeraItems, serviceItems, extraItems } from '../../data/menuData'
import MenuCard from './MenuCard'

function SectionHeader({ title }) {
  return (
    <div className="text-center mb-12 md:mb-14">
      <div className="flex items-center justify-center gap-3 md:gap-5">
        {/* Left line */}
        <div className="flex-1 max-w-[100px] md:max-w-[140px] h-[1px]"
             style={{ background: 'linear-gradient(to right, transparent, #D4A017)' }} />
        <span style={{ color: '#D4A017', fontSize: '14px' }}>✦</span>

        {/* Title */}
        <h2 className="amharic text-7xl md:text-9xl lg:text-[10rem] px-4"
            style={{
              color: '#FFFFFF',
              fontWeight: 900,
              textShadow: '0 0 40px rgba(255,255,255,0.3), 0 6px 20px rgba(0,0,0,0.8)',
              letterSpacing: '0.1em',
              WebkitTextStroke: '1px rgba(212,160,23,0.4)',
            }}>
          {title}
        </h2>

        <span style={{ color: '#D4A017', fontSize: '14px' }}>✦</span>
        {/* Right line */}
        <div className="flex-1 max-w-[100px] md:max-w-[140px] h-[1px]"
             style={{ background: 'linear-gradient(to left, transparent, #D4A017)' }} />
      </div>
    </div>
  )
}

export default function Menu() {
  return (
    <section id="menu" className="pt-10 pb-16 md:pt-14 md:pb-24 px-4 md:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto">

        <SectionHeader title="ደረቅ እንጀራ" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12 mx-auto mb-20 md:mb-28 px-8 md:px-0">
          {injeraItems.map((item) => (
            <MenuCard key={item.id} item={item} isInjera={true} />
          ))}
        </div>

        <SectionHeader title="አገልግል" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12 mb-20 md:mb-28">
          {serviceItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>

        <SectionHeader title="ተጨማሪ" />
<div className="grid grid-cols-1 sm:grid-cols-2 gap-0 md:gap-12 mx-auto">
          {extraItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>

      </div>
    </section>
  )
}
