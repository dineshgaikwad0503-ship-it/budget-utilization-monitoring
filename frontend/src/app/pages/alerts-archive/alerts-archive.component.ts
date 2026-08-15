import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, AlertItem } from '../../services/alert.service';

@Component({
  selector: 'app-alerts-archive',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts-archive.component.html',
  styleUrls: ['./alerts-archive.component.css'],
})
export class AlertsArchiveComponent implements OnInit {
  alerts: AlertItem[] = [];
  loading = true;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.getAll({ isResolved: true }).subscribe({
      next: (data) => { this.alerts = data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }
}
