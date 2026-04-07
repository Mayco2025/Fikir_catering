import { useState, useEffect } from 'react'
import { initEmailJS, sendEmail } from '../../services/emailjs'
import { serviceItems, extraItems } from '../../data/menuData'
import ThankYou from './ThankYou'

const WHATSAPP_NUMBER = '819039118822'
const TELEGRAM_URL    = 'https://t.me/+819039118822'
const SERVICE_IDS = serviceItems.map((s) => s.id)

function makeInitialForm() {
  const base = {
    name: '', phone: '', deliveryType: '', deliveryAddress: '',
    nechChecked: false, nechQuantity: '',
    keyChecked: false, keyQuantity: '',
    daboChecked: false, daboQty: '',
    tejChecked: false, tejQty: '',
    additionalNotes: '', deliveryTime: '',
  }
  SERVICE_IDS.forEach((id) => { base[id] = '' })
  return base
}

const INITIAL_FORM = makeInitialForm()

function parsePrice(s) { const m = s.match(/¥([\d,]+)/); return m ? parseInt(m[1].replace(/,/g, ''), 10) : 0 }
function getSelectedOption(item, idx) { return item.options?.[parseInt(idx)] }

function computeTotal(form) {
  let total = 0, hasInjera = form.nechChecked || form.keyChecked
  serviceItems.forEach((item) => {
    if (form[item.id] !== '') { const o = getSelectedOption(item, form[item.id]); if (o) total += parsePrice(o.price) }
  })
  if (form.daboChecked && form.daboQty) total += (parseInt(form.daboQty) || 0) * 2500
  if (form.tejChecked && form.tejQty) total += (parseInt(form.tejQty) || 0) * 2000
  return { total, hasInjera }
}

function buildWhatsAppMessage(form) {
  const l = ['🍽️ *New Order - Fikir Catering*', '', `👤 Name: ${form.name}`, `📞 Phone: ${form.phone}`]
  l.push(`🚚 ${form.deliveryType === 'delivery' ? `Delivery to: ${form.deliveryAddress}` : 'Pickup at Kitasenju'}`)
  l.push('', '📋 Order:')
  if (form.nechChecked && form.nechQuantity) l.push(`• ነጭ እንጀራ x${form.nechQuantity}`)
  if (form.keyChecked && form.keyQuantity) l.push(`• ቀይ እንጀራ x${form.keyQuantity}`)
  serviceItems.forEach((item) => { if (form[item.id] !== '') { const o = getSelectedOption(item, form[item.id]); if (o) l.push(`• ${item.name} (${o.label}) — ${o.price}`) } })
  if (form.daboChecked && form.daboQty) l.push(`• ድፎ ዳቦ x${form.daboQty} kg — ¥${(parseInt(form.daboQty) || 0) * 2500}`)
  if (form.tejChecked && form.tejQty) l.push(`• የማር ብርዝ x${form.tejQty} L — ¥${(parseInt(form.tejQty) || 0) * 2000}`)
  if (form.additionalNotes.trim()) { l.push('', `📝 Notes: ${form.additionalNotes.trim()}`) }
  l.push(`⏰ Time: ${form.deliveryTime}`)
  const { total, hasInjera } = computeTotal(form)
  if (total > 0 || hasInjera) { l.push('', hasInjera && total === 0 ? '💴 Total: (injera price depends on quantity)' : hasInjera ? `💴 Est. Total: ¥${total.toLocaleString()} + injera` : `💴 Total: ¥${total.toLocaleString()}`) }
  return l.join('\n')
}

const inputClass = 'w-full px-4 py-3.5 rounded-xl border text-base font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-600/40'
const inputStyle = { background: 'rgba(212,160,23,0.06)', borderColor: 'rgba(212,160,23,0.15)', color: '#FFFFFF' }

/* ── Step indicator ── */
function StepBadge({ num }) {
  return (
    <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black"
          style={{ background: '#D4A017', color: '#1C1008' }}>
      {num}
    </span>
  )
}

function StepHeader({ num, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <StepBadge num={num} />
      <div>
        <h3 className="amharic text-lg md:text-xl font-black text-white">{title}</h3>
        {subtitle && <p className="text-xs md:text-sm font-medium" style={{ color: '#D4C4A8' }}>{subtitle}</p>}
      </div>
    </div>
  )
}

