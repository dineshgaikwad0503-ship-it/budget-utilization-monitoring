import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService, AlertItem } from '../../services/alert.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css'],
})
export class NotificationsComponent implements OnInit {
  alerts: AlertItem[] = [];
  loading = true;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.getAll({ isResolved: false }).subscribe({
      next: (data) => { this.alerts = data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }
}
