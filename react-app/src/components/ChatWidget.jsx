import { useState } from 'react'
import './ChatWidget.css'

function ChatWidget({ show, onToggle }) {
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi! 👋 How can I help you today?' }
    ])
    const [input, setInput] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    const quickReplies = [
        'How does it work?',
        'Pricing info',
        'Download app',
        'Contact support'
    ]

    const handleSend = (message) => {
        if (!message.trim()) return

        setMessages([...messages, { type: 'user', text: message }])
        setInput('')

        // Simulate bot response
        setTimeout(() => {
            let botResponse = 'Thanks for your message! Our team will get back to you soon.'

            if (message.toLowerCase().includes('price') || message.toLowerCase().includes('pricing')) {
                botResponse = 'We offer a free plan and premium plans starting at $4.99/month. Check out our pricing section for more details!'
            } else if (message.toLowerCase().includes('download')) {
                botResponse = 'You can download OneRoom from the App Store or Google Play Store. Just scroll to the top of the page!'
            } else if (message.toLowerCase().includes('work')) {
                botResponse = 'OneRoom helps you manage chores, split expenses, and communicate with roommates all in one app. It\'s simple and easy to use!'
            }

            setMessages(prev => [...prev, { type: 'bot', text: botResponse }])
        }, 1000)
    }

    const handleQuickReply = (reply) => {
        handleSend(reply)
    }

    return (
        <>
            <button
                className={`chat-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </button>

            <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
                <div className="chat-header">
                    <div className="chat-header-info">
                        <div className="chat-avatar">💬</div>
                        <div>
                            <h4>OneRoom Support</h4>
                            <span className="status">● Online</span>
                        </div>
                    </div>
                </div>

                <div className="chat-messages">
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.type}`}>
                            {message.type === 'bot' && <div className="message-avatar">🤖</div>}
                            <div className="message-bubble">{message.text}</div>
                        </div>
                    ))}

                    {messages.length === 1 && (
                        <div className="quick-replies">
                            {quickReplies.map((reply, index) => (
                                <button
                                    key={index}
                                    className="quick-reply"
                                    onClick={() => handleQuickReply(reply)}
                                >
                                    {reply}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <form
                    className="chat-input-form"
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleSend(input)
                    }}
                >
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="chat-input"
                    />
                    <button type="submit" className="chat-send">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </form>
            </div>
        </>
    )
}

export default ChatWidget
