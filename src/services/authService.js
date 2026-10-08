const demoUsers = {
  'admin@edupulse.demo': { id: 'admin-001', email: 'admin@edupulse.demo', password: 'EduPulse2025!', firstName: 'Alex', lastName: 'Stone', role: 'Super Admin', department: 'Academic Administration', institution: 'Northstar University', phone: '+1 555 014 2040', joinedDate: 'January 2024', lastLogin: 'Just now' },
  'faculty@edupulse.demo': { id: 'faculty-001', email: 'faculty@edupulse.demo', password: 'EduPulse2025!', firstName: 'Maya', lastName: 'Chen', role: 'Faculty', department: 'Computer Science', institution: 'Northstar University', phone: '+1 555 014 2041', joinedDate: 'August 2024', lastLogin: 'Just now' },
  'mentor@edupulse.demo': { id: 'mentor-001', email: 'mentor@edupulse.demo', password: 'EduPulse2025!', firstName: 'Anita', lastName: 'Rao', role: 'Mentor', department: 'Student Success', institution: 'Northstar University', phone: '+1 555 014 2042', joinedDate: 'March 2024', lastLogin: 'Just now' },
  'hod@edupulse.demo': { id: 'hod-001', email: 'hod@edupulse.demo', password: 'EduPulse2025!', firstName: 'Vikram', lastName: 'Shah', role: 'HOD', department: 'Computer Science', institution: 'Northstar University', phone: '+1 555 014 2043', joinedDate: 'June 2023', lastLogin: 'Just now' },
  'student@edupulse.demo': { id: 'student-001', email: 'student@edupulse.demo', password: 'EduPulse2025!', firstName: 'Rahul', lastName: 'Sharma', role: 'Student', department: 'Computer Science', institution: 'Northstar University', phone: '', joinedDate: 'September 2023', lastLogin: 'Just now' },
}

const publicUser = ({ password, ...user }) => user

export async function loginRequest(email, password) {
  const apiUrl = import.meta.env.VITE_API_URL
  if (import.meta.env.VITE_DEMO_MODE !== 'false' || !apiUrl) {
    const user = demoUsers[email.toLowerCase()]
    const savedPassword = localStorage.getItem(`edupulse-password-${email.toLowerCase()}`) || user?.password
    if (!user || savedPassword !== password) throw new Error('INVALID_CREDENTIALS')
    return { token: `demo-token-${user.id}`, user: publicUser(user), demo: true }
  }
  const response = await fetch(`${apiUrl}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
  if (!response.ok) throw new Error(response.status === 401 ? 'INVALID_CREDENTIALS' : 'SERVER_ERROR')
  return response.json()
}

export async function logoutRequest(token) {
  const apiUrl = import.meta.env.VITE_API_URL
  if (token?.startsWith('demo-token-') || !apiUrl) return
  await fetch(`${apiUrl}/auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
}

export async function updateProfileRequest(user, token) {
  const apiUrl = import.meta.env.VITE_API_URL
  if (token?.startsWith('demo-token-') || !apiUrl) return user
  const response = await fetch(`${apiUrl}/auth/me`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(user) })
  if (!response.ok) throw new Error('SERVER_ERROR')
  return response.json()
}

export async function changePasswordRequest(email, currentPassword, newPassword, token) {
  if (token?.startsWith('demo-token-') || !import.meta.env.VITE_API_URL) {
    const savedPassword = localStorage.getItem(`edupulse-password-${email.toLowerCase()}`) || 'EduPulse2025!'
    if (currentPassword !== savedPassword) throw new Error('INVALID_PASSWORD')
    localStorage.setItem(`edupulse-password-${email.toLowerCase()}`, newPassword)
    return
  }
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/change-password`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ currentPassword, newPassword }) })
  if (!response.ok) throw new Error(response.status === 401 ? 'INVALID_PASSWORD' : 'SERVER_ERROR')
}

export async function requestPasswordReset(email) {
  const token = `demo-reset-${Date.now()}`
  if (!import.meta.env.VITE_API_URL || import.meta.env.VITE_DEMO_MODE !== 'false') {
    if (!demoUsers[email.toLowerCase()]) throw new Error('NOT_FOUND')
    localStorage.setItem(`edupulse-reset-${token}`, email.toLowerCase())
    return token
  }
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
  if (!response.ok) throw new Error('SERVER_ERROR')
  return response.json()
}

export async function resetPasswordRequest(token, newPassword) {
  if (!import.meta.env.VITE_API_URL || import.meta.env.VITE_DEMO_MODE !== 'false') {
    const email = localStorage.getItem(`edupulse-reset-${token}`)
    if (!email) throw new Error('INVALID_TOKEN')
    localStorage.setItem(`edupulse-password-${email}`, newPassword)
    localStorage.removeItem(`edupulse-reset-${token}`)
    return
  }
  const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: newPassword }) })
  if (!response.ok) throw new Error(response.status === 400 ? 'INVALID_TOKEN' : 'SERVER_ERROR')
}

export function demoAccounts() { return Object.values(demoUsers).map(publicUser).map((user) => ({ ...user, password: 'EduPulse2025!' })) }
