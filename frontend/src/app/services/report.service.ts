import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private base = `${environment.apiBaseUrl}/reports`;
  constructor(private http: HttpClient) {}

  downloadBudgetPdf(filters: { department?: string; financialYear?: string } = {}) {
    let params = new HttpParams();
    if (filters.department) params = params.set('department', filters.department);
    if (filters.financialYear) params = params.set('financialYear', filters.financialYear);
    return this.http.get(`${this.base}/budget-pdf`, { params, responseType: 'blob' });
  }

  downloadExpenditurePdf(filters: { budget?: string; department?: string } = {}) {
    let params = new HttpParams();
    if (filters.budget) params = params.set('budget', filters.budget);
    if (filters.department) params = params.set('department', filters.department);
    return this.http.get(`${this.base}/expenditure-pdf`, { params, responseType: 'blob' });
  }

  static triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
