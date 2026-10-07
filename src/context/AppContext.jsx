import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { atRiskStudents } from '../data/demoData'

const seedStudents = [
  { id: 'rahul-sharma', name: 'Rahul Sharma', initials: 'RS', department: 'CSE', semester: 5, gpa: 6.8, previousGpa: 7.4, attendance: 68, engagement: 54, assignments: 62, quiz: 64, exam: 61, studyHours: 1.5, risk: 82, level: 'HIGH', success: 68, failure: 34, dropout: 21, confidence: 91, courseFailures: 1, skills: [{ name: 'Programming', value: 82 }, { name: 'Data Structures', value: 74 }, { name: 'Algorithms', value: 68 }, { name: 'Database', value: 88 }], courses: ['Data Structures', 'Database Systems', 'Operating Systems'] },
  { id: 'aisha-khan', name: 'Aisha Khan', initials: 'AK', department: 'ECE', semester: 4, gpa: 7.1, previousGpa: 7.6, attendance: 72, engagement: 61, assignments: 70, quiz: 69, exam: 67, studyHours: 2.2, risk: 77, level: 'HIGH', success: 73, failure: 28, dropout: 15, confidence: 88, courseFailures: 0, skills: [{ name: 'Programming', value: 72 }, { name: 'Circuits', value: 79 }, { name: 'Signals', value: 65 }, { name: 'Communication', value: 84 }], courses: ['Signals & Systems', 'Embedded Systems', 'Engineering Maths'] },
  { id: 'vikram-nair', name: 'Vikram Nair', initials: 'VN', department: 'ME', semester: 6, gpa: 7.8, previousGpa: 7.5, attendance: 76, engagement: 71, assignments: 79, quiz: 74, exam: 72, studyHours: 2.8, risk: 69, level: 'MEDIUM', success: 78, failure: 20, dropout: 9, confidence: 85, courseFailures: 0, skills: [{ name: 'Design', value: 81 }, { name: 'Mechanics', value: 78 }, { name: 'CAD', value: 72 }], courses: ['Thermodynamics', 'CAD Lab', 'Manufacturing'] },
  { id: 'sara-menon', name: 'Sara Menon', initials: 'SM', department: 'BBA', semester: 3, gpa: 8.2, previousGpa: 8.4, attendance: 81, engagement: 77, assignments: 86, quiz: 82, exam: 84, studyHours: 3.1, risk: 64, level: 'MEDIUM', success: 84, failure: 12, dropout: 5, confidence: 86, courseFailures: 0, skills: [{ name: 'Marketing', value: 88 }, { name: 'Finance', value: 75 }, { name: 'Communication', value: 91 }], courses: ['Marketing Strategy', 'Business Finance', 'Consumer Behaviour'] },
  { id: 'dev-patel', name: 'Dev Patel', initials: 'DP', department: 'IT', semester: 7, gpa: 9.1, previousGpa: 8.8, attendance: 94, engagement: 91, assignments: 96, quiz: 92, exam: 93, studyHours: 4.5, risk: 18, level: 'LOW', success: 96, failure: 3, dropout: 1, confidence: 94, courseFailures: 0, skills: [{ name: 'Cloud', value: 93 }, { name: 'Programming', value: 95 }, { name: 'Security', value: 87 }], courses: ['Cloud Architecture', 'Cybersecurity', 'Capstone'] },
  { id: 'meera-iyer', name: 'Meera Iyer', initials: 'MI', department: 'MBA', semester: 2, gpa: 8.7, previousGpa: 8.2, attendance: 89, engagement: 86, assignments: 91, quiz: 88, exam: 90, studyHours: 3.8, risk: 26, level: 'LOW', success: 92, failure: 4, dropout: 2, confidence: 92, courseFailures: 0, skills: [{ name: 'Leadership', value: 91 }, { name: 'Strategy', value: 89 }, { name: 'Analytics', value: 82 }], courses: ['Strategy', 'Business Analytics', 'Leadership'] },
]

