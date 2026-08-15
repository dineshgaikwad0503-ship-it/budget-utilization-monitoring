import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roles-permissions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.css', '../../shared/styles/info-grid.css'],
})
export class RolesPermissionsComponent {
  roles = [
    { tag: 'Admin', title: 'Full Access', body: 'Create/edit/deactivate budgets, manage departments and users, configure alert thresholds, view all audit logs.' },
    { tag: 'Finance', title: 'Finance Officer', body: 'Create/edit budgets and expenditures, resolve alerts, run detection scans, view all department data.' },
    { tag: 'Dept', title: 'Department Head', body: "View and record expenditures for their own department's budgets; view their department's alerts." },
  ];
}
