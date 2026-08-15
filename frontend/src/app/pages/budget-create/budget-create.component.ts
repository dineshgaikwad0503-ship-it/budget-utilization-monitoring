import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BudgetService } from '../../services/budget.service';
import { DepartmentService, Department } from '../../services/department.service';

@Component({
  selector: 'app-budget-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './budget-create.component.html',
  styleUrls: ['./budget-create.component.css'],
})
export class BudgetCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  departments: Department[] = [];
  errorMessage = '';

  form = this.fb.group({
    financialYear: ['2025-2026', Validators.required],
    department: ['', Validators.required],
    scheme: ['', Validators.required],
    allocatedAmount: [null, [Validators.required, Validators.min(1)]],
    quarter: ['Annual', Validators.required],
    notes: [''],
  });

  constructor(private budgetService: BudgetService, private deptService: DepartmentService, private router: Router) {}

  ngOnInit() {
    this.deptService.getAll().subscribe((data) => (this.departments = data));
  }

  submit() {
    if (this.form.invalid) return;
    this.budgetService.create(this.form.value as any).subscribe({
      next: (b) => this.router.navigate(['/budgets', b._id]),
      error: (err) => (this.errorMessage = err.error?.message || 'Failed to create budget'),
    });
  }
}
