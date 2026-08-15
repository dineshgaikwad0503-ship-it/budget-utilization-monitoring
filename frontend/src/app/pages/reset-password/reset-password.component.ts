import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  submitted = false;

  form = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  });

  constructor(private router: Router) {}

  submit() {
    if (this.form.invalid) return;
    if (this.form.value.password !== this.form.value.confirmPassword) return;
    this.submitted = true;
    setTimeout(() => this.router.navigate(['/login']), 1500);
  }
}
