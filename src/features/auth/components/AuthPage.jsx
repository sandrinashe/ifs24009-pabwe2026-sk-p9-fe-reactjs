import { useState } from 'react'
import { ChromeBlob } from '../../../components/Art'
import { FieldError, SubmitButton } from '../../../components/Ui'
import { Link, navigate } from '../../../helpers/navigation'
import { showToast } from '../../../helpers/toolsHelper'
import useDocumentMeta from '../../../hooks/useDocumentMeta'
import useInput from '../../../hooks/useInput'
import { useAuth } from '../AuthContext'
import { login, register } from '../api/authApi'

const INITIAL = { username: '', email: '', password: '' }

/** Halaman login (id login-username/login-password/login-submit) dan registrasi. */
export default function AuthPage({ mode = 'login' }) {
  const isLogin = mode === 'login'
  useDocumentMeta(isLogin ? 'Masuk' : 'Daftar', isLogin ? 'Masuk ke Delcom Blog untuk menulis dan mengelola artikelmu.' : 'Daftar sebagai penulis Delcom Blog dan mulai menerbitkan artikel.')
  const { signIn } = useAuth()
  const { values, bind } = useInput(INITIAL)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [processing, setProcessing] = useState(false)

  const validate = () => {
    const next = {}
    const username = values.username.trim()
    if (!username) next.username = isLogin ? 'Username atau email wajib diisi.' : 'Username wajib diisi.'
    else if (!isLogin && username.length < 3) next.username = 'Username minimal 3 karakter.'
    if (!isLogin && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = 'Masukkan email yang valid.'
    if (!values.password) next.password = 'Password wajib diisi.'
    else if (!isLogin && values.password.length < 6) next.password = 'Password minimal 6 karakter.'
    return next
  }

  const submit = async (event) => {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    setFormError('')
    if (Object.keys(found).length) return
    setProcessing(true)
    try {
      const data = isLogin
        ? await login(values.username.trim(), values.password)
        : await register({ username: values.username.trim(), email: values.email.trim(), password: values.password })
      signIn(data.token, data.user)
      showToast(isLogin ? `Selamat datang, ${data.user.username}!` : 'Akun berhasil dibuat.')
      navigate(data.user.role === 'admin' ? '/admin' : '/author', { replace: true })
    } catch (err) {
      setFormError(err.message)
    } finally {
      setProcessing(false)
    }
  }

  const prefix = isLogin ? 'login' : 'register'
  const describe = (name) => (errors[name] ? `${prefix}-${name}-error` : undefined)

  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-8 sm:py-20" aria-labelledby="auth-title">
      <ChromeBlob className="floaty pointer-events-none absolute -left-6 top-10 h-40 w-40 sm:left-[6%] sm:h-60 sm:w-60" />
      <ChromeBlob tint="pink" className="floaty pointer-events-none absolute -right-6 bottom-6 h-44 w-44 sm:right-[8%] sm:h-64 sm:w-64" />
      <div className="relative mx-auto max-w-md">
        <h1 id="auth-title" className="mega text-center text-ink" style={{ fontSize: 'clamp(3rem, 10vw, 5.5rem)' }}>
          {isLogin ? 'masuk' : 'daftar'}
        </h1>
        <p className="mt-4 text-center text-muted">{isLogin ? 'Lanjutkan menulis dan kelola artikelmu.' : 'Buat akun penulis dan terbitkan tulisan pertamamu.'}</p>

        <form onSubmit={submit} noValidate className="mt-8 space-y-5 rounded-[2.5rem] bg-white p-6 shadow-xl ring-1 ring-line sm:p-8">
          {formError && (
            <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 ring-1 ring-red-200">
              {formError}
            </p>
          )}
          <div>
            <label htmlFor={`${prefix}-username`} className="label">
              {isLogin ? 'Username atau email' : 'Username'}
            </label>
            <input id={`${prefix}-username`} name="username" type="text" autoComplete="username" className="field" aria-invalid={Boolean(errors.username)} aria-describedby={describe('username')} {...bind('username')} />
            <FieldError id={describe('username')} message={errors.username} />
          </div>
          {!isLogin && (
            <div>
              <label htmlFor="register-email" className="label">
                Email
              </label>
              <input id="register-email" name="email" type="email" autoComplete="email" className="field" aria-invalid={Boolean(errors.email)} aria-describedby={describe('email')} {...bind('email')} />
              <FieldError id={describe('email')} message={errors.email} />
            </div>
          )}
          <div>
            <label htmlFor={`${prefix}-password`} className="label">
              Password
            </label>
            <input id={`${prefix}-password`} name="password" type="password" autoComplete={isLogin ? 'current-password' : 'new-password'} className="field" aria-invalid={Boolean(errors.password)} aria-describedby={describe('password')} {...bind('password')} />
            <FieldError id={describe('password')} message={errors.password} />
          </div>
          <SubmitButton processing={processing} className="btn-primary w-full" id={`${prefix}-submit`}>
            {isLogin ? 'Masuk' : 'Buat akun'}
          </SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm font-semibold text-muted">
          {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
          <Link to={isLogin ? '/register' : '/login'} className="inline-flex min-h-11 items-center text-berry underline">
            {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
          </Link>
        </p>
      </div>
    </section>
  )
}
