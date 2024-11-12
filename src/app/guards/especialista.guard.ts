import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenService } from '../services/authen.service';
import { map, switchMap } from 'rxjs/operators';
import { FirestoreService } from '../services/firestore.service';
import { of } from 'rxjs';

export const especialistaGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(AuthenService);
  const firestore = inject(FirestoreService)

  return auth.DatosAutenticacion().pipe(
    // Primero, obtenemos el email del usuario autenticado
    switchMap(email => {
      if (email) {
        // Si el email está definido, consultamos Firestore para obtener el usuario
        return firestore.getUsuarioPorEmail(email).pipe(
          map(users => {
            const user = users[0];
            // Verificamos si el usuario es de tipo "admin"
            if (user && (user as unknown as { tipo: string }).tipo === 'especialista') {
              return true;
            } else {
              // Redirigir al login si el usuario no es admin
              router.navigate(['/login']);
              return false;
            }
          })
        );
      } else {
        // Si no hay email, el usuario no está autenticado
        router.navigate(['/login']);
        return of(false);
      }
    })
  );
};
