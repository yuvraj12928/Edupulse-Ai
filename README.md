# EduPulse AI

**Predict. Understand. Intervene. Improve Student Success.**

EduPulse AI is a student intelligence platform for turning academic, attendance, engagement, and intervention data into explainable decisions. Phase 1 establishes the production-shaped frontend shell and visual system; subsequent phases will connect the Node API, MongoDB, and FastAPI prediction service.

## Phase 1 scope

- React + Vite application foundation
- Responsive command-center shell with collapsible sidebar
- Routed product surfaces for overview, students, intelligence, analytics, interventions, AI, reports, and system settings
- Reusable KPI, panel, badge, progress, table, and chart primitives
- Stable deterministic demo data for the first dashboard experience
- Dark-first visual system with accessible focus states and mobile navigation

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

Create a local `.env` from `.env.example` when wiring the API. The Phase 1 shell runs without a backend in demo mode.

## Architecture

```text
frontend (React/Vite)
  src/
    components/   reusable UI primitives
    data/         deterministic demo fixtures
    layouts/      application chrome
    pages/        routed product surfaces
    App.jsx       route composition
    styles.css    design tokens and global styles

future services
  backend/        Node.js + Express + MongoDB API
  ml-service/     FastAPI + scikit-learn prediction service
```

## Planned stack

- Frontend: React, React Router, Recharts, Framer Motion, Lucide React
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- ML service: Python, FastAPI, pandas, NumPy, scikit-learn, joblib

## Demo direction

The shell is intentionally demo-first: every route is navigable, the overview contains realistic synthetic institutional signals, and the visual hierarchy is ready for the early-warning, digital-twin, what-if, and intervention workflows.
