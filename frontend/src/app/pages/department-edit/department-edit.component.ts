import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-department-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './department-edit.component.html',
  styleUrls: ['./department-edit.component.css'],
})
export class DepartmentEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  errorMessage = '';
  deptId = '';
  loading = true;

  form = this.fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    description: [''],
  });

  constructor(private route: ActivatedRoute, private deptService: DepartmentService, private router: Router) {}

  ngOnInit() {
    this.deptId = this.route.snapshot.paramMap.get('id')!;
    this.deptService.getOne(this.deptId).subscribe((d) => {
      this.form.patchValue({ name: d.name, code: d.code, description: d.description });
      this.loading = false;
    });
  }

  submit() {
    if (this.form.invalid) return;
    this.deptService.update(this.deptId, this.form.value as any).subscribe({
      next: () => this.router.navigate(['/departments', this.deptId]),
      error: (err) => (this.errorMessage = err.error?.message || 'Failed to update department'),
    });
  }
}
