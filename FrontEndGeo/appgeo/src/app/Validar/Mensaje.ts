export class Mensaje {
    public mensajes = {
        //Rol
        'nombrerol': [
            { type: 'required', message: 'El Nombre del rol es requerido.' },
            { type: 'maxlength', message: 'La Nombre debe tener menos de 25 caracteres.' },
            { type: 'pattern', message: 'El Nombre debe tener solo letras.' }
        ],
        'permisosrol': [
            { type: 'required', message: 'El Nombre del rol es requerido.' },
            { type: 'maxlength', message: 'La Nombre debe tener menos de 25 caracteres.' },
            { type: 'pattern', message: 'El Nombre debe tener solo letras.' }
        ],

        //Usuarios
        'username': [
            { type: 'required', message: 'El username es requerido.' },
            { type: 'maxlength', message: 'El username no puede tener más de 50 caracteres.' },
            { type: 'pattern', message: 'El username solo puede contener letras y números.' }
        ],
        'password': [
            { type: 'required', message: 'La contraseña es requerida.' },
            { type: 'minlength', message: 'La contraseña debe tener al menos 6 caracteres.' }
        ],
        'nombres': [
            { type: 'required', message: 'El nombres es requerido.' },
            { type: 'maxlength', message: 'El nombres no puede tener más de 50 caracteres.' },
            { type: 'pattern', message: 'El nombres solo puede contener letras y números.' }
        ],
        'apellidos': [
            { type: 'required', message: 'El apellidos es requerido.' },
            { type: 'maxlength', message: 'El apellidos no puede tener más de 50 caracteres.' },
            { type: 'pattern', message: 'El apellidos solo puede contener letras y números.' }
        ],
        'ci': [
            { type: 'required', message: 'El ci es requerido.' },
            { type: 'maxlength', message: 'El ci no puede tener más de 50 caracteres.' },
            { type: 'pattern', message: 'El ci solo puede contener letras y números.' }
        ],

        //Login
        'usuario': [
            { type: 'required', message: 'El username es requerido.' },
            { type: 'maxlength', message: 'El username no puede tener más de 50 caracteres.' },
            { type: 'pattern', message: 'El username solo puede contener letras y números.' }
        ],
        'contraseña': [
            { type: 'required', message: 'La contraseña es requerida.' },
            { type: 'minlength', message: 'La contraseña debe tener al menos 6 caracteres.' }
        ]

    }
}