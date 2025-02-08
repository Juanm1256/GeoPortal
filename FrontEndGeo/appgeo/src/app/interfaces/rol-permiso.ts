import { Permisos } from "./permisos";
import { Roles } from "./roles";

export interface RolPermiso {
    idrolpermiso: number;
    idrol: number;
    idpermiso: number;
    estado: string;
    IdRolnav: Roles;
    IdPermisonav: Permisos;
}
