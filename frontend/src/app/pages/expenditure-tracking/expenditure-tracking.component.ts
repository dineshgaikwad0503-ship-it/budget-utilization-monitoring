import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpenditureService, Expenditure } from '../../services/expenditure.service';
import { BudgetService, Budget } from '../../services/budget.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-expenditure-tracking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expenditure-tracking.component.html',
  styleUrls: ['./expenditure-tracking.component.css'],
})
export class ExpenditureTrackingComponent implements OnInit {
  private fb = inject(FormBuilder);
  expenditures: Expenditure[] = [];
  budgets: Budget[] = [];
  showForm = false;
  loading = true;
  errorMessage = '';
  categories = ['Salaries', 'Infrastructure', 'Equipment', 'Travel', 'Utilities', 'Consulting', 'Training', 'Miscellaneous'];

  form = this.fb.group({
    budget: ['', Validators.required],
    amountSpent: [null, [Validators.required, Validators.min(1)]],
    expenseCategory: ['Miscellaneous', Validators.required],
    date: [new Date().toISOString().substring(0, 10), Validators.required],
    description: [''],
  });

  constructor(
    private expService: ExpenditureService,
    private budgetService: BudgetService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.load();
    this.budgetService.getAll().subscribe((data) => (this.budgets = data));
  }

  load() {
    this.loading = true;
    this.expService.getAll().subscribe({
      next: (data) => { this.expenditures = data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.errorMessage = '';
  }

  submit() {
    if (this.form.invalid) return;
    this.expService.create(this.form.value).subscribe({
      next: () => {
        this.form.reset({ expenseCategory: 'Miscellaneous', date: new Date().toISOString().substring(0, 10) });
        this.showForm = false;
        this.load();
      },
      error: (err) => (this.errorMessage = err.error?.message || 'Failed to record expenditure'),
    });
  }

  remove(id: string) {
    if (!confirm('Delete this expenditure record?')) return;
    this.expService.delete(id).subscribe(() => this.load());
  }

  statusBadge(status: string): string {
    if (status === 'Flagged') return 'badge-danger';
    if (status === 'Pending') return 'badge-warning';
    return 'badge-success';
  }
}
