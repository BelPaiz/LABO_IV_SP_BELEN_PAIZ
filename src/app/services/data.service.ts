import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private email_paciente: string = "";


  constructor() { }
  setEmail(email: string) {
    this.email_paciente = email;
  }

  getEmail(): string {
    return this.email_paciente;
  }
}
