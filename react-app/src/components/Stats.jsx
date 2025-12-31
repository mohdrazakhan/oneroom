import { useState, useEffect, useRef } from 'react'
import './Stats.css'

function Stats() {
    const [counts, setCounts] = useState({ users: 0, tasks: 0, expenses: 0, satisfaction: 0 })
    const [hasAnimated, setHasAnimated] = useState(false)
    const statsRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    animateCounters()
                    setHasAnimated(true)
                }
            },
            { threshold: 0.5 }
        )

        if (statsRef.current) {
            observer.observe(statsRef.current)
        }

        return () => observer.disconnect()
    }, [hasAnimated])

    const animateCounters = () => {
        const targets = { users: 10000, tasks: 500000, expenses: 1000000, satisfaction: 98 }
        const duration = 2000
        const steps = 60
        const interval = duration / steps

        let step = 0
        const timer = setInterval(() => {
            step++
            const progress = step / steps

            setCounts({
                users: Math.floor(targets.users * progress),
                tasks: Math.floor(targets.tasks * progress),
                expenses: Math.floor(targets.expenses * progress),
                satisfaction: Math.floor(targets.satisfaction * progress)
            })

            if (step >= steps) {
                clearInterval(timer)
                setCounts(targets)
            }
        }, interval)
    }

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M+'
        if (num >= 1000) return (num / 1000).toFixed(0) + 'K+'
        return num
    }

    return (
        <section className="stats-section" ref={statsRef}>
            <div className="container">
                <div className="stats-grid">
                    <div className="stat-card reveal">
                        <div className="stat-icon">👥</div>
                        <div className="stat-value">{formatNumber(counts.users)}</div>
                        <div className="stat-label">Active Users</div>
                    </div>

                    <div className="stat-card reveal" style={{ animationDelay: '0.1s' }}>
                        <div className="stat-icon">✅</div>
                        <div className="stat-value">{formatNumber(counts.tasks)}</div>
                        <div className="stat-label">Tasks Completed</div>
                    </div>

                    <div className="stat-card reveal" style={{ animationDelay: '0.2s' }}>
                        <div className="stat-icon">💰</div>
                        <div className="stat-value">${formatNumber(counts.expenses)}</div>
                        <div className="stat-label">Expenses Tracked</div>
                    </div>

                    <div className="stat-card reveal" style={{ animationDelay: '0.3s' }}>
                        <div className="stat-icon">⭐</div>
                        <div className="stat-value">{counts.satisfaction}%</div>
                        <div className="stat-label">Satisfaction Rate</div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Stats
