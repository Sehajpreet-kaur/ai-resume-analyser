import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useLocation, useNavigate } from 'react-router-dom'
import {toast} from "sonner"

function Login() {
  const { isLoading, user, token, login ,error:storeError} = useAuthStore()
  const isAuthenticated = Boolean(user && token)

  const location = useLocation()
  const next = new URLSearchParams(location.search).get('next') || '/'
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) navigate(next)
  }, [isAuthenticated, next, navigate])

  useEffect(() => {
    if (storeError) setError(storeError)
  }, [storeError])

  const handleSubmit = async(e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      toast.error('Email and password are required.',{position:"top-center"})
      return
    }
    try {
      await login(email, password)   // store sets user + token on success
    } catch {
      toast.error('Login failed. Please check your credentials and try again.',{position:"top-center"})
      setEmail('')
      setPassword('')
    }
  }

  return (
    <main className='bg-[url("/images/bg-auth.svg")] bg-cover min-h-screen flex items-center justify-center'> 
        <div className='gradient-border shadow-lg'>
            <div className='flex flex-cols w-150 items-center max-w-3xl rounded-2xl overflow-hidden bg-white'>
         
            <section className='flex flex-col items-center justify-center gap-8 bg-white rounded-2xl p-10 w-full'>
                <div className='text-2xl font-bold w-100 text-center'>
                    <h1>Welcome</h1>
          <form onSubmit={handleSubmit} className="flex flex-col items-center  gap-4 w-full max-w-sm">
            <label className="flex flex-col gap-1 text-sm w-full text-center">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="flex flex-col gap-1 text-sm w-full text-center ">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </label>


            <button type="submit" className="w-full primary-gradient rounded-full cursor-pointer text-3xl font-semibold text-gray-800" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Log in'}
            </button>
          </form>

          <p className="text-xs text-center text-gray-500 p-2">
            Don’t have an account? <span className="font-semibold text-black " onClick={() => navigate('/auth/register')}>
              Sign up
            </span>
          </p>
                
          </div>
           </section>
           </div>
          </div>
    </main>
  )
}

export default Login

