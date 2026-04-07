export default function About() {
  return (
    <section id="about" className="py-16 md:py-20 px-6" style={{ borderTop: '1px solid rgba(212,160,23,0.1)' }}>
      <div className="container mx-auto max-w-3xl text-center">
        <div className="flex items-center justify-center gap-3 md:gap-5 mb-10">
          <div className="flex-1 max-w-[100px] md:max-w-[140px] h-[1px]"
               style={{ background: 'linear-gradient(to right, transparent, #D4A017)' }} />
          <span style={{ color: '#D4A017', fontSize: '14px' }}>✦</span>
          <h2 className="section-title text-3xl md:text-5xl px-2">
            ስለ ፍቅር ካተሪንግ ጃፓን
          </h2>
          <span style={{ color: '#D4A017', fontSize: '14px' }}>✦</span>
          <div className="flex-1 max-w-[100px] md:max-w-[140px] h-[1px]"
               style={{ background: 'linear-gradient(to left, transparent, #D4A017)' }} />
        </div>

        <div
          className="rounded-2xl px-6 py-8 md:px-10 md:py-10"
          style={{ background: 'linear-gradient(170deg, rgba(45,30,15,0.7) 0%, rgba(25,18,8,0.8) 100%)', border: '1px solid rgba(212,160,23,0.12)' }}
        >
          <p className="text-base md:text-lg font-semibold leading-relaxed mb-5 text-white" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
            We prepare authentic Ethiopian dishes made with love and tradition. Our meals bring the taste of home to Japan, inspired by family cooking and cultural heritage.
          </p>
          <div className="mx-auto w-16 my-4" style={{ height: '1px', background: 'linear-gradient(to right, transparent, #D4A017, transparent)' }} />
          <p className="amharic text-base md:text-lg font-bold leading-relaxed mb-4" style={{ color: '#F0E4D0' }}>
            ንጽህናቸውን በጠበቀ መልኩ የበሰሉ የሀገራችንን ምግቦችን እንደ ፍላጎትዎ እናቀርባለን።
          </p>
          <p className="amharic text-base md:text-lg font-bold leading-relaxed" style={{ color: '#F0E4D0' }}>
            እንዲሁም በ ብዙዎችን ተወዳጅነትን ያተረፈውን በ ነጭ እና በ ጥቁር ጤፍ የተጋገረ እንጀራችንን ማግኘት ይችላሉ።
          </p>
        </div>

        <div className="mt-10 pt-8" style={{ borderTop: '1px solid rgba(212,160,23,0.1)' }}>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <PhoneIcon />
              <a href="tel:080-3911-8822" className="text-lg font-bold text-white hover:text-yellow-400 transition-colors">080-3911-8822</a>
              <span className="font-semibold text-gray-400">or</span>
              <a href="tel:070-1182-2650" className="text-lg font-bold text-white hover:text-yellow-400 transition-colors">070-1182-2650</a>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <a href="https://wa.me/819039118822" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-white transition-opacity hover:opacity-85"
                 style={{ background: '#25D366' }}>
                <WAIcon /> WhatsApp
              </a>
              <a href="https://t.me/+819039118822" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-white transition-opacity hover:opacity-85"
                 style={{ background: '#229ED9' }}>
                <TGIcon /> Telegram
              </a>
            </div>
            <div className="flex items-center gap-2">
              <LocationIcon />
              <p className="text-lg font-bold text-white">Anywhere in Japan</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WAIcon() { return <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> }
function TGIcon() { return <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> }
function PhoneIcon() { return <svg className="w-5 h-5" fill="none" stroke="#D4A017" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg> }
function LocationIcon() { return <svg className="w-5 h-5" fill="none" stroke="#D4A017" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg> }
