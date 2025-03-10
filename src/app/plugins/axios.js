import axios from 'axios';


export const api_url = 'https://proyectometeoritobackend-production.up.railway.app/';

// Crea la instancia de axios
export const axiosIns = axios.create({
    baseURL: api_url,
});

