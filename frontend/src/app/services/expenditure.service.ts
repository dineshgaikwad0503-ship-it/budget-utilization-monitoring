import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Expenditure {
  _id: string;
  budget: any;
  department: any;
  amountSpent: number;
  expenseCategory: string;
  date: string;
  description?: string;
  status: string;
  recordedBy?: any;
}

@Injectable({ providedIn: 'root' })
export class ExpenditureService {
  private base = `${environment.apiBaseUrl}/expenditures`;
  constructor(private http: HttpClient) {}

  getAll(filters: { budget?: string; department?: string } = {}) {
    let params = new HttpParams();
    if (filters.budget) params = params.set('budget', filters.budget);
    if (filters.department) params = params.set('department', filters.department);
    return this.http.get<Expenditure[]>(this.base, { params });
  }
  getOne(id: string) { return this.http.get<Expenditure>(`${this.base}/${id}`); }
  create(payload: any) { return this.http.post<Expenditure>(this.base, payload); }
  update(id: string, payload: Partial<Expenditure>) { return this.http.put<Expenditure>(`${this.base}/${id}`, payload); }
  delete(id: string) { return this.http.delete(`${this.base}/${id}`); }
}
