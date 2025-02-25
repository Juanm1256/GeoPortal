import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormsModule, ReactiveFormsModule, FormArray, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Roles } from '../../interfaces/roles';
import { RolesService } from '../../servicios/roles.service';
import { Mensaje } from '../../Validar/Mensaje';
import { CommonModule } from '@angular/common';
import { FilteronePipe } from "../../Pipes/filterone.pipe";
import { RolPermisoDTO } from '../../interfaces/rol-permiso-dto';
import { RolesPermisoService } from '../../servicios/roles-permiso.service';
import { ThemeService } from '../../servicios/theme.service';
import { Permisos } from '../../interfaces/permisos';
import { Subscription, firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-roles',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbPaginationModule, FilteronePipe],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit, OnDestroy {
  isLoading: boolean = true; 
  isDarkMode: boolean = false;
  listaRol: Roles[] = [];
  permisosList: Permisos[] = [];
  form: FormGroup;
  accion = "Agregar";
  id: string | undefined;
  lista: Mensaje = new Mensaje();
  pageSize = 5;
  page = 1;
  pagesizee: any;
  search = '';
  criterio = 'nombrerol';
  themeSubscription!: Subscription;  // ✅ Solo esta suscripción

  constructor(
    public themeService: ThemeService, 
    public modalService: NgbModal,
    private rolpermisoservice: RolesPermisoService,
    private rolservice: RolesService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.maxLength(25),
        Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')
      ]],
    });
  }
  async cargarRoles(): Promise<void> {
    try {
      this.isLoading = true;
      const data = await firstValueFrom(this.rolservice.ListarTodos());
      this.listaRol = data;
      this.pagesizee = this.listaRol.length;
    } catch (error) {
      console.error('Error al obtener los roles:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.cargarRoles();
  
      // ✅ Suscripción al tema
      this.themeSubscription = this.themeService.isDarkMode$.subscribe(
        (isDark) => this.isDarkMode = isDark
      );
  
      await Promise.all([
        this.listadoRol(),
        this.ListaPermiso()
      ]);
  
      if (!this.form.contains('permisos')) {
        this.form.addControl('permisos', this.fb.array([]));
      }
  
      // Transformar todos los campos del formulario a mayúsculas excepto los que especifiques
      Object.keys(this.form.controls).forEach((field) => {
        if (field !== 'nombreEspecial') {  // Agrega aquí los campos que no quieres que se conviertan en mayúsculas
          this.form.get(field)?.valueChanges.subscribe(value => {
            if (value && typeof value === 'string' && value !== value.toUpperCase()) {
              this.form.get(field)?.setValue(value.toUpperCase(), { emitEvent: false });
            }
          });
        }
      });
  
    } catch (error) {
      console.error('Error en la inicialización:', error);
    }
  }
  

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  async listadoRol(): Promise<void> {
    try {
      const data = await firstValueFrom(this.rolservice.ListarTodos());
      this.listaRol = data;
      this.pagesizee = this.listaRol.length;
    } catch (error) {
      console.error('Error al obtener los roles:', error);
    }
  }

  async ListaPermiso(): Promise<void> {
    try {
      const data = await firstValueFrom(this.rolservice.ListarPermiso());
      this.permisosList = data;
    } catch (error) {
      console.error('Error al obtener los permisos:', error);
    }
  }

  async Guardar(): Promise<void> {
    try {
      const rolDTO: RolPermisoDTO = {
        nombreRol: this.form.get('nombre')?.value,
        estado: 'Activo',
        IdPermisos: this.form.get('permisos')?.value.filter((permiso: any) => permiso !== null)
      };
  
      if (this.id == undefined) {
        await firstValueFrom(this.rolpermisoservice.insertar(rolDTO));
        Swal.fire({ icon: 'success', title: 'Rol Registrado!' });
      } else {
        await firstValueFrom(this.rolpermisoservice.modificar(rolDTO, this.id));
        Swal.fire({ icon: 'success', title: 'Rol Modificado!' });
      }
  
      await this.listadoRol();
      this.form.reset();
      this.modalService.dismissAll();
    } catch (error: any) {
      if (error.error?.errors) {
        Swal.fire({
          icon: 'error',
          title: 'Error en el Formulario',
          html: error.error.errors[Object.keys(error.error.errors)[0]]
        });
      } else {
        console.error('Error al guardar:', error);
      }
    }
  }

  async Guardarinstruct(content: any): Promise<void> {
    try {
      await this.modalService.open(content);
      this.form.markAsUntouched();
      this.form.markAsPristine();
      this.id = undefined;
      this.form.patchValue({ nombre: "" });
    } catch (error) {
      console.error('Error al abrir el modal:', error);
    }
  }

  async SeleccionarRol(content: any, rol: Roles): Promise<void> {
    try {
      await this.modalService.open(content);
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
    } catch (error) {
      console.error('Error al seleccionar rol:', error);
    }
  }

  async CambiarEstado(rol: Roles, accion: string): Promise<void> {
    try {
      const dto: RolPermisoDTO = {
        nombreRol: rol.nombre,
        estado: accion,
        IdPermisos: rol.permisos ? rol.permisos.map((p: any) => p.idpermiso).filter(id => id !== undefined) : []
      };
  
      if (rol.nombre) {
        await firstValueFrom(this.rolpermisoservice.modificar(dto, rol.nombre));
        
        Swal.fire({
          icon: accion === 'Inactivo' ? 'error' : 'success',
          title: `El rol ha sido ${accion === 'Inactivo' ? 'desactivado' : 'activado'}!`
        });
        
        await this.listadoRol();
        this.form.reset();
      }
    } catch (error) {
      console.error('Error al modificar el rol:', error);
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
  getErrorMessage(controlName: string): string | null {
    const control = this.form.get(controlName);
    if (control && control.invalid && (control.dirty || control.touched)) {
      const errors = control.errors;
      if (errors) {
        const errorKey = Object.keys(errors)[0]; // Obtener la primera clave de error
        const mensajes = this.lista.mensajes[controlName]; // Obtener los mensajes correspondientes
        if (mensajes) {
          const mensaje = mensajes.find((msg) => msg.type === errorKey); // Buscar el mensaje que coincida con la clave de error
          return mensaje ? mensaje.message : null;
        }
      }
    }
    return null;
  }  
  LimpiarSearch() {
    this.search = '';
  }
  ngOnDestroy() {
    // ✅ Solo cancelamos la suscripción si existe
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}
