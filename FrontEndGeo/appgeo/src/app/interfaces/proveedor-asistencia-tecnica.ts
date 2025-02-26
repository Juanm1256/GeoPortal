import { DecimalPipe } from "@angular/common";

export interface ProveedorAsistenciaTecnica {
    gid:number;
    name: string|null;
    long_x: number;
    lat_y:number;
    geom: any;
}
