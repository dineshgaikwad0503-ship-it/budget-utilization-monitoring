import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, AlertItem } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css'],
})
export class AlertsComponent implements OnInit {
  alerts: AlertItem[] = [];
  loading = true;
  scanning = false;
  filter: 'all' | 'active' | 'resolved' = 'active';

  constructor(private alertService: AlertService, public auth: AuthService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    const params = this.filter === 'all' ? {} : { isResolved: this.filter === 'resolved' };
    this.alertService.getAll(params).subscribe({
      next: (data) => { this.alerts = data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  setFilter(f: 'all' | 'active' | 'resolved') {
    this.filter = f;
    this.load();
  }

  resolve(id: string) {
    this.alertService.resolve(id).subscribe(() => this.load());
  }

  runScan() {
    this.scanning = true;
    this.alertService.triggerScan().subscribe({
      next: () => { this.scanning = false; this.load(); },
      error: () => { this.scanning = false; },
    });
  }

  severityBadge(sev: string): string {
    if (sev === 'Critical' || sev === 'High') return 'badge-danger';
    if (sev === 'Medium') return 'badge-warning';
    return 'badge-info';
  }

  canManage(): boolean {
    return this.auth.hasRole('Admin', 'FinanceOfficer');
  }
}
