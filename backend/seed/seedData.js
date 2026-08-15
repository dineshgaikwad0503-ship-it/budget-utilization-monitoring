/**
 * Seed script: populates realistic demo data modeled on publicly-known
 * Indian government department budget structures (illustrative figures,
 * inspired by CAG / Union Budget category patterns — not official records).
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Department = require('../models/Department');
const Budget = require('../models/Budget');
const Expenditure = require('../models/Expenditure');
const Alert = require('../models/Alert');
const AuditLog = require('../models/AuditLog');
const Setting = require('../models/Setting');

const departments = [
  { name: 'Rural Development', code: 'RD', description: 'Schemes for rural infrastructure and employment guarantee programs.' },
  { name: 'Health & Family Welfare', code: 'HFW', description: 'Public health infrastructure, hospitals, and welfare schemes.' },
  { name: 'School Education', code: 'SED', description: 'Primary and secondary education infrastructure and programs.' },
  { name: 'Public Works', code: 'PWD', description: 'Roads, buildings, and public infrastructure maintenance.' },
  { name: 'Urban Development', code: 'UD', description: 'Municipal services, sanitation, and urban housing schemes.' },
  { name: 'Agriculture & Irrigation', code: 'AGR', description: 'Farmer welfare, irrigation projects, and crop insurance schemes.' },
];

const categories = ['Salaries', 'Infrastructure', 'Equipment', 'Travel', 'Utilities', 'Consulting', 'Training', 'Miscellaneous'];

const randomBetween = (min, max) => Math.random() * (max - min) + min;
const randomDateInFY = (fyStartYear) => {
  const start = new Date(`${fyStartYear}-04-01`).getTime();
  const end = Math.min(Date.now(), new Date(`${fyStartYear + 1}-03-31`).getTime());
  return new Date(randomBetween(start, end));
};

const run = async () => {
  await connectDB();
  console.log('Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Department.deleteMany({}),
    Budget.deleteMany({}),
    Expenditure.deleteMany({}),
    Alert.deleteMany({}),
    AuditLog.deleteMany({}),
    Setting.deleteMany({}),
  ]);

  console.log('Creating departments...');
  const createdDepartments = await Department.insertMany(departments);

  console.log('Creating users...');
  const admin = await User.create({
    name: 'Anil Deshmukh',
    email: 'admin@budgetmonitor.gov.in',
    password: 'Admin@123',
    role: 'Admin',
  });

  const financeOfficer = await User.create({
    name: 'Priya Sharma',
    email: 'finance.officer@budgetmonitor.gov.in',
    password: 'Finance@123',
    role: 'FinanceOfficer',
  });

  const departmentHeads = [];
  for (const dept of createdDepartments) {
    const head = await User.create({
      name: `Head - ${dept.name}`,
      email: `${dept.code.toLowerCase()}.head@budgetmonitor.gov.in`,
      password: 'Head@123',
      role: 'DepartmentHead',
      department: dept._id,
    });
    dept.headOfDepartment = head._id;
    await dept.save();
    departmentHeads.push(head);
  }

  console.log('Creating budgets and expenditures for FY 2024-2025 and 2025-2026...');
  const financialYears = [
    { label: '2024-2025', startYear: 2024 },
    { label: '2025-2026', startYear: 2025 },
  ];

  // Illustrative allocation bands (in INR lakhs) roughly reflecting relative
  // scale of state-level department budgets — for demo purposes only.
  const allocationBandsByDept = {
    RD: [8000, 15000],
    HFW: [12000, 22000],
    SED: [10000, 18000],
    PWD: [9000, 16000],
    UD: [7000, 13000],
    AGR: [6000, 11000],
  };

  let totalExpenditures = 0;

  for (const fy of financialYears) {
    for (const dept of createdDepartments) {
      const [min, max] = allocationBandsByDept[dept.code];
      const allocatedAmount = Math.round(randomBetween(min, max)) * 100000; // convert lakhs to rupees

      const budget = await Budget.create({
        financialYear: fy.label,
        department: dept._id,
        scheme: `${dept.name} Annual Plan ${fy.label}`,
        allocatedAmount,
        allocationDate: new Date(`${fy.startYear}-04-01`),
        quarter: 'Annual',
        notes: `Illustrative annual allocation for ${dept.name} (${fy.label}).`,
        createdBy: financeOfficer._id,
      });

      // Vary utilization: some depts under-utilize, some overspend, most normal
      const utilizationProfile = Math.random();
      let targetUtilization;
      if (utilizationProfile < 0.2) targetUtilization = randomBetween(0.15, 0.35); // under-utilized
      else if (utilizationProfile < 0.3) targetUtilization = randomBetween(1.02, 1.15); // overspent
      else targetUtilization = randomBetween(0.55, 0.92); // normal range

      const targetTotalSpend = allocatedAmount * targetUtilization;
      const numTransactions = Math.round(randomBetween(8, 20));
      let runningTotal = 0;

      for (let i = 0; i < numTransactions; i++) {
        const isLast = i === numTransactions - 1;
        let amount;
        if (isLast) {
          amount = Math.max(targetTotalSpend - runningTotal, 0);
        } else {
          amount = Math.round(randomBetween(0.02, 0.12) * targetTotalSpend);
        }
        // Occasionally inject a spike for anomaly detection demo
        if (!isLast && Math.random() < 0.06) {
          amount = Math.round(amount * randomBetween(3.5, 6));
        }
        runningTotal += amount;
        if (amount <= 0) continue;

        await Expenditure.create({
          budget: budget._id,
          department: dept._id,
          amountSpent: Math.round(amount),
          expenseCategory: categories[Math.floor(Math.random() * categories.length)],
          date: randomDateInFY(fy.startYear),
          description: `Expenditure entry #${i + 1} for ${dept.name} (${fy.label})`,
          recordedBy: Math.random() > 0.5 ? financeOfficer._id : departmentHeads.find((h) => String(h.department) === String(dept._id))._id,
          status: 'Approved',
        });
        totalExpenditures++;
      }
    }
  }

  console.log('Creating default anomaly-detection threshold settings...');
  await Setting.create({ key: 'anomaly-thresholds' });

  console.log('Running initial anomaly scan to seed alerts...');
  const { runAnomalyScan } = require('../utils/anomalyDetection');
  const alertsCreated = await runAnomalyScan();

  console.log('Seeding audit trail entries...');
  await AuditLog.create({
    user: admin._id,
    action: 'SEED_DATABASE',
    entityType: 'System',
    details: { departments: createdDepartments.length, financialYears: financialYears.length, expenditures: totalExpenditures },
  });

  console.log('----------------------------------------------------');
  console.log('Seed complete.');
  console.log(`Departments: ${createdDepartments.length}`);
  console.log(`Budgets: ${createdDepartments.length * financialYears.length}`);
  console.log(`Expenditures: ${totalExpenditures}`);
  console.log(`Alerts generated: ${alertsCreated}`);
  console.log('----------------------------------------------------');
  console.log('Login credentials:');
  console.log('  Admin           -> admin@budgetmonitor.gov.in / Admin@123');
  console.log('  Finance Officer -> finance.officer@budgetmonitor.gov.in / Finance@123');
  console.log('  Dept Head (e.g) -> rd.head@budgetmonitor.gov.in / Head@123');
  console.log('----------------------------------------------------');

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
