import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const ok = await login(email, password)
      if (ok) navigate('/diagnostic')
      else setError('Invalid credentials')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold">Login</h2>
      {error && <div className="mt-2 text-red-600">{error}</div>}
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="w-full border p-2 rounded" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-sky-600 text-white py-2 rounded">Sign in</button>
      </form>
      <div className="mt-4 text-sm">Don't have an account? <Link to="/register" className="text-sky-600">Register</Link></div>
    </div>
  )
}

