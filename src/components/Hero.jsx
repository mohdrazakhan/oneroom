import { useEffect, useState } from 'react'
import './Hero.css'
import statsService from '../services/statsService'

function Hero() {
    const [particles, setParticles] = useState([])
    const [stats, setStats] = useState({
        activeUsers: '0+',
        appRating: '0.0★',
        downloads: '0+'
    })

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

    // Fetch real stats from Firebase
    useEffect(() => {
        let unsubscribe;

        const fetchStats = async () => {
            try {
                // Real-time subscription to stats
                unsubscribe = statsService.subscribeToStats((data) => {
                    const formatNumber = (num) => {
                        if (num === undefined || num === null) return '0+';
                        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+'
                        if (num >= 1000) return (num / 1000).toFixed(0) + 'K+'
                        return num.toString() + '+'
                    }

                    setStats({
                        activeUsers: formatNumber(data.activeUsers),
                        appRating: `${data.appRating !== undefined ? Number(data.appRating).toFixed(1) : '0.0'}★`,
                        ratingCount: data.ratingCount,
                        downloads: formatNumber(data.totalDownloads)
                    })
                })

                // Alternative: One-time fetch with Play Store data
                // const data = await statsService.getAllStats()
                // setStats({
                //     activeUsers: formatNumber(data.activeUsers || 10000),
                //     appRating: `${data.playStore?.rating || data.appRating || 4.8}★`,
                //     downloads: formatNumber(data.playStore?.downloads || data.totalDownloads || 50000)
                // })
            } catch (error) {
                console.error('Error fetching hero stats:', error)
            }
        }

        fetchStats()

        return () => {
            if (unsubscribe) {
                unsubscribe()
            }
        }
    }, [])

    const [showIosPopup, setShowIosPopup] = useState(false)

    const handleIosClick = () => {
        setShowIosPopup(true)
        setTimeout(() => setShowIosPopup(false), 3000)
    }

    return (
        <section id="hero" className="hero">
            {showIosPopup && (
                <div className="ios-popup">
                    <span>🍎</span>
                    <span>Coming Soon </span>
                </div>
            )}
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
                            <span>Now available on Android</span>
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
                            <button className="btn btn-primary" onClick={handleIosClick}>
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
                                <div className="stat-number">
                                    {stats.activeUsers}
                                    <span className="stat-live-dot" title="Live Count"></span>
                                </div>
                                <div className="stat-label">Active Users</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">
                                    {stats.appRating}
                                    {stats.ratingCount && <span style={{ fontSize: '0.8rem', opacity: 0.7, marginLeft: '5px' }}>({stats.ratingCount})</span>}
                                </div>
                                <div className="stat-label">App Rating</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">{stats.downloads}</div>
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
