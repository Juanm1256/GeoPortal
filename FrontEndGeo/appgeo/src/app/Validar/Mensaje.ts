export class Mensaje {
    public mensajes: { [key: string]: { type: string; message: string }[] } = {
        'nombre': [
            { type: 'required', message: 'El Nombre del rol es requerido.' },
            { type: 'maxlength', message: 'El Nombre debe tener menos de 25 caracteres.' },
            { type: 'pattern', message: 'El Nombre debe tener solo letras.' }
        ],
        'username': [
            { type: 'required', message: 'El nombre de usuario es requerido.' },
            { type: 'maxlength', message: 'El nombre de usuario no puede tener más de 50 caracteres.' },
            { type: 'pattern', message: 'El nombre de usuario solo puede contener letras y números.' }
        ],
        'password': [
            { type: 'required', message: 'La contraseña es requerida.' },
            { type: 'minlength', message: 'La contraseña debe tener al menos 6 caracteres.' },
            { type: 'pattern', message: 'La contraseña debe incluir una mayúscula, una minúscula y un número.' }
        ],
        'nombres': [
            { type: 'required', message: 'Los nombres son requeridos.' },
            { type: 'maxlength', message: 'Los nombres no pueden tener más de 50 caracteres.' },
            { type: 'pattern', message: 'Los nombres solo pueden contener letras.' }
        ],
        'apellidos': [
            { type: 'required', message: 'Los apellidos son requeridos.' },
            { type: 'maxlength', message: 'Los apellidos no pueden tener más de 50 caracteres.' },
            { type: 'pattern', message: 'Los apellidos solo pueden contener letras.' }
        ],
        'ci': [
            { type: 'required', message: 'El CI es requerido.' },
            { type: 'maxlength', message: 'El CI no puede tener más de 50 caracteres.' },
            { type: 'pattern', message: 'El CI solo puede contener letras y números.' }
        ],
        'usuario': [
            { type: 'required', message: 'El nombre de usuario es requerido.' },
            { type: 'maxlength', message: 'El nombre de usuario no puede tener más de 50 caracteres.' },
            { type: 'pattern', message: 'El nombre de usuario solo puede contener letras y números.' }
        ],
        'contraseña': [
            { type: 'required', message: 'La contraseña es requerida.' },
            { type: 'minlength', message: 'La contraseña debe tener al menos 6 caracteres.' },
            { type: 'pattern', message: 'La contraseña debe incluir una mayúscula, una minúscula y un número.' }
        ]
    };
}
