import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-department-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './department-create.component.html',
  styleUrls: ['./department-create.component.css'],
})
export class DepartmentCreateComponent {
  private fb = inject(FormBuilder);
  errorMessage = '';

  form = this.fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    description: [''],
  });

  constructor(private deptService: DepartmentService, private router: Router) {}

  submit() {
    if (this.form.invalid) return;
    this.deptService.create(this.form.value as any).subscribe({
      next: (d) => this.router.navigate(['/departments', d._id]),
      error: (err) => (this.errorMessage = err.error?.message || 'Failed to create department'),
    });
  }
}
