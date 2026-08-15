import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService, Budget } from '../../services/budget.service';

interface DeptRow {
  department: string;
  years: { [fy: string]: { allocated: number; utilized: number; rate: number } };
}

@Component({
  selector: 'app-budget-comparison',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budget-comparison.component.html',
  styleUrls: ['./budget-comparison.component.css'],
})
export class BudgetComparisonComponent implements OnInit {
  rows: DeptRow[] = [];
  financialYears: string[] = [];
  loading = true;

  constructor(private budgetService: BudgetService) {}

  ngOnInit() {
    this.budgetService.getAll().subscribe((budgets: Budget[]) => {
      const yearsSet = new Set<string>();
      const map = new Map<string, DeptRow>();

      for (const b of budgets) {
        const deptName = b.department?.name || 'Unassigned';
        yearsSet.add(b.financialYear);
        if (!map.has(deptName)) map.set(deptName, { department: deptName, years: {} });
        const row = map.get(deptName)!;
        row.years[b.financialYear] = {
          allocated: b.allocatedAmount,
          utilized: b.utilizedAmount || 0,
          rate: b.utilizationRate || 0,
        };
      }

      this.financialYears = Array.from(yearsSet).sort();
      this.rows = Array.from(map.values());
      this.loading = false;
    });
  }
}
