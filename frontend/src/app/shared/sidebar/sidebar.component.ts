import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface NavLink { path: string; label: string; icon: string; roles: string[]; exact?: boolean; }
interface NavGroup { title: string; links: NavLink[]; }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  constructor(public auth: AuthService) {}

  allRoles = ['Admin', 'FinanceOfficer', 'DepartmentHead'];
  financeRoles = ['Admin', 'FinanceOfficer'];
  adminOnly = ['Admin'];

  groups: NavGroup[] = [
    {
      title: 'Overview',
      links: [
        { path: '/dashboard', label: 'Dashboard', icon: '▦', roles: this.allRoles, exact: true },
        { path: '/executive-summary', label: 'Executive Summary', icon: '★', roles: this.allRoles },
        { path: '/department-overview', label: 'Department Overview', icon: '◫', roles: this.allRoles },
      ],
    },
    {
      title: 'Financial Management',
      links: [
        { path: '/budgets', label: 'Budget Management', icon: '₹', roles: this.allRoles, exact: true },
        { path: '/budgets/comparison', label: 'Budget Comparison', icon: '⇄', roles: this.allRoles },
        { path: '/expenditures', label: 'Expenditure Tracking', icon: '⎘', roles: this.allRoles, exact: true },
        { path: '/expenditures/bulk-upload', label: 'Bulk Upload', icon: '⇧', roles: this.allRoles },
        { path: '/departments', label: 'Departments', icon: '🏢', roles: this.allRoles },
      ],
    },
    {
      title: 'Monitoring',
      links: [
        { path: '/alerts', label: 'Alerts', icon: '⚠', roles: this.allRoles, exact: true },
        { path: '/alerts/archive', label: 'Resolved Archive', icon: '🗄', roles: this.allRoles },
        { path: '/alerts/rules', label: 'Alert Rules', icon: '⚙', roles: this.financeRoles },
      ],
    },
    {
      title: 'Reports & Insights',
      links: [
        { path: '/reports', label: 'Reports Hub', icon: '▤', roles: this.allRoles, exact: true },
        { path: '/reports/department-summary', label: 'Department Summary', icon: '▤', roles: this.allRoles },
        { path: '/reports/utilization-trend', label: 'Utilization Trend', icon: '📈', roles: this.allRoles },
        { path: '/reports/builder', label: 'Report Builder', icon: '🛠', roles: this.allRoles },
      ],
    },
    {
      title: 'Administration',
      links: [
        { path: '/admin', label: 'Admin Panel', icon: '⚙', roles: this.adminOnly, exact: true },
        { path: '/admin/users', label: 'Users', icon: '👤', roles: this.financeRoles },
        { path: '/admin/roles', label: 'Roles & Permissions', icon: '🔑', roles: this.adminOnly },
        { path: '/admin/settings', label: 'System Settings', icon: '🛡', roles: this.adminOnly },
        { path: '/audit-logs', label: 'Audit Logs', icon: '☰', roles: this.adminOnly },
      ],
    },
    {
      title: 'Support',
      links: [
        { path: '/help', label: 'Help & FAQs', icon: '?', roles: this.allRoles },
      ],
    },
  ];

  visibleGroups(): NavGroup[] {
    const role = this.auth.currentUser()?.role;
    return this.groups
      .map((g) => ({ ...g, links: g.links.filter((l) => !role || l.roles.includes(role)) }))
      .filter((g) => g.links.length > 0);
  }
}
