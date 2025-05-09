import { EstadoEvento } from "./estado-evento";
import { Usuario } from "./usuario";

export interface Evento {
    codigo_sala: string;
    num_usuario: number;
    estado: EstadoEvento;
    fecha_inicio: Date;
    descripcion: string;
    num_jugadores: number;
    usuario: Usuario;
}
