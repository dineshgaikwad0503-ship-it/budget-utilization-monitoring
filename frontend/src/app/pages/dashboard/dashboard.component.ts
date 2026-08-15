import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { DashboardService, DashboardSummary } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;
  loading = true;

  utilizationChartData: ChartData<'bar'> = { labels: [], datasets: [{ data: [], label: 'Utilization %', backgroundColor: '#2f7f5f' }] };
  utilizationChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, max: 150, title: { display: true, text: '% Utilized' } } },
  };

  trendChartData: ChartData<'line'> = { labels: [], datasets: [{ data: [], label: 'Monthly Expenditure (₹)', borderColor: '#0b2545', backgroundColor: 'rgba(11,37,69,0.08)', fill: true, tension: 0.35 }] };
  trendChartOptions: ChartConfiguration['options'] = { responsive: true, plugins: { legend: { display: false } } };

  categoryChartData: ChartData<'doughnut'> = { labels: [], datasets: [{ data: [], backgroundColor: ['#0b2545', '#2f7f5f', '#c88a1a', '#b83232', '#3fae87', '#5c6b7a', '#7a3fae', '#3f9dae'] }] };
  categoryChartOptions: ChartConfiguration['options'] = { responsive: true };

  constructor(private dashboardService: DashboardService, public auth: AuthService) {}

  ngOnInit() {
    this.dashboardService.getSummary().subscribe({
      next: (data) => { this.summary = data; this.loading = false; },
      error: () => { this.loading = false; },
    });

    this.dashboardService.getDepartmentUtilization().subscribe((data) => {
      this.utilizationChartData = {
        labels: data.map((d) => d.department),
        datasets: [{ data: data.map((d) => d.utilizationRate), label: 'Utilization %', backgroundColor: '#2f7f5f' }],
      };
    });

    this.dashboardService.getExpenditureTrend().subscribe((data) => {
      this.trendChartData = {
        labels: data.map((d) => d.label),
        datasets: [{ data: data.map((d) => d.total), label: 'Monthly Expenditure (₹)', borderColor: '#0b2545', backgroundColor: 'rgba(11,37,69,0.08)', fill: true, tension: 0.35 }],
      };
    });

    this.dashboardService.getCategoryBreakdown().subscribe((data) => {
      this.categoryChartData = {
        labels: data.map((d) => d.category),
        datasets: [{ data: data.map((d) => d.total), backgroundColor: ['#0b2545', '#2f7f5f', '#c88a1a', '#b83232', '#3fae87', '#5c6b7a', '#7a3fae', '#3f9dae'] }],
      };
    });
  }

  formatCurrency(value: number | undefined): string {
    if (value === undefined) return '₹0';
    return '₹' + Math.round(value).toLocaleString('en-IN');
  }
}
