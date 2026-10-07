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

const placeholderPaths = ['/early-warning', '/groups', '/predictions', '/insights', '/ai-insights', '/analytics/academic', '/analytics/engagement', '/analytics/departments', '/analytics/courses', '/analytics/attendance', '/courses', '/departments', '/reports', '/profile']

function RoutedPlaceholder() {
  const location = useLocation()
  return <PlaceholderPage path={location.pathname} />
}

function TransitionedOutlet({ children }) {
  const location = useLocation()
  return <PageTransition key={`${location.pathname}${location.search}`}>{children}</PageTransition>
}

export default function App() {
  return <Routes><Route path="/login" element={<Login />} /><Route element={<AppShell />}><Route path="/" element={<Navigate to="/dashboard" replace />} /><Route path="/dashboard" element={<TransitionedOutlet><Overview /></TransitionedOutlet>} /><Route path="/students" element={<TransitionedOutlet><Students /></TransitionedOutlet>} /><Route path="/students/groups" element={<TransitionedOutlet><RoutedPlaceholder /></TransitionedOutlet>} /><Route path="/students/:id/digital-twin" element={<TransitionedOutlet><DigitalTwin /></TransitionedOutlet>} /><Route path="/students/:id" element={<TransitionedOutlet><StudentProfile /></TransitionedOutlet>} /><Route path="/simulator" element={<TransitionedOutlet><Simulator /></TransitionedOutlet>} /><Route path="/ai-copilot" element={<TransitionedOutlet><Copilot /></TransitionedOutlet>} /><Route path="/interventions/effectiveness" element={<TransitionedOutlet><Interventions effectiveness /></TransitionedOutlet>} /><Route path="/interventions" element={<TransitionedOutlet><Interventions /></TransitionedOutlet>} /><Route path="/notifications" element={<TransitionedOutlet><Notifications /></TransitionedOutlet>} /><Route path="/settings" element={<TransitionedOutlet><SettingsPage /></TransitionedOutlet>} />{placeholderPaths.map((path) => <Route key={path} path={path} element={<TransitionedOutlet><RoutedPlaceholder /></TransitionedOutlet>} />)}<Route path="*" element={<Navigate to="/dashboard" replace />} /></Route></Routes>
}
