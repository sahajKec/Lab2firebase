import { useState, useEffect } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from './firebase'
import AuthPage from './components/AuthPage'
import Portfolio from './components/Portfolio'
import Loader from './components/Loader'

type AppState = 'loading' | 'auth' | 'portfolio'

function App() {
  const [state, setState] = useState<AppState>('loading')
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        setUser(firebaseUser)
        setState('portfolio')
      } else {
        setUser(null)
        setState('auth')
      }
    })
    return () => unsub()
  }, [])

  if (state === 'loading') return <Loader />
  if (state === 'portfolio' && user) return <Portfolio user={user} />
  return <AuthPage />
}

export default App