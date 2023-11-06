import { Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../services/auth.service";

export const noAuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.token)
    return true;
  return router.navigate(['/']);
};
