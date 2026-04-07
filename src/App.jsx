import coverImg from './assets/images/cover-page.jpeg'
import Navbar from './components/Navbar/Navbar'
import AnnouncementBanner from './components/AnnouncementBanner/AnnouncementBanner'
import Hero from './components/Hero/Hero'
import Menu from './components/Menu/Menu'
import About from './components/About/About'
import OrderForm from './components/OrderForm/OrderForm'
import Footer from './components/Footer/Footer'
import FloatingContact from './components/FloatingContact/FloatingContact'

function App() {
  return (
    <div className="relative min-h-screen">
      {/* Full background image */}
      <div className="fixed inset-0 z-0">
        <img src={coverImg} alt="" className="w-full h-full object-cover" style={{ filter: 'brightness(0.45) saturate(1.2)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(25,15,5,0.45) 0%, rgba(15,10,5,0.5) 100%)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <AnnouncementBanner />
        <Hero />
        <Menu />
        <About />
        <OrderForm />
        <Footer />
        <FloatingContact />
      </div>
    </div>
  )
}

export default App
