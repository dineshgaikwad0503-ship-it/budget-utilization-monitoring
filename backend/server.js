require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const { runAnomalyScan } = require('./utils/anomalyDetection');
const cron = require('node-cron');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const expenditureRoutes = require('./routes/expenditureRoutes');
const alertRoutes = require('./routes/alertRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const auditRoutes = require('./routes/auditRoutes');
const settingRoutes = require('./routes/settingRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'Budget Utilization Monitoring API', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/expenditures', expenditureRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/reports', reportRoutes);

cron.schedule('0 */6 * * *', () => {
  console.log('[cron] Running scheduled anomaly detection scan...');
  runAnomalyScan().catch((e) => console.error('Anomaly scan error:', e.message));
});
setTimeout(() => {
  runAnomalyScan().catch((e) => console.error('Initial anomaly scan error:', e.message));
}, 10000);

// ---------------------------------------------------------------------------
// Single-deployment mode: if the Angular production build exists alongside
// this backend (frontend/dist/budget-utilization-monitoring), serve it as
// static files and fall back to index.html for client-side routing on any
// non-API GET request. This lets the whole app run as one Render web
// service — build the frontend first, then start this server.
// ---------------------------------------------------------------------------
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist', 'budget-utilization-monitoring');
const frontendIndexPath = path.join(frontendDistPath, 'index.html');
const frontendBuildExists = fs.existsSync(frontendIndexPath);

if (frontendBuildExists) {
  app.use(express.static(frontendDistPath));
  console.log('Serving frontend build from', frontendDistPath);
} else {
  console.log('No frontend build found at', frontendDistPath, '— running in API-only mode.');
}

// Unmatched /api/* routes get a JSON 404 (never fall through to the SPA index.html)
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Every other unmatched GET request serves the Angular app so client-side
// routing (e.g. refreshing on /dashboard) works correctly.
app.get('*', (req, res) => {
  if (frontendBuildExists) {
    res.sendFile(frontendIndexPath);
  } else {
    res.status(404).json({ message: 'Route not found — frontend build not present. Run `npm run build` in /frontend, or use the API directly under /api.' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
