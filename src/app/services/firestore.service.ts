import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, getDocs, limit, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { empty, Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Disponibilidad } from '../models/disponibilidad_horaria';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  loginRegister(user: string) {
    let col = collection(this.firestore, 'sesiones');
    addDoc(col, { fecha: new Date(), usuario: user })
  }

  getDataSesions(contador: number, sesioneCol: any[]) {
    let col = collection(this.firestore, 'sesiones');
    const observable = collectionData(col);

    observable.subscribe((respuesta: any[]) => {
      sesioneCol = respuesta;
      contador = sesioneCol.length;
      console.log(respuesta);
    })
  }

  nuevoUsuario(usuario: Usuario) {
    let col = collection(this.firestore, 'usuarios');
    addDoc(col, {
      nombre: usuario.nombre, apellido: usuario.apellido, edad: usuario.edad, dni: usuario.dni, obra_social: usuario.obra_social, especialidad: usuario.especialidad,
      email: usuario.email, img1: usuario.img1, img2: usuario.img2, tipo: usuario.tipo, habilitado: usuario.habilitado
    })
  }

  getUsuariosPorTipo(tipo: string): Observable<Usuario[]> {
    const col = collection(this.firestore, 'usuarios');
    const tipoQuery = query(col, where('tipo', '==', tipo));
    return collectionData(tipoQuery);
  }

  getUsuarioPorEmail(email: string): Observable<any[]> {
    const col = collection(this.firestore, 'usuarios');
    const tipoQuery = query(col, where('email', '==', email));
    return collectionData(tipoQuery);
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

  async updateEspecialista(dni: number, habilitado: boolean) {
    const usuarioRef = collection(this.firestore, 'usuarios');
    const q = query(usuarioRef, where('dni', '==', dni));
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const usuarioDoc = querySnapshot.docs[0];
        const usuarioRef = doc(this.firestore, `usuarios/${usuarioDoc.id}`);

        await updateDoc(usuarioRef, { habilitado: habilitado });
      }
    } catch (error) {
      console.error('Error al modificar el especialista: ', error);
    }
  }

  async getEspecialistaDni(dni: number) {
    let col = collection(this.firestore, 'usuarios');
    const fetchQuery = query(
      col,
      where("dni", "==", dni),
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

  getEspecialidades(): Observable<any[]> {
    const col = collection(this.firestore, 'especialidades');
    const q = query(col, orderBy('nombre'));
    return collectionData(q);
  }

  setEspecialidad(especialidad: string) {
    let col = collection(this.firestore, 'especialidades');
    addDoc(col, { nombre: especialidad });
  }

  async getUsuarioEmail(email: string) {
    let col = collection(this.firestore, 'usuarios');
    const fetchQuery = query(
      col,
      where("email", "==", email),
      limit(1),
    );
    const querySnapshot = await getDocs(fetchQuery);
    return querySnapshot.docs[0].data();
  }

  getDisponibilidadPorMail(email: string): Observable<Disponibilidad[]> {
    const col = collection(this.firestore, 'disponibilidad');
    const tipoQuery = query(col, where('email', '==', email));
    return collectionData(tipoQuery);
  }
  // getDisponibilidadPorEspecialidad(especialidad: string): Observable<Disponibilidad[]> {
  //   const col = collection(this.firestore, 'disponibilidad');
  //   const tipoQuery = query(col, where('especialidad', '==', especialidad));
  //   return collectionData(tipoQuery);
  // }

  async getDisponibilidadId(disponibilidad: Disponibilidad) {
    let col = collection(this.firestore, 'disponibilidad');
    const fetchQuery = query(
      col,
      where("email", "==", disponibilidad.email),
      where("dia", "==", disponibilidad.dia),
      limit(1)
    );

    const querySnapshot = await getDocs(fetchQuery);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, data: doc.data() };
    } else {
      return null;
    }
  }

  setDisponibilidad(disponibilidad: Disponibilidad) {
    let col = collection(this.firestore, 'disponibilidad');
    addDoc(col, {
      email: disponibilidad.email, especialidad: disponibilidad.especialidad, dia: disponibilidad.dia,
      disponible: disponibilidad.disponible
    });
  }

  async updateDisponibilidad(id: string, data: { disponible: number[]; }) {
    const docRef = doc(this.firestore, `disponibilidad/${id}`);
    try {
      await updateDoc(docRef, data);
    } catch (error) {
      console.error('Error al modificar disponibilidad: ', error);
    }
  }




}

