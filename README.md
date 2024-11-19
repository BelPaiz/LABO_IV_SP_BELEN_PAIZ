# Clinica Sana Sana

 [Angular Web App:](https://sana-sana-app.web.app/)

 ![Pagina de inicio](./src/assets/images/readme/Captura%20de%20pantalla%202024-11-19%20172532.png)

 ## Tecnologías y Versiones

Este proyecto utiliza las siguientes tecnologías:

| Tecnología    | Versión  |
|---------------|----------|
| **Angular**   | 18.2.4   |
| **Bootstrap** | 5.3.3    |
| **Firebase**  | 10.14.1  |


## Tipos de Usuarios del proyecto

|TIPO           | REQUISITOS                                                                                    | ACCIONES                                                  |
|---------------|-----------------------------------------------------------------------------------------------|-----------------------------------------------------------|
|ADMINISTRADOR  | El alta de un usuario administrador solo puede ser realizada por otro usuario administrador,  |Alta de usuarios ( administradores, especialistas,         | 
|               | posteriormente el nuevo usuario deberá validar su email, mediante el enlace que le llegrá     |pacientes). Alta de turnos, visualización de turnos,       |
|               | en el email de verificación.                                                                  | visualización y listados de usuarios                      |
|               |                                                                                               |                                                           |
|ESPECIALISTA   | Crear una cuenta en /registro_especialista, verificar el email, luego un usuario admin        |Mantener actualizada su disponibilidad horaria.            |
|               | deberá habilitar al especialista desde el listado de usuarios especialistas.                  |Aceptar, rechazar, cancelar, finalizar los turnos          |
|               |                                                                                               |                                                           |
|PACIENTE       |Crear una cuenta en /registro_paciente y verificar su email.                                   | Solicitar turnos. Visualización de turnos en apartado     |
|               |                                                                                               |  /ver-turnos-paciente                                     |

## Rutas de la Aplicación

| Ruta                       | Descripción                                     | Acceso                     |
|----------------------------|-------------------------------------------------|----------------------------|
| `/home`                    | Página principal                               | Todos los usuarios         |
| `/login`                   | Página de inicio de sesión                     | Todos los usuarios         |
| `/registro`                | Antesala del registro de usuario               | Todos los usuarios         |
| `/registro_paciente`       | Registro de pacientes                          | Todos los usuarios         |
| `/registro_especialista`   | Registro de especialistas                      | Todos los usuarios         |
| `/registro-admin`          | Registro de administradores                    | Administradores            |
| `/admin-usuarios`          | Gestión de usuarios por el administrador       | Administradores            |
| `/perfil-especialista`     | Perfil del especialista                        | Especialistas              |
| `/perfil-paciente`         | Perfil del paciente                            | Pacientes                  |
| `/solicitar-turno`         | Solicitud de turnos                            | Pacientes                  |
| `/solicitar-turno-admin`   | Gestión de solicitudes de turno por admin      | Administradores            |
| `/ver-turnos-admin`        | Vista de turnos para el administrador          | Administradores            |
| `/ver-turnos-paciente`     | Vista de turnos para el paciente               | Pacientes                  |
| `/ver-turnos-especialista` | Vista de turnos para el especialista           | Especialistas              |

## registro
![registro](./src/assets/images/readme/Captura%20de%20pantalla%202024-11-19%20175517.png "Antesala al formulario del registro")

## registro_paciente
![registro_paciente](./src/assets/images/readme/Captura%20de%20pantalla%202024-11-19%20180053.png "Formulario de registro de paciente")

## admin-usuarios
![admin-usuarios](./src/assets/images/readme/Captura%20de%20pantalla%202024-11-19%20180248.png "Gestión de usuarios / administrador")

## solicitar-turno
![solicitar-turno](./src/assets/images/readme/Captura%20de%20pantalla%202024-11-19%20180405.png "Solicitud de turnos / Pacientes y Administradores")

## ver-turnos-admin
![ver-turnos-admin](./src/assets/images/readme/Captura%20de%20pantalla%202024-11-19%20180516.png "Visualización de turnos / Administrador")

## ver-turnos-paciente
![ver-turnos-paciente](./src/assets/images/readme/Captura%20de%20pantalla%202024-11-19%20180706.png "Actualizacion de estado de turno / Especialista")

