import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../App.css' // Import general styles if needed, or rely on index.css

const JoinRoomPage = () => {
    const { roomId } = useParams()
    const [status, setStatus] = useState('Opening OneRoom app...')
    const [showDownload, setShowDownload] = useState(false)

    useEffect(() => {
        if (!roomId) return

        // 1. Try to open the app
        const appScheme = `oneroom://join/${roomId}`
        const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.oneroom.app&hl=en'

        const startTime = Date.now()

        // Attempt to open the app
        window.location.href = appScheme

        // 2. Fallback check
        const timer = setTimeout(() => {
            const elapsed = Date.now() - startTime

            // If the user is still here after ~2.5s, the app likely didn't open
            if (elapsed < 3000) {
                setStatus('App not installed?')
                setShowDownload(true)

                // Optional: Auto-redirect to store after another delay?
                // For better UX, let them click the button or redirect after another short delay
                // setTimeout(() => {
                //     window.location.href = playStoreUrl
                // }, 2000)
            }
        }, 2500)

        // iOS detection for specific message
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            setTimeout(() => {
                setStatus('iOS app coming soon!')
                setShowDownload(true)
            }, 1000)
        }

        return () => clearTimeout(timer)
    }, [roomId])

    return (
        <div className="join-room-container" style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'linear-gradient(135deg, #f7f7ff 0%, #ffffff 100%)' // Light clean background
        }}>
            <div className="glass" style={{
                padding: '48px 32px',
                borderRadius: '24px',
                maxWidth: '480px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.05)'
            }}>
                <div style={{
                    fontSize: '60px',
                    marginBottom: '24px',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    width: '100px',
                    height: '100px',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    color: 'white'
                }}>
                    🏠
                </div>

                <h1 style={{ marginBottom: '12px' }}>Join Room</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
                    You've been invited to join a room on OneRoom.
                </p>

                {roomId && (
                    <div style={{
                        background: 'var(--bg-card)', // Changed to variable
                        padding: '16px 24px',
                        borderRadius: '12px',
                        marginBottom: '32px',
                        border: '2px solid var(--primary-light)'
                    }}>
                        <div style={{
                            fontSize: '12px',
                            color: 'var(--primary)',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '8px'
                        }}>Room Code</div>
                        <div style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            fontFamily: 'monospace',
                            letterSpacing: '2px'
                        }}>{roomId}</div>
                    </div>
                )}

                {/* Spinner */}
                {!showDownload && (
                    <div className="spinner" style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid var(--primary)',
                        borderRadius: '50%',
                        margin: '0 auto 24px',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                )}

                <style>{`
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                `}</style>

                <p style={{ marginBottom: '24px', fontWeight: '500' }}>{status}</p>

                {showDownload && (
                    <a
                        href="https://play.google.com/store/apps/details?id=com.oneroom.app&hl=en"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-block',
                            padding: '16px 32px',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                            color: 'white',
                            borderRadius: '12px',
                            fontWeight: '600',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            boxShadow: 'var(--shadow-lg)'
                        }}
                    >
                        {/iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'Available on Android' : 'Download OneRoom'}
                    </a>
                )}
            </div>
        </div>
    )
}

export default JoinRoomPage
