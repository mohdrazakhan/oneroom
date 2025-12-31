import { useEffect, useState } from 'react'
import './Hero.css'

function Hero() {
    const [particles, setParticles] = useState([])

    useEffect(() => {
        // Generate random particles for background
        const newParticles = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            top: Math.random() * 100,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5
        }))
        setParticles(newParticles)
    }, [])

    return (
        <section id="hero" className="hero">
            <div className="particles">
                {particles.map(particle => (
                    <div
                        key={particle.id}
                        className="particle"
                        style={{
                            left: `${particle.left}%`,
                            top: `${particle.top}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            animationDuration: `${particle.duration}s`,
                            animationDelay: `${particle.delay}s`
                        }}
                    />
                ))}
            </div>

            <div className="container">
                <div className="hero-content">
                    <div className="hero-text">
                        <div className="badge">
                            <span className="badge-icon">🎉</span>
                            <span>Now available on iOS & Android</span>
                        </div>

                        <h1 className="hero-title">
                            Living together,<br />
                            <span className="text-gradient">simplified.</span>
                        </h1>

                        <p className="hero-description">
                            The all-in-one app to manage chores, split expenses, and keep the peace
                            in your shared home. Join thousands of happy roommates today.
                        </p>

                        <div className="hero-buttons">
                            <button className="btn btn-primary">
                                <span>Download for iOS</span>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 3V17M10 17L16 11M10 17L4 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <a
                                href="https://play.google.com/store/apps/details?id=com.oneroom.app&hl=en"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <button className="btn btn-outline">
                                    <span>Get on Android</span>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M10 3V17M10 17L16 11M10 17L4 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </a>
                        </div>

                        <div className="hero-stats">
                            <div className="stat">
                                <div className="stat-number">10K+</div>
                                <div className="stat-label">Active Users</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">4.8★</div>
                                <div className="stat-label">App Rating</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">50K+</div>
                                <div className="stat-label">Downloads</div>
                            </div>
                        </div>
                    </div>

                    <div className="hero-image">
                        <div className="phone-mockup float">
                            <img src="/assets/hero-phones.png" alt="OneRoom App Interface" />
                            <div className="glow glow-1"></div>
                            <div className="glow glow-2"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
