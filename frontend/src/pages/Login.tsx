import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import hospitalImage from '@/assets/hospital.png'
import styles from '@/styles/LoginPage.module.scss'
import { routes } from '@/utils'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('');
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!username || !password) {
      setError('Please fill in all fields')
      return
    }

    const { url, options } = await routes.login(username, password)
    const res = await fetch(url, options!)

    if (res.ok) {
      const content = await res.json()
      localStorage.setItem('token', content.token)
      localStorage.setItem('refresh token', content.refresh_token)
      navigate('/dashboard')
    }
    else {
      setError('Login failed')
    }
  }
  return (
    <div className={styles.page}>
      <form onSubmit={handleSubmit}>
        <img src={hospitalImage} alt="hospital" />
        <div>Sign in to your account</div>
        <label>Email</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter email" />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
        <button type="submit">Sign in</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  )
}


export default Login
