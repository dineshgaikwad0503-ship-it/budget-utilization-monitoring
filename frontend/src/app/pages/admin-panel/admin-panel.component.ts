import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { DepartmentService, Department } from '../../services/department.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  private fb = inject(FormBuilder);
  users: any[] = [];
  departments: Department[] = [];
  showDeptForm = false;
  loading = true;

  deptForm = this.fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
    description: [''],
  });

  constructor(private userService: UserService, private deptService: DepartmentService) {}

  ngOnInit() {
    this.loadUsers();
    this.loadDepartments();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: (data) => { this.users = data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  loadDepartments() {
    this.deptService.getAll().subscribe((data) => (this.departments = data));
  }

  toggleActive(user: any) {
    this.userService.update(user._id, { isActive: !user.isActive }).subscribe(() => this.loadUsers());
  }

  changeRole(user: any, role: string) {
    this.userService.update(user._id, { role }).subscribe(() => this.loadUsers());
  }

  toggleDeptForm() {
    this.showDeptForm = !this.showDeptForm;
  }

  submitDept() {
    if (this.deptForm.invalid) return;
    this.deptService.create(this.deptForm.value as any).subscribe(() => {
      this.deptForm.reset();
      this.showDeptForm = false;
      this.loadDepartments();
    });
  }
}
