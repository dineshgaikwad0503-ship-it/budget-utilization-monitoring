import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = `${environment.apiBaseUrl}/users`;
  constructor(private http: HttpClient) {}

  getAll() { return this.http.get<any[]>(this.base); }
  getOne(id: string) { return this.http.get<any>(`${this.base}/${id}`); }
  update(id: string, payload: any) { return this.http.put(`${this.base}/${id}`, payload); }
  delete(id: string) { return this.http.delete(`${this.base}/${id}`); }
}
