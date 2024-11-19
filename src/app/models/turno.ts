export interface Turno {
    email_paciente: string;
    email_especialista: string;
    especialidad: string;
    dia: string;
    fecha: string;
    hora: string;
    estado: string;
    comentario: string | null;
    encuesta: string[] | null;
    calificacion: string | null;
}