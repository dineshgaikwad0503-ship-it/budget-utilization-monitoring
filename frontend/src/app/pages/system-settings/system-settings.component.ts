import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.css'],
})
export class SystemSettingsComponent {
  settings = [
    { label: 'Organization Name', value: 'Unified Mentor — Budget Utilization Monitoring System' },
    { label: 'Financial Year Format', value: 'April – March (Indian government fiscal year convention)' },
    { label: 'Default Currency', value: 'INR (₹)' },
    { label: 'Anomaly Scan Frequency', value: 'Every 6 hours, plus on-demand' },
    { label: 'Data Retention', value: 'Audit logs retained indefinitely for compliance' },
  ];
}
