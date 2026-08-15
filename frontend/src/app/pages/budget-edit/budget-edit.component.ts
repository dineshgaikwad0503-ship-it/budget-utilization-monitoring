import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BudgetService } from '../../services/budget.service';
import { DepartmentService, Department } from '../../services/department.service';

@Component({
  selector: 'app-budget-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './budget-edit.component.html',
  styleUrls: ['./budget-edit.component.css'],
})
export class BudgetEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  departments: Department[] = [];
  errorMessage = '';
  budgetId = '';
  loading = true;

  form = this.fb.group({
    financialYear: ['', Validators.required],
    department: ['', Validators.required],
    scheme: ['', Validators.required],
    allocatedAmount: [null, [Validators.required, Validators.min(1)]],
    quarter: ['Annual', Validators.required],
    notes: [''],
  });

  constructor(
    private route: ActivatedRoute,
    private budgetService: BudgetService,
    private deptService: DepartmentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.budgetId = this.route.snapshot.paramMap.get('id')!;
    this.deptService.getAll().subscribe((data) => (this.departments = data));
    this.budgetService.getOne(this.budgetId).subscribe((b) => {
      this.form.patchValue({
        financialYear: b.financialYear,
        department: typeof b.department === 'object' ? b.department._id : b.department,
        scheme: b.scheme,
        allocatedAmount: b.allocatedAmount as any,
        quarter: b.quarter,
        notes: b.notes,
      });
      this.loading = false;
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.budgetService.update(this.budgetId, this.form.value as any).subscribe({
      next: () => this.router.navigate(['/budgets', this.budgetId]),
      error: (err) => (this.errorMessage = err.error?.message || 'Failed to update budget'),
    });
  }
}
