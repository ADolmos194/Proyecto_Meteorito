import axios from 'axios';


export const api_url = 'https://curious-alice-proyecto-meteorito-backend-030d8df1.koyeb.app/';

// Crea la instancia de axios
export const axiosIns = axios.create({
    baseURL: api_url,
});

