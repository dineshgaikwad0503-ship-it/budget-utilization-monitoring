# AI-Based Budget Utilization Monitoring System

A MEAN-stack (MongoDB, Express, Angular, Node.js) web application that gives
government departments and large enterprises real-time visibility into
budget allocation, expenditure, and utilization — with rule-based anomaly
detection for under-utilization, overspending, and sudden spending spikes.

Built to the project brief referencing CAG of India and the Open Budget
Portal (International Budget Partnership) as governance context.

## Feature summary

- **Authentication & RBAC** — JWT auth with three roles: Admin, Finance
  Officer, Department Head. Department Heads only see their own
  department's data.
- **Budget Management** — create/edit annual or quarterly allocations per
  department and scheme, plus year-over-year comparison view.
- **Expenditure Tracking** — record transactions with category, date, an
  optional supporting-document upload, and CSV bulk upload.
- **Anomaly Detection Engine** (`backend/utils/anomalyDetection.js`) — rule
  based scan (also runs on a 6-hour cron job) that flags:
  - Under-utilization (< 40% spent with ≥ 70% of the financial year elapsed)
  - Overspending (> 100% of allocation)
  - Spending spikes (a single transaction > 3x the average transaction size)
  - **Thresholds are live-configurable** — Admin/Finance Officer can edit
    all four values from the Alert Rules Configuration page; changes are
    stored in the `Setting` collection and apply on the very next scan,
    no code change or redeploy required.
- **Dashboards** — main dashboard, executive summary, and department
  overview, with Chart.js bar/line/doughnut visualizations.
- **Alerts** — active/resolved alert feed, resolved archive, a **live editable**
  alert-rules configuration page, manual "Run Detection Scan", resolve workflow.
- **Reports** — reports hub, department summary, utilization trend, and a
  custom report builder — with **both CSV and server-generated PDF export**
  (`backend/controllers/reportController.js`, via PDFKit).
- **Admin** — departments (list/detail/create/edit), users (list/detail),
  roles & permissions reference, system settings.
- **Audit Logs** — every create/update/delete/login action is recorded
  with user, action, entity, and timestamp (Admin-only).
- **Account & support** — profile, notifications, help/FAQs.
- **Public marketing pages** — landing, about, features, contact —
  plus forgot/reset password flows.

**43 distinct frontend pages/screens** across public marketing, auth,
dashboards, budgets, expenditures, alerts, departments, reports, admin,
and account sections — styled with a dark "glow" UI (neon teal/cyan
accents on a deep navy background).

## Documentation

`documentation/Budget-Utilization-Monitoring-System-Technical-Report.docx`
is a 16-page technical report covering system architecture, database
schema (full field-level tables), the anomaly-detection algorithm, the
complete API reference, the RBAC access matrix, testing approach (13
representative test cases), deployment guide, security considerations,
and appendices for environment variables and seed data.

## Tech stack

| Layer      | Technology                                   |
|------------|-----------------------------------------------|
| Frontend   | Angular 17 (standalone components, lazy-loaded routes), Chart.js  |
| Backend    | Node.js, Express.js                           |
| Database   | MongoDB (Mongoose ODM)                        |
| Auth       | JWT + bcrypt                                  |
| Deployment | Any Node host (Render/Azure/AWS) + Vercel/Netlify or same host for Angular build |

## Project structure

```
budget-utilization-monitoring/
├── documentation/
│   └── Budget-Utilization-Monitoring-System-Technical-Report.docx  # 16-page technical report
├── backend/
│   ├── config/db.js               # MongoDB connection
│   ├── models/                    # User, Department, Budget, Expenditure, Alert, AuditLog, Setting
│   ├── controllers/                # Business logic per resource (incl. reportController for PDF export)
│   ├── routes/                     # Express routers (incl. settingRoutes, reportRoutes)
│   ├── middleware/                 # auth (JWT), roleCheck (RBAC), audit, upload
│   ├── utils/anomalyDetection.js   # Rule-based detection engine, thresholds read from Setting
│   ├── seed/seedData.js            # Realistic demo dataset + default thresholds
│   └── server.js
└── frontend/
    └── src/app/
        ├── pages/                  # 43 standalone page components (see below)
        ├── services/                # HTTP services per resource (incl. settings.service, report.service)
        ├── guards/, interceptors/   # auth + role guards, JWT interceptor
        └── shared/                  # navbar, sidebar, shared marketing/info-grid styles
```

### Page map (43 pages)

| Area | Pages |
|------|-------|
| Public | landing, about, features, contact |
| Auth | login, register, forgot-password, reset-password |
| Dashboards | dashboard, executive-summary, department-overview |
| Budgets | budget-management (list), budget-detail, budget-create, budget-edit, budget-comparison |
| Expenditures | expenditure-tracking (list), expenditure-detail, expenditure-create, expenditure-edit, expenditure-bulk-upload |
| Alerts | alerts (list), alert-detail, alert-rules, alerts-archive |
| Departments | departments (list), department-detail, department-create, department-edit |
| Reports | reports (hub), report-department-summary, report-utilization-trend, report-builder |
| Admin | admin-panel, users (list), user-detail, roles-permissions, system-settings |
| Audit | audit-logs |
| Account | profile, notifications, help |
| Other | not-found (404) |

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # then edit MONGO_URI / JWT_SECRET
npm run seed                 # populates departments, users, budgets, expenditures, alerts
npm run dev                  # starts on http://localhost:5000
```

Demo login credentials (created by the seed script):

| Role            | Email                                   | Password    |
|-----------------|------------------------------------------|-------------|
| Admin           | admin@budgetmonitor.gov.in               | Admin@123   |
| Finance Officer | finance.officer@budgetmonitor.gov.in     | Finance@123 |
| Dept Head       | rd.head@budgetmonitor.gov.in (etc.)      | Head@123    |

### 2. Frontend

```bash
cd frontend
npm install
npm start                    # starts on http://localhost:4200
```

The frontend reads its API base URL from `src/environments/environment.ts`
(defaults to `http://localhost:5000/api`).

