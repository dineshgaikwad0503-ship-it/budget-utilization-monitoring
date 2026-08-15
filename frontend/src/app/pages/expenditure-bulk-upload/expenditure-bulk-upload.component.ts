import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenditureService } from '../../services/expenditure.service';
import { BudgetService, Budget } from '../../services/budget.service';

interface ParsedRow {
  budgetId: string;
  amountSpent: number;
  expenseCategory: string;
  date: string;
  description: string;
  valid: boolean;
  error?: string;
}

@Component({
  selector: 'app-expenditure-bulk-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expenditure-bulk-upload.component.html',
  styleUrls: ['./expenditure-bulk-upload.component.css'],
})
export class ExpenditureBulkUploadComponent implements OnInit {
  budgets: Budget[] = [];
  rows: ParsedRow[] = [];
  fileName = '';
  submitting = false;
  resultMessage = '';

  constructor(private expService: ExpenditureService, private budgetService: BudgetService) {}

  ngOnInit() {
    this.budgetService.getAll().subscribe((data) => (this.budgets = data));
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.fileName = file.name;
    const reader = new FileReader();
    reader.onload = () => this.parseCsv(String(reader.result));
    reader.readAsText(file);
  }

  private parseCsv(text: string) {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;
    const dataLines = lines[0].toLowerCase().includes('budgetid') ? lines.slice(1) : lines;

    this.rows = dataLines.map((line) => {
      const [budgetId, amountSpent, expenseCategory, date, ...descParts] = line.split(',').map((c) => c.trim());
      const amount = Number(amountSpent);
      const budgetExists = this.budgets.some((b) => b._id === budgetId);
      let error;
      if (!budgetId || !budgetExists) error = 'Unknown budgetId';
      else if (!amount || amount <= 0) error = 'Invalid amount';
      return {
        budgetId,
        amountSpent: amount,
        expenseCategory: expenseCategory || 'Miscellaneous',
        date: date || new Date().toISOString().substring(0, 10),
        description: descParts.join(',') || '',
        valid: !error,
        error,
      };
    });
  }

  get validRows() {
    return this.rows.filter((r) => r.valid);
  }

  submitAll() {
    if (this.validRows.length === 0) return;
    this.submitting = true;
    let completed = 0;
    const total = this.validRows.length;
    this.validRows.forEach((row) => {
      this.expService
        .create({
          budget: row.budgetId,
          amountSpent: row.amountSpent,
          expenseCategory: row.expenseCategory,
          date: row.date,
          description: row.description,
        })
        .subscribe({
          next: () => {
            completed++;
            if (completed === total) this.finish(total);
          },
          error: () => {
            completed++;
            if (completed === total) this.finish(total);
          },
        });
    });
  }

  private finish(total: number) {
    this.submitting = false;
    this.resultMessage = `Submitted ${total} expenditure record(s).`;
    this.rows = [];
    this.fileName = '';
  }
}
