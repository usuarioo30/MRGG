import { Categoria } from "./categoria";

export interface Juego {
    id: number;
    nombre: string;
    descripcion: string;
    categoria: Categoria;
    foto: string;
}
