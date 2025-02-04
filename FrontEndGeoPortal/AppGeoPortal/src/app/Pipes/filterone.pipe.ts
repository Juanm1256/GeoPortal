import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterone'
})
export class FilteronePipe implements PipeTransform {

  transform(myObject: any[], campo:string, input: any) {
    if (!input) return myObject;
    //tabla con multiples tablas sin un llamado de otro object 
    //tabla con multiples tablas
    //Filtro estudiante y administrador
    
    
    //Buscador de Rol
    if(campo==="nombrerol"){
      const result=[];
      for (const rol of myObject) {
        if (rol.nombre.toLocaleLowerCase().indexOf(input.toLocaleLowerCase())>-1) {
          result.push(rol);
          
        }
        
      }
      
      return result;
    }

    //tabla individual
    return myObject.filter(val => this.porFiltrado(val, campo, input));
    
  }

  private porFiltrado(
    myObject: any,
    campo:string,
    search: any
  ){
    const reduced = Object.keys(myObject)
    .reduce((prev, current)=> this.reducirllaves(prev, current, myObject, campo), "")
    .toLocaleLowerCase();
    
    return reduced.indexOf(search.toLocaleLowerCase()) > -1;
  }

  private reducirllaves(
    prev:any,
    current: any,
    myObject:any,
    campo:string
  ): any {
    if (this.esPilar(current,campo)) {
      prev=`${prev}\$${myObject[current]}`;
      // console.log('p');
    }
    return prev;
  }

  private esPilar(key:any, campo:string): boolean {
    // console.log(key.includes(campo));
    return key.includes(campo);
  }
}
