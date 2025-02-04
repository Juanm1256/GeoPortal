export class Mensaje {
    public mensajes = {
        //Rol
        'rolnom': [
            { type: 'required', message: 'El Nombre del rol es requerido.' },
            { type: 'maxlength', message: 'La Nombre debe tener menos de 25 caracteres.' },
            { type: 'pattern', message: 'El Nombre debe tener solo letras.' }
        ],
      }
}