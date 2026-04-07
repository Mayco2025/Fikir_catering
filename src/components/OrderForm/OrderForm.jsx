import { useState, useEffect } from 'react'
import coverImg from '../../assets/images/cover-page.jpeg'
import { initEmailJS, sendEmail } from '../../services/emailjs'
import { serviceItems, extraItems } from '../../data/menuData'
import ThankYou from './ThankYou'

const WHATSAPP_NUMBER = '819039118822'
const TELEGRAM_URL    = 'https://t.me/+819039118822'

const SERVICE_IDS = serviceItems.map((s) => s.id)

function makeInitialForm() {
  const base = {
    name:           '',
    phone:          '',
    deliveryType:   '',
    deliveryAddress:'',
    nechChecked:    false,
    nechQuantity:   '',
    keyChecked:     false,
    keyQuantity:    '',
    daboChecked:    false,
    daboQty:        '',
    tejChecked:     false,
    tejQty:         '',
    additionalNotes:'',
    deliveryTime:   '',
  }
  SERVICE_IDS.forEach((id) => { base[id] = false })
  return base
}

const INITIAL_FORM = makeInitialForm()

function parsePrice(priceStr) {
  const m = priceStr.match(/¥([\d,]+)/)
  return m ? parseInt(m[1].replace(/,/g, ''), 10) : 0
}

function computeTotal(form) {
  let total    = 0
  let hasInjera = form.nechChecked || form.keyChecked

  serviceItems.forEach((item) => {
    if (form[item.id]) total += parsePrice(item.price)
  })
  if (form.daboChecked && form.daboQty) total += (parseInt(form.daboQty) || 0) * 2500
  if (form.tejChecked  && form.tejQty)  total += (parseInt(form.tejQty)  || 0) * 2000

  return { total, hasInjera }
}

function buildWhatsAppMessage(form) {
  const lines = ['🍽️ *New Order - Fikir Catering*', '']
  lines.push(`👤 Name: ${form.name}`)
  lines.push(`📞 Phone: ${form.phone}`)

  const deliveryText = form.deliveryType === 'delivery'
    ? `Delivery to: ${form.deliveryAddress}`
    : 'Pickup at Kitasenju'
  lines.push(`🚚 ${deliveryText}`)
  lines.push('')
  lines.push('📋 Order:')

  if (form.nechChecked && form.nechQuantity)
    lines.push(`• ነጭ እንጀራ x${form.nechQuantity}`)
  if (form.keyChecked && form.keyQuantity)
    lines.push(`• ቀይ እንጀራ x${form.keyQuantity}`)

  serviceItems.forEach((item) => {
    if (form[item.id]) lines.push(`• ${item.name} — ${item.price}`)
  })

  if (form.daboChecked && form.daboQty)
    lines.push(`• ድፎ ዳቦ x${form.daboQty} kg — ¥${(parseInt(form.daboQty) || 0) * 2500}`)
  if (form.tejChecked && form.tejQty)
    lines.push(`• የማር ብርዝ x${form.tejQty} L — ¥${(parseInt(form.tejQty) || 0) * 2000}`)

  if (form.additionalNotes.trim()) {
    lines.push('')
    lines.push(`📝 Notes: ${form.additionalNotes.trim()}`)
  }
  lines.push(`⏰ Time: ${form.deliveryTime}`)

  const { total, hasInjera } = computeTotal(form)
  if (total > 0 || hasInjera) {
    lines.push('')
    lines.push(
      hasInjera && total === 0
        ? '💴 Total: (injera price depends on quantity)'
        : hasInjera
          ? `💴 Est. Total: ¥${total.toLocaleString()} + injera`
          : `💴 Total: ¥${total.toLocaleString()}`
    )
  }

  return lines.join('\n')
}

