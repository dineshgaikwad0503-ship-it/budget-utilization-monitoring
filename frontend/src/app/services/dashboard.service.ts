import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface DashboardSummary {
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
  utilizationRate: number;
  activeAlerts: number;
  totalBudgets: number;
  totalDepartments: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private base = `${environment.apiBaseUrl}/dashboard`;
  constructor(private http: HttpClient) {}

  getSummary() { return this.http.get<DashboardSummary>(`${this.base}/summary`); }
  getDepartmentUtilization() { return this.http.get<any[]>(`${this.base}/department-utilization`); }
  getExpenditureTrend() { return this.http.get<any[]>(`${this.base}/expenditure-trend`); }
  getCategoryBreakdown() { return this.http.get<any[]>(`${this.base}/category-breakdown`); }
}
