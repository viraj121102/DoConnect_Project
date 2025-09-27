import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expected = route.data['roles'] as string[];
    const role = this.auth.getRole();
    if (role && expected.some(r => r.toLowerCase() === role.toLowerCase())) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
