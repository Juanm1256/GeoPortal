import { Personas } from "./personas";
import { Roles } from "./roles";

export interface Usuarios {
    idusuario: number;
    idpersona?: number;
    username: string;
    password_hash: string;
    idrol: number;
    fechareg: Date;
    estado: string;
    IdPersonanav?: Personas;
    IdRolnav? : Roles | undefined;
}
