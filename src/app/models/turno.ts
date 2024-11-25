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
    historia: boolean;
    altura: string | null;
    peso: string | null;
    temperatura: string | null;
    presion: string[] | null;
    dato_uno: string[] | null;
    dato_dos: string[] | null;
    dato_tres: string[] | null;
}