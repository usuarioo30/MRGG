import { EstadoSolicitud } from "./estado-solicitud";
import { Evento } from "./evento";

export interface Solicitud {
    id: number;
    estado: EstadoSolicitud
    evento?: Evento;
}
