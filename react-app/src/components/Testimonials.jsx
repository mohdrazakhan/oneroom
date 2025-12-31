import { useState } from 'react'
import './Testimonials.css'

function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0)

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'College Student',
            avatar: '👩‍🎓',
            rating: 5,
            text: 'OneRoom has completely transformed how we manage our apartment. No more awkward conversations about who owes what!'
        },
        {
            name: 'Mike Chen',
            role: 'Software Engineer',
            avatar: '👨‍💻',
            rating: 5,
            text: 'The expense tracking feature is a game-changer. We can finally keep track of all our shared costs without the spreadsheet headaches.'
        },
        {
            name: 'Emily Rodriguez',
            role: 'Graduate Student',
            avatar: '👩‍🔬',
            rating: 5,
            text: 'Love the chore rotation feature! It\'s made our household so much more organized and fair. Highly recommend!'
        },
        {
            name: 'James Wilson',
            role: 'Marketing Manager',
            avatar: '👨‍💼',
            rating: 5,
            text: 'Best roommate app out there. The interface is beautiful and everything just works. Our whole house uses it now!'
        }
    ]

    return (
        <section id="testimonials" className="testimonials-section">
            <div className="container">
                <div className="section-header reveal">
                    <h2 className="section-title">
                        Loved by <span className="text-gradient">thousands</span>
                    </h2>
                    <p className="section-subtitle">
                        See what our users have to say about OneRoom
                    </p>
                </div>

                <div className="testimonials-grid">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="testimonial-card reveal"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="testimonial-rating">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <span key={i} className="star">⭐</span>
                                ))}
                            </div>
                            <p className="testimonial-text">"{testimonial.text}"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">{testimonial.avatar}</div>
                                <div className="author-info">
                                    <div className="author-name">{testimonial.name}</div>
                                    <div className="author-role">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials
