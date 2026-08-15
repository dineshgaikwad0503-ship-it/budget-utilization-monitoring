import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DepartmentService, Department } from '../../services/department.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  loading = false;
  errorMessage = '';
  departments: Department[] = [];

  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['DepartmentHead', Validators.required],
    department: [''],
  });

  constructor(
    private auth: AuthService,
    private router: Router,
    private deptService: DepartmentService
  ) {}

  ngOnInit() {
    this.deptService.getAll().subscribe({
      next: (data) => (this.departments = data),
      error: () => {},
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    this.auth.register(this.form.value as any).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Registration failed.';
      },
    });
  }
}
