import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { toast } from 'sonner'

function Register() {
  const { isLoading, register, error: storeError } = useAuthStore()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (storeError) setError(storeError)
  }, [storeError])

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
      setError('All fields are required.')
      toast.error('All fields are required.', { position: 'top-center' })
      return
    }
    if (!validateEmail(email)) {
      setError('Enter a valid email address.')
      toast.error('Enter a valid email address.', { position: 'top-center' })
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      toast.error('Password must be at least 6 characters.', { position: 'top-center' })
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      toast.error('Passwords do not match.', { position: 'top-center' })
      return
    }

    try {
      await register(username, email, password)
      toast.success('Account created. Please log in.', { position: 'top-center' })
      navigate('/auth/login', { replace: true })
    } catch (err) {
      setError(err?.message ?? 'Registration failed.')
      toast.error(err?.message ?? 'Registration failed.', { position: 'top-center' })
    }
  }

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-6 bg-white rounded-2xl p-10 w-full">
          <h1 className="text-2xl font-bold text-center">Create account</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="input-field" required />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input-field" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="input-field" required />
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm password" className="input-field" required />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Register'}
            </button>
          </form>
          <p className="text-xs text-center text-gray-500">
            Already registered? <span className="font-semibold cursor-pointer" onClick={() => navigate('/auth/login')}>Log in</span>
          </p>
        </section>
      </div>
    </main>
  )
}

export default Register