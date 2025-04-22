import { EstadoEvento } from "./estado-evento";

export interface Evento {
    codigo_sala: number;
    num_usuario: number;
    estado: EstadoEvento;
    fecha_inicio: Date;
    comentario: string;
}
