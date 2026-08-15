import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BudgetService, Budget } from '../../services/budget.service';
import { DepartmentService, Department } from '../../services/department.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-budget-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './budget-management.component.html',
  styleUrls: ['./budget-management.component.css'],
})
export class BudgetManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  budgets: Budget[] = [];
  departments: Department[] = [];
  showForm = false;
  loading = true;
  errorMessage = '';

  form = this.fb.group({
    financialYear: ['2025-2026', Validators.required],
    department: ['', Validators.required],
    scheme: ['', Validators.required],
    allocatedAmount: [null, [Validators.required, Validators.min(1)]],
    quarter: ['Annual', Validators.required],
    notes: [''],
  });

  constructor(
    private budgetService: BudgetService,
    private deptService: DepartmentService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loadBudgets();
    this.deptService.getAll().subscribe((data) => (this.departments = data));
  }

  loadBudgets() {
    this.loading = true;
    this.budgetService.getAll().subscribe({
      next: (data) => { this.budgets = data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  canManage(): boolean {
    return this.auth.hasRole('Admin', 'FinanceOfficer');
  }

  toggleForm() {
    this.showForm = !this.showForm;
    this.errorMessage = '';
  }

  submit() {
    if (this.form.invalid) return;
    this.budgetService.create(this.form.value as any).subscribe({
      next: () => {
        this.form.reset({ financialYear: '2025-2026', quarter: 'Annual' });
        this.showForm = false;
        this.loadBudgets();
      },
      error: (err) => (this.errorMessage = err.error?.message || 'Failed to create budget'),
    });
  }

  deactivate(id: string) {
    if (!confirm('Deactivate this budget allocation?')) return;
    this.budgetService.delete(id).subscribe(() => this.loadBudgets());
  }

  utilBadgeClass(rate: number | undefined): string {
    if (rate === undefined) return 'badge-info';
    if (rate > 100) return 'badge-danger';
    if (rate < 40) return 'badge-warning';
    return 'badge-success';
  }
}
