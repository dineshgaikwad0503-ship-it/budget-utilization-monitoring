import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ExpenditureService, Expenditure } from '../../services/expenditure.service';
import { DepartmentService, Department } from '../../services/department.service';

@Component({
  selector: 'app-report-builder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './report-builder.component.html',
  styleUrls: ['./report-builder.component.css'],
})
export class ReportBuilderComponent implements OnInit {
  private fb = inject(FormBuilder);
  departments: Department[] = [];
  categories = ['Salaries', 'Infrastructure', 'Equipment', 'Travel', 'Utilities', 'Consulting', 'Training', 'Miscellaneous'];
  results: Expenditure[] = [];
  generated = false;

  form = this.fb.group({
    department: [''],
    category: [''],
  });

  constructor(private expService: ExpenditureService, private deptService: DepartmentService) {}

  ngOnInit() {
    this.deptService.getAll().subscribe((data) => (this.departments = data));
  }

  generate() {
    const { department, category } = this.form.value;
    this.expService.getAll({ department: department || undefined }).subscribe((data) => {
      this.results = category ? data.filter((e) => e.expenseCategory === category) : data;
      this.generated = true;
    });
  }

  exportCsv() {
    const header = ['Date', 'Scheme', 'Department', 'Category', 'Amount'];
    const rows = this.results.map((e) => [
      new Date(e.date).toLocaleDateString('en-IN'),
      e.budget?.scheme,
      e.department?.name,
      e.expenseCategory,
      e.amountSpent,
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'custom-report.csv'; a.click();
    URL.revokeObjectURL(url);
  }
}
