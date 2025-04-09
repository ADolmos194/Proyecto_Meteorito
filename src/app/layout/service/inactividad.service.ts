import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from '@/services/login_service/login.service';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class InactividadService {
    private timer: any;
    private readonly TIEMPO_INACTIVO = 60 * 60 * 1000;

    constructor(
        private router: Router,
        private autenticacionService: AutenticacionService,
        private messageService: MessageService,
        private ngZone: NgZone
    ) { }

    iniciarInactividad() {
        this.resetTimer();

        document.body.addEventListener('mousemove', this.resetTimer.bind(this));
        document.body.addEventListener('keydown', this.resetTimer.bind(this));
        document.body.addEventListener('click', this.resetTimer.bind(this));
        document.body.addEventListener('scroll', this.resetTimer.bind(this));
    }

    private resetTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
            this.cerrarSesion();
        }, this.TIEMPO_INACTIVO);
    }

    private cerrarSesion() {
        this.messageService.add({
            severity: 'warn',
            summary: 'Sesión Cerrada',
            detail: 'La sesión se ha cerrado por inactividad.',
            life: 3000,
        });

        this.autenticacionService.logoutUser().then(() => {
            this.router.navigate(['/auth/login']);
        }).catch(() => {
            console.error('Error al cerrar la sesión');
        });
    }
}
