import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface AlertItem {
  _id: string;
  department: any;
  budget?: any;
  alertType: string;
  severity: string;
  message: string;
  isResolved: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private base = `${environment.apiBaseUrl}/alerts`;
  constructor(private http: HttpClient) {}

  getAll(filters: { department?: string; isResolved?: boolean } = {}) {
    let params = new HttpParams();
    if (filters.department) params = params.set('department', filters.department);
    if (filters.isResolved !== undefined) params = params.set('isResolved', String(filters.isResolved));
    return this.http.get<AlertItem[]>(this.base, { params });
  }
  getOne(id: string) { return this.http.get<AlertItem>(`${this.base}/${id}`); }
  resolve(id: string) { return this.http.put<AlertItem>(`${this.base}/${id}/resolve`, {}); }
  triggerScan() { return this.http.post<{ message: string }>(`${this.base}/scan`, {}); }
}
