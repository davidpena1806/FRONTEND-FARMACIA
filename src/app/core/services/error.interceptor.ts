import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Intercepta errores HTTP y muestra un mensaje legible.
 * Entiende el formato de error del backend Spring Boot:
 *   { status, mensaje, errors?: { campo: ["mensaje"] } }
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensaje = 'Ocurrió un error al comunicarse con la API.';
      const esLogin = req.url.endsWith('/auth/login');

      if (error.status === 0) {
        mensaje = 'No se pudo conectar con la API. Verifica que el backend esté corriendo y la URL en environment.ts.';
      } else if (error.status === 401 && !esLogin) {
        mensaje = 'Tu sesión expiró. Inicia sesión nuevamente.';
        auth.logout();
      } else if (error.status === 403) {
        mensaje = 'No tienes permisos para realizar esta acción.';
      } else if (error.error?.errors && Object.keys(error.error.errors).length > 0) {
        mensaje = Object.values(error.error.errors as Record<string, string[]>).flat().join(' | ');
      } else if (error.error?.mensaje) {
        mensaje = error.error.mensaje;
      } else if (typeof error.error === 'string' && error.error) {
        mensaje = error.error;
      }

      snackBar.open(mensaje, 'Cerrar', { duration: 6000 });
      return throwError(() => error);
    })
  );
};