export default function OrderForm() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [whatsappUrl, setWhatsappUrl] = useState(null)

  useEffect(() => { initEmailJS() }, [])

  useEffect(() => {
    function handlePreselect(e) {
      const { id } = e.detail
      setForm((f) => {
        if (id === 'nech-enjera') return { ...f, nechChecked: true }
        if (id === 'key-enjera') return { ...f, keyChecked: true }
        if (id === 'dabo') return { ...f, daboChecked: true }
        if (id === 'tej') return { ...f, tejChecked: true }
        if (SERVICE_IDS.includes(id)) return { ...f, [id]: '0' }
        return f
      })
    }
    window.addEventListener('preselect-item', handlePreselect)
    return () => window.removeEventListener('preselect-item', handlePreselect)
  }, [])

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    const hasAnyItem = form.nechChecked || form.keyChecked || SERVICE_IDS.some((id) => form[id] !== '') || form.daboChecked || form.tejChecked
    if (!hasAnyItem) { alert('እባክዎ ቢያንስ አንድ ምግብ ይምረጡ'); return }
    if (form.nechChecked && !form.nechQuantity.trim()) { alert('የ ነጭ እንጀራ ብዛት ያስገቡ'); return }
    if (form.keyChecked && !form.keyQuantity.trim()) { alert('የ ቀይ እንጀራ ብዛት ያስገቡ'); return }
    if (form.daboChecked && !form.daboQty.trim()) { alert('የ ድፎ ዳቦ ብዛት ያስገቡ'); return }
    if (form.tejChecked && !form.tejQty.trim()) { alert('የ የማር ብርዝ ብዛት ያስገቡ'); return }
    if (form.deliveryType === 'delivery' && !form.deliveryAddress.trim()) { alert('እባክዎ አድራሻ ያስገቡ'); return }

    setSubmitting(true)
    const emailLines = []
    if (form.nechChecked && form.nechQuantity) emailLines.push(`ነጭ እንጀራ: ${form.nechQuantity}`)
    if (form.keyChecked && form.keyQuantity) emailLines.push(`ቀይ እንጀራ: ${form.keyQuantity}`)
    serviceItems.forEach((item) => { if (form[item.id] !== '') { const o = getSelectedOption(item, form[item.id]); if (o) emailLines.push(`${item.name} (${o.label}): ${o.price}`) } })
    if (form.daboChecked && form.daboQty) emailLines.push(`ድፎ ዳቦ: ${form.daboQty} kg`)
    if (form.tejChecked && form.tejQty) emailLines.push(`የማር ብርዝ: ${form.tejQty} L`)
    if (form.additionalNotes.trim()) emailLines.push(`Notes: ${form.additionalNotes.trim()}`)

    try {
      await sendEmail({
        name: form.name, phone: form.phone,
        delivery_type: form.deliveryType === 'delivery' ? 'Delivery' : 'Pickup',
        delivery_address: form.deliveryType === 'delivery' ? (form.deliveryAddress || 'Not provided') : 'Kitasenju Station',
        order: emailLines.join('\n') || 'No items selected',
        preferred_time: form.deliveryTime || 'Not specified',
        email: form.phone,
      })
    } catch (err) { console.error('EmailJS error:', err) }

    const message = buildWhatsAppMessage(form)
    setWhatsappUrl(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`)
    setSubmitting(false)
    setTimeout(() => { document.getElementById('thankYouMessage')?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }, 100)
  }

  const { total, hasInjera } = computeTotal(form)
  const hasAnySelected = form.nechChecked || form.keyChecked || SERVICE_IDS.some((id) => form[id] !== '') || form.daboChecked || form.tejChecked

  return (
    <section id="order" className="py-16 md:py-20 px-4 md:px-6">
      <div className="container mx-auto max-w-xl">

        {/* Title */}
        <div className="flex items-center justify-center gap-3 md:gap-5 mb-10">
          <div className="flex-1 max-w-[100px] md:max-w-[140px] h-[1px]" style={{ background: 'linear-gradient(to right, transparent, #D4A017)' }} />
          <span style={{ color: '#D4A017', fontSize: '14px' }}>✦</span>
          <h2 className="section-title text-3xl md:text-5xl px-2">ትዕዛዝ</h2>
          <span style={{ color: '#D4A017', fontSize: '14px' }}>✦</span>
          <div className="flex-1 max-w-[100px] md:max-w-[140px] h-[1px]" style={{ background: 'linear-gradient(to left, transparent, #D4A017)' }} />
        </div>

        {whatsappUrl ? (
          <ThankYou whatsappUrl={whatsappUrl} telegramUrl={TELEGRAM_URL} />
        ) : (
          <form
            id="orderForm"
            className="rounded-2xl p-5 md:p-8 space-y-8"
            style={{ background: 'linear-gradient(170deg, rgba(45,30,15,0.7) 0%, rgba(25,18,8,0.8) 100%)', border: '1px solid rgba(212,160,23,0.15)' }}
            onSubmit={handleSubmit}
          >

            {/* ════ STEP 1: Pick your food ════ */}
            <div>
              <StepHeader num={1} title="ምግብ ይምረጡ" subtitle="የሚፈልጉትን ይንኩ" />

              {/* Injera */}
              <p className="text-sm font-bold mb-3 ml-11" style={{ color: '#D4A017' }}>እንጀራ</p>

              {/* Nech */}
              <label className="flex items-center gap-4 py-3 px-4 rounded-xl mb-2 cursor-pointer transition-all"
                     style={{ background: form.nechChecked ? 'rgba(212,160,23,0.12)' : 'rgba(212,160,23,0.04)', border: form.nechChecked ? '2px solid #D4A017' : '2px solid rgba(212,160,23,0.08)' }}>
                <input type="checkbox" className="w-5 h-5 accent-amber-600 rounded flex-shrink-0" checked={form.nechChecked} onChange={(e) => set('nechChecked', e.target.checked)} />
                <div className="flex-1">
                  <span className="amharic font-bold text-base text-white">ነጭ እንጀራ</span>
                  <span className="block text-xs font-semibold mt-0.5" style={{ color: '#F0C040' }}>¥400 / 1 · ¥6,000 / 15 · ¥12,000 / 30</span>
                </div>
              </label>
              {form.nechChecked && (
                <div className="ml-11 mb-3">
                  <input type="number" min="1" className={inputClass} style={inputStyle} placeholder="ስንት? (1, 15, 30...)" value={form.nechQuantity} onChange={(e) => set('nechQuantity', e.target.value)} />
                </div>
              )}

              {/* Key */}
              <label className="flex items-center gap-4 py-3 px-4 rounded-xl mb-2 cursor-pointer transition-all"
                     style={{ background: form.keyChecked ? 'rgba(212,160,23,0.12)' : 'rgba(212,160,23,0.04)', border: form.keyChecked ? '2px solid #D4A017' : '2px solid rgba(212,160,23,0.08)' }}>
                <input type="checkbox" className="w-5 h-5 accent-amber-600 rounded flex-shrink-0" checked={form.keyChecked} onChange={(e) => set('keyChecked', e.target.checked)} />
                <div className="flex-1">
                  <span className="amharic font-bold text-base text-white">ቀይ እንጀራ</span>
                  <span className="block text-xs font-semibold mt-0.5" style={{ color: '#F0C040' }}>¥500 / 1 · ¥7,500 / 15 · ¥15,000 / 30</span>
                </div>
              </label>
              {form.keyChecked && (
                <div className="ml-11 mb-3">
                  <input type="number" min="1" className={inputClass} style={inputStyle} placeholder="ስንት? (1, 15, 30...)" value={form.keyQuantity} onChange={(e) => set('keyQuantity', e.target.value)} />
                </div>
              )}

              {/* Services */}
              <p className="text-sm font-bold mb-3 mt-5 ml-11" style={{ color: '#D4A017' }}>አገልግል</p>

              {serviceItems.map((item) => (
                <div key={item.id} className="rounded-xl mb-3 p-4" style={{ background: 'rgba(212,160,23,0.04)', border: '2px solid rgba(212,160,23,0.08)' }}>
                  <p className="amharic font-black text-base text-white mb-3">{item.name}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {item.options.map((opt, i) => {
                      const selected = form[item.id] === String(i)
                      return (
                        <button
                          key={opt.label} type="button"
                          className="py-3 px-3 rounded-xl text-center transition-all"
                          style={{
                            background: selected ? 'rgba(212,160,23,0.15)' : 'rgba(255,255,255,0.03)',
                            border: selected ? '2px solid #D4A017' : '2px solid rgba(255,255,255,0.06)',
                          }}
                          onClick={() => set(item.id, selected ? '' : String(i))}
                        >
                          <span className="amharic font-bold text-sm block" style={{ color: selected ? '#F0C040' : '#FFFFFF' }}>{opt.label}</span>
                          <span className="font-black text-lg block mt-1" style={{ color: '#F0C040' }}>{opt.price}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Extras */}
              <p className="text-sm font-bold mb-3 mt-5 ml-11" style={{ color: '#D4A017' }}>ተጨማሪ</p>

              <label className="flex items-center gap-4 py-3 px-4 rounded-xl mb-2 cursor-pointer transition-all"
                     style={{ background: form.daboChecked ? 'rgba(212,160,23,0.12)' : 'rgba(212,160,23,0.04)', border: form.daboChecked ? '2px solid #D4A017' : '2px solid rgba(212,160,23,0.08)' }}>
                <input type="checkbox" className="w-5 h-5 accent-amber-600 rounded flex-shrink-0" checked={form.daboChecked} onChange={(e) => set('daboChecked', e.target.checked)} />
                <div className="flex-1 flex items-center justify-between">
                  <span className="amharic font-bold text-base text-white">ድፎ ዳቦ</span>
                  <span className="font-black text-sm" style={{ color: '#F0C040' }}>¥2,500/kg</span>
                </div>
              </label>
              {form.daboChecked && (
                <div className="ml-11 mb-3">
                  <input type="number" min="1" className={inputClass} style={inputStyle} placeholder="ስንት ኪሎ?" value={form.daboQty} onChange={(e) => set('daboQty', e.target.value)} />
                </div>
              )}

              <label className="flex items-center gap-4 py-3 px-4 rounded-xl mb-2 cursor-pointer transition-all"
                     style={{ background: form.tejChecked ? 'rgba(212,160,23,0.12)' : 'rgba(212,160,23,0.04)', border: form.tejChecked ? '2px solid #D4A017' : '2px solid rgba(212,160,23,0.08)' }}>
                <input type="checkbox" className="w-5 h-5 accent-amber-600 rounded flex-shrink-0" checked={form.tejChecked} onChange={(e) => set('tejChecked', e.target.checked)} />
                <div className="flex-1 flex items-center justify-between">
                  <span className="amharic font-bold text-base text-white">የማር ብርዝ</span>
                  <span className="font-black text-sm" style={{ color: '#F0C040' }}>¥2,000/L</span>
                </div>
              </label>
              {form.tejChecked && (
                <div className="ml-11 mb-3">
                  <input type="number" min="1" className={inputClass} style={inputStyle} placeholder="ስንት ሊትር?" value={form.tejQty} onChange={(e) => set('tejQty', e.target.value)} />
                </div>
              )}
            </div>

            {/* ════ STEP 2: Your info ════ */}
            <div>
              <StepHeader num={2} title="ስምና ስልክ" subtitle="እንድንደውልዎ" />

              <div className="mb-4">
                <label className="block text-sm mb-1.5 font-bold text-white">ስም</label>
                <input type="text" required className={inputClass} style={inputStyle} placeholder="ሙሉ ስምዎ" value={form.name} onChange={(e) => set('name', e.target.value)} />
              </div>

              <div>
                <label className="block text-sm mb-1.5 font-bold text-white">ስልክ</label>
                <input type="tel" required className={inputClass} style={inputStyle} placeholder="ስልክ ቁጥር" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
              </div>
            </div>

            {/* ════ STEP 3: Delivery or Pickup ════ */}
            <div>
              <StepHeader num={3} title="እንዴት ይፈልጋሉ?" subtitle="delivery ወይም pickup" />

              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: 'delivery', icon: '🚚', label: 'Delivery', sub: 'ወደ ቤትዎ' },
                  { type: 'pickup', icon: '📍', label: 'Pickup', sub: 'Kitasenju' },
                ].map(({ type, icon, label, sub }) => (
                  <button
                    key={type} type="button"
                    className="py-4 px-3 rounded-xl text-center transition-all"
                    style={{
                      background: form.deliveryType === type ? 'rgba(212,160,23,0.15)' : 'rgba(212,160,23,0.04)',
                      border: form.deliveryType === type ? '2px solid #D4A017' : '2px solid rgba(212,160,23,0.08)',
                    }}
                    onClick={() => set('deliveryType', type)}
                  >
                    <span className="text-2xl block mb-1">{icon}</span>
                    <span className="font-bold text-base block" style={{ color: form.deliveryType === type ? '#F0C040' : '#FFFFFF' }}>{label}</span>
                    <span className="amharic text-xs block mt-0.5" style={{ color: '#D4C4A8' }}>{sub}</span>
                  </button>
                ))}
              </div>

              {form.deliveryType === 'delivery' && (
                <div className="mt-4">
                  <label className="block text-sm mb-1.5 font-bold text-white">አድራሻ</label>
                  <textarea rows={2} className={inputClass + ' resize-none'} style={inputStyle} placeholder="የ delivery አድራሻዎን ይጻፉ" value={form.deliveryAddress} onChange={(e) => set('deliveryAddress', e.target.value)} />
                  <p className="text-xs mt-1.5 font-bold" style={{ color: '#D4A017' }}>የ delivery ክፍያ ይኖረዋል</p>
                </div>
              )}
            </div>

            {/* ════ STEP 4: Time & Notes ════ */}
            <div>
              <StepHeader num={4} title="መቼ ይፈልጋሉ?" subtitle="ቀንና ሰዓት" />

              <div className="mb-4">
                <input type="text" required className={inputClass} style={inputStyle} placeholder="ለምሳሌ: ነገ 6 ሰዓት" value={form.deliveryTime} onChange={(e) => set('deliveryTime', e.target.value)} />
              </div>

              <label className="block text-sm mb-1.5 font-bold text-white">ተጨማሪ ማስታወሻ</label>
              <textarea rows={2} className={inputClass + ' resize-none'} style={inputStyle} placeholder="ጥያቄ ወይም ሀሳብ ካለ..." value={form.additionalNotes} onChange={(e) => set('additionalNotes', e.target.value)} />
            </div>

            {/* ── Notice ── */}
            <div className="rounded-xl p-4 flex gap-3 items-start" style={{ background: 'rgba(212,160,23,0.08)', borderLeft: '4px solid #D4A017' }}>
              <span className="text-lg flex-shrink-0">⚠️</span>
              <p className="amharic text-xs md:text-sm font-bold leading-relaxed" style={{ color: '#F0E4D0' }}>
                እንጀራ ሲያዙ delivery ከሆነ ከ 4 ቀን ፣ pickup ከሆነ ከ 3 ቀን በፊት ይዘዙ።
              </p>
            </div>

            {/* ── Total ── */}
            {hasAnySelected && (
              <div className="rounded-xl p-5 text-center" style={{ background: 'rgba(212,160,23,0.12)', border: '1px solid rgba(212,160,23,0.2)' }}>
                <p className="text-xs uppercase tracking-widest mb-2 font-bold" style={{ color: '#D4C4A8' }}>ጠቅላላ ዋጋ</p>
                <p className="text-3xl md:text-4xl font-black" style={{ color: '#F0C040', textShadow: '0 2px 8px rgba(212,160,23,0.3)' }}>
                  {total > 0 ? `¥${total.toLocaleString()}` : ''}
                  {hasInjera && total > 0 ? ' + እንጀራ' : ''}
                  {hasInjera && total === 0 ? 'እንጀራ (በብዛት ይለያያል)' : ''}
                </p>
              </div>
            )}

            {/* ── Submit ── */}
            <div>
              <div className="ethiopian-flag-line-thin mb-5" />
              <button
                type="submit" disabled={submitting}
                className="w-full py-4 md:py-5 rounded-xl text-lg md:text-xl font-black text-white disabled:opacity-60 transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: '#D4A017', boxShadow: '0 4px 20px rgba(212,160,23,0.3)' }}
              >
                {submitting ? 'እየተላከ ነው...' : '📲 ትዕዛዝ ላክ → WhatsApp'}
              </button>
            </div>

          </form>
        )}
      </div>
    </section>
  )
}
