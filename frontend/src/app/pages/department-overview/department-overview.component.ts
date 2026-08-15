import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-department-overview',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './department-overview.component.html',
  styleUrls: ['./department-overview.component.css'],
})
export class DepartmentOverviewComponent implements OnInit {
  deptData: any[] = [];
  loading = true;

  chartData: ChartData<'bar'> = { labels: [], datasets: [
    { data: [], label: 'Allocated', backgroundColor: '#34c9f0' },
    { data: [], label: 'Spent', backgroundColor: '#2fe6a8' },
  ] };
  chartOptions: ChartConfiguration['options'] = { responsive: true, plugins: { legend: { display: true } } };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getDepartmentUtilization().subscribe((data) => {
      this.deptData = data;
      this.loading = false;
      this.chartData = {
        labels: data.map((d) => d.department),
        datasets: [
          { data: data.map((d) => d.allocated), label: 'Allocated', backgroundColor: '#34c9f0' },
          { data: data.map((d) => d.spent), label: 'Spent', backgroundColor: '#2fe6a8' },
        ],
      };
    });
  }
}
