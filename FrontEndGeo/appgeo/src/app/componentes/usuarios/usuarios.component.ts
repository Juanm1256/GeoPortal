import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../servicios/usuarios.service';
import { Mensaje } from '../../Validar/Mensaje';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Usuarios } from '../../interfaces/usuarios';
import { RolesService } from '../../servicios/roles.service';
import { CommonModule } from '@angular/common';
import { FilteronePipe } from '../../Pipes/filterone.pipe';



@Component({
  selector: 'app-usuarios',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbPaginationModule, FilteronePipe],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  listaUsuarios: any[] = [];
  form: FormGroup;
  accion = "Agregar";
  id: number | undefined;
  idpersona: number|undefined;
  lista: Mensaje = new Mensaje();
  pageSize = 5;
  page = 1;
  pagesizee: any;
  search = '';
  criterio = 'username';
  roles: any[] = [];
  personas: any[] = [];

  constructor(
    public modalService: NgbModal,
    private usuarioService: UsuariosService,
    private fb: FormBuilder,
    private rolService: RolesService,
  ) {
    this.form = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ]+( [A-Za-z0-9ñÑáéíóúÁÉÍÓÚ]+)*$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      idrol: ['', Validators.required],
      nombres:['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ]+( [A-Za-z0-9ñÑáéíóúÁÉÍÓÚ]+)*$')
      ]],
      apellidos:['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ]+( [A-Za-z0-9ñÑáéíóúÁÉÍÓÚ]+)*$')
      ]],
      ci:['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ]+( [A-Za-z0-9ñÑáéíóúÁÉÍÓÚ]+)*$')
      ]],
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      ci: ['', Validators.required],
      idrol: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.listadoUsuarios();
    this.cargarRoles();
  }

  listadoUsuarios() {
    this.usuarioService.ListarTodos().subscribe(data => {
      this.listaUsuarios = data;
      this.pagesizee = this.listaUsuarios.length;
    });
  }

  cargarRoles() {
    this.rolService.ListarTodos().subscribe(data => {
      this.roles = data;
    });
  }
  

  LimpiarSearch() {
    this.search = '';
  }

  Guardar() {

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

    if (this.id == undefined) {
      this.usuarioService.PostUsuario(usuario).subscribe(() => {
        Swal.fire({ icon: 'success', title: 'Usuario Registrado!' });
        this.listadoUsuarios();
        this.form.reset();
      }, error => {
        Swal.fire({ icon: 'error', title: 'Error en el Formulario', html: error.error.errors[Object.keys(error.error.errors)[0]] });
      });
    } else {
      usuario.idusuario = this.id;
      this.usuarioService.PutUsuario(this.id, usuario).subscribe(() => {
        Swal.fire({ icon: 'success', title: 'Usuario Modificado!' });
        this.listadoUsuarios();
      }, error => {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Algo salió mal.' });
      });
    }
}

  Guardarinstruct(content: any) {
    this.modalService.open(content);
    this.form.markAsUntouched();
    this.form.markAsPristine();
    this.id = undefined;
    this.idpersona = undefined;
    this.form.reset();
  }

  SeleccionarUsuario(content: any, usuario: Usuarios) {
    
    this.modalService.open(content);
    this.accion = "Editar";
    this.id = usuario.idusuario;
    this.idpersona = usuario.idpersona;
    this.form.patchValue({
      username: usuario.username,
      password: "",
      idrol: usuario.idrol,
      idpersona: usuario.idpersona,
      nombres: usuario.IdPersonanav?.nombres,
      apellidos: usuario.IdPersonanav?.apellidos,
      ci: usuario.IdPersonanav?.ci
    });
  }

  CambiarEstado(usuario: Usuarios, accion: string) {
    usuario.estado = accion;
    this.usuarioService.PutUsuario(usuario.idusuario, usuario).subscribe(() => {
      Swal.fire({
        icon: accion === 'Activo' ? 'success' : 'error',
        title: accion === 'Activo' ? 'Usuario Activado!' : 'Usuario Desactivado!',
      });
      this.listadoUsuarios();
    });
  }
  obtenerNombreRol(idrol: number): string {
    const rol = this.roles.find(r => r.idrol === idrol);
    return rol ? rol.nombre : 'Sin rol';
  }
  
}
