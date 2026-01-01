import { useState, useEffect, useRef } from 'react'
import './Stats.css'
import statsService from '../services/statsService'

function Stats() {
    const [counts, setCounts] = useState({ users: 0, expensesCount: 0, expensesAmount: 0, bugs: 0 })
    const [targets, setTargets] = useState({ users: 0, expensesCount: 0, expensesAmount: 0, bugs: 0 })
    const [hasAnimated, setHasAnimated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const statsRef = useRef(null)

    // Fetch real data from Firebase
    useEffect(() => {
        let unsubscribe;

        const fetchStats = async () => {
            try {
                unsubscribe = statsService.subscribeToStats((data) => {
                    setTargets({
                        users: data.activeUsers || 0,
                        expensesCount: data.totalExpensesCount || 0,
                        expensesAmount: data.expensesTracked || 0,
                        bugs: data.bugReports || 0
                    })
                    setIsLoading(false)
                })
            } catch (error) {
                console.error('Error fetching stats:', error)
                setIsLoading(false)
            }
        }

        fetchStats()

        return () => {
            if (unsubscribe) {
                unsubscribe()
            }
        }
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated && !isLoading) {
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
    }, [hasAnimated, isLoading, targets])

    const animateCounters = () => {
        const duration = 2000
        const steps = 60
        const interval = duration / steps

        let step = 0
        const timer = setInterval(() => {
            step++
            const progress = step / steps

            setCounts({
                users: Math.floor(targets.users * progress),
                expensesCount: Math.floor(targets.expensesCount * progress),
                expensesAmount: Math.floor(targets.expensesAmount * progress),
                bugs: Math.floor(targets.bugs * progress)
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
                    {/* Active Users */}
                    <div className="stat-card reveal">
                        <div className="stat-icon">👥</div>
                        <div className="stat-value">{formatNumber(counts.users)}</div>
                        <div className="stat-label">Active Users</div>
                    </div>

                    {/* Expenses Added (Count) */}
                    <div className="stat-card reveal" style={{ animationDelay: '0.1s' }}>
                        <div className="stat-icon">🧾</div>
                        <div className="stat-value">{formatNumber(counts.expensesCount)}</div>
                        <div className="stat-label">Expenses Added</div>
                    </div>

                    {/* Expenses Tracked (Amount) */}
                    <div className="stat-card reveal" style={{ animationDelay: '0.2s' }}>
                        <div className="stat-icon">💰</div>
                        <div className="stat-value">₹{formatNumber(counts.expensesAmount)}</div>
                        <div className="stat-label">Expenses Tracked</div>
                    </div>

                    {/* Bug Reports */}
                    <div className="stat-card reveal" style={{ animationDelay: '0.3s' }}>
                        <div className="stat-icon">🐞</div>
                        <div className="stat-value">{formatNumber(counts.bugs)}</div>
                        <div className="stat-label">Bug Reports</div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Stats
