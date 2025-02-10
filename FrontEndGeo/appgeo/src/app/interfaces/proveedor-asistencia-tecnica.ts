import { DecimalPipe } from "@angular/common";

export interface ProveedorAsistenciaTecnica {
    gid:number;
    name: string|null;
    long_x: DoubleRange;
    lat_y:DoubleRange;
    geom: any;
}
