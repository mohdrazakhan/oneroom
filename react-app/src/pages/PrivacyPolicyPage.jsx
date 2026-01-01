function PrivacyPolicyPage() {
    return (
        <main className="page-container">
            <div className="container">
                <div className="page-header">
                    <h1>Privacy Policy</h1>
                    <p className="last-updated">Last Updated: January 1, 2026</p>
                </div>

                <div className="legal-content">
                    <section>
                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to OneRoom (oneroom.living) ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                            If you have any questions or concerns about this privacy notice or our practices with regard to your personal information,
                            please contact us at care.oneroom@gmail.com.
                        </p>
                        <p>
                            This Privacy Policy applies to all information collected through our mobile application, OneRoom, and any related services, sales, marketing, or events.
                        </p>
                    </section>

                    <section>
                        <h2>2. Information We Collect</h2>
                        <p>
                            We collect personal information that you voluntarily provide to us when you register on the App, express an interest in obtaining information about us or our products and services, when you participate in activities on the App (such as by posting messages in our online forums or entering competitions, contests or giveaways) or otherwise when you contact us.
                        </p>
                        <ul>
                            <li><strong>Personal Information Provided by You:</strong> We collect names; email addresses; usernames; passwords; contact preferences; and other similar information.</li>
                            <li><strong>Payment Data:</strong> We may collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. How We Use Your Information</h2>
                        <p>
                            We use personal information collected via our App for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
                        </p>
                        <ul>
                            <li>To facilitate account creation and logon process.</li>
                            <li>To post testimonials.</li>
                            <li>To request feedback.</li>
                            <li>To enable user-to-user communications.</li>
                            <li>To manage user accounts.</li>
                            <li>To enforce our terms, conditions and policies for business purposes, to comply with legal and regulatory requirements or in connection with our contract.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Sharing Your Information</h2>
                        <p>
                            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
                        </p>
                    </section>

                    <section>
                        <h2>5. Data Safety</h2>
                        <p>
                            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
                        </p>
                    </section>
                </div>
            </div>

            <style jsx>{`
                .page-container {
                    padding-top: 100px;
                    padding-bottom: 4rem;
                }
                .page-header {
                    margin-bottom: 3rem;
                    border-bottom: 1px solid var(--border);
                    padding-bottom: 2rem;
                }
                .page-header h1 {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                }
                .last-updated {
                    color: var(--text-muted);
                    font-style: italic;
                }
                .legal-content {
                    max-width: 800px;
                    margin: 0 auto;
                }
                .legal-content section {
                    margin-bottom: 2.5rem;
                }
                .legal-content h2 {
                    font-size: 1.5rem;
                    margin-bottom: 1rem;
                    color: var(--text-main);
                }
                .legal-content p {
                    margin-bottom: 1rem;
                    line-height: 1.7;
                    color: var(--text-muted);
                }
                .legal-content ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    color: var(--text-muted);
                    margin-bottom: 1rem;
                }
                .legal-content li {
                    margin-bottom: 0.5rem;
                }
            `}</style>
        </main>
    )
}

export default PrivacyPolicyPage
