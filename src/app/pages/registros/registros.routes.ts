import { Routes } from '@angular/router';
import { Clientes } from './clientes/clientes';
import { Universidad } from './universidad/universidad';

export default [
    { path: 'clientes', component: Clientes },
    { path: 'universidad', component: Universidad },
] as Routes;
