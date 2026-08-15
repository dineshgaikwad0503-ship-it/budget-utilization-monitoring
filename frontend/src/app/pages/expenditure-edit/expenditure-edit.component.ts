import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExpenditureService } from '../../services/expenditure.service';
import { BudgetService, Budget } from '../../services/budget.service';

@Component({
  selector: 'app-expenditure-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './expenditure-edit.component.html',
  styleUrls: ['./expenditure-edit.component.css'],
})
export class ExpenditureEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  budgets: Budget[] = [];
  errorMessage = '';
  expId = '';
  loading = true;
  categories = ['Salaries', 'Infrastructure', 'Equipment', 'Travel', 'Utilities', 'Consulting', 'Training', 'Miscellaneous'];

  form = this.fb.group({
    amountSpent: [null, [Validators.required, Validators.min(1)]],
    expenseCategory: ['Miscellaneous', Validators.required],
    date: ['', Validators.required],
    description: [''],
    status: ['Approved', Validators.required],
  });

  constructor(
    private route: ActivatedRoute,
    private expService: ExpenditureService,
    private budgetService: BudgetService,
    private router: Router
  ) {}

  ngOnInit() {
    this.expId = this.route.snapshot.paramMap.get('id')!;
    this.budgetService.getAll().subscribe((data) => (this.budgets = data));
    this.expService.getOne(this.expId).subscribe((e) => {
      this.form.patchValue({
        amountSpent: e.amountSpent as any,
        expenseCategory: e.expenseCategory,
        date: new Date(e.date).toISOString().substring(0, 10),
        description: e.description,
        status: e.status,
      });
      this.loading = false;
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.expService.update(this.expId, this.form.value as any).subscribe({
      next: () => this.router.navigate(['/expenditures', this.expId]),
      error: (err) => (this.errorMessage = err.error?.message || 'Failed to update expenditure'),
    });
  }
}
