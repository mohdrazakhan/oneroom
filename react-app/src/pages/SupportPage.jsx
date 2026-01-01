function SupportPage() {
    return (
        <main className="page-container">
            <div className="container">
                <div className="page-header">
                    <h1>Support Center</h1>
                    <p className="subtitle">We're here to help you get the most out of OneRoom.</p>
                </div>

                <div className="support-grid">
                    <div className="support-card">
                        <h3>Contact Support</h3>
                        <p>Have a specific issue or found a bug? Our support team is ready to assist you.</p>
                        <a href="mailto:care.oneroom@gmail.com" className="btn btn-primary">Email Us</a>
                        <p style={{ marginTop: '1rem', fontWeight: '500' }}>Call/WhatsApp: +91 8279677833</p>
                    </div>

                    <div className="support-card">
                        <h3>General Inquiries</h3>
                        <p>For partnership opportunities or general questions about the company.</p>
                        <a href="mailto:care.oneroom@gmail.com" className="btn btn-outline">Contact Info</a>
                    </div>
                </div>

                <section className="faq-preview">
                    <h2>Common Topics</h2>
                    <ul className="topic-list">
                        <li>Account Management</li>
                        <li>Billing & Subscriptions</li>
                        <li>Roommate Invites</li>
                        <li>Chores & Tasks Setup</li>
                        <li>Expense Splitting Logic</li>
                    </ul>
                </section>
            </div>

            <style jsx>{`
                .page-container {
                    padding-top: 100px;
                    padding-bottom: 4rem;
                    min-height: 80vh;
                }
                .page-header {
                    text-align: center;
                    margin-bottom: 4rem;
                }
                .page-header h1 {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }
                .subtitle {
                    font-size: 1.25rem;
                    color: var(--text-muted);
                }
                .support-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    max-width: 900px;
                    margin: 0 auto 4rem;
                }
                .support-card {
                    background: var(--bg-card);
                    padding: 2rem;
                    border-radius: var(--radius-lg);
                    text-align: center;
                    border: 1px solid var(--border);
                }
                .support-card h3 {
                    margin-bottom: 1rem;
                    color: var(--text-main);
                }
                .support-card p {
                    color: var(--text-muted);
                    margin-bottom: 2rem;
                }
                .btn-outline {
                    border: 2px solid var(--primary);
                    color: var(--primary);
                    padding: 0.75rem 1.5rem;
                    border-radius: var(--radius-full);
                    font-weight: 600;
                    display: inline-block;
                }
                .faq-preview {
                    max-width: 600px;
                    margin: 0 auto;
                    text-align: center;
                }
                .topic-list {
                    list-style: none;
                    text-align: left;
                    margin-top: 2rem;
                }
                .topic-list li {
                    padding: 1rem;
                    border-bottom: 1px solid var(--border);
                    color: var(--text-main);
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .topic-list li:hover {
                    color: var(--primary);
                }
            `}</style>
        </main>
    )
}

export default SupportPage