export default function OrderForm() {
  const [form, setForm]         = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [whatsappUrl, setWhatsappUrl] = useState(null)

  useEffect(() => { initEmailJS() }, [])

  // Listen for "Order →" clicks from menu cards
  useEffect(() => {
    function handlePreselect(e) {
      const { id } = e.detail
      setForm((f) => {
        if (id === 'nech-enjera') return { ...f, nechChecked: true }
        if (id === 'key-enjera')  return { ...f, keyChecked: true }
        if (id === 'dabo')        return { ...f, daboChecked: true }
        if (id === 'tej')         return { ...f, tejChecked: true }
        if (SERVICE_IDS.includes(id)) return { ...f, [id]: true }
        return f
      })
    }
    window.addEventListener('preselect-item', handlePreselect)
    return () => window.removeEventListener('preselect-item', handlePreselect)
  }, [])

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return

    const hasAnyItem = form.nechChecked || form.keyChecked ||
      SERVICE_IDS.some((id) => form[id]) || form.daboChecked || form.tejChecked
    if (!hasAnyItem) {
      alert('Please select at least one item.')
      return
    }
    if (form.nechChecked && !form.nechQuantity.trim()) {
      alert('Please enter the quantity for ነጭ እንጀራ.')
      return
    }
    if (form.keyChecked && !form.keyQuantity.trim()) {
      alert('Please enter the quantity for ቀይ እንጀራ.')
      return
    }
    if (form.daboChecked && !form.daboQty.trim()) {
      alert('Please enter the quantity for ድፎ ዳቦ.')
      return
    }
    if (form.tejChecked && !form.tejQty.trim()) {
      alert('Please enter the quantity for የማር ብርዝ.')
      return
    }
    if (form.deliveryType === 'delivery' && !form.deliveryAddress.trim()) {
      alert('Please enter your delivery address.')
      return
    }

    setSubmitting(true)

    // Build order text for EmailJS
    const emailLines = []
    if (form.nechChecked && form.nechQuantity)
      emailLines.push(`ነጭ እንጀራ: ${form.nechQuantity}`)
    if (form.keyChecked && form.keyQuantity)
      emailLines.push(`ቀይ እንጀራ: ${form.keyQuantity}`)
    serviceItems.forEach((item) => {
      if (form[item.id]) emailLines.push(`${item.name}: ${item.price}`)
    })
    if (form.daboChecked && form.daboQty)
      emailLines.push(`ድፎ ዳቦ: ${form.daboQty} kg`)
    if (form.tejChecked && form.tejQty)
      emailLines.push(`የማር ብርዝ: ${form.tejQty} L`)
    if (form.additionalNotes.trim())
      emailLines.push(`Notes: ${form.additionalNotes.trim()}`)

    const orderDetails = emailLines.join('\n') || 'No items selected'
    const deliveryAddressText = form.deliveryType === 'delivery'
      ? (form.deliveryAddress || 'Not provided')
      : 'Kitasenju Station'

    try {
      await sendEmail({
        name:             form.name,
        phone:            form.phone,
        delivery_type:    form.deliveryType === 'delivery' ? 'Delivery' : 'Pickup',
        delivery_address: deliveryAddressText,
        order:            orderDetails,
        preferred_time:   form.deliveryTime || 'Not specified',
        email:            form.phone,
      })
    } catch (err) {
      console.error('EmailJS error:', err)
    }

    const message = buildWhatsAppMessage(form)
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    setWhatsappUrl(url)
    setSubmitting(false)

    setTimeout(() => {
      document.getElementById('thankYouMessage')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  const { total, hasInjera } = computeTotal(form)
  const hasAnySelected = form.nechChecked || form.keyChecked ||
    SERVICE_IDS.some((id) => form[id]) || form.daboChecked || form.tejChecked

  return (
    <section id="order" className="py-20 px-6 relative bg-gradient-to-b from-gray-900 to-black">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img src={coverImg} alt="Ethiopian Food Collage" className="w-full h-full object-cover background-image" />
        <div className="absolute inset-0 background-overlay" />
      </div>

      <div className="container mx-auto max-w-2xl relative z-10">
        <h2 className="section-title text-4xl md:text-5xl text-center mb-4 gold-text break-words">
          Place Your Order
        </h2>
        <div className="ethiopian-flag-line max-w-xs mx-auto mb-8" />

        {whatsappUrl ? (
          <ThankYou whatsappUrl={whatsappUrl} telegramUrl={TELEGRAM_URL} />
        ) : (
          <form id="orderForm" className="bg-gray-900 rounded-lg p-8 border border-gray-800" onSubmit={handleSubmit}>

            {/* How to order guide */}
            <div className="mb-6 bg-red-50 border-l-4 border-red-600 rounded-lg p-4 shadow-md">
              <h3 className="text-base md:text-lg font-bold text-red-900 mb-3 drop-shadow-sm">
                How to Order እንዴት እንደሚዘዙ
              </h3>
              <ol className="text-gray-800 text-xs md:text-sm space-y-1 list-decimal list-inside font-semibold leading-relaxed">
                <li>የሚፈልጉትን ምግብ ወይም እንጀራ ምረጡ</li>
                <li>ብዛቱን ወይም ቁጥሩን ያስገቡ</li>
                <li>delivery ወይም pickup ይምረጡ</li>
                <li>ትዕዛዝዎን ያስገቡ — WhatsApp ይከፈታል</li>
                <li>ለ Fikir Catering መልዕክቱን ይላኩ</li>
              </ol>
            </div>

            {/* Order notice */}
            <div className="mb-6 bg-yellow-900 bg-opacity-30 border-l-4 border-yellow-400 rounded-lg p-4">
              <p className="text-yellow-400 text-sm md:text-base font-semibold leading-relaxed">
                ማሳሰቢያ እንጀራ ሲያዙ delivery ከሆነ ከ 4 ቀን pickup ከሆነ ከ 3 ቀን በፊት ይዘዙ። አስቸኩዋይ ከሆነ ደውለው መኖር አለመኖሩን ያረጋግጡ።
              </p>
            </div>

            {/* Name */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-white mb-2 font-semibold">Name (ሙሉ ስም) *</label>
              <input
                type="text" id="name" required
                className="form-input w-full px-4 py-3 rounded-lg text-white"
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label htmlFor="phone" className="block text-white mb-2 font-semibold">Phone number (ስልክ ቁጥር) *</label>
              <input
                type="tel" id="phone" required
                className="form-input w-full px-4 py-3 rounded-lg text-white"
                placeholder="Your phone number"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            </div>

            {/* Delivery / Pickup */}
            <div className="mb-6">
              <label className="block text-white mb-2 font-semibold">delivery ወይም pickup የሚለውን ምረጡ *</label>
              <div className="flex flex-col gap-3 mt-2">
                {['delivery', 'pickup'].map((type) => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio" name="deliveryType" value={type} required
                      className="w-5 h-5 text-yellow-400"
                      checked={form.deliveryType === type}
                      onChange={() => set('deliveryType', type)}
                    />
                    <span className="text-white capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Delivery address */}
            {form.deliveryType === 'delivery' && (
              <div className="mb-6">
                <label htmlFor="deliveryAddress" className="block text-white mb-2 font-semibold">Delivery Address *</label>
                <textarea
                  id="deliveryAddress" rows={3}
                  className="form-input w-full px-4 py-3 rounded-lg text-white resize-none"
                  placeholder="Enter your delivery address"
                  value={form.deliveryAddress}
                  onChange={(e) => set('deliveryAddress', e.target.value)}
                />
                <p className="text-yellow-400 text-sm mt-2 font-semibold">እባክዎ ትክክለኛ አድራሻ ማስገባትዎን ያረጋግጡ።</p>
                <p className="text-yellow-400 text-sm mt-1 font-semibold">የ delivery ክፍያ ይኖረዋል።</p>
              </div>
            )}

            {/* Pickup info */}
            {form.deliveryType === 'pickup' && (
              <div className="mb-6">
                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  <p className="text-white text-base md:text-lg font-semibold">
                    Pickup station is Kitasenju መቀበያ ቦታ
                  </p>
                </div>
              </div>
            )}

            {/* ─── Injera section ─── */}
            <div className="mb-8">
              <h3 className="text-white font-bold text-lg mb-3 border-b border-gray-700 pb-2">
                ደረቅ እንጀራ (Injera)
              </h3>

              {/* Nech Enjera */}
              <div className="mb-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
                <label className="flex items-center gap-3 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-yellow-400"
                    checked={form.nechChecked}
                    onChange={(e) => set('nechChecked', e.target.checked)}
                  />
                  <span className="text-white font-semibold text-lg">ነጭ እንጀራ</span>
                </label>
                {form.nechChecked && (
                  <div className="mt-3 ml-8">
                    <label htmlFor="nechQuantity" className="block text-white mb-2 text-sm">Quantity ብዛት *</label>
                    <input
                      type="number" id="nechQuantity" min="1"
                      className="form-input w-full px-4 py-2 rounded-lg text-white"
                      placeholder="e.g. 1, 15, 30"
                      value={form.nechQuantity}
                      onChange={(e) => set('nechQuantity', e.target.value)}
                    />
                    <p className="text-gray-400 text-xs mt-2">¥400 / piece · ¥6,000 / 15 · ¥12,000 / 30</p>
                  </div>
                )}
              </div>

              {/* Key Enjera */}
              <div className="mb-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
                <label className="flex items-center gap-3 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-yellow-400"
                    checked={form.keyChecked}
                    onChange={(e) => set('keyChecked', e.target.checked)}
                  />
                  <span className="text-white font-semibold text-lg">ቀይ እንጀራ</span>
                </label>
                {form.keyChecked && (
                  <div className="mt-3 ml-8">
                    <label htmlFor="keyQuantity" className="block text-white mb-2 text-sm">Quantity ብዛት *</label>
                    <input
                      type="number" id="keyQuantity" min="1"
                      className="form-input w-full px-4 py-2 rounded-lg text-white"
                      placeholder="e.g. 1, 15, 30"
                      value={form.keyQuantity}
                      onChange={(e) => set('keyQuantity', e.target.value)}
                    />
                    <p className="text-gray-400 text-xs mt-2">¥500 / piece · ¥7,500 / 15 · ¥15,000 / 30</p>
                  </div>
                )}
              </div>
            </div>

            {/* ─── Services section ─── */}
            <div className="mb-8">
              <h3 className="text-white font-bold text-lg mb-3 border-b border-gray-700 pb-2">
                አገልግሎቶች (Services)
              </h3>
              <div className="flex flex-col gap-3">
                {serviceItems.map((item) => (
                  <label key={item.id} className="flex items-center justify-between gap-3 bg-gray-800 rounded-lg p-4 border border-gray-700 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-yellow-400 flex-shrink-0"
                        checked={Boolean(form[item.id])}
                        onChange={(e) => set(item.id, e.target.checked)}
                      />
                      <span className="text-white font-semibold">{item.name}</span>
                    </div>
                    <span className="text-yellow-400 font-bold whitespace-nowrap">{item.price}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* ─── Extras section ─── */}
            <div className="mb-8">
              <h3 className="text-white font-bold text-lg mb-3 border-b border-gray-700 pb-2">
                ተጨማሪ (Extras)
              </h3>

              {/* Dabo */}
              <div className="mb-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
                <label className="flex items-center justify-between gap-3 cursor-pointer mb-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-yellow-400"
                      checked={form.daboChecked}
                      onChange={(e) => set('daboChecked', e.target.checked)}
                    />
                    <span className="text-white font-semibold">ድፎ ዳቦ</span>
                  </div>
                  <span className="text-yellow-400 font-bold">¥2,500 / kg</span>
                </label>
                {form.daboChecked && (
                  <div className="ml-8 mt-2">
                    <input
                      type="number" min="1"
                      className="form-input w-full px-4 py-2 rounded-lg text-white"
                      placeholder="Quantity (kg)"
                      value={form.daboQty}
                      onChange={(e) => set('daboQty', e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Tej */}
              <div className="mb-4 bg-gray-800 rounded-lg p-4 border border-gray-700">
                <label className="flex items-center justify-between gap-3 cursor-pointer mb-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-5 h-5 text-yellow-400"
                      checked={form.tejChecked}
                      onChange={(e) => set('tejChecked', e.target.checked)}
                    />
                    <span className="text-white font-semibold">የማር ብርዝ</span>
                  </div>
                  <span className="text-yellow-400 font-bold">¥2,000 / L</span>
                </label>
                {form.tejChecked && (
                  <div className="ml-8 mt-2">
                    <input
                      type="number" min="1"
                      className="form-input w-full px-4 py-2 rounded-lg text-white"
                      placeholder="Quantity (liters)"
                      value={form.tejQty}
                      onChange={(e) => set('tejQty', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Additional notes */}
            <div className="mb-6">
              <label htmlFor="additionalNotes" className="block text-white mb-2 font-semibold">
                ጥያቄ ወይም ሀሳብ ካለ ጻፉልን
              </label>
              <textarea
                id="additionalNotes" rows={3}
                className="form-input w-full px-4 py-3 rounded-lg text-white resize-none"
                placeholder="Additional notes..."
                value={form.additionalNotes}
                onChange={(e) => set('additionalNotes', e.target.value)}
              />
            </div>

            {/* Delivery time */}
            <div className="mb-6">
              <label htmlFor="deliveryTime" className="block text-white mb-2 font-semibold">
                Preferred Delivery/Pickup Time የመቀበያ ሰዓት *
              </label>
              <input
                type="text" id="deliveryTime" required
                className="form-input w-full px-4 py-3 rounded-lg text-white"
                placeholder="e.g., Tomorrow at 6 PM"
                value={form.deliveryTime}
                onChange={(e) => set('deliveryTime', e.target.value)}
              />
            </div>

            {/* Running total */}
            {hasAnySelected && (
              <div className="mb-6 bg-gray-800 rounded-lg p-4 border border-yellow-400 border-opacity-30">
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-1 font-semibold">
                  Estimated Total
                </p>
                <p className="text-2xl font-black gold-text">
                  {total > 0 ? `¥${total.toLocaleString()}` : ''}
                  {hasInjera && total > 0 ? ' + injera' : ''}
                  {hasInjera && total === 0 ? 'Injera (price by quantity)' : ''}
                </p>
                <p className="text-gray-500 text-xs mt-1">* delivery fee not included</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-primary text-white font-semibold px-8 py-4 rounded-lg text-lg disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Submit Order → WhatsApp'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
