import { ArrowUpRight, ChevronRight, CircleAlert, Sparkles, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export function Panel({ children, className = '', title, eyebrow, action, style }) {
  return (
    <section className={`panel ${className}`} style={style}>
      {(title || eyebrow || action) && (
        <header className="panel-header">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2 className="panel-title">{title}</h2>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

export function StatusBadge({ children, tone = 'neutral' }) {
  return <span className={`status-badge status-${tone}`}>{children}</span>
}

export function Button({ children, variant = 'primary', icon, ...props }) {
  return (
    <button className={`button button-${variant}`} {...props}>
      {icon}
      <span>{children}</span>
    </button>
  )
}

export function ProgressBar({ value, tone = 'cyan' }) {
  return <div className="progress-track"><span className={`progress-fill progress-${tone}`} style={{ width: `${value}%` }} /></div>
}

export function AnimatedNumber({ value, duration = 900, decimals = 0, suffix = '' }) {
  const target = Number(value)
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const start = performance.now()
    let frame
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - ((1 - progress) ** 3)
      setDisplay(target * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [duration, target])
  return <>{display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</>
}

export function RiskScore({ value, compact = false }) {
  const tone = value >= 75 ? 'red' : value >= 55 ? 'amber' : 'green'
  return <div className={`risk-score risk-score-${tone} ${compact ? 'risk-score-compact' : ''}`} title="Higher score means higher modeled risk"><div className="risk-score-ring" style={{ '--risk-value': value }}><span><AnimatedNumber value={value} /></span></div><div><strong>{value >= 75 ? 'HIGH RISK' : value >= 55 ? 'MONITORING' : 'STABLE'}</strong><small>higher score = higher risk</small></div></div>
}

export function PageTransition({ children }) {
  return <div className="page-transition">{children}</div>
}

export function SectionHeading({ eyebrow, title, copy, action }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {copy && <p className="section-copy">{copy}</p>}
      </div>
      {action}
    </div>
  )
}

export function EmptyState({ title = 'Nothing here yet', copy = 'Connect a data source to bring this surface to life.' }) {
  return (
    <div className="empty-state">
      <Sparkles size={20} />
      <strong>{title}</strong>
      <span>{copy}</span>
    </div>
  )
}

export function MiniSparkline({ values, tone = 'cyan' }) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * 100
    const y = 30 - ((value - min) / (max - min || 1)) * 24
    return `${x},${y}`
  }).join(' ')
  return (
    <svg className={`sparkline sparkline-${tone}`} viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true">
      <polyline className="sparkline-line" points={points} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function LinkRow({ children, to = '#' }) {
  return <Link className="link-row" to={to}>{children}<ChevronRight size={15} /></Link>
}

export function RiskSignal({ value }) {
  const tone = value >= 75 ? 'red' : value >= 55 ? 'amber' : 'green'
  return <div className="risk-signal"><CircleAlert size={15} /><span className={`risk-number risk-${tone}`}>{value}</span><span className="risk-label">risk index</span></div>
}

export function ViewAll({ children = 'View all', onClick }) {
  return <button className="view-all" onClick={onClick}>{children}<ArrowUpRight size={14} /></button>
}

export function Modal({ open, title, children, onClose, wide = false }) {
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])
  if (!open) return null
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className={`modal ${wide ? 'modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}><header className="modal-header"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></header>{children}</div></div>
}
