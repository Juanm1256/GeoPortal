import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../servicios/usuarios.service';
import { Mensaje } from '../../Validar/Mensaje';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Usuarios } from '../../interfaces/usuarios';
import { RolesService } from '../../servicios/roles.service';
import { CommonModule } from '@angular/common';
import { FilteronePipe } from '../../Pipes/filterone.pipe';
import { ThemeService } from '../../servicios/theme.service';
import { Subscription, firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbPaginationModule, FilteronePipe],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit, OnDestroy {
  showPassword: boolean = false;
  isLoading: boolean = true; // ⬅ Estado del spinner
  isDarkMode: boolean = false;
  listaUsuarios: Usuarios[] = [];
  form: FormGroup;
  accion = "Agregar";
  id: number | undefined;
  idpersona: number | undefined;
  lista: Mensaje = new Mensaje();
  pageSize = 5;
  page = 1;
  pagesizee: number = 0;
  search = '';
  criterio = 'username';
  roles: any[] = [];
  personas: any[] = [];
  themeSubscription!: Subscription;

  constructor(
    private themeService: ThemeService,
    public modalService: NgbModal,
    private usuarioService: UsuariosService,
    private fb: FormBuilder,
    private rolService: RolesService,
  ) {
    this.form = this.fb.group({
      idrol: ['', Validators.required], // ✅ Inicializado como cadena vacía
      username: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ@#$%&._+-]+( [A-Za-z0-9ñÑáéíóúÁÉÍÓÚ@#$%&._+-]+)*$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ@#$%&._+-]{6,}$')
      ]],
      nombres: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')
      ]],
      apellidos: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')
      ]],
      ci: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[A-Za-z0-9]+$')
      ]]
    });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  async ngOnInit(): Promise<void> {
    try {
      this.themeSubscription = this.themeService.isDarkMode$.subscribe(
        (isDark) => {
          this.isDarkMode = isDark;
        }
      );

      await Promise.all([
        this.cargarUsuarios(),
        this.cargarRoles()
      ]);
      // Transformar todos los campos excepto 'username' y 'password' a mayúsculas
      Object.keys(this.form.controls).forEach((field) => {
        if (field !== 'username' && field !== 'password') {
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

  async cargarUsuarios(): Promise<void> {
    try {
      this.isLoading = true;
      const data = await firstValueFrom(this.usuarioService.ListarTodos());
      this.listaUsuarios = data;
      this.pagesizee = this.listaUsuarios.length;
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    } finally {
      this.isLoading = false;
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  async cargarRoles(): Promise<void> {
    try {
      const data = await firstValueFrom(this.rolService.ListarTodos());
      this.roles = data;
    } catch (error) {
      console.error('Error al cargar roles:', error);
    }
  }

  LimpiarSearch() {
    this.search = '';
  }

  async Guardar(): Promise<void> {
    try {
        const today = new Date();

        const usuario: Usuarios = {
            idusuario: this.id || 0,
            username: this.form.get('username')?.value,
            password_hash: this.form.get('password')?.value,
            fechareg: today,
            idrol: this.form.get('idrol')?.value,
            idpersona: this.idpersona || 0,
            estado: 'Activo',
            IdPersonanav: {
                idpersona: this.idpersona || 0,
                nombres: this.form.get('nombres')?.value,
                apellidos: this.form.get('apellidos')?.value,
                ci: this.form.get('ci')?.value,
                fechareg: today,
                estado: 'Activo',
            },
            IdRolnav: undefined,
        };

        if (!this.id) {
            const response = await firstValueFrom(this.usuarioService.PostUsuario(usuario));
            console.log("✅ Respuesta del servidor:", response);

            if (response === null) {
                Swal.fire({
                    icon: 'error',
                    title: 'Usuario duplicado',
                    text: 'El nombre de usuario ya existe. Por favor, elija otro.'
                });
            } else {
                Swal.fire({ icon: 'success', title: 'Usuario Registrado!' });
                await this.cargarUsuarios();
                this.form.reset();
            }
        } else {
            const response = await firstValueFrom(this.usuarioService.PutUsuario(this.id, usuario));
            if (response) {
                Swal.fire({ icon: 'success', title: 'Usuario Modificado!' });
                await this.cargarUsuarios();
                this.form.reset();
                this.modalService.dismissAll();
            }
        }
    } catch (error: any) {
        console.error("❌ Error completo:", error);

        if (error.status === 400 && error.error === "Usuario ya existe") {
            Swal.fire({
                icon: 'error',
                title: 'Usuario duplicado',
                text: 'El nombre de usuario ya existe. Por favor, elija otro.'
            });
        } else if (error.status === 400) {
            Swal.fire({
                icon: 'error',
                title: 'Error en el formulario',
                text: error.error || 'Algo salió mal.'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error inesperado',
                text: 'Hubo un problema al procesar la solicitud.'
            });
        }
    }
}


  async Guardarinstruct(content: any): Promise<void> {
    try {
      await this.modalService.open(content);
      this.form.markAsUntouched();
      this.form.markAsPristine();
      this.id = undefined;
      this.idpersona = undefined;
      this.form.reset({ idrol: '' }); // ✅ Restablece idrol como cadena vacía para seleccionar la opción por defecto
    } catch (error) {
      console.error('Error al abrir el modal:', error);
    }
  }

  async SeleccionarUsuario(content: any, usuario: Usuarios): Promise<void> {
    try {
      await this.modalService.open(content);
      this.accion = "Editar";
      this.id = usuario.idusuario;
      this.idpersona = usuario.idpersona;
      this.form.patchValue({
        username: usuario.username,
        password: "",
        idrol: usuario.idrol ?? null, // ✅ Asegura que si no hay rol, se muestra la opción por defecto
        nombres: usuario.IdPersonanav?.nombres,
        apellidos: usuario.IdPersonanav?.apellidos,
        ci: usuario.IdPersonanav?.ci
      });
    } catch (error) {
      console.error('Error al seleccionar usuario:', error);
    }
  }

  async CambiarEstado(usuario: Usuarios, accion: string): Promise<void> {
    try {
      usuario.estado = accion; // Verifica que el estado se actualiza correctamente
      console.log("Enviando usuario:", usuario); // 📌 Verifica qué se está enviando
  
      const response = await firstValueFrom(this.usuarioService.PutUsuario(usuario.idusuario, usuario));
  
      console.log("Respuesta del servidor:", response); // 📌 Verifica si hay respuesta del backend
  
      Swal.fire({
        icon: accion === 'Activo' ? 'success' : 'error',
        title: accion === 'Activo' ? 'Usuario Activado!' : 'Usuario Desactivado!',
      });
  
      await this.cargarUsuarios();
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cambiar el estado del usuario.' });
    }
  }
  

  obtenerNombreRol(idrol: number): string {
    const rol = this.roles.find(r => r.idrol === idrol);
    return rol ? rol.nombre : 'Sin rol';
  }
  // Método para obtener mensajes de error
  getErrorMessage(controlName: string): string | null {
    const control = this.form.get(controlName);
    if (control && control.invalid && (control.dirty || control.touched)) {
      const errors = control.errors;
      if (errors) {
        const errorKey = Object.keys(errors)[0];
        const mensajes = this.lista.mensajes[controlName];
        if (mensajes) {
          const mensaje = mensajes.find((msg: any) => msg.type === errorKey);
          return mensaje ? mensaje.message : null;
        }
      }
    }
    return null;
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }

}