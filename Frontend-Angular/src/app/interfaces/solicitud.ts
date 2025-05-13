import { EstadoSolicitud } from "./estado-solicitud";

export interface Solicitud {
    id: number;
    estado: EstadoSolicitud
}
