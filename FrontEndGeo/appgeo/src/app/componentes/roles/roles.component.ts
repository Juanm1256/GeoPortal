import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormsModule, ReactiveFormsModule, FormArray, FormControl} from '@angular/forms'
import Swal from 'sweetalert2';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Roles } from '../../interfaces/roles';
import { RolesService } from '../../servicios/roles.service';
import { Mensaje } from '../../Validar/Mensaje';
import { CommonModule } from '@angular/common';
import { FilteronePipe } from "../../Pipes/filterone.pipe";
import { RolPermisoDTO } from '../../interfaces/rol-permiso-dto';
import { RolesPermisoService } from '../../servicios/roles-permiso.service';
import { Permisos } from '../../interfaces/permisos';

@Component({
  selector: 'app-roles',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbPaginationModule, FilteronePipe],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit {
  listaRol: Roles[] = [];
  permisosList: Permisos[] =[];
  form: FormGroup;
  accion = "Agregar";
  id: string | undefined;
  lista: Mensaje = new Mensaje();
  pageSize = 5;
  page = 1;
  pagesizee: any;
  search = '';
  criterio = 'nombrerol';

  constructor(
    public modalService: NgbModal,
    private rolpermisoservice: RolesPermisoService,
    private rolservice: RolesService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ]+( [A-Za-zñÑáéíóúÁÉÍÓÚ]+)*$')
        ]
      ],
      permisos: this.fb.array([])
    });
  }

  ListaRol() {
    this.rolservice.ListarTodos().subscribe(
      (data: Roles[]) => {
        this.listaRol = data;
        this.pagesizee = this.listaRol.length;
      },
      (error) => {
        //console.error('Error al obtener los roles:', error);
      }
    );
  }

  ListaPermiso(){
    this.rolservice.ListarPermiso().subscribe(
      (data: Permisos[]) => {
        this.permisosList = data;
      },
      (error) => {
        //console.error('Error al obtener los roles:', error);
      }
    );
  }


  LimpiarSearch() {
    this.search = '';
  }

  ngOnInit(): void {
    this.listadoRol();
    this.ListaPermiso();

  if (!this.form.contains('permisos')) {
    this.form.addControl('permisos', this.fb.array([])); 
  }
    
  }

  Guardar() {
    const rolDTO: RolPermisoDTO = {
      nombreRol: this.form.get('nombre')?.value,
      estado: 'Activo',
      IdPermisos: this.form.get('permisos')?.value.filter((permiso: any) => permiso !== null)
    };
  
    if (this.id == undefined) {
      console.log(rolDTO);
      this.rolpermisoservice.insertar(rolDTO).subscribe(data => {
        Swal.fire({
          icon: 'success',
          title: 'Rol Registrado!'
        });
        this.ListaRol();
        this.form.reset();
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Error en el Formulario',
          html: error.error.errors[Object.keys(error.error.errors)[0]]
        })
      });
    } else {
      this.rolpermisoservice.modificar(rolDTO, this.id).subscribe(data => {
        Swal.fire({
          icon: 'success',
          title: 'Rol Modificado!'
        });
        this.ListaRol();
        this.form.reset();
      });
    }
  }
  

  Guardarinstruct(content: any) {
    this.modalService.open(content);
    this.form.markAsUntouched();
    this.form.markAsPristine();

    this.id = undefined;
    this.form.patchValue({
      nombre: ""
    })
  }

  SeleccionarRol(content: any, rol: Roles) {
    this.modalService.open(content);
    this.accion = "Editar";
    this.id = rol.nombre;
  
    this.form.patchValue({
      nombre: rol.nombre,
    });
  
    const permisosArray = this.form.get('permisos') as FormArray;
    permisosArray.clear();
  
    if (rol.permisos && Array.isArray(rol.permisos)) {
      rol.permisos.forEach((permiso: any) => {
        permisosArray.push(new FormControl(permiso.idpermiso));
      });
    }
  }
  


  CambiarEstado(rol: Roles, accion: string) {
    const dto: RolPermisoDTO = {
      nombreRol: rol.nombre,
      estado: accion,
      IdPermisos: rol.permisos ? rol.permisos.map((p: any) => p.idpermiso).filter(id => id !== undefined) : []
    };
  
    if (rol.nombre) {
      this.rolpermisoservice.modificar(dto, rol.nombre).subscribe(
        () => {
          Swal.fire({
            icon: accion === 'Inactivo' ? 'error' : 'success',
            title: `El rol ha sido ${accion === 'Inactivo' ? 'desactivado' : 'activado'}!`
          });
          this.ListaRol();
          this.form.reset();
        },
        (error) => {
          //console.error('Error al modificar el rol:', error);
        }
      );
    }
  }
  

  

  get permisos(): FormArray {
    return this.form.get('permisos') as FormArray;
  }
  
  onCheckboxChange(e: any) {
    const permisos = this.permisos;
  
    if (e.target.checked) {
      permisos.push(this.fb.control(e.target.value));
    } else {
      const index = permisos.controls.findIndex(ctrl => ctrl.value === e.target.value);
      if (index !== -1) {
        permisos.removeAt(index);
      }
    }
  }
  
  async listadoRol() {
    await this.rolservice.ListarTodos().subscribe(
      (data: Roles[]) => {
        this.listaRol = data;
        this.pagesizee = this.listaRol.length;
      },
      (error) => {
        //console.error('Error al obtener los roles:', error);
      }
    );
  }
}
