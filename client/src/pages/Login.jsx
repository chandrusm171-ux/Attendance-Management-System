import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { motion } from 'framer-motion'
import { Eye, EyeOff, LogIn, GraduationCap } from 'lucide-react'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '', role: 'admin' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        username: form.username.trim(),
        password: form.password,
        role: form.role.toLowerCase()
      }
      const { data } = await api.post('/auth/login', payload)
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('userId', data.userId)
      localStorage.setItem('profileImage', data.profileImage || '')
      navigate(`/${data.role}/dashboard`)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const roleConfig = {
    admin: { label: 'Admin', color: 'from-violet-500 to-purple-600', dot: 'bg-violet-400' },
    teacher: { label: 'Teacher', color: 'from-blue-500 to-cyan-500', dot: 'bg-blue-400' },
    student: { label: 'Student', color: 'from-emerald-500 to-teal-500', dot: 'bg-emerald-400' },
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>

      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)', animation: 'pulse 4s ease-in-out infinite' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #2563eb, transparent)', animation: 'pulse 4s ease-in-out infinite 2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', animation: 'pulse 6s ease-in-out infinite 1s' }} />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="rounded-3xl p-8 shadow-2xl"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}>

          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}
            >
              <GraduationCap size={32} className="text-white" />
            </motion.div>
            <h1 className="text-3xl font-black text-white tracking-tight">SmartAttend</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Attendance Management System
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Role Selector — custom styled tabs */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest mb-2 block"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                Select Role
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl"
                style={{ background: 'rgba(0,0,0,0.3)' }}>
                {['admin', 'teacher', 'student'].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm({ ...form, role: r })}
                    className={`py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-300 ${
                      form.role === r
                        ? 'text-white shadow-lg'
                        : 'text-white/40 hover:text-white/70'
                    }`}
                    style={form.role === r ? {
                      background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                      boxShadow: '0 4px 15px rgba(124,58,237,0.4)'
                    } : {}}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest mb-2 block"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
                className="w-full px-4 py-3.5 rounded-2xl text-white placeholder-white/20 text-sm outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  caretColor: '#7c3aed'
                }}
                onFocus={e => e.target.style.border = '1px solid rgba(124,58,237,0.6)'}
                onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest mb-2 block"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full px-4 py-3.5 pr-12 rounded-2xl text-white placeholder-white/20 text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    caretColor: '#7c3aed'
                  }}
                  onFocus={e => e.target.style.border = '1px solid rgba(124,58,237,0.6)'}
                  onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.1)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-all"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 rounded-2xl text-sm text-center font-medium"
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                background: loading
                  ? 'rgba(124,58,237,0.5)'
                  : 'linear-gradient(135deg, #7c3aed, #2563eb)',
                boxShadow: loading ? 'none' : '0 8px 25px rgba(124,58,237,0.4)',
                letterSpacing: '0.05em'
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={17} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs mt-6" style={{ color: 'rgba(255,255,255,0.2)' }}>
            Admin-controlled access only • No public registration
          </p>
        </div>

        {/* Bottom glow */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #2563eb)' }} />
      </motion.div>
    </div>
  )
}