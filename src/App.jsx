import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppShell from './layouts/AppShell'
import Overview from './pages/Overview'
import PlaceholderPage from './pages/PlaceholderPage'
import Students from './pages/Students'
import StudentProfile from './pages/StudentProfile'
import Simulator from './pages/Simulator'
import Copilot from './pages/Copilot'
import Interventions from './pages/Interventions'
import Notifications from './pages/Notifications'
import SettingsPage from './pages/SettingsPage'
import DigitalTwin from './pages/DigitalTwin'
import Login from './pages/Login'
import { PageTransition } from './components/ui'
import { useAuth } from './context/AuthContext'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'

const placeholderPaths = ['/early-warning', '/groups', '/predictions', '/insights', '/ai-insights', '/analytics/academic', '/analytics/engagement', '/analytics/departments', '/analytics/courses', '/analytics/attendance', '/courses', '/departments', '/reports', '/profile']

function RoutedPlaceholder() {
  const location = useLocation()
  return <PlaceholderPage path={location.pathname} />
}

function TransitionedOutlet({ children }) {
  const location = useLocation()
  return <PageTransition key={`${location.pathname}${location.search}`}>{children}</PageTransition>
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, authChecked } = useAuth()
  const location = useLocation()
  if (!authChecked) return <div className="auth-loading">Checking your EduPulse session...</div>
  if (!isAuthenticated) return <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname + location.search)}`} replace />
  return children
}

export default function App() {
  const guarded = (element) => <ProtectedRoute><TransitionedOutlet>{element}</TransitionedOutlet></ProtectedRoute>
  return <Routes><Route path="/login" element={<Login />} /><Route path="/forgot-password" element={<ForgotPassword />} /><Route path="/reset-password/:token" element={<ResetPassword />} /><Route element={<AppShell />}><Route path="/" element={<Navigate to="/dashboard" replace />} /><Route path="/dashboard" element={guarded(<Overview />)} /><Route path="/students" element={guarded(<Students />)} /><Route path="/students/groups" element={guarded(<RoutedPlaceholder />)} /><Route path="/students/:id/digital-twin" element={guarded(<DigitalTwin />)} /><Route path="/students/:id" element={guarded(<StudentProfile />)} /><Route path="/simulator" element={guarded(<Simulator />)} /><Route path="/ai-copilot" element={guarded(<Copilot />)} /><Route path="/interventions/effectiveness" element={guarded(<Interventions effectiveness />)} /><Route path="/interventions" element={guarded(<Interventions />)} /><Route path="/notifications" element={guarded(<Notifications />)} /><Route path="/profile" element={guarded(<Profile />)} /><Route path="/settings" element={guarded(<SettingsPage />)} />{placeholderPaths.map((path) => <Route key={path} path={path} element={guarded(<RoutedPlaceholder />)} />)}<Route path="*" element={<Navigate to="/dashboard" replace />} /></Route></Routes>
}
