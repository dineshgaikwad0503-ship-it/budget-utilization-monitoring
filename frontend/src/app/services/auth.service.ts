import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'FinanceOfficer' | 'DepartmentHead';
  department?: { _id: string; name: string; code: string } | string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'bums_token';
  private readonly USER_KEY = 'bums_user';
  currentUser = signal<AuthUser | null>(this.loadUser());

  constructor(private http: HttpClient, private router: Router) {}

  private loadUser(): AuthUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  login(email: string, password: string): Observable<{ token: string; user: AuthUser }> {
    return this.http.post<{ token: string; user: AuthUser }>(`${environment.apiBaseUrl}/auth/login`, { email, password }).pipe(
      tap((res) => this.setSession(res.token, res.user))
    );
  }

  register(payload: { name: string; email: string; password: string; role?: string }) {
    return this.http.post<{ token: string; user: AuthUser }>(`${environment.apiBaseUrl}/auth/register`, payload).pipe(
      tap((res) => this.setSession(res.token, res.user))
    );
  }

  setSession(token: string, user: AuthUser) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(...roles: string[]): boolean {
    const user = this.currentUser();
    return !!user && roles.includes(user.role);
  }
}
