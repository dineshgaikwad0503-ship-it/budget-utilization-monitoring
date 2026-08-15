import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService, AlertItem } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-alert-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './alert-detail.component.html',
  styleUrls: ['./alert-detail.component.css'],
})
export class AlertDetailComponent implements OnInit {
  alert: AlertItem | null = null;
  loading = true;

  constructor(private route: ActivatedRoute, private alertService: AlertService, private router: Router, public auth: AuthService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.alertService.getOne(id).subscribe({
      next: (a) => { this.alert = a; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  resolve() {
    if (!this.alert) return;
    this.alertService.resolve(this.alert._id).subscribe((a) => (this.alert = a));
  }

  severityBadge(sev: string): string {
    if (sev === 'Critical' || sev === 'High') return 'badge-danger';
    if (sev === 'Medium') return 'badge-warning';
    return 'badge-info';
  }
}
