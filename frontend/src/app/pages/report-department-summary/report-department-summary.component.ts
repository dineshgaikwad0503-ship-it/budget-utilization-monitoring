import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-report-department-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-department-summary.component.html',
  styleUrls: ['./report-department-summary.component.css'],
})
export class ReportDepartmentSummaryComponent implements OnInit {
  deptData: any[] = [];
  loading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getDepartmentUtilization().subscribe((data) => {
      this.deptData = data;
      this.loading = false;
    });
  }

  exportCsv() {
    const header = ['Department', 'Allocated', 'Spent', 'Utilization %'];
    const rows = this.deptData.map((d) => [d.department, d.allocated, d.spent, d.utilizationRate]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'department-summary-report.csv'; a.click();
    URL.revokeObjectURL(url);
  }
}
