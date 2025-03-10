// @/plugins/axios.js
import axios from 'axios';

// URL base de la API
export const api_url = 'https://proyectometeorito-backend-604aeb96f320.herokuapp.com/ ';

// Crea la instancia de axios
export const axiosIns = axios.create({
    baseURL: api_url,
});
