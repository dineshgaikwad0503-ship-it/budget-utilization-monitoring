import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  submitted = false;
  form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });

  submit() {
    if (this.form.invalid) return;
    // Demo flow: no backend email dispatch is wired up in this build.
    this.submitted = true;
  }
}
