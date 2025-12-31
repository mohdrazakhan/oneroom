import { useState, useEffect } from 'react'
import './Header.css'

function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToSection = (id) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
            setMobileMenuOpen(false)
        }
    }

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <nav className="nav">
                    <div className="logo" onClick={() => scrollToSection('hero')}>
                        <img src="/assets/logo.png" alt="OneRoom Logo" />
                        <span>OneRoom</span>
                    </div>

                    <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                        <a onClick={() => scrollToSection('hero')}>Home</a>
                        <a onClick={() => scrollToSection('features')}>Features</a>
                        <a onClick={() => scrollToSection('pricing')}>Pricing</a>
                        <a onClick={() => scrollToSection('testimonials')}>Testimonials</a>
                        <a onClick={() => scrollToSection('faq')}>FAQ</a>
                        <button className="btn btn-primary">Download App</button>
                    </div>

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </nav>
            </div>
        </header>
    )
}

export default Header
