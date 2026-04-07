const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/submit-order'

export async function submitOrder(orderData) {
  const response = await fetch(BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  })
  return response.json()
}
