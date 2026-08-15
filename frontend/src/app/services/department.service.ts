import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Department {
  _id: string;
  name: string;
  code: string;
  description?: string;
  headOfDepartment?: any;
}

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private base = `${environment.apiBaseUrl}/departments`;
  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<Department[]>(this.base); }
  getOne(id: string) { return this.http.get<Department>(`${this.base}/${id}`); }
  create(payload: Partial<Department>) { return this.http.post<Department>(this.base, payload); }
  update(id: string, payload: Partial<Department>) { return this.http.put<Department>(`${this.base}/${id}`, payload); }
  delete(id: string) { return this.http.delete(`${this.base}/${id}`); }
}
