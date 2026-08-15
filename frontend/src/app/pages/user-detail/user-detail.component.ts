import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit {
  user: any = null;
  loading = true;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.userService.getOne(id).subscribe({
      next: (u) => { this.user = u; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  toggleActive() {
    this.userService.update(this.user._id, { isActive: !this.user.isActive }).subscribe(() => {
      this.user.isActive = !this.user.isActive;
    });
  }
}
