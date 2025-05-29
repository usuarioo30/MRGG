import { Roles } from "./roles";

export interface Actor {
    id: number,
    nombre: string,
    email: string,
    telefono: string,
    clave_segura: string,
    chat_id: number,
    username: string,
    password: string,
    foto: string,
    baneado: boolean,
    rol: Roles,
}
