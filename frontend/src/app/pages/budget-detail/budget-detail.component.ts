import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BudgetService, Budget } from '../../services/budget.service';
import { ExpenditureService, Expenditure } from '../../services/expenditure.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-budget-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './budget-detail.component.html',
  styleUrls: ['./budget-detail.component.css'],
})
export class BudgetDetailComponent implements OnInit {
  budget: Budget | null = null;
  expenditures: Expenditure[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private budgetService: BudgetService,
    private expService: ExpenditureService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.budgetService.getOne(id).subscribe((b) => {
      this.budget = b;
      this.loading = false;
    });
    this.expService.getAll({ budget: id }).subscribe((e) => (this.expenditures = e));
  }

  utilBadge(): string {
    const rate = this.budget?.utilizationRate ?? 0;
    if (rate > 100) return 'badge-danger';
    if (rate < 40) return 'badge-warning';
    return 'badge-success';
  }
}
