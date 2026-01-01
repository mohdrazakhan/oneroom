import { useState, useEffect } from 'react'
import './Testimonials.css'

function Testimonials() {
    const [activeIndex, setActiveIndex] = useState(0)

    const testimonials = [
        {
            name: 'Amit Kumar',
            role: 'Student',
            avatar: '👨‍🎓',
            rating: 5,
            text: 'This app made dividing bills so simple for our student apartment. No more awkward conversations about money!'
        },
        {
            name: 'Kaleem Shahid',
            role: 'Working Professional',
            avatar: '👨‍💼',
            rating: 5,
            text: 'Perfect for busy professionals. Chores are finally under control and the notification system is a lifesaver.'
        },
        {
            name: 'Danish Alam',
            role: 'Data Science Engineer',
            avatar: '👨‍💻',
            rating: 5,
            text: 'Impressive UI/UX. The expense analytics are detailed and accurate. Makes managing shared finances completely seamless.'
        },
        {
            name: 'Prathibha Dungel',
            role: 'Student',
            avatar: '👩‍🎓',
            rating: 5,
            text: 'It helped us organize our daily tasks during exam weeks perfectly. We finally have a clean flat without arguments.'
        },
        {
            name: 'Jayanti Kumari',
            role: 'Student',
            avatar: '👩‍🏫',
            rating: 5,
            text: 'No more fighting over who buys milk! The shared grocery list features are exactly what we needed.'
        },
        {
            name: 'Chandan Kumar Tiwari',
            role: 'Student',
            avatar: '👨‍🎓',
            rating: 5,
            text: 'Best app for hostel life. Really helpful for splitting mess bills and keeping track of group expenses.'
        }
    ]

    const [itemsPerSlide, setItemsPerSlide] = useState(3)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setItemsPerSlide(1)
            } else if (window.innerWidth < 1024) {
                setItemsPerSlide(2)
            } else {
                setItemsPerSlide(3)
            }
        }

        handleResize() // Set initial value
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const maxIndex = testimonials.length - itemsPerSlide

    const nextSlide = () => {
        setActiveIndex((prev) =>
            prev >= maxIndex ? 0 : prev + 1
        )
    }

    const prevSlide = () => {
        setActiveIndex((prev) =>
            prev <= 0 ? maxIndex : prev - 1
        )
    }

    // Auto-advance slides every 5 seconds
    useEffect(() => {
        const interval = setInterval(nextSlide, 5000)
        return () => clearInterval(interval)
    }, [maxIndex]) // Re-create interval if maxIndex changes

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

                <div className="testimonials-slider-container">
                    <button className="slider-btn prev-btn" onClick={prevSlide} aria-label="Previous testimonial">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>

                    <div className="testimonials-viewport">
                        <div
                            className="testimonials-track"
                            style={{
                                transform: `translateX(-${activeIndex * (100 / itemsPerSlide)}%)`
                            }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="testimonial-card"
                                    style={{ flex: `0 0 calc(${100 / itemsPerSlide}% - 1.5rem)` }}
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

                    <button className="slider-btn next-btn" onClick={nextSlide} aria-label="Next testimonial">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                </div>

                <div className="slider-dots">
                    {[...Array(maxIndex + 1)].map((_, index) => (
                        <button
                            key={index}
                            className={`slider-dot ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Testimonials
