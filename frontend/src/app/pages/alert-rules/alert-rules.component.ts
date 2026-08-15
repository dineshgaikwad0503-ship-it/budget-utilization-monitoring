import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-alert-rules',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alert-rules.component.html',
  styleUrls: ['./alert-rules.component.css', '../../shared/styles/info-grid.css'],
})
export class AlertRulesComponent implements OnInit {
  private fb = inject(FormBuilder);
  loading = true;
  saved = false;
  errorMessage = '';

  form = this.fb.group({
    underUtilizationPercent: [40, [Validators.required, Validators.min(1), Validators.max(99)]],
    timeElapsedPercent: [70, [Validators.required, Validators.min(1), Validators.max(99)]],
    overspendPercent: [100, [Validators.required, Validators.min(50), Validators.max(300)]],
    spikeMultiplier: [3, [Validators.required, Validators.min(1.5), Validators.max(10)]],
  });

  constructor(private settingsService: SettingsService, public auth: AuthService) {}

  ngOnInit() {
    this.settingsService.getThresholds().subscribe({
      next: (s) => {
        this.form.patchValue({
          underUtilizationPercent: Math.round(s.underUtilizationThreshold * 100),
          timeElapsedPercent: Math.round(s.timeElapsedThreshold * 100),
          overspendPercent: Math.round(s.overspendThreshold * 100),
          spikeMultiplier: s.spikeMultiplier,
        });
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  canEdit(): boolean {
    return this.auth.hasRole('Admin', 'FinanceOfficer');
  }

  submit() {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.settingsService
      .updateThresholds({
        underUtilizationThreshold: (v.underUtilizationPercent || 0) / 100,
        timeElapsedThreshold: (v.timeElapsedPercent || 0) / 100,
        overspendThreshold: (v.overspendPercent || 0) / 100,
        spikeMultiplier: v.spikeMultiplier || 3,
      })
      .subscribe({
        next: () => { this.saved = true; setTimeout(() => (this.saved = false), 3000); },
        error: (err) => (this.errorMessage = err.error?.message || 'Failed to save thresholds'),
      });
  }
}
