import { useRef } from 'react'
import './Showcase.css'

function Showcase() {
    const scrollRef = useRef(null)

    const screenshots = [
        { src: '/assets/screenshot/dashboard.png', title: 'Dashboard' },
        { src: '/assets/screenshot/Expense_Analytics.png', title: 'Expense Analytics' },
        { src: '/assets/screenshot/Tasks.png', title: 'Tasks' },
        { src: '/assets/screenshot/room_setting1.png', title: 'Room Settings' },
        { src: '/assets/screenshot/My_Tasks.png', title: 'My Tasks' },
        { src: '/assets/screenshot/Room_Setting2.png', title: 'Room Features' }
    ]

    return (
        <section id="showcase" className="showcase-section">
            <div className="container">
                <div className="section-header reveal">
                    <h2 className="section-title">
                        See it in <span className="text-gradient">action.</span>
                    </h2>
                    <p className="section-subtitle">
                        Experience the intuitive interface designed for modern living
                    </p>
                </div>

                <div className="showcase-scroll" ref={scrollRef}>
                    {screenshots.map((screenshot, index) => (
                        <div key={index} className="screenshot-card reveal" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="screenshot-wrapper">
                                <img src={screenshot.src} alt={screenshot.title} />
                                <div className="screenshot-overlay">
                                    <span className="screenshot-title">{screenshot.title}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Showcase
