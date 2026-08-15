import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Budget {
  _id: string;
  financialYear: string;
  department: any;
  scheme: string;
  allocatedAmount: number;
  allocationDate: string;
  quarter: string;
  notes?: string;
  utilizedAmount?: number;
  utilizationRate?: number;
  remainingAmount?: number;
}

@Injectable({ providedIn: 'root' })
export class BudgetService {
  private base = `${environment.apiBaseUrl}/budgets`;
  constructor(private http: HttpClient) {}

  getAll(filters: { department?: string; financialYear?: string } = {}) {
    let params = new HttpParams();
    if (filters.department) params = params.set('department', filters.department);
    if (filters.financialYear) params = params.set('financialYear', filters.financialYear);
    return this.http.get<Budget[]>(this.base, { params });
  }
  getOne(id: string) { return this.http.get<Budget>(`${this.base}/${id}`); }
  create(payload: Partial<Budget>) { return this.http.post<Budget>(this.base, payload); }
  update(id: string, payload: Partial<Budget>) { return this.http.put<Budget>(`${this.base}/${id}`, payload); }
  delete(id: string) { return this.http.delete(`${this.base}/${id}`); }
}
