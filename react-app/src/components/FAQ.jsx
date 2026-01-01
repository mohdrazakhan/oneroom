import { useState } from 'react'
import './FAQ.css'

function FAQ() {
    const [openIndex, setOpenIndex] = useState(null)

    const faqs = [
        {
            question: 'How does OneRoom work?',
            answer: 'OneRoom is a comprehensive roommate management app that helps you track chores, split expenses, communicate with housemates, and coordinate schedules all in one place. Simply create a room, invite your roommates, and start managing your shared living space effortlessly.'
        },
        {
            question: 'Is OneRoom free to use?',
            answer: 'Yes! OneRoom offers a free plan that includes basic features for up to 4 roommates. We also offer Premium and Family plans with advanced features and unlimited roommates for those who need more functionality.'
        },
        {
            question: 'How secure is my data?',
            answer: 'We take security very seriously. All data is encrypted in transit and at rest. We use industry-standard security practices and never share your personal information with third parties. Your privacy is our top priority.'
        },
        {
            question: 'Can I use OneRoom on multiple devices?',
            answer: 'Absolutely! OneRoom syncs seamlessly across all your devices. Use it on your phone, tablet, or computer - your data stays synchronized in real-time.'
        },
        {
            question: 'What if my roommate doesn\'t have the app?',
            answer: 'You can easily invite roommates via email or text message. They\'ll receive an invitation link to download the app and join your room. It only takes a minute to get started!'
        },
        {
            question: 'Can I cancel my subscription anytime?',
            answer: 'Yes, you can cancel your Premium or Family subscription at any time. There are no long-term commitments, and you\'ll continue to have access until the end of your billing period.'
        }
    ]

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section id="faq" className="faq-section">
            <div className="container">
                <div className="section-header reveal">
                    <h2 className="section-title">
                        Frequently Asked <span className="text-gradient">Questions</span>
                    </h2>
                    <p className="section-subtitle">
                        Everything you need to know about OneRoom
                    </p>
                </div>

                <div className="faq-container">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${openIndex === index ? 'open' : ''}`}
                        >
                            <button
                                className="faq-question"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span>{faq.question}</span>
                                <svg
                                    className="faq-icon"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M19 9L12 16L5 9"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                            <div className="faq-answer">
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="faq-cta reveal">
                    <p>Still have questions?</p>
                    <a href="mailto:care.oneroom@gmail.com" className="btn btn-primary">Contact Support</a>
                </div>
            </div>
        </section>
    )
}

export default FAQ
