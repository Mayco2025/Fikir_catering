import emailjs from '@emailjs/browser'

const PUBLIC_KEY   = import.meta.env.VITE_EMAILJS_PUBLIC_KEY   || 'w4GVYNqjiwTeGNs1z'
const SERVICE_ID   = import.meta.env.VITE_EMAILJS_SERVICE_ID   || 'service_k7nn285'
const TEMPLATE_ID  = import.meta.env.VITE_EMAILJS_TEMPLATE_ID  || 'template_f20ebuf'

let initialized = false

export function initEmailJS() {
  if (!initialized) {
    emailjs.init(PUBLIC_KEY)
    initialized = true
  }
}

export function sendEmail(params) {
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, params)
}
