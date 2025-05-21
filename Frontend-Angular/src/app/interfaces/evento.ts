import { EstadoEvento } from "./estado-evento";
import { Juego } from "./juego";
import { Solicitud } from "./solicitud";
import { Usuario } from "./usuario";

export interface Evento {
    id: number;
    codigo_sala: string;
    num_usuario: number;
    estado: EstadoEvento;
    fecha_inicio: Date;
    descripcion: string;
    num_jugadores: number;
    usuario: Usuario;
    solicitudes: Solicitud[];
    juego: Juego;
}
