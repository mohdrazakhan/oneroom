import './Pricing.css'

function Pricing() {
    return (
        <section id="pricing" className="pricing-section">
            <div className="container">
                <div className="congrats-card reveal">
                    <div className="congrats-icon">🎉</div>
                    <h2 className="congrats-title">
                        Congratulations!
                    </h2>
                    <h3 className="congrats-subtitle">
                        All <span className="text-gradient">Premium Features</span> are currently <span className="highlight-free">FREE</span>!
                    </h3>
                    <p className="congrats-description">
                        As a special welcome to our early community, we've unlocked the entire OneRoom experience for everyone.
                        No credit card required. No hidden fees. Just seamless shared living.
                    </p>

                    <div className="features-grid">
                        <div className="feature-item">
                            <span className="check-icon">✓</span>
                            <span>Unlimited Roommates</span>
                        </div>
                        <div className="feature-item">
                            <span className="check-icon">✓</span>
                            <span>Advanced Chore Scheduling</span>
                        </div>
                        <div className="feature-item">
                            <span className="check-icon">✓</span>
                            <span>Detailed Expense Analytics</span>
                        </div>
                        <div className="feature-item">
                            <span className="check-icon">✓</span>
                            <span>Receipt Scanning</span>
                        </div>
                        <div className="feature-item">
                            <span className="check-icon">✓</span>
                            <span>Priority Support</span>
                        </div>

                    </div>

                    <a href="https://play.google.com/store/apps/details?id=com.oneroom.app&hl=en" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg">
                        Get Premium for FREE Now
                    </a>

                    <p className="offer-note">* Limited time offer for early adopters</p>
                </div>
            </div>
        </section>
    )
}

export default Pricing
