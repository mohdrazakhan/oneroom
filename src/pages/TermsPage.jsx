function TermsPage() {
    return (
        <main className="page-container">
            <div className="container">
                <div className="page-header">
                    <h1>Terms of Service</h1>
                    <p className="last-updated">Last Updated: January 1, 2026</p>
                </div>

                <div className="legal-content">
                    <section>
                        <h2>1. Agreement to Terms</h2>
                        <p>
                            These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and OneRoom (oneroom.living) ("we," "us" or "our"), concerning your access to and use of the OneRoom application as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                        </p>
                        <p>
                            You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms of Use. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF USE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.
                        </p>
                    </section>

                    <section>
                        <h2>2. Intellectual Property Rights</h2>
                        <p>
                            Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                        </p>
                    </section>

                    <section>
                        <h2>3. User Representations</h2>
                        <p>
                            By using the Site, you represent and warrant that:
                        </p>
                        <ul>
                            <li>All registration information you submit will be true, accurate, current, and complete.</li>
                            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                            <li>You have the legal capacity and you agree to comply with these Terms of Use.</li>
                            <li>You are not a minor in the jurisdiction in which you reside.</li>
                            <li>You will not use the Site for any illegal or unauthorized purpose.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. User Registration</h2>
                        <p>
                            You may be required to register with the Site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
                        </p>
                    </section>

                    <section>
                        <h2>5. Prohibited Activities</h2>
                        <p>
                            You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                        </p>
                    </section>

                    <section>
                        <h2>6. Limitation of Liability</h2>
                        <p>
                            In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.
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

export default TermsPage
