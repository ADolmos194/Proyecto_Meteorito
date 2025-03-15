import { Routes } from '@angular/router';
import { Clientes } from './clientes/clientes';
import { Tesis } from './tesis/tesis';
import { Pagos_Clientes } from './pagos_clientes/pagos_clientes';

export default [
    { path: 'pagos_clientes', component: Pagos_Clientes },
    { path: 'clientes', component: Clientes },
    { path: 'tesis', component: Tesis },
] as Routes;
