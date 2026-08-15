import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService } from '../../services/audit.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.css'],
})
export class AuditLogsComponent implements OnInit {
  logs: any[] = [];
  loading = true;

  constructor(private auditService: AuditService) {}

  ngOnInit() {
    this.auditService.getAll().subscribe({
      next: (data) => { this.logs = data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }
}
