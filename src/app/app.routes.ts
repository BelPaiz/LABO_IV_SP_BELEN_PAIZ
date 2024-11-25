import { Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroAdminComponent } from './componentes/registro-admin/registro-admin.component';
import { adminGuard } from './guards/admin.guard';
import { especialistaGuard } from './guards/especialista.guard';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { pacienteGuard } from './guards/paciente.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent, data: { animation: 'login' } },
    { path: 'registro', loadComponent: () => import('./componentes/registro/registro.component').then(c => c.RegistroComponent) },
    { path: 'registro_paciente', loadComponent: () => import('./componentes/registro-paciente/registro-paciente.component').then(c => c.RegistroPacienteComponent) },
    { path: 'registro_especialista', loadComponent: () => import('./componentes/registro-especialista/registro-especialista.component').then(c => c.RegistroEspecialistaComponent) },
    { path: 'registro-admin', component: RegistroAdminComponent },
    {
        path: 'admin-usuarios', loadComponent: () => import('./componentes/admin-usuarios/admin-usuarios.component').then(c => c.AdminUsuariosComponent),
        canActivate: [adminGuard],
        data: { animation: 'admin-usuarios' }
    },
    {
        path: 'solicitar-turno-admin', loadComponent: () => import('./componentes/solicitar-turno-admin/solicitar-turno-admin.component').then(c => c.SolicitarTurnoAdminComponent),
        canActivate: [adminGuard], data: { animation: 'solicitar-turno-admin' }
    },
    {
        path: 'ver-turnos-admin', loadComponent: () => import('./componentes/ver-turnos-admin/ver-turnos-admin.component').then(c => c.VerTurnosAdminComponent),
        canActivate: [adminGuard], data: { animation: 'ver-turnos-admin' }
    },
    {
        path: 'informes', loadComponent: () => import('./componentes/informes/informes.component').then(c => c.InformesComponent),
        canActivate: [adminGuard], data: { animation: 'informes' }
    },
    {
        path: 'logs-ingresos', loadComponent: () => import('./componentes/logs-ingresos/logs-ingresos.component').then(c => c.LogsIngresosComponent),
        canActivate: [adminGuard],
    },
    {
        path: 'informes-2', loadComponent: () => import('./componentes/informes-2/informes-2.component').then(c => c.Informes2Component),
        canActivate: [adminGuard],
    },
    {
        path: 'informes-3', loadComponent: () => import('./componentes/informe-3/informe-3.component').then(c => c.Informe3Component),
        canActivate: [adminGuard],
    },
    {
        path: 'informes-4', loadComponent: () => import('./componentes/informe-4/informe-4.component').then(c => c.Informe4Component),
        canActivate: [adminGuard],
    },
    {
        path: 'perfil-paciente', loadComponent: () => import('./componentes/paciente-perfil/paciente-perfil.component').then(c => c.PacientePerfilComponent),
        canActivate: [pacienteGuard], data: { animation: 'perfil-paciente' }
    },
    {
        path: 'solicitar-turno', loadComponent: () => import('./componentes/solicitar-turno/solicitar-turno.component').then(c => c.SolicitarTurnoComponent),
        ...canActivate(() => redirectUnauthorizedTo(['/login'])), data: { animation: 'solicitar-turno' }
    },
    {
        path: 'ver-turnos-paciente', loadComponent: () => import('./componentes/ver-turnos-paciente/ver-turnos-paciente.component').then(c => c.VerTurnosPacienteComponent),
        canActivate: [pacienteGuard], data: { animation: 'ver-turnos-paciente' }
    },
    {
        path: 'perfil-especialista', loadComponent: () => import('./componentes/especialista-perfil/especialista-perfil.component').then(c => c.EspecialistaPerfilComponent),
        canActivate: [especialistaGuard],
    },
    {
        path: 'ver-turnos-especialista', loadComponent: () => import('./componentes/ver-turnos-especialista/ver-turnos-especialista.component').then(c => c.VerTurnosEspecialistaComponent),
        canActivate: [especialistaGuard],
    },
    {
        path: 'completar-hc', loadComponent: () => import('./componentes/completar-hc/completar-hc.component').then(c => c.CompletarHcComponent),
        canActivate: [especialistaGuard],
    },
    {
        path: 'mis-pacientes', loadComponent: () => import('./componentes/mis-pacientes/mis-pacientes.component').then(c => c.MisPacientesComponent),
        canActivate: [especialistaGuard],
    },
    {
        path: 'historia-clinica', loadComponent: () => import('./componentes/historia-clinica/historia-clinica.component').then(c => c.HistoriaClinicaComponent),
        ...canActivate(() => redirectUnauthorizedTo(['/login']))
    },



];
