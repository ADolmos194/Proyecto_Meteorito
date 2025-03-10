import { Routes } from '@angular/router';
import { Clientes } from './clientes/clientes';
import { Tesis } from './tesis/tesis';

export default [
    { path: 'clientes', component: Clientes },
    { path: 'tesis', component: Tesis },
] as Routes;
