import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { AutenticacionService } from '@/services/login_service/login.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, ToastModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    templateUrl: './login.components.html',
    providers: [MessageService, ConfirmationService]
})
export class Login {
    username: string = '';

    password: string = '';

    isLoading: boolean = false;

    checked: boolean = false;

    constructor(
        private autenticacionService: AutenticacionService,
        private router: Router,
        private messageService: MessageService,) { }

        async onLogin() {
            this.isLoading = true;
            try {
                const response = await this.autenticacionService.loginUsuario(this.username, this.password);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: response.message_user || 'Inicio de sesión exitoso'
                });

                localStorage.setItem('user', JSON.stringify(response.data)); // Guarda el usuario

                await new Promise(resolve => setTimeout(resolve, 1500));

                this.router.navigate(['/']); 
            } catch (error) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Usuario o contraseña incorrectos'
                });

                console.error('Error al iniciar sesión:', error);
            } finally {
                this.isLoading = false;
            }
        }

}
