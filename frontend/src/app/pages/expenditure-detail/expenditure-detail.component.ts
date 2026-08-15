import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ExpenditureService, Expenditure } from '../../services/expenditure.service';

@Component({
  selector: 'app-expenditure-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './expenditure-detail.component.html',
  styleUrls: ['./expenditure-detail.component.css'],
})
export class ExpenditureDetailComponent implements OnInit {
  expenditure: Expenditure | null = null;
  loading = true;

  constructor(private route: ActivatedRoute, private expService: ExpenditureService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.expService.getOne(id).subscribe({
      next: (e) => { this.expenditure = e; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }
}
