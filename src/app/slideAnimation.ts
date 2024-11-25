import {
    animate,
    animateChild,
    group,
    query,
    style,
    transition,
    trigger
} from '@angular/animations';

// export const slideInAnimation = trigger('routeAnimations', [
//     transition('* => admin-usuarios', [
//         ...resetRoute,
//         query(':enter', [style({ transform: 'translateX(100%)', opacity: 0 })], {
//             optional: true,
//         }),
//         group([
//             query(
//                 ':leave',
//                 [animate('0.5s', style({ transform: 'translateX(-100%)', opacity: 0 }))],
//                 { optional: true }
//             ),
//             query(
//                 ':enter',
//                 [animate('1s ease-in-out', style({ transform: 'translateX(0)', opacity: 1 }))],
//                 { optional: true }
//             ),
//         ]),
//     ]),
//     transition('home => about', [
//         style({ backgroundColor: 'red' })
//     ])
// ]);
export const slideInAnimation =
    trigger('routeAnimations', [
        transition('admin-usuarios <=> solicitar-turno-admin', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ]),
            query(':enter', [
                style({ left: '100%' })
            ], { optional: true }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('300ms ease-out', style({ left: '-100%' }))
                ], { optional: true }),
                query(':enter', [
                    animate('300ms ease-out', style({ left: '0%' }))
                ], { optional: true }),
            ]),
        ]),
        transition('ver-turnos-admin <=> solicitar-turno-admin', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ]),
            query(':enter', [
                style({ left: '100%' })
            ], { optional: true }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('300ms ease-out', style({ left: '-100%' }))
                ], { optional: true }),
                query(':enter', [
                    animate('300ms ease-out', style({ left: '0%' }))
                ], { optional: true }),
            ]),
        ]),
        transition('ver-turnos-admin <=> informes', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ]),
            query(':enter', [
                style({ left: '100%' })
            ], { optional: true }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('300ms ease-out', style({ left: '-100%' }))
                ], { optional: true }),
                query(':enter', [
                    animate('300ms ease-out', style({ left: '0%' }))
                ], { optional: true }),
            ]),
        ]),
        transition('admin-usuarios <=> informes', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ]),
            query(':enter', [
                style({ left: '100%' })
            ], { optional: true }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('300ms ease-out', style({ left: '-100%' }))
                ], { optional: true }),
                query(':enter', [
                    animate('300ms ease-out', style({ left: '0%' }))
                ], { optional: true }),
            ]),
        ]),
        transition('admin-usuarios <=> ver-turnos-admin', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ]),
            query(':enter', [
                style({ left: '100%' })
            ], { optional: true }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('300ms ease-out', style({ left: '-100%' }))
                ], { optional: true }),
                query(':enter', [
                    animate('300ms ease-out', style({ left: '0%' }))
                ], { optional: true }),
            ]),
        ]),
        transition('informes <=> ver-turnos-admin', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ]),
            query(':enter', [
                style({ left: '100%' })
            ], { optional: true }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('300ms ease-out', style({ left: '-100%' }))
                ], { optional: true }),
                query(':enter', [
                    animate('300ms ease-out', style({ left: '0%' }))
                ], { optional: true }),
            ]),
        ]),
        transition('informes <=> solicitar-turno-admin', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ]),
            query(':enter', [
                style({ left: '100%' })
            ], { optional: true }),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('300ms ease-out', style({ left: '-100%' }))
                ], { optional: true }),
                query(':enter', [
                    animate('300ms ease-out', style({ left: '0%' }))
                ], { optional: true }),
            ]),
        ]),
        transition('perfil-paciente <=> solicitar-turno', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: 'translateY(100%)'
                })
            ]),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('300ms ease-out', style({
                        transform: 'translateY(100%)', // Mover hacia abajo fuera de la vista
                    }))
                ], { optional: true }),

                query(':enter', [
                    animate('300ms ease-out', style({
                        transform: 'translateY(0%)', // Mover a su posición original
                    }))
                ], { optional: true })
            ]),
        ]),
        transition('perfil-paciente <=> ver-turnos-paciente', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: 'translateY(100%)'
                })
            ]),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('300ms ease-out', style({
                        transform: 'translateY(100%)', // Mover hacia abajo fuera de la vista
                    }))
                ], { optional: true }),

                query(':enter', [
                    animate('300ms ease-out', style({
                        transform: 'translateY(0%)', // Mover a su posición original
                    }))
                ], { optional: true })
            ]),
        ]),
        transition('solicitar-turno <=> ver-turnos-paciente', [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: 'translateY(100%)'
                })
            ]),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('300ms ease-out', style({
                        transform: 'translateY(100%)', // Mover hacia abajo fuera de la vista
                    }))
                ], { optional: true }),

                query(':enter', [
                    animate('300ms ease-out', style({
                        transform: 'translateY(0%)', // Mover a su posición original
                    }))
                ], { optional: true })
            ]),
        ]),
    ]);