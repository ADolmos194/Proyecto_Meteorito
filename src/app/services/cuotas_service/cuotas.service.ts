import { Injectable } from '@angular/core';
import { axiosIns, api_url } from '@/plugins/axios';

export const url = api_url;
export const endpoints = {
    cuotas: "app/cuotas/",
    cuotaspagadas: "app/cuotaspagadas/"
};

@Injectable({
    providedIn: 'root',
})
export class CuotasService {
    async getCuotas() {
        try {
            const response = await axiosIns.get(`${url}${endpoints.cuotas}`);
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener las cuotas:', error);
            throw error;
        }
    }

    async getCuotasPagadas() {
        try {
            const response = await axiosIns.get(`${url}${endpoints.cuotaspagadas}`);
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener las cuotas pagadas:', error);
            throw error;
        }
    }
}
