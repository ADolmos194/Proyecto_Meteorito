// @/plugins/axios.d.ts
import { AxiosInstance } from 'axios';

declare module '@/plugins/axios' {
    const axiosIns: AxiosInstance;
    const api_url: string;  // Declaramos api_url si es necesario
    export { axiosIns, api_url };
}
