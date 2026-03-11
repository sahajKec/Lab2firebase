// src/components/Portfolio.tsx
import { User } from 'firebase/auth'
import { auth } from '../firebase'

interface PortfolioProps {
  user: User
}

export default function Portfolio({ user }: PortfolioProps) {
  // Logout handler
  const handleLogout = async () => {
    try {
      await auth.signOut()
      // No need to redirect manually — App.tsx handles auth state
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Welcome, {user.displayName || user.email}</h1>
      <p> I am a Computer Engineering undergraduate at Kantipur Engineering College, passionate about building 
      backend systems and solving real-world problems using Python and Django. I enjoy exploring Machine 
      Learning and Computer Vision to create intelligent applications, from Automatic Number Plate Recognition 
      for Nepali vehicles to real-time violence detection from CCTV footage. I am eager to contribute to 
      meaningful projects and grow as a backend developer while continuously learning new technologies 
      and best practices.</p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: '1.5rem',
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          backgroundColor: '#f87171',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  )
}