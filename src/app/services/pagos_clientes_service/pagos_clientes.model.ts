export interface PagosClientes {
    id: number;
    tesis_id : number;
    monto_tesis : number;
    cuotas_id : number;
    cuotas_pagadas_id : number;
    monto_cuotas : number;
    fecha_pago_inicial : string;
    fecha_pago_final : string;
    estado_pagos_id : number;
    estado_id : number;
    fecha_creacion : string;
    fecha_modificacion : string;
}
