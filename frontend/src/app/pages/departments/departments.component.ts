import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DepartmentService, Department } from '../../services/department.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css'],
})
export class DepartmentsComponent implements OnInit {
  departments: Department[] = [];
  loading = true;

  constructor(private deptService: DepartmentService, public auth: AuthService) {}

  ngOnInit() {
    this.deptService.getAll().subscribe({
      next: (data) => { this.departments = data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }
}
