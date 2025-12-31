import './Features.css'

function Features() {
    const features = [
        {
            icon: '⚡',
            title: 'Chore Tracking',
            description: 'Never argue about whose turn it is to do the dishes again. Assign tasks, set recurring schedules, and track completion.',
            color: '#8B5CF6'
        },
        {
            icon: '💸',
            title: 'Expense Settle-up',
            description: 'Split rent, utilities, and grocery bills instantly. Keep a running tally of who owes what and settle up with one tap.',
            color: '#EC4899'
        },
        {
            icon: '💬',
            title: 'House Chat',
            description: 'A dedicated space for house comms. Pin important messages, create polls for dinner, and keep personal chats separate.',
            color: '#06B6D4'
        },
        {
            icon: '🛒',
            title: 'Shared Shopping List',
            description: 'Add items to the list as you run out. Real-time syncing ensures you never buy double milk again.',
            color: '#10B981'
        },
        {
            icon: '📅',
            title: 'Shared Calendar',
            description: 'Know when friends are coming over or when the landlord is visiting. Coordinate schedules effortlessly.',
            color: '#F59E0B'
        },
        {
            icon: '🔒',
            title: 'Secure & Private',
            description: 'Your data is safe with us. Built with privacy-first architecture so you can live with peace of mind.',
            color: '#EF4444'
        }
    ]

    return (
        <section id="features" className="features-section">
            <div className="container">
                <div className="section-header reveal">
                    <h2 className="section-title">
                        Everything you need to<br />
                        <span className="text-gradient">live in harmony.</span>
                    </h2>
                    <p className="section-subtitle">
                        Powerful features designed to make shared living effortless
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card reveal"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="feature-icon-wrapper" style={{ background: `${feature.color}15` }}>
                                <div className="feature-icon" style={{ color: feature.color }}>
                                    {feature.icon}
                                </div>
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                            <div className="feature-arrow" style={{ color: feature.color }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Features
