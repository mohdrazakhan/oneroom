import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { signInWithGoogle } from '../services/authService'
import { auth } from '../config/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import './Header.css'

function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [user, setUser] = useState(null)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => unsubscribe()
    }, [])

    const handleLogin = async () => {
        try {
            await signInWithGoogle()
            window.location.href = '/app/index.html'
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        setMobileMenuOpen(false)
    }, [location])

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '')
            setTimeout(() => {
                const element = document.getElementById(id)
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                }
            }, 100)
        }
    }, [location])

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container">
                <nav className="nav">
                    <Link to="/" className="logo">
                        <img src="/assets/logo.png" alt="OneRoom Logo" />
                        <span>OneRoom</span>
                    </Link>

                    <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
                        <Link to="/">Home</Link>
                        <Link to="/features">Features</Link>
                        <Link to="/pricing">Pricing</Link>
                        <Link to="/#testimonials">Testimonials</Link>
                        <Link to="/faq">FAQ</Link>
                        <a href="https://play.google.com/store/apps/details?id=com.oneroom.app&hl=en" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Download App</a>
                        {user ? (
                            <button onClick={() => window.location.href = '/app/index.html'} className="btn btn-secondary">
                                Dashboard
                            </button>
                        ) : (
                            <button onClick={handleLogin} className="btn btn-secondary">
                                Login
                            </button>
                        )}
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
