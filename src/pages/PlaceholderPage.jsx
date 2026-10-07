import { BrainCircuit, ClipboardCheck, FileText, GraduationCap, Settings2, Sparkles, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, EmptyState, Panel, SectionHeading } from '../components/ui'

const pageContent = {
  '/students': ['Student directory', 'One workspace for every learner profile, trajectory, and support signal.', Users],
  '/early-warning': ['Early warning system', 'Surface the students whose next outcome is most sensitive to timely support.', BrainCircuit],
  '/groups': ['Student groups', 'Create focused cohorts for mentoring, support, and high-performance programs.', Users],
  '/predictions': ['Prediction lab', 'Inspect model estimates, confidence, and the signals driving each outcome.', BrainCircuit],
  '/simulator': ['Student success simulator', 'Model how practical changes could shift a student’s estimated trajectory.', Sparkles],
  '/insights': ['AI insights', 'Turn institutional patterns into clear, explainable decisions for your team.', Sparkles],
  '/analytics/departments': ['Department intelligence', 'Compare outcomes across departments and drill into the reasons beneath the averages.', GraduationCap],
  '/analytics/courses': ['Course intelligence', 'Find where performance, engagement, and failure risk converge.', GraduationCap],
  '/analytics/attendance': ['Attendance intelligence', 'See the attendance patterns that precede academic risk.', ClipboardCheck],
  '/interventions': ['Intervention hub', 'Move from recommendation to action, then measure what changed.', ClipboardCheck],
  '/reports': ['Report studio', 'Generate decision-ready views for students, faculty, and institutional leaders.', FileText],
  '/settings': ['Workspace settings', 'Configure thresholds, permissions, notification rules, and AI behavior.', Settings2],
}

export default function PlaceholderPage({ path }) {
  const navigate = useNavigate()
  const [title, copy, Icon] = pageContent[path] || ['EduPulse AI', 'A new intelligence surface is ready to be connected.', Sparkles]
  return <div className="placeholder-page"><SectionHeading eyebrow="Phase 1 surface" title={title} copy={copy} action={<Button icon={<Icon size={16} />} onClick={() => navigate('/settings')}>Configure view</Button>} /><div className="placeholder-layout"><Panel className="placeholder-hero"><div className="placeholder-icon"><Icon size={26} /></div><span className="eyebrow">Ready for the next layer</span><h2>{title} is part of the command center.</h2><p>The route, shell, navigation state, and component language are in place. This surface will connect to live Node and FastAPI data in the next implementation phase.</p><Button variant="secondary" onClick={() => navigate('/settings')}>View architecture</Button></Panel><Panel title="Coming into focus"><EmptyState title="Data connection pending" copy="This Phase 1 route is intentionally wired as a stable destination for the product workflow." /></Panel></div></div>
}
