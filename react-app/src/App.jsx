import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import Stats from './components/Stats'
import Showcase from './components/Showcase'
import Testimonials from './components/Testimonials'
import Pricing from './components/Pricing'
import FAQ from './components/FAQ'
import Newsletter from './components/Newsletter'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'

function App() {
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    // Reveal on scroll animation
    const revealElements = document.querySelectorAll('.reveal')

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active')
        }
      })
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    })

    revealElements.forEach(el => revealObserver.observe(el))

    return () => revealObserver.disconnect()
  }, [])

  return (
    <div className="App">
      <Header />
      <Hero />
      <Stats />
      <Features />
      <Showcase />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Newsletter />
      <Footer />
      <ChatWidget show={showChat} onToggle={() => setShowChat(!showChat)} />
    </div>
  )
}

export default App
