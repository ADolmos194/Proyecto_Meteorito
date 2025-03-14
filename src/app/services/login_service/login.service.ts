import { Injectable } from '@angular/core';
import { axiosIns, api_url } from '@/plugins/axios';

export const url = api_url;
export const endpoints = {
    login: "autenticacion/login/",
    logout: "autenticacion/logout/",
};

@Injectable({
    providedIn: 'root',
})
export class AutenticacionService {
    async loginUsuario(username: string, password: string) {
        try {
            const response = await axiosIns.post(`${url}${endpoints.login}`, { username, password });

            if (response.data?.data?.token) {
                localStorage.setItem('user', JSON.stringify(response.data.data));
                axiosIns.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
            }

            return response.data;
        } catch (error: any) {
            this.handleError(error);
        }
    }

    async logoutUser() {
        try {
            await axiosIns.post(`${url}${endpoints.logout}`);
            localStorage.removeItem('user');
            delete axiosIns.defaults.headers.common['Authorization'];
        } catch (error: any) {
            this.handleError(error);
        }
    }

    private handleError(error: any) {
        if (error.response) {
            console.error(`Error ${error.response.status}:`, error.response.data);
        } else if (error.request) {
            console.error('No se recibió respuesta del servidor:', error.request);
        } else {
            console.error('Error en la configuración de la petición:', error.message);
        }
        throw error;
    }
}
