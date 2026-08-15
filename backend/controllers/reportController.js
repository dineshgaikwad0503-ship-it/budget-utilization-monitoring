const PDFDocument = require('pdfkit');
const Budget = require('../models/Budget');
const Expenditure = require('../models/Expenditure');
const { attachUtilization } = require('./budgetController');

const addHeader = (doc, title, subtitle) => {
  doc.fontSize(18).fillColor('#0b2545').text('Budget Utilization Monitoring System', { align: 'left' });
  doc.fontSize(12).fillColor('#555').text(title, { align: 'left' });
  if (subtitle) doc.fontSize(9).fillColor('#888').text(subtitle);
  doc.moveDown(0.5);
  doc.strokeColor('#2f7f5f').lineWidth(1.5).moveTo(doc.x, doc.y).lineTo(560, doc.y).stroke();
  doc.moveDown(1);
};

const formatCurrency = (n) => '₹' + Math.round(n || 0).toLocaleString('en-IN');

// GET /api/reports/budget-pdf
const generateBudgetPdf = async (req, res) => {
  const filter = {};
  if (req.query.department) filter.department = req.query.department;
  if (req.query.financialYear) filter.financialYear = req.query.financialYear;

  const budgets = await Budget.find(filter).populate('department', 'name code').sort('-createdAt');
  const rows = await attachUtilization(budgets);

  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="budget-utilization-report.pdf"');
  doc.pipe(res);

  addHeader(doc, 'Budget Utilization Report', `Generated ${new Date().toLocaleString('en-IN')}`);

  const colX = [40, 190, 290, 370, 450];
  doc.fontSize(9).fillColor('#000');
  doc.text('Scheme', colX[0], doc.y, { continued: false });
  doc.text('Department', colX[1], doc.y - 12);
  doc.text('Allocated', colX[2], doc.y - 12);
  doc.text('Utilized', colX[3], doc.y - 12);
  doc.text('Util. %', colX[4], doc.y - 12);
  doc.moveDown(0.5);
  doc.strokeColor('#ccc').moveTo(40, doc.y).lineTo(560, doc.y).stroke();
  doc.moveDown(0.3);

  let totalAllocated = 0;
  let totalUtilized = 0;

  rows.forEach((b) => {
    if (doc.y > 760) { doc.addPage(); }
    const y = doc.y;
    doc.fontSize(8.5).fillColor('#222');
    doc.text(String(b.scheme).substring(0, 28), colX[0], y, { width: 145 });
    doc.text(b.department?.name || '-', colX[1], y, { width: 95 });
    doc.text(formatCurrency(b.allocatedAmount), colX[2], y, { width: 75 });
    doc.text(formatCurrency(b.utilizedAmount), colX[3], y, { width: 75 });
    doc.text(`${b.utilizationRate}%`, colX[4], y, { width: 60 });
    doc.moveDown(0.9);
    totalAllocated += b.allocatedAmount;
    totalUtilized += b.utilizedAmount;
  });

  doc.moveDown(0.5);
  doc.strokeColor('#0b2545').lineWidth(1).moveTo(40, doc.y).lineTo(560, doc.y).stroke();
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor('#0b2545').text(
    `Total Allocated: ${formatCurrency(totalAllocated)}    |    Total Utilized: ${formatCurrency(totalUtilized)}    |    Overall Utilization: ${totalAllocated ? ((totalUtilized / totalAllocated) * 100).toFixed(1) : 0}%`
  );

  doc.end();
};

// GET /api/reports/expenditure-pdf
const generateExpenditurePdf = async (req, res) => {
  const filter = {};
  if (req.query.budget) filter.budget = req.query.budget;
  if (req.query.department) filter.department = req.query.department;

  const expenditures = await Expenditure.find(filter)
    .populate('budget', 'scheme financialYear')
    .populate('department', 'name code')
    .sort('-date');

  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="expenditure-report.pdf"');
  doc.pipe(res);

  addHeader(doc, 'Expenditure Detail Report', `Generated ${new Date().toLocaleString('en-IN')}`);

  const colX = [40, 120, 260, 350, 430, 500];
  doc.fontSize(9).fillColor('#000');
  doc.text('Date', colX[0], doc.y);
  doc.text('Scheme', colX[1], doc.y - 12);
  doc.text('Department', colX[2], doc.y - 12);
  doc.text('Category', colX[3], doc.y - 12);
  doc.text('Amount', colX[4], doc.y - 12);
  doc.moveDown(0.5);
  doc.strokeColor('#ccc').moveTo(40, doc.y).lineTo(560, doc.y).stroke();
  doc.moveDown(0.3);

  let total = 0;
  expenditures.forEach((e) => {
    if (doc.y > 760) { doc.addPage(); }
    const y = doc.y;
    doc.fontSize(8.5).fillColor('#222');
    doc.text(new Date(e.date).toLocaleDateString('en-IN'), colX[0], y, { width: 75 });
    doc.text(String(e.budget?.scheme || '-').substring(0, 24), colX[1], y, { width: 135 });
    doc.text(e.department?.name || '-', colX[2], y, { width: 85 });
    doc.text(e.expenseCategory, colX[3], y, { width: 75 });
    doc.text(formatCurrency(e.amountSpent), colX[4], y, { width: 70 });
    doc.moveDown(0.9);
    total += e.amountSpent;
  });

  doc.moveDown(0.5);
  doc.strokeColor('#0b2545').lineWidth(1).moveTo(40, doc.y).lineTo(560, doc.y).stroke();
  doc.moveDown(0.5);
  doc.fontSize(10).fillColor('#0b2545').text(`Total Expenditure: ${formatCurrency(total)}   |   Transaction Count: ${expenditures.length}`);

  doc.end();
};

module.exports = { generateBudgetPdf, generateExpenditurePdf };
