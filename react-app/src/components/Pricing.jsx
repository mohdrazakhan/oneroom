import { useState } from 'react'
import './Pricing.css'

function Pricing() {
    const [isAnnual, setIsAnnual] = useState(false)

    const plans = [
        {
            name: 'Free',
            price: { monthly: 0, annual: 0 },
            description: 'Perfect for trying out OneRoom',
            features: [
                'Up to 4 roommates',
                'Basic chore tracking',
                'Expense splitting',
                'House chat',
                'Mobile app access'
            ],
            cta: 'Get Started',
            popular: false
        },
        {
            name: 'Premium',
            price: { monthly: 4.99, annual: 49.99 },
            description: 'Everything you need for seamless living',
            features: [
                'Unlimited roommates',
                'Advanced chore scheduling',
                'Detailed expense analytics',
                'Priority support',
                'Custom categories',
                'Export data',
                'Ad-free experience'
            ],
            cta: 'Start Free Trial',
            popular: true
        },
        {
            name: 'Family',
            price: { monthly: 9.99, annual: 99.99 },
            description: 'For larger households',
            features: [
                'Everything in Premium',
                'Multiple households',
                'Family calendar sync',
                'Advanced permissions',
                'Dedicated support',
                'Custom integrations'
            ],
            cta: 'Contact Sales',
            popular: false
        }
    ]

    return (
        <section id="pricing" className="pricing-section">
            <div className="container">
                <div className="section-header reveal">
                    <h2 className="section-title">
                        Simple, <span className="text-gradient">transparent pricing</span>
                    </h2>
                    <p className="section-subtitle">
                        Choose the plan that works best for your household
                    </p>

                    <div className="pricing-toggle">
                        <span className={!isAnnual ? 'active' : ''}>Monthly</span>
                        <button
                            className="toggle-switch"
                            onClick={() => setIsAnnual(!isAnnual)}
                        >
                            <span className={`toggle-slider ${isAnnual ? 'annual' : ''}`}></span>
                        </button>
                        <span className={isAnnual ? 'active' : ''}>
                            Annual <span className="save-badge">Save 20%</span>
                        </span>
                    </div>
                </div>

                <div className="pricing-grid">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`pricing-card reveal ${plan.popular ? 'popular' : ''}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {plan.popular && <div className="popular-badge">Most Popular</div>}

                            <div className="plan-header">
                                <h3 className="plan-name">{plan.name}</h3>
                                <div className="plan-price">
                                    <span className="currency">$</span>
                                    <span className="amount">
                                        {isAnnual ? plan.price.annual : plan.price.monthly}
                                    </span>
                                    <span className="period">/{isAnnual ? 'year' : 'month'}</span>
                                </div>
                                <p className="plan-description">{plan.description}</p>
                            </div>

                            <ul className="plan-features">
                                {plan.features.map((feature, i) => (
                                    <li key={i}>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'}`}>
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Pricing
