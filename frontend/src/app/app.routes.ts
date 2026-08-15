import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Public marketing
  { path: 'home', loadComponent: () => import('./pages/landing/landing.component').then((m) => m.LandingComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent) },
  { path: 'features', loadComponent: () => import('./pages/features/features.component').then((m) => m.FeaturesComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactComponent) },

  // Auth
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then((m) => m.RegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('./pages/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./pages/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent) },

  // Dashboard & summaries
  { path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent), canActivate: [authGuard] },
  { path: 'executive-summary', loadComponent: () => import('./pages/executive-summary/executive-summary.component').then((m) => m.ExecutiveSummaryComponent), canActivate: [authGuard] },
  { path: 'department-overview', loadComponent: () => import('./pages/department-overview/department-overview.component').then((m) => m.DepartmentOverviewComponent), canActivate: [authGuard] },

  // Budgets
  { path: 'budgets', loadComponent: () => import('./pages/budget-management/budget-management.component').then((m) => m.BudgetManagementComponent), canActivate: [authGuard] },
  { path: 'budgets/comparison', loadComponent: () => import('./pages/budget-comparison/budget-comparison.component').then((m) => m.BudgetComparisonComponent), canActivate: [authGuard] },
  { path: 'budgets/new', loadComponent: () => import('./pages/budget-create/budget-create.component').then((m) => m.BudgetCreateComponent), canActivate: [authGuard, roleGuard], data: { roles: ['Admin', 'FinanceOfficer'] } },
  { path: 'budgets/:id/edit', loadComponent: () => import('./pages/budget-edit/budget-edit.component').then((m) => m.BudgetEditComponent), canActivate: [authGuard, roleGuard], data: { roles: ['Admin', 'FinanceOfficer'] } },
  { path: 'budgets/:id', loadComponent: () => import('./pages/budget-detail/budget-detail.component').then((m) => m.BudgetDetailComponent), canActivate: [authGuard] },

  // Expenditures
  { path: 'expenditures', loadComponent: () => import('./pages/expenditure-tracking/expenditure-tracking.component').then((m) => m.ExpenditureTrackingComponent), canActivate: [authGuard] },
  { path: 'expenditures/bulk-upload', loadComponent: () => import('./pages/expenditure-bulk-upload/expenditure-bulk-upload.component').then((m) => m.ExpenditureBulkUploadComponent), canActivate: [authGuard] },
  { path: 'expenditures/new', loadComponent: () => import('./pages/expenditure-create/expenditure-create.component').then((m) => m.ExpenditureCreateComponent), canActivate: [authGuard] },
  { path: 'expenditures/:id/edit', loadComponent: () => import('./pages/expenditure-edit/expenditure-edit.component').then((m) => m.ExpenditureEditComponent), canActivate: [authGuard, roleGuard], data: { roles: ['Admin', 'FinanceOfficer'] } },
  { path: 'expenditures/:id', loadComponent: () => import('./pages/expenditure-detail/expenditure-detail.component').then((m) => m.ExpenditureDetailComponent), canActivate: [authGuard] },

  // Alerts
  { path: 'alerts', loadComponent: () => import('./pages/alerts/alerts.component').then((m) => m.AlertsComponent), canActivate: [authGuard] },
  { path: 'alerts/rules', loadComponent: () => import('./pages/alert-rules/alert-rules.component').then((m) => m.AlertRulesComponent), canActivate: [authGuard, roleGuard], data: { roles: ['Admin', 'FinanceOfficer'] } },
  { path: 'alerts/archive', loadComponent: () => import('./pages/alerts-archive/alerts-archive.component').then((m) => m.AlertsArchiveComponent), canActivate: [authGuard] },
  { path: 'alerts/:id', loadComponent: () => import('./pages/alert-detail/alert-detail.component').then((m) => m.AlertDetailComponent), canActivate: [authGuard] },

  // Departments
  { path: 'departments', loadComponent: () => import('./pages/departments/departments.component').then((m) => m.DepartmentsComponent), canActivate: [authGuard] },
  { path: 'departments/new', loadComponent: () => import('./pages/department-create/department-create.component').then((m) => m.DepartmentCreateComponent), canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },
  { path: 'departments/:id/edit', loadComponent: () => import('./pages/department-edit/department-edit.component').then((m) => m.DepartmentEditComponent), canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },
  { path: 'departments/:id', loadComponent: () => import('./pages/department-detail/department-detail.component').then((m) => m.DepartmentDetailComponent), canActivate: [authGuard] },

  // Reports
  { path: 'reports', loadComponent: () => import('./pages/reports/reports.component').then((m) => m.ReportsComponent), canActivate: [authGuard] },
  { path: 'reports/department-summary', loadComponent: () => import('./pages/report-department-summary/report-department-summary.component').then((m) => m.ReportDepartmentSummaryComponent), canActivate: [authGuard] },
  { path: 'reports/utilization-trend', loadComponent: () => import('./pages/report-utilization-trend/report-utilization-trend.component').then((m) => m.ReportUtilizationTrendComponent), canActivate: [authGuard] },
  { path: 'reports/builder', loadComponent: () => import('./pages/report-builder/report-builder.component').then((m) => m.ReportBuilderComponent), canActivate: [authGuard] },

  // Admin
  { path: 'admin', loadComponent: () => import('./pages/admin-panel/admin-panel.component').then((m) => m.AdminPanelComponent), canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },
  { path: 'admin/users', loadComponent: () => import('./pages/users/users.component').then((m) => m.UsersComponent), canActivate: [authGuard, roleGuard], data: { roles: ['Admin', 'FinanceOfficer'] } },
  { path: 'admin/users/:id', loadComponent: () => import('./pages/user-detail/user-detail.component').then((m) => m.UserDetailComponent), canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },
  { path: 'admin/roles', loadComponent: () => import('./pages/roles-permissions/roles-permissions.component').then((m) => m.RolesPermissionsComponent), canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },
  { path: 'admin/settings', loadComponent: () => import('./pages/system-settings/system-settings.component').then((m) => m.SystemSettingsComponent), canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },

  // Audit
  { path: 'audit-logs', loadComponent: () => import('./pages/audit-logs/audit-logs.component').then((m) => m.AuditLogsComponent), canActivate: [authGuard, roleGuard], data: { roles: ['Admin'] } },

  // Account
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent), canActivate: [authGuard] },
  { path: 'notifications', loadComponent: () => import('./pages/notifications/notifications.component').then((m) => m.NotificationsComponent), canActivate: [authGuard] },
  { path: 'help', loadComponent: () => import('./pages/help/help.component').then((m) => m.HelpComponent), canActivate: [authGuard] },

  { path: '404', loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent) },
  { path: '**', redirectTo: '404' },
];
