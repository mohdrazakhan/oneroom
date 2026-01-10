import { useState } from 'react'
import './Newsletter.css'

function Newsletter() {
    const [email, setEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (email) {
            setSubscribed(true)
            setTimeout(() => {
                setEmail('')
                setSubscribed(false)
            }, 3000)
        }
    }

    return (
        <section className="newsletter-section">
            <div className="container">
                <div className="newsletter-content reveal">
                    <div className="newsletter-text">
                        <h2 className="newsletter-title">
                            Stay in the <span className="text-gradient-cyan">loop</span>
                        </h2>
                        <p className="newsletter-description">
                            Get the latest updates, tips, and exclusive offers delivered to your inbox.
                        </p>
                    </div>

                    <form className="newsletter-form" onSubmit={handleSubmit}>
                        {!subscribed ? (
                            <>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="newsletter-input"
                                />
                                <button type="submit" className="btn btn-primary">
                                    Subscribe
                                </button>
                            </>
                        ) : (
                            <div className="success-message">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>Thanks for subscribing!</span>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Newsletter
