import './Footer.css'

function Footer() {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        product: [
            { name: 'Features', href: '#features' },
            { name: 'Pricing', href: '#pricing' },
            { name: 'FAQ', href: '#faq' },
            { name: 'Download', href: '#hero' }
        ],
        company: [
            { name: 'About', href: '/about.html' },
            { name: 'Support', href: '/support.html' },
            { name: 'Privacy', href: '/privacy.html' },
            { name: 'Terms', href: '#' }
        ],
        social: [
            { name: 'Twitter', icon: '𝕏', href: '#' },
            { name: 'Facebook', icon: 'f', href: '#' },
            { name: 'Instagram', icon: '📷', href: '#' },
            { name: 'LinkedIn', icon: 'in', href: '#' }
        ]
    }

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <img src="/assets/logo.png" alt="OneRoom Logo" />
                            <span>OneRoom</span>
                        </div>
                        <p className="footer-tagline">
                            Making shared living simple, transparent, and stress-free.
                        </p>
                        <div className="social-links">
                            {footerLinks.social.map((social, index) => (
                                <a key={index} href={social.href} className="social-link" aria-label={social.name}>
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="footer-links">
                        <div className="footer-column">
                            <h4>Product</h4>
                            <ul>
                                {footerLinks.product.map((link, index) => (
                                    <li key={index}>
                                        <a href={link.href}>{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4>Company</h4>
                            <ul>
                                {footerLinks.company.map((link, index) => (
                                    <li key={index}>
                                        <a href={link.href}>{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="footer-column">
                            <h4>Download</h4>
                            <ul>
                                <li><a href="#">iOS App</a></li>
                                <li><a href="https://play.google.com/store/apps/details?id=com.oneroom.app&hl=en">Android App</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} OneRoom. All rights reserved.</p>
                    <p>Made with ❤️ for better living</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
