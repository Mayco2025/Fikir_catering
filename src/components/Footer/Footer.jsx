export default function Footer() {
  return (
    <footer className="py-10 px-6" style={{ borderTop: '1px solid rgba(212,160,23,0.1)' }}>
      <div className="mx-auto w-32 mb-6" style={{ height: '2px', background: 'linear-gradient(to right, transparent, #D4A017, transparent)' }} />
      <div className="container mx-auto text-center">
        <p className="text-sm font-bold text-gray-400">© 2025 Fikir Catering Japan — Cooked with love</p>
        <p className="amharic text-sm font-semibold mt-1" style={{ color: '#D4A017' }}>
          ሰላም ለ አገራችን
        </p>
      </div>
    </footer>
  )
}
