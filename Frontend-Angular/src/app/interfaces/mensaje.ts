export interface Mensaje {
    id: number;
    fechaEnvio: string;
    asunto: string;
    cuerpo: string;
    usuarioQueLee: string[];
    esAdmin: boolean;
    leido?: boolean;
}
