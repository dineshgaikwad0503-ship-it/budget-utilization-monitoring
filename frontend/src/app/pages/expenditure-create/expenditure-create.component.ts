import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ExpenditureService } from '../../services/expenditure.service';
import { BudgetService, Budget } from '../../services/budget.service';

@Component({
  selector: 'app-expenditure-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './expenditure-create.component.html',
  styleUrls: ['./expenditure-create.component.css'],
})
export class ExpenditureCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  budgets: Budget[] = [];
  errorMessage = '';
  categories = ['Salaries', 'Infrastructure', 'Equipment', 'Travel', 'Utilities', 'Consulting', 'Training', 'Miscellaneous'];

  form = this.fb.group({
    budget: ['', Validators.required],
    amountSpent: [null, [Validators.required, Validators.min(1)]],
    expenseCategory: ['Miscellaneous', Validators.required],
    date: [new Date().toISOString().substring(0, 10), Validators.required],
    description: [''],
  });

  constructor(private expService: ExpenditureService, private budgetService: BudgetService, private router: Router) {}

  ngOnInit() {
    this.budgetService.getAll().subscribe((data) => (this.budgets = data));
  }

  submit() {
    if (this.form.invalid) return;
    this.expService.create(this.form.value).subscribe({
      next: (e) => this.router.navigate(['/expenditures', e._id]),
      error: (err) => (this.errorMessage = err.error?.message || 'Failed to record expenditure'),
    });
  }
}
