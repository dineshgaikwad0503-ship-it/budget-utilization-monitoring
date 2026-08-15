import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  loading = false;
  errorMessage = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  demoAccounts = [
    { label: 'Admin', email: 'admin@budgetmonitor.gov.in', password: 'Admin@123' },
    { label: 'Finance Officer', email: 'finance.officer@budgetmonitor.gov.in', password: 'Finance@123' },
    { label: 'Dept Head (Rural Dev.)', email: 'rd.head@budgetmonitor.gov.in', password: 'Head@123' },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  fillDemo(acc: { email: string; password: string }) {
    this.form.patchValue({ email: acc.email, password: acc.password });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
      },
    });
  }
}
