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

const placeholderPaths = ['/early-warning', '/groups', '/predictions', '/insights', '/ai-insights', '/analytics/academic', '/analytics/engagement', '/analytics/departments', '/analytics/courses', '/analytics/attendance', '/courses', '/departments', '/reports', '/profile']

function RoutedPlaceholder() {
  const location = useLocation()
  return <PlaceholderPage path={location.pathname} />
}

export default function App() {
  return <Routes><Route path="/login" element={<Login />} /><Route element={<AppShell />}><Route path="/" element={<Navigate to="/dashboard" replace />} /><Route path="/dashboard" element={<Overview />} /><Route path="/students" element={<Students />} /><Route path="/students/groups" element={<RoutedPlaceholder />} /><Route path="/students/:id/digital-twin" element={<DigitalTwin />} /><Route path="/students/:id" element={<StudentProfile />} /><Route path="/simulator" element={<Simulator />} /><Route path="/ai-copilot" element={<Copilot />} /><Route path="/interventions/effectiveness" element={<Interventions effectiveness />} /><Route path="/interventions" element={<Interventions />} /><Route path="/notifications" element={<Notifications />} /><Route path="/settings" element={<SettingsPage />} />{placeholderPaths.map((path) => <Route key={path} path={path} element={<RoutedPlaceholder />} />)}<Route path="*" element={<Navigate to="/dashboard" replace />} /></Route></Routes>
}
