import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService, DashboardSummary } from '../../services/dashboard.service';

@Component({
  selector: 'app-executive-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './executive-summary.component.html',
  styleUrls: ['./executive-summary.component.css'],
})
export class ExecutiveSummaryComponent implements OnInit {
  summary: DashboardSummary | null = null;
  deptData: any[] = [];
  loading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getSummary().subscribe((s) => (this.summary = s));
    this.dashboardService.getDepartmentUtilization().subscribe((d) => {
      this.deptData = d.sort((a, b) => b.allocated - a.allocated);
      this.loading = false;
    });
  }

  formatCurrency(value: number | undefined): string {
    if (value === undefined) return '₹0';
    return '₹' + Math.round(value).toLocaleString('en-IN');
  }

  statusOf(rate: number): { label: string; cls: string } {
    if (rate > 100) return { label: 'Overspent', cls: 'badge-danger' };
    if (rate < 40) return { label: 'Under-utilized', cls: 'badge-warning' };
    return { label: 'On Track', cls: 'badge-success' };
  }
}
