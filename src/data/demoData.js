export const kpis = [
  { label: 'Students monitored', value: '1,842', delta: '+6.8%', note: 'vs last semester', tone: 'cyan' },
  { label: 'Success rate', value: '82.4%', delta: '+4.2%', note: 'institution-wide', tone: 'green' },
  { label: 'At-risk students', value: '142', delta: '-12.5%', note: 'since last review', tone: 'amber' },
  { label: 'Critical cases', value: '18', delta: '+2', note: 'needs action today', tone: 'red' },
]

export const riskTrend = [
  { month: 'SEP', risk: 198, stable: 1530 },
  { month: 'OCT', risk: 181, stable: 1588 },
  { month: 'NOV', risk: 164, stable: 1640 },
  { month: 'DEC', risk: 153, stable: 1682 },
  { month: 'JAN', risk: 149, stable: 1711 },
  { month: 'FEB', risk: 142, stable: 1744 },
]

export const departmentData = [
  { name: 'CSE', success: 88, students: 492, color: '#57d6d0' },
  { name: 'BBA', success: 84, students: 286, color: '#f4b860' },
  { name: 'ECE', success: 79, students: 341, color: '#a89cf4' },
  { name: 'MBA', success: 76, students: 224, color: '#f27d72' },
  { name: 'ME', success: 73, students: 267, color: '#84a9ff' },
]

export const atRiskStudents = [
  { initials: 'RS', name: 'Rahul Sharma', meta: 'CSE · Semester 5', risk: 82, level: 'High', attendance: '68%', trend: '-6.4%', action: 'Mentor review' },
  { initials: 'AK', name: 'Aisha Khan', meta: 'ECE · Semester 4', risk: 77, level: 'High', attendance: '72%', trend: '-3.1%', action: 'Study plan' },
  { initials: 'VN', name: 'Vikram Nair', meta: 'ME · Semester 6', risk: 69, level: 'Medium', attendance: '76%', trend: '+1.8%', action: 'Attendance watch' },
  { initials: 'SM', name: 'Sara Menon', meta: 'BBA · Semester 3', risk: 64, level: 'Medium', attendance: '81%', trend: '-2.7%', action: 'Course support' },
]
