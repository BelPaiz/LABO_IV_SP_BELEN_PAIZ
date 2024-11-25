import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private email_paciente: string = "";
  private currentTurnoId: string = "";
  private nombre_especialista: string = "";
  private nombre_paciente: string = "";
  private estado: string = "";


  constructor() { }
  setEmail(email: string) {
    this.email_paciente = email;
  }

  getEmail(): string {
    return this.email_paciente;
  }

  setTurno(id: string) {
    this.currentTurnoId = id;
  }
  getTurno() { return this.currentTurnoId; }

  setEspecialista(nombre: string) {
    this.nombre_especialista = nombre;
  }

  getEspecialista(): string {
    return this.nombre_especialista;
  }

  setPaciente(nombre: string) {
    this.nombre_paciente = nombre;
  }

  getPaciente(): string {
    return this.nombre_paciente;
  }

  setEstado(estado: string) {
    this.estado = estado;
  }

  getEstado(): string {
    return this.estado;
  }

}
