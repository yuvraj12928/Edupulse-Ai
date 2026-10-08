import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Bell, BrainCircuit, ChevronDown, Command, Gauge, GraduationCap, LayoutGrid, LogOut, Menu, Moon, PanelLeftClose, PanelLeftOpen, Search, Settings, Sparkles, Sun, Target, Users, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Modal } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const navGroups = [
  { label: 'Command center', items: [{ label: 'Overview', to: '/dashboard', icon: Gauge }] },
  { label: 'Students', items: [{ label: 'All students', to: '/students', icon: Users }, { label: 'At-risk students', to: '/students?risk=high', icon: Target, badge: '142', badgeTone: 'red' }, { label: 'High performers', to: '/students?type=high-performer', icon: GraduationCap }, { label: 'Student groups', to: '/students/groups', icon: LayoutGrid }] },
  { label: 'Intelligence', items: [{ label: 'Early warning', to: '/early-warning', icon: Target }, { label: 'Predictions', to: '/predictions', icon: BrainCircuit }, { label: 'What-if simulator', to: '/simulator', icon: Sparkles }, { label: 'AI insights', to: '/ai-insights', icon: GraduationCap }] },
  { label: 'Analytics', items: [{ label: 'Academic', to: '/analytics/academic', icon: GraduationCap }, { label: 'Attendance', to: '/analytics/attendance', icon: Target }, { label: 'Engagement', to: '/analytics/engagement', icon: Sparkles }, { label: 'Courses', to: '/courses', icon: GraduationCap }, { label: 'Departments', to: '/departments', icon: LayoutGrid }] },
  { label: 'Interventions', items: [{ label: 'Recommended', to: '/interventions?status=recommended', icon: Sparkles, badge: '24', badgeTone: 'purple' }, { label: 'Active', to: '/interventions?status=active', icon: Target, badge: '12', badgeTone: 'blue' }, { label: 'Completed', to: '/interventions?status=completed', icon: GraduationCap }, { label: 'Effectiveness', to: '/interventions/effectiveness', icon: BrainCircuit }] },
]

const commands = [
  ['Dashboard', '/dashboard'], ['Students', '/students'], ['At-Risk Students', '/students?risk=high'], ['Predictions', '/predictions'], ['Simulator', '/simulator'], ['AI Copilot', '/ai-copilot'], ['Reports', '/reports'], ['Settings', '/settings'],
]

