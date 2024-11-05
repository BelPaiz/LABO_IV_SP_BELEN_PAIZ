import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, getDocs, limit, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  loginRegister(user: string) {
    let col = collection(this.firestore, 'sesiones');
    addDoc(col, { fecha: new Date(), usuario: user })
  }

  getData(contador: number, sesioneCol: any[]) {
    let col = collection(this.firestore, 'sesiones');
    const observable = collectionData(col);

    observable.subscribe((respuesta: any[]) => {
      sesioneCol = respuesta;
      contador = sesioneCol.length;
      console.log(respuesta);
    })
  }

  nuevoPaciente(paciente: any) {
    let col = collection(this.firestore, 'usuarios');
    addDoc(col, {
      nombre: paciente.nombre, apellido: paciente.apellido, edad: paciente.edad, dni: paciente.dni, obra_social: paciente.obra_social, especialidad: null,
      email: paciente.email, img1: paciente.img1, img2: paciente.img2, tipo: 'paciente', habilitado: true
    })
  }
  nuevoEspecialista(usuario: any) {
    let col = collection(this.firestore, 'usuarios');
    addDoc(col, {
      nombre: usuario.nombre, apellido: usuario.apellido, edad: usuario.edad, dni: usuario.dni, obra_social: null, especialidad: usuario.especialidad,
      email: usuario.email, img1: usuario.img1, img2: null, tipo: 'especialista', habilitado: false
    })
  }
  nuevoAdmin(usuario: any) {
    let col = collection(this.firestore, 'usuarios');
    addDoc(col, {
      nombre: usuario.nombre, apellido: usuario.apellido, edad: usuario.edad, dni: usuario.dni, obra_social: null, especialidad: null,
      email: usuario.email, img1: usuario.img1, img2: null, tipo: 'admin', habilitado: true
    })
  }

  async getHabilitadoMail(email: string) {
    let col = collection(this.firestore, 'usuarios');
    const fetchQuery = query(
      col,
      where("email", "==", email),
      limit(1),
    );
    const querySnapshot = await getDocs(fetchQuery);
    return querySnapshot.docs[0].data();
  }

  async dniExiste(dni: string): Promise<boolean> {
    const col = collection(this.firestore, 'usuarios');
    const fetchQuery = query(
      col,
      where("dni", "==", dni),
      limit(1)
    );
    const querySnapshot = await getDocs(fetchQuery);
    return !querySnapshot.empty;
  }


}

