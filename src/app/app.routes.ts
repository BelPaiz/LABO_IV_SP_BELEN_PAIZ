import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroAdminComponent } from './componentes/registro-admin/registro-admin.component';
import { adminGuard } from './guards/admin.guard';
import { especialistaGuard } from './guards/especialista.guard';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },

    { path: 'registro_paciente', loadComponent: () => import('./componentes/registro-paciente/registro-paciente.component').then(c => c.RegistroPacienteComponent) },

    { path: 'registro', loadComponent: () => import('./componentes/registro/registro.component').then(c => c.RegistroComponent) },

    { path: 'registro_especialista', loadComponent: () => import('./componentes/registro-especialista/registro-especialista.component').then(c => c.RegistroEspecialistaComponent) },

    { path: 'registro-admin', component: RegistroAdminComponent },
    {
        path: 'admin-usuarios', loadComponent: () => import('./componentes/admin-usuarios/admin-usuarios.component').then(c => c.AdminUsuariosComponent),
        canActivate: [adminGuard],
    },
    {
        path: 'perfil-especialista', loadComponent: () => import('./componentes/especialista-perfil/especialista-perfil.component').then(c => c.EspecialistaPerfilComponent),
        canActivate: [especialistaGuard],
    },
    {
        path: 'perfil-paciente', loadComponent: () => import('./componentes/paciente-perfil/paciente-perfil.component').then(c => c.PacientePerfilComponent),
        ...canActivate(() => redirectUnauthorizedTo(['/login']))
    },
    {
        path: 'solicitar-turno', loadComponent: () => import('./componentes/solicitar-turno/solicitar-turno.component').then(c => c.SolicitarTurnoComponent),
        ...canActivate(() => redirectUnauthorizedTo(['/login']))
    },
    {
        path: 'solicitar-turno-admin', loadComponent: () => import('./componentes/solicitar-turno-admin/solicitar-turno-admin.component').then(c => c.SolicitarTurnoAdminComponent),
        canActivate: [adminGuard],
    },
    {
        path: 'ver-turnos-admin', loadComponent: () => import('./componentes/ver-turnos-admin/ver-turnos-admin.component').then(c => c.VerTurnosAdminComponent),
        canActivate: [adminGuard],
    },
    {
        path: 'ver-turnos-paciente', loadComponent: () => import('./componentes/ver-turnos-paciente/ver-turnos-paciente.component').then(c => c.VerTurnosPacienteComponent),
        ...canActivate(() => redirectUnauthorizedTo(['/login']))
    },
    {
        path: 'ver-turnos-especialista', loadComponent: () => import('./componentes/ver-turnos-especialista/ver-turnos-especialista.component').then(c => c.VerTurnosEspecialistaComponent),

    }



];
