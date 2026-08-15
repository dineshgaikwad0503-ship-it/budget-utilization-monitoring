import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface ThresholdSettings {
  _id?: string;
  underUtilizationThreshold: number;
  timeElapsedThreshold: number;
  overspendThreshold: number;
  spikeMultiplier: number;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private base = `${environment.apiBaseUrl}/settings`;
  constructor(private http: HttpClient) {}

  getThresholds() { return this.http.get<ThresholdSettings>(`${this.base}/thresholds`); }
  updateThresholds(payload: Partial<ThresholdSettings>) { return this.http.put<ThresholdSettings>(`${this.base}/thresholds`, payload); }
}
