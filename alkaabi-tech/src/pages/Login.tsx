import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Wrench } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (err) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6">
      <div className="mb-8 flex flex-col items-center gap-3 text-white">
        <div className="rounded-2xl bg-copper/20 p-4">
          <Wrench size={32} className="text-copper-light" />
        </div>
        <h1 className="text-xl font-bold">ALKAABI TECH</h1>
        <p className="text-sm text-white/50">دخول لوحة التحكم</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <label className="mb-1 block text-sm font-medium text-graphite">البريد الإلكتروني</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-xl border border-ink/10 px-4 py-3 outline-none focus:border-copper"
          placeholder="admin@example.com"
          dir="ltr"
        />

        <label className="mb-1 block text-sm font-medium text-graphite">كلمة المرور</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-xl border border-ink/10 px-4 py-3 outline-none focus:border-copper"
          placeholder="••••••••"
          dir="ltr"
        />

        {error && <p className="mb-4 text-sm text-status-needsInfo">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-ink py-3 font-medium text-white disabled:opacity-60"
        >
          {submitting ? 'جارِ الدخول...' : 'تسجيل الدخول'}
        </button>
      </form>
    </div>
  )
}
