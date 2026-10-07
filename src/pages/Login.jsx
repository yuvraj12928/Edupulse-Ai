import { useNavigate } from 'react-router-dom'
import { Button, Panel } from '../components/ui'

export default function Login() {
  const navigate = useNavigate()
  return <main className="login-page"><div className="login-brand"><div className="brand-mark"><span /><span /><span /></div><strong>edupulse</strong><small>AI / student intelligence platform</small></div><Panel className="login-panel"><p className="eyebrow">Demo workspace</p><h1>Sign in to EduPulse AI</h1><p>Choose a role to enter the deterministic demo environment.</p><div className="login-options">{['Student', 'Faculty', 'Mentor', 'HOD', 'Admin'].map((role) => <Button key={role} onClick={() => navigate('/dashboard')}>Login as {role}</Button>)}</div></Panel></main>
}