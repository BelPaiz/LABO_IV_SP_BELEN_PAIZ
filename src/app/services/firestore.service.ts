import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, DocumentReference, Firestore, getDocs, limit, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { empty, Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { Disponibilidad } from '../models/disponibilidad_horaria';
import { Turno } from '../models/turno';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  // LOGS
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

  getSesionesPorEmail(email: string): Observable<any[]> {
    const col = collection(this.firestore, 'sesiones');
    const tipoQuery = query(col, where('usuario', '==', email));
    return collectionData(tipoQuery);
  }

  // GESTION USUARIOS
  nuevoUsuario(usuario: Usuario) {
    let col = collection(this.firestore, 'usuarios');
    addDoc(col, {
      nombre: usuario.nombre, apellido: usuario.apellido, edad: usuario.edad, dni: usuario.dni, obra_social: usuario.obra_social, especialidad: usuario.especialidad,
      email: usuario.email, img1: usuario.img1, img2: usuario.img2, tipo: usuario.tipo, habilitado: usuario.habilitado
    })
  }

  getUsuariosAll(): Observable<Usuario[]> {
    const col = collection(this.firestore, 'usuarios');
    return collectionData(col);
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

  // ESPECIALISTAS HABILITACION MODIFICACION
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

  async obtenerUsuariosPorEspecialidad(especialidad_Seleccionada: string) {
    const col = collection(this.firestore, 'usuarios');

    // Crear una consulta con array-contains para buscar usuarios que tengan especialidad_Seleccionada en su array
    const q = query(col, where('especialidad', 'array-contains', especialidad_Seleccionada));

    // Ejecutar la consulta y obtener los documentos
    const querySnapshot = await getDocs(q);

    // Mapear los documentos a objetos Usuario
    const usuarios = querySnapshot.docs.map(doc => doc.data());

    return usuarios;
  }


  // ESPECIALIDADES
  getEspecialidades(): Observable<any[]> {
    const col = collection(this.firestore, 'especialidades');
    const q = query(col, orderBy('nombre'));
    return collectionData(q);
  }

  setEspecialidad(especialidad: string) {
    let col = collection(this.firestore, 'especialidades');
    addDoc(col, { nombre: especialidad });
  }


  // DISPONIBILIDAD
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
      where("fecha", "==", disponibilidad.fecha),
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
      email: disponibilidad.email, especialidad: disponibilidad.especialidad, dia: disponibilidad.dia, fecha: disponibilidad.fecha,
      disponible: disponibilidad.disponible
    });
  }

  async updateDisponibilidad(id: string, data: { disponible: string[]; especialidad: string[] }) {
    const docRef = doc(this.firestore, `disponibilidad/${id}`);
    try {
      await updateDoc(docRef, data);
    } catch (error) {
      console.error('Error al modificar disponibilidad: ', error);
    }
  }

  // TURNOS
  nuevoTurno(turno: Turno): Promise<DocumentReference> {
    let col = collection(this.firestore, 'turnos');
    return addDoc(col, turno);
  }

  getTurnoPorDato(dato: string, data: string): Observable<Turno[]> {
    const col = collection(this.firestore, 'turnos');
    const tipoQuery = query(col, where(dato, '==', data));
    return collectionData(tipoQuery);
  }

  getTurnosAll(): Observable<any[]> {
    const col = collection(this.firestore, 'turnos');
    return collectionData(col);
  }
  getTurnosAllID(): Observable<any[]> {
    const col = collection(this.firestore, 'turnos');
    return collectionData(col, { idField: 'id' }); // Agrega el ID como un campo llamado 'id'
  }
  getTurnosByEmail(email: string): Observable<any[]> {
    const col = collection(this.firestore, 'turnos');
    const q = query(col, where('email_paciente', '==', email)); // Filtra por el campo 'email'
    return collectionData(q, { idField: 'id' }); // Agrega el ID como un campo llamado 'id'
  }

  getTurnosByEmailEspecialista(email: string): Observable<any[]> {
    const col = collection(this.firestore, 'turnos');
    const q = query(col, where('email_especialista', '==', email)); // Filtra por el campo 'email'
    return collectionData(q, { idField: 'id' }); // Agrega el ID como un campo llamado 'id'
  }

  async updateTurnoComentarioEstado(id: string, data: { comentario?: string; estado?: string }) {
    const turnoDocRef = doc(this.firestore, `turnos/${id}`);
    try {
      await updateDoc(turnoDocRef, data);
    } catch (error) {
      console.error('Error al actualizar el turno: ', error);
    }
  }

  async updateTurnoCalificacion(id: string, data: { calificacion?: string }) {
    const turnoDocRef = doc(this.firestore, `turnos/${id}`);
    try {
      await updateDoc(turnoDocRef, data);
    } catch (error) {
      console.error('Error al actualizar el turno: ', error);
    }
  }

  async updateTurnoEncuesta(id: string, data: { encuesta?: string[] }) {
    const turnoDocRef = doc(this.firestore, `turnos/${id}`);
    try {
      await updateDoc(turnoDocRef, data);
    } catch (error) {
      console.error('Error al actualizar el turno: ', error);
    }
  }

  async updateTurnoHistoria(id: string, data: {
    historia?: boolean; altura?: string; peso?: string;
    temperatura?: string; presion?: string[]; dato_uno?: string[] | null;
    dato_dos?: string[] | null; dato_tres?: string[] | null;
  }) {
    const turnoDocRef = doc(this.firestore, `turnos/${id}`);
    try {
      await updateDoc(turnoDocRef, data);
    } catch (error) {
      console.error('Error al actualizar el turno: ', error);
    }
  }

}

