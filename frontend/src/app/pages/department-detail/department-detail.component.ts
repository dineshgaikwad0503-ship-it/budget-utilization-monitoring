import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DepartmentService, Department } from '../../services/department.service';
import { BudgetService, Budget } from '../../services/budget.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-department-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './department-detail.component.html',
  styleUrls: ['./department-detail.component.css'],
})
export class DepartmentDetailComponent implements OnInit {
  department: Department | null = null;
  budgets: Budget[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private deptService: DepartmentService,
    private budgetService: BudgetService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.deptService.getOne(id).subscribe({
      next: (d) => { this.department = d; this.loading = false; },
      error: () => { this.loading = false; },
    });
    this.budgetService.getAll({ department: id }).subscribe((b) => (this.budgets = b));
  }
}
