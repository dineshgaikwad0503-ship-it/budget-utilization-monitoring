import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowedRoles = (route.data?.['roles'] as string[]) || [];
  if (auth.hasRole(...allowedRoles)) return true;
  router.navigate(['/dashboard']);
  return false;
};