export default function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const { students, notifications, markRead, markAllRead } = useApp()
  const { user, logout, loading: authLoading, authMessage, setAuthMessage } = useAuth()
    const { theme, toggleTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('edupulse-sidebar-collapsed') === 'true')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteQuery, setPaletteQuery] = useState('')
  const [paletteIndex, setPaletteIndex] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [workspaceOpen, setWorkspaceOpen] = useState(false)
  const [workspace, setWorkspace] = useState('Northstar University')
  const [logoutOpen, setLogoutOpen] = useState(false)
  const current = location.pathname === '/' || location.pathname === '/dashboard' ? 'Overview' : location.pathname.split('/').filter(Boolean).join(' / ')
  const filteredCommands = useMemo(() => commands.filter(([label]) => label.toLowerCase().includes(paletteQuery.toLowerCase())), [paletteQuery])
  const searchResults = useMemo(() => searchQuery.trim().length < 2 ? [] : students.filter((student) => `${student.name} ${student.department}`.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5), [searchQuery, students])

  useEffect(() => { localStorage.setItem('edupulse-sidebar-collapsed', collapsed) }, [collapsed])
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setPaletteOpen(true) }
      if (event.key === 'Escape') { setPaletteOpen(false); setSearchOpen(false); setNotificationsOpen(false); setProfileOpen(false) }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])
  useEffect(() => { if (paletteIndex >= filteredCommands.length) setPaletteIndex(0) }, [filteredCommands.length, paletteIndex])
  useEffect(() => {
    const closeProfile = (event) => { if (!event.target.closest('.profile-button, .profile-menu, .avatar-button')) setProfileOpen(false) }
    document.addEventListener('mousedown', closeProfile)
    return () => document.removeEventListener('mousedown', closeProfile)
  }, [])

  const executeCommand = (path) => { setPaletteOpen(false); setPaletteQuery(''); navigate(path) }
  const handlePaletteKey = (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setPaletteIndex((index) => Math.min(index + 1, filteredCommands.length - 1)) }
    if (event.key === 'ArrowUp') { event.preventDefault(); setPaletteIndex((index) => Math.max(index - 1, 0)) }
    if (event.key === 'Enter' && filteredCommands[paletteIndex]) executeCommand(filteredCommands[paletteIndex][1])
  }

  useEffect(() => { if (!authMessage) return undefined; const timer = setTimeout(() => setAuthMessage(null), 3200); return () => clearTimeout(timer) }, [authMessage, setAuthMessage])
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Account'
  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : 'AS'
  return (
    <div className="app-shell">
      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><span /><span /><span /></div>
          {!collapsed && <div><strong>Veyra</strong><small>AI / intelligence layer</small></div>}
          <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18} /></button>
        </div>
        <button className="workspace-switcher" onClick={() => setWorkspaceOpen(!workspaceOpen)} aria-expanded={workspaceOpen}>
          <div className="workspace-icon">N</div>
          {!collapsed && <div className="workspace-copy"><span>{workspace}</span><small>Institution workspace</small></div>}
          {!collapsed && <ChevronDown size={15} />}
        </button>
        {workspaceOpen && <div className="workspace-menu"><button onClick={() => { setWorkspace('Northstar University'); setWorkspaceOpen(false) }}><strong>Northstar University</strong><small>1,842 monitored students</small></button><button onClick={() => { setWorkspace('Demo Sandbox'); setWorkspaceOpen(false) }}><strong>Demo Sandbox</strong><small>Deterministic test workspace</small></button></div>}
        <nav className="main-nav">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              {!collapsed && <p className="nav-label">{group.label}</p>}
              {group.items.map(({ label, to, icon: Icon, badge, badgeTone }) => (
                <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} onClick={() => setMobileOpen(false)} title={collapsed ? label : undefined}>
                  <Icon size={17} strokeWidth={1.8} />
                  {!collapsed && <><span>{label}</span>{badge && <b className={`nav-badge nav-badge-${badgeTone}`}>{badge}</b>}</>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          {!collapsed && <div className="sidebar-ai-card"><div className="sidebar-ai-icon"><Sparkles size={16} /></div><strong>Smarter decisions.<br />Brighter futures.</strong><small>AI guidance is active</small><button onClick={() => navigate('/ai-copilot')}>Open Copilot <ChevronDown size={13} /></button></div>}
          <NavLink to="/ai-copilot" className="nav-link"><Command size={17} /><span>AI Copilot</span></NavLink>
          <NavLink to="/reports" className="nav-link"><Command size={17} /><span>Reports</span></NavLink>
          <NavLink to="/notifications" className="nav-link"><Bell size={17} /><span>Notifications</span></NavLink>
          <NavLink to="/settings" className="nav-link"><Settings size={17} /><span>Settings</span></NavLink>
          <button className="profile-chip profile-button" onClick={() => setProfileOpen(!profileOpen)}><div className="avatar avatar-small">{initials}</div>{!collapsed && <div><strong>{displayName}</strong><small>{user?.role || 'Administrator'}</small></div>}</button>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
          <div className="breadcrumb"><span>Workspace</span><ChevronDown size={13} /><strong>{current}</strong></div>
          <div className="topbar-actions">
            <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search students"><Search size={16} /><span>Search students, courses...</span><kbd>⌘ K</kbd></button>
            <button className="icon-button notification-button" onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label="Notifications"><Bell size={18} />{notifications.some((item) => !item.read) && <i />}</button>
            <button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
            <button className="avatar avatar-button" onClick={() => setProfileOpen(!profileOpen)} aria-label="Open profile menu">{initials}</button>
            {profileOpen && <div className="profile-menu topbar-profile-menu"><div className="profile-menu-heading"><strong>{displayName}</strong><small>{user?.email}</small></div><button onClick={() => { setProfileOpen(false); navigate('/profile') }}>View profile</button><button onClick={() => { setProfileOpen(false); navigate('/settings') }}>Account settings</button><button onClick={() => { setProfileOpen(false); navigate('/notifications') }}>Notifications</button><button className="profile-signout" onClick={() => { setProfileOpen(false); setLogoutOpen(true) }}>Sign out</button></div>}
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
      <button className="collapse-toggle" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}>{collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}</button>
      {searchOpen && <div className="search-overlay" onMouseDown={(event) => event.target === event.currentTarget && setSearchOpen(false)}><div className="global-search"><div className="global-search-input"><Search size={18} /><input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search students, courses, departments..." /><button className="icon-button" onClick={() => setSearchOpen(false)}><X size={17} /></button></div>{searchQuery.length < 2 ? <p className="search-hint">Try searching for Rahul, CSE, or a department.</p> : searchResults.length ? <div className="search-results">{searchResults.map((student) => <button key={student.id} onClick={() => { setSearchOpen(false); setSearchQuery(''); navigate(`/students/${student.id}`) }}><div className="avatar avatar-student">{student.initials}</div><span><strong>{student.name}</strong><small>{student.department} · Semester {student.semester}</small></span><b>{student.level}</b></button>)}</div> : <p className="search-hint">No students found for “{searchQuery}”.</p>}</div></div>}
      {notificationsOpen && <div className="popover notification-popover"><div className="popover-header"><strong>Notifications</strong><button onClick={markAllRead}>Mark all read</button></div>{notifications.map((item) => <button className={`notification-item ${item.read ? '' : 'notification-unread'}`} key={item.id} onClick={() => { markRead(item.id); setNotificationsOpen(false); navigate(item.path) }}><span className={`notification-dot notification-${item.priority.toLowerCase()}`} /><span><strong>{item.title}</strong><small>{item.copy}</small></span></button>)}</div>}
      <Modal open={paletteOpen} title="Command palette" onClose={() => setPaletteOpen(false)}><input className="palette-input" autoFocus value={paletteQuery} onChange={(event) => setPaletteQuery(event.target.value)} onKeyDown={handlePaletteKey} placeholder="Search commands..." /> <div className="command-list">{filteredCommands.map(([label, path], index) => <button className={index === paletteIndex ? 'command-active' : ''} key={path} onMouseEnter={() => setPaletteIndex(index)} onClick={() => executeCommand(path)}><Command size={15} /><span>{label}</span><kbd>↵</kbd></button>)}</div></Modal>
      <Modal open={logoutOpen} title="Sign out of Veyra?" onClose={() => setLogoutOpen(false)}><p className="modal-copy">You will need to sign in again to access your student intelligence dashboard.</p><div className="modal-actions"><button className="button button-secondary" onClick={() => setLogoutOpen(false)}>Cancel</button><button className="button button-danger" disabled={authLoading} onClick={async () => { await logout(); setLogoutOpen(false); navigate('/login', { replace: true }) }}><LogOut size={15} />{authLoading ? 'Signing out...' : 'Sign out'}</button></div></Modal>
      {authMessage && <div className="toast toast-success" role="status">{authMessage}</div>}
    </div>
  )
}
