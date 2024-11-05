import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut, updateCurrentUser, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {

  errorCode: any;
  evitarActualizacion: boolean = false;

  private authState = new BehaviorSubject<string | null>(null);
  constructor(public auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      if (!this.evitarActualizacion) {
        if (user?.email) {
          this.authState.next(user.email);
        } else {
          this.authState.next(null);
        }
      }


      this.evitarActualizacion = false;
    });
  }

  async Registro(email: string, password: string): Promise<User | null> {
    const usuarioAntes = this.getUsuario();
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      if (this.auth.currentUser) {
        await sendEmailVerification(this.auth.currentUser)
      }


      if (usuarioAntes) {
        this.evitarActualizacion = true;
        await signOut(this.auth);
        const usuarioAhora = await updateCurrentUser(this.auth, usuarioAntes);

        this.authState.next(usuarioAntes.email);

        console.log(usuarioAntes);
        console.log(this.getUsuario());
      }
      else {
        await signOut(this.auth);
      }
      console.log(this.getUsuario());

      return userCredential.user;

    } catch (error) {
      throw error;
    }
  }

  dispararVerif(user: User) {
    return sendEmailVerification(user);
  }
  isEmailVerified(user: User): boolean {
    return user.emailVerified;
  }

  async Login(email: string, pass: string): Promise<User | null> {

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, pass);
      const user = userCredential.user;
      return user;

    } catch (error) {
      if (this.errorCode === null) {
        const errorFire = error as { code?: string };
        this.errorCode = errorFire.code;
      }
      throw this.errorCode;
    }
  }

  CerrarSesion() {
    return signOut(this.auth);
  }

  DatosAutenticacion() {
    return this.authState.asObservable();
  }

  getUsuario(): User | null {
    return this.auth.currentUser;
  }

  setearUsuario(usuarioEnSesion: User) {
    return updateCurrentUser(this.auth, usuarioEnSesion);
  }

  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }


}
