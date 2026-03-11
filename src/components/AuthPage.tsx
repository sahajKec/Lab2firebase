// src/components/AuthPage.tsx
import { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth } from '../firebase'

type Tab = 'signin' | 'signup'
type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  type: ToastType
  msg: string
}

let toastId = 0

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('signin')
  const [toasts, setToasts] = useState<Toast[]>([])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // ── Toast ──
  const addToast = (type: ToastType, msg: string) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, type, msg }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

  // ── Firebase error messages ──
  const friendlyError = (code: string) => {
    const map: Record<string, string> = {
      'auth/email-already-in-use': 'Email already registered.',
      'auth/user-not-found': 'No account found.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/weak-password': 'Password must be 6+ characters.',
    }
    return map[code] ?? 'Something went wrong.'
  }

  // ── Sign Up ──
  const handleSignUp = async () => {
    if (!isEmail(email)) return addToast('error', 'Enter a valid email.')
    if (password.length < 6) return addToast('error', 'Password must be 6+ chars.')

    setLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      await sendEmailVerification(cred.user)
      addToast('success', `Verification email sent to ${email}!`)
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      addToast('error', friendlyError(code))
    }
    setLoading(false)
  }

  // ── Sign In ──
  const handleSignIn = async () => {
    if (!isEmail(email)) return addToast('error', 'Enter a valid email.')
    if (!password) return addToast('error', 'Password required.')

    setLoading(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      if (!cred.user.emailVerified) {
        addToast('error', 'Verify your email first.')
        await auth.signOut()
      } else {
        addToast('success', 'Signed in!')
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      addToast('error', friendlyError(code))
    }
    setLoading(false)
  }

  // ── Forgot Password ──
  const handleForgot = async () => {
    if (!isEmail(email)) return addToast('info', 'Enter your email first.')
    try {
      await sendPasswordResetEmail(auth, email)
      addToast('success', 'Password reset email sent!')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      addToast('error', friendlyError(code))
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 400, margin: 'auto' }}>
      <h1>WELCOME</h1>

      {/* Tabs */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setTab('signin')} disabled={tab === 'signin'}>Sign In</button>
        <button onClick={() => setTab('signup')} disabled={tab === 'signup'}>Sign Up</button>
      </div>

      {/* Form */}
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%', marginBottom: 10 }}
        />

        {tab === 'signin' ? (
          <>
            <button onClick={handleSignIn} disabled={loading} style={{ width: '100%', marginBottom: 5 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <button onClick={handleForgot} style={{ width: '100%' }}>Forgot Password?</button>
          </>
        ) : (
          <button onClick={handleSignUp} disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing up...' : 'Sign Up & Verify Email'}
          </button>
        )}
      </div>

      {/* Toasts */}
      <div style={{ position: 'fixed', bottom: 20, left: 20 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ margin: '5px 0', padding: '5px 10px', background: t.type === 'error' ? '#f87171' : t.type === 'success' ? '#34d399' : '#fbbf24', color: '#fff', borderRadius: 4 }}>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  )
}