const seedNotifications = [
  { id: 'n1', title: 'Rahul entered high-risk status', copy: 'Attendance dropped below the 70% threshold.', priority: 'HIGH', read: false, path: '/students/rahul-sharma' },
  { id: 'n2', title: '5 students need attention', copy: 'The early warning queue changed since yesterday.', priority: 'WARNING', read: false, path: '/early-warning' },
  { id: 'n3', title: 'Intervention completed', copy: 'Aisha Khan completed her study plan.', priority: 'INFO', read: true, path: '/interventions' },
]

const seedInterventions = [
  { id: 'i1', studentId: 'rahul-sharma', student: 'Rahul Sharma', risk: 82, type: 'Academic counselling', priority: 'HIGH', mentor: 'Dr. Anita Rao', dueDate: '2025-02-18', status: 'RECOMMENDED', outcome: '', notes: '' },
  { id: 'i2', studentId: 'aisha-khan', student: 'Aisha Khan', risk: 77, type: 'Weekly mentor meeting', priority: 'MEDIUM', mentor: 'Prof. Vikram Shah', dueDate: '2025-02-21', status: 'IN PROGRESS', outcome: '', notes: '' },
]

function load(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback } catch { return fallback } }

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [students, setStudents] = useState(() => load('edupulse-students', seedStudents))
  const [notifications, setNotifications] = useState(() => load('edupulse-notifications', seedNotifications))
  const [interventions, setInterventions] = useState(() => load('edupulse-interventions', seedInterventions))
  const [toast, setToast] = useState(null)

  useEffect(() => { localStorage.setItem('edupulse-students', JSON.stringify(students)) }, [students])
  useEffect(() => { localStorage.setItem('edupulse-notifications', JSON.stringify(notifications)) }, [notifications])
  useEffect(() => { localStorage.setItem('edupulse-interventions', JSON.stringify(interventions)) }, [interventions])
  useEffect(() => { if (!toast) return undefined; const timer = setTimeout(() => setToast(null), 3200); return () => clearTimeout(timer) }, [toast])

  const notify = (message, tone = 'success') => setToast({ message, tone })
  const updateStudent = (id, changes) => { setStudents((current) => current.map((student) => student.id === id ? { ...student, ...changes } : student)); notify('Student updated successfully.') }
  const addStudent = (student) => { setStudents((current) => [student, ...current]); notify('Student created successfully.') }
  const deleteStudent = (id) => { setStudents((current) => current.filter((student) => student.id !== id)); notify('Student removed from demo workspace.', 'info') }
  const runPrediction = (student) => {
    const risk = Math.max(4, Math.min(96, Math.round(100 - (student.attendance * .25 + student.gpa * 5 + student.assignments * .15 + student.engagement * .15))))
    const result = { risk: Math.round((risk + student.risk) / 2), success: Math.max(5, 100 - Math.round((risk + student.risk) / 2)), confidence: Math.min(97, student.confidence + 1) }
    updateStudent(student.id, { risk: result.risk, success: result.success, confidence: result.confidence, level: result.risk >= 75 ? 'HIGH' : result.risk >= 55 ? 'MEDIUM' : 'LOW' })
    notify('Prediction recalculated just now.', 'info')
    return result
  }
  const addIntervention = (data) => { setInterventions((current) => [{ ...data, id: `i-${Date.now()}` }, ...current]); notify('Intervention created successfully.') }
  const updateIntervention = (id, changes) => { setInterventions((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item)); notify('Intervention updated successfully.', 'info') }
  const markRead = (id) => setNotifications((current) => current.map((item) => item.id === id ? { ...item, read: true } : item))
  const markAllRead = () => { setNotifications((current) => current.map((item) => ({ ...item, read: true }))); notify('All notifications marked as read.', 'info') }
  const value = useMemo(() => ({ students, notifications, interventions, toast, notify, addStudent, updateStudent, deleteStudent, runPrediction, addIntervention, updateIntervention, markRead, markAllRead, atRiskStudents }), [students, notifications, interventions, toast])
  return <AppContext.Provider value={value}>{children}{toast && <div className={`toast toast-${toast.tone}`} role="status">{toast.message}</div>}</AppContext.Provider>
}

export function useApp() { const context = useContext(AppContext); if (!context) throw new Error('useApp must be used inside AppProvider'); return context }
