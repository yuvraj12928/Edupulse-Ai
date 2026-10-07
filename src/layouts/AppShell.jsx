import { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Bell, BrainCircuit, ChevronDown, Command, Gauge, GraduationCap, LayoutGrid, Menu, PanelLeftClose, PanelLeftOpen, Search, Settings, Sparkles, Target, Users, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Modal } from '../components/ui'

const navGroups = [
  { label: 'Command center', items: [{ label: 'Overview', to: '/dashboard', icon: Gauge }] },
  { label: 'Students', items: [{ label: 'All students', to: '/students', icon: Users }, { label: 'At-risk students', to: '/students?risk=high', icon: Target }, { label: 'High performers', to: '/students?type=high-performer', icon: GraduationCap }, { label: 'Student groups', to: '/students/groups', icon: LayoutGrid }] },
  { label: 'Intelligence', items: [{ label: 'Early warning', to: '/early-warning', icon: Target }, { label: 'Predictions', to: '/predictions', icon: BrainCircuit }, { label: 'What-if simulator', to: '/simulator', icon: Sparkles }, { label: 'AI insights', to: '/ai-insights', icon: GraduationCap }] },
  { label: 'Analytics', items: [{ label: 'Academic', to: '/analytics/academic', icon: GraduationCap }, { label: 'Attendance', to: '/analytics/attendance', icon: Target }, { label: 'Engagement', to: '/analytics/engagement', icon: Sparkles }, { label: 'Courses', to: '/courses', icon: GraduationCap }, { label: 'Departments', to: '/departments', icon: LayoutGrid }] },
  { label: 'Interventions', items: [{ label: 'Recommended', to: '/interventions?status=recommended', icon: Sparkles }, { label: 'Active', to: '/interventions?status=active', icon: Target }, { label: 'Completed', to: '/interventions?status=completed', icon: GraduationCap }, { label: 'Effectiveness', to: '/interventions/effectiveness', icon: BrainCircuit }] },
]

const commands = [
  ['Dashboard', '/dashboard'], ['Students', '/students'], ['At-Risk Students', '/students?risk=high'], ['Predictions', '/predictions'], ['Simulator', '/simulator'], ['AI Copilot', '/ai-copilot'], ['Reports', '/reports'], ['Settings', '/settings'],
]

export default function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const { students, notifications, markRead, markAllRead } = useApp()
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('edupulse-sidebar-collapsed') === 'true')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteQuery, setPaletteQuery] = useState('')
  const [paletteIndex, setPaletteIndex] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
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

  const executeCommand = (path) => { setPaletteOpen(false); setPaletteQuery(''); navigate(path) }
  const handlePaletteKey = (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setPaletteIndex((index) => Math.min(index + 1, filteredCommands.length - 1)) }
    if (event.key === 'ArrowUp') { event.preventDefault(); setPaletteIndex((index) => Math.max(index - 1, 0)) }
    if (event.key === 'Enter' && filteredCommands[paletteIndex]) executeCommand(filteredCommands[paletteIndex][1])
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="brand-lockup">
          <div className="brand-mark"><span /><span /><span /></div>
          {!collapsed && <div><strong>edupulse</strong><small>AI / intelligence layer</small></div>}
          <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18} /></button>
        </div>
        <div className="workspace-switcher">
          <div className="workspace-icon">N</div>
          {!collapsed && <div className="workspace-copy"><span>Northstar University</span><small>Institution workspace</small></div>}
          {!collapsed && <ChevronDown size={15} />}
        </div>
        <nav className="main-nav">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              {!collapsed && <p className="nav-label">{group.label}</p>}
              {group.items.map(({ label, to, icon: Icon }) => (
                <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} onClick={() => setMobileOpen(false)} title={collapsed ? label : undefined}>
                  <Icon size={17} strokeWidth={1.8} />
                  {!collapsed && <span>{label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <NavLink to="/ai-copilot" className="nav-link"><Command size={17} /><span>AI Copilot</span></NavLink>
          <NavLink to="/reports" className="nav-link"><Command size={17} /><span>Reports</span></NavLink>
          <NavLink to="/notifications" className="nav-link"><Bell size={17} /><span>Notifications</span></NavLink>
          <NavLink to="/settings" className="nav-link"><Settings size={17} /><span>Settings</span></NavLink>
          <button className="profile-chip profile-button" onClick={() => setProfileOpen(!profileOpen)}><div className="avatar avatar-small">AS</div>{!collapsed && <div><strong>Alex Stone</strong><small>Super Admin</small></div>}</button>
          {profileOpen && <div className="profile-menu"><button onClick={() => navigate('/profile')}>View profile</button><button onClick={() => navigate('/settings')}>Settings</button><button onClick={() => navigate('/login')}>Log out</button></div>}
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
          <div className="breadcrumb"><span>Workspace</span><ChevronDown size={13} /><strong>{current}</strong></div>
          <div className="topbar-actions">
            <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search students"><Search size={16} /><span>Search students, courses...</span><kbd>⌘ K</kbd></button>
            <button className="icon-button notification-button" onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label="Notifications"><Bell size={18} />{notifications.some((item) => !item.read) && <i />}</button>
            <button className="avatar avatar-button" onClick={() => setProfileOpen(!profileOpen)} aria-label="Open profile menu">AS</button>
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
      <button className="collapse-toggle" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}>{collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}</button>
      {searchOpen && <div className="search-overlay" onMouseDown={(event) => event.target === event.currentTarget && setSearchOpen(false)}><div className="global-search"><div className="global-search-input"><Search size={18} /><input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search students, courses, departments..." /><button className="icon-button" onClick={() => setSearchOpen(false)}><X size={17} /></button></div>{searchQuery.length < 2 ? <p className="search-hint">Try searching for Rahul, CSE, or a department.</p> : searchResults.length ? <div className="search-results">{searchResults.map((student) => <button key={student.id} onClick={() => { setSearchOpen(false); setSearchQuery(''); navigate(`/students/${student.id}`) }}><div className="avatar avatar-student">{student.initials}</div><span><strong>{student.name}</strong><small>{student.department} · Semester {student.semester}</small></span><b>{student.level}</b></button>)}</div> : <p className="search-hint">No students found for “{searchQuery}”.</p>}</div></div>}
      {notificationsOpen && <div className="popover notification-popover"><div className="popover-header"><strong>Notifications</strong><button onClick={markAllRead}>Mark all read</button></div>{notifications.map((item) => <button className={`notification-item ${item.read ? '' : 'notification-unread'}`} key={item.id} onClick={() => { markRead(item.id); setNotificationsOpen(false); navigate(item.path) }}><span className={`notification-dot notification-${item.priority.toLowerCase()}`} /><span><strong>{item.title}</strong><small>{item.copy}</small></span></button>)}</div>}
      <Modal open={paletteOpen} title="Command palette" onClose={() => setPaletteOpen(false)}><input className="palette-input" autoFocus value={paletteQuery} onChange={(event) => setPaletteQuery(event.target.value)} onKeyDown={handlePaletteKey} placeholder="Search commands..." /> <div className="command-list">{filteredCommands.map(([label, path], index) => <button className={index === paletteIndex ? 'command-active' : ''} key={path} onMouseEnter={() => setPaletteIndex(index)} onClick={() => executeCommand(path)}><Command size={15} /><span>{label}</span><kbd>↵</kbd></button>)}</div></Modal>
    </div>
  )
}
