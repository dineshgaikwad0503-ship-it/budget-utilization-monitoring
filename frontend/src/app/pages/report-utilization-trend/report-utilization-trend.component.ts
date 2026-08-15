import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-report-utilization-trend',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './report-utilization-trend.component.html',
  styleUrls: ['./report-utilization-trend.component.css'],
})
export class ReportUtilizationTrendComponent implements OnInit {
  trend: { label: string; total: number }[] = [];
  loading = true;
  chartData: ChartData<'line'> = { labels: [], datasets: [{ data: [], label: 'Monthly Expenditure (₹)', borderColor: '#2fe6a8', backgroundColor: 'rgba(47,230,168,0.1)', fill: true, tension: 0.35 }] };
  chartOptions: ChartConfiguration['options'] = { responsive: true, plugins: { legend: { display: false } } };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getExpenditureTrend().subscribe((data) => {
      this.trend = data;
      this.loading = false;
      this.chartData = {
        labels: data.map((d) => d.label),
        datasets: [{ data: data.map((d) => d.total), label: 'Monthly Expenditure (₹)', borderColor: '#2fe6a8', backgroundColor: 'rgba(47,230,168,0.1)', fill: true, tension: 0.35 }],
      };
    });
  }
}
