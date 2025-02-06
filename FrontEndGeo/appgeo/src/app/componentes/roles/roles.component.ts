import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms'
import Swal from 'sweetalert2';
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Roles } from '../../interfaces/roles';
import { RolesService } from '../../servicios/roles.service';
import { Mensaje } from '../../Validar/Mensaje';
import { CommonModule } from '@angular/common';
import { FilteronePipe } from "../../Pipes/filterone.pipe";

@Component({
  selector: 'app-roles',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbPaginationModule, FilteronePipe],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit{
  listaRol:Roles[]=[];
  form:FormGroup;
  accion="Agregar";
  id:number|undefined;
   //Mensajes Error
  lista: Mensaje=new Mensaje();
  pageSize = 5;
  page = 1;
  pagesizee : any;
  search='';
  criterio='nombrerol';

  constructor( public modalService:NgbModal,private rolservice: RolesService, private fb:FormBuilder) 
  {
    this.form = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ]+( [A-Za-zñÑáéíóúÁÉÍÓÚ]+)*$')
      ]],
    });
  }

   ListaRol(){
    this.rolservice.ListarActivos().subscribe(resp=>{
      this.listaRol=resp;
      this.pagesizee = this.listaRol.length;
  })
  }

  
  LimpiarSearch() {
    this.search = '';
  }


  ngOnInit(): void {
    this.listadoRol(); 
  }

  Guardar(){
    const rol:Roles = {
      nombre: this.form.get('nombre')?.value,
      estado: 'Activo',
    }
    if(this.id == undefined){
      this.rolservice.PostRol(rol).subscribe(data => {
        Swal.fire({
          icon: 'success',
          title: 'Rol Registrado!'
        });
        this.ListaRol();
        this.form.reset();
      },error =>{
        Swal.fire({
          icon: 'error',
          title: 'Error en el Formulario',
          html: error.error.errors[Object.keys(error.error.errors)[0]]
        })
      });
    }
    else{
      rol.idrol ==this.id;
      //EDITAR
      this.rolservice.PutRol(this.id,rol).subscribe(x=>{
        this.accion="Modificar";
        Swal.fire({
          icon: 'success',
          title: 'Rol Modificado!'
        })
        this.ListaRol();
      },error =>{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '<a href="">Why do I have this issue?</a>'
        })
        //console.log(error);
      });
    }
  }

  Guardarinstruct(content:any){
    //Abrir Modal
    this.modalService.open(content);
    //Limpiar Form
    this.form.markAsUntouched();
    this.form.markAsPristine();
    
    this.id = undefined;
    this.form.patchValue({
      nombre: ""
    })
  }


  SeleccionarRol(content:any,rol:Roles){
    this.modalService.open(content);
    this.accion = "Editar";
    this.id=rol.idrol;
    this.form.patchValue({
      nombre:rol.nombre,
    })
  }

  CambiarEstado(rol: Roles, accion: string) {
    this.id = rol.idrol;
    if (this.id != undefined) {
      rol.estado = accion;
      this.rolservice
        .PutRol(this.id, rol)
        .subscribe((r) => {
          if (rol.estado == 'Inactivo') {
            Swal.fire({
              icon: 'error',
              title: 'El rol ha sido desactivado!',
            });
          } else {
            Swal.fire({
              icon: 'success',
              title: 'El rol ha sido activado',
            });
          }
          this.ListaRol();
        });
    }
  }

  async listadoRol() {
    await this.rolservice.ListarActivos().subscribe((data) => {
      this.listaRol = data;
      // console.log(data);
      this.pagesizee = this.listaRol.length;
    });
  }
}

