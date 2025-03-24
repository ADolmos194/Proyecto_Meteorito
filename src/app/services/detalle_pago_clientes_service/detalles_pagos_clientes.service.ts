import { Injectable } from '@angular/core';
import { axiosIns, api_url } from '@/plugins/axios';

export const url = api_url;
export const endpoints = {
    detallespagosclientes: "registros/detallespagosclientes/",
};

@Injectable({
    providedIn: 'root',
})
export class DetallesPagosClientesService {
    async getDetallesPagosClientes() {
        try {
            const response = await axiosIns.get(`${url}${endpoints.detallespagosclientes}`);
            console.log('Detalles de pago del cliente:', response.data.data);
            return response.data.data;
        } catch (error) {
            console.error('Error al obtener los detalle de pago del cliente:', error);
            throw error;
        }
    }
}
