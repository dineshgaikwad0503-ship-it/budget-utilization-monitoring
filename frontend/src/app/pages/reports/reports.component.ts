import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService, Budget } from '../../services/budget.service';
import { ExpenditureService, Expenditure } from '../../services/expenditure.service';
import { ReportService } from '../../services/report.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {
  budgets: Budget[] = [];
  expenditures: Expenditure[] = [];
  loading = true;
  downloadingBudgetPdf = false;
  downloadingExpPdf = false;

  constructor(private budgetService: BudgetService, private expService: ExpenditureService, private reportService: ReportService) {}

  ngOnInit() {
    this.budgetService.getAll().subscribe((data) => (this.budgets = data));
    this.expService.getAll().subscribe((data) => {
      this.expenditures = data;
      this.loading = false;
    });
  }

  exportBudgetsCsv() {
    const header = ['Scheme', 'Department', 'Financial Year', 'Allocated', 'Utilized', 'Utilization %', 'Remaining'];
    const rows = this.budgets.map((b) => [
      b.scheme,
      b.department?.name,
      b.financialYear,
      b.allocatedAmount,
      b.utilizedAmount,
      b.utilizationRate,
      b.remainingAmount,
    ]);
    this.downloadCsv('budget-utilization-report.csv', header, rows);
  }

  exportExpendituresCsv() {
    const header = ['Date', 'Scheme', 'Department', 'Category', 'Amount', 'Status'];
    const rows = this.expenditures.map((e) => [
      new Date(e.date).toLocaleDateString('en-IN'),
      e.budget?.scheme,
      e.department?.name,
      e.expenseCategory,
      e.amountSpent,
      e.status,
    ]);
    this.downloadCsv('expenditure-report.csv', header, rows);
  }

  private downloadCsv(filename: string, header: string[], rows: any[][]) {
    const csvContent = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  downloadBudgetPdf() {
    this.downloadingBudgetPdf = true;
    this.reportService.downloadBudgetPdf().subscribe({
      next: (blob) => { ReportService.triggerDownload(blob, 'budget-utilization-report.pdf'); this.downloadingBudgetPdf = false; },
      error: () => { this.downloadingBudgetPdf = false; },
    });
  }

  downloadExpenditurePdf() {
    this.downloadingExpPdf = true;
    this.reportService.downloadExpenditurePdf().subscribe({
      next: (blob) => { ReportService.triggerDownload(blob, 'expenditure-report.pdf'); this.downloadingExpPdf = false; },
      error: () => { this.downloadingExpPdf = false; },
    });
  }
}