### 3. Production build

```bash
cd frontend
npm run build                # outputs to frontend/dist/budget-utilization-monitoring
```

Deploy the backend to any Node host (Render, Azure App Service, AWS
Elastic Beanstalk) with a MongoDB Atlas connection string, and the
frontend build output to Vercel, Netlify, or the same host as static
files.

## Anomaly detection thresholds

Thresholds are stored in MongoDB (`Setting` collection, seeded with
defaults below) and are **live-editable** from the Alert Rules
Configuration page (`/alerts/rules`) by an Admin or Finance Officer —
no code change or redeploy needed. They can also be read/updated
directly via the API:

```
GET  /api/settings/thresholds
PUT  /api/settings/thresholds   (Admin, Finance Officer only)
```

Defaults (used the first time the app runs, before any Setting
document exists):

```js
underUtilizationThreshold: 0.4,  // 40% used
timeElapsedThreshold: 0.7,       // 70% of FY elapsed
overspendThreshold: 1.0,         // 100% of allocation
spikeMultiplier: 3,              // 3x average transaction size
```

## Downloadable reports

Both the Budget Utilization Report and Expenditure Detail Report are
available as CSV (generated client-side) and as a formatted PDF
(generated server-side via PDFKit) from the Reports page:

```
GET /api/reports/budget-pdf?department=&financialYear=
GET /api/reports/expenditure-pdf?budget=&department=
```

## Run with Docker (recommended — no local Node/MongoDB setup needed)

The project ships with a multi-stage `Dockerfile` (builds the Angular
frontend, then packages it with the Express backend into one image)
and a `docker-compose.yml` that also brings up MongoDB — one command,
nothing else to install:

```bash
docker compose up --build
```

Then, in a second terminal, seed the demo data once:

```bash
docker compose exec app npm run seed
```

Open **http://localhost:5000** — the backend serves the built Angular
app directly, so there's only one URL. Stop everything with
`docker compose down` (add `-v` to also delete the MongoDB volume).

To build and run the image by itself against your own MongoDB (e.g.
Atlas), without docker-compose:

```bash
docker build -t budget-utilization-monitoring .
docker run -p 5000:5000 \
  -e MONGO_URI="<your MongoDB connection string>" \
  -e JWT_SECRET="<a long random string>" \
  budget-utilization-monitoring
```

## Deploy to Render (Docker-based, single service)

This project is set up to deploy as **one** Render web service, built
directly from the Dockerfile — no Node buildpack, no separate
frontend deployment.

### Option A — One-click Blueprint

1. Push this repo to GitHub.
2. In Render: **New +** → **Blueprint** → select this repo. Render reads
   `render.yaml` at the project root, which points at the Dockerfile.
3. When prompted, set `MONGO_URI` to a MongoDB Atlas connection string
   (free-tier M0 cluster — see
   [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas); under
   Network Access, allow `0.0.0.0/0` so Render can reach it).
   `JWT_SECRET` is auto-generated by Render.
4. Click **Apply** — Render builds the Docker image (frontend build +
   backend, per the Dockerfile) and starts the container. Health check
   is wired to `/api/health`.
5. Open a shell in the Render dashboard and run `npm run seed` once
   (from `/app/backend`, the container's working directory) to
   populate demo departments, users, budgets, and thresholds.

### Option B — Manual Docker Web Service

| Setting | Value |
|---|---|
| Runtime | Docker |
| Dockerfile Path | `./Dockerfile` |
| Docker Context | `.` |
| Health Check Path | `/api/health` |

Environment variables to add: `MONGO_URI`, `JWT_SECRET`,
`JWT_EXPIRES_IN` (e.g. `8h`), `NODE_ENV=production`. Render sets
`PORT` automatically — the server already reads it via
`process.env.PORT`, and the Dockerfile exposes `5000` as the default.

### Why this avoids the errors from before

- **No more `ECONNREFUSED ::1:27017`** — that happened because
  `MONGO_URI` pointed at a local MongoDB that doesn't exist in a
  container/cloud environment. `docker-compose.yml` includes a real
  MongoDB container for local use; for Render, point `MONGO_URI` at
  MongoDB Atlas instead.
- **No more `{"message":"Route not found"}` on the root URL** — the
  backend serves the Angular build for any non-`/api` route (built
  into the Docker image itself), so visiting the site root or
  refreshing on `/dashboard`, `/budgets`, etc. correctly loads the app.
- **Single deployment** — the Dockerfile bundles the built Angular
  frontend and the Express backend into one image, so there's one
  artifact to build, one container to run, and no separate services
  to keep in sync.

## Notes on data

The seed script generates illustrative allocation figures loosely modeled
on the relative scale of state-level Indian government department
budgets (Rural Development, Health & Family Welfare, School Education,
Public Works, Urban Development, Agriculture & Irrigation) — these are
demo/placeholder figures, not official published records. Replace with
real department data before any production use.
