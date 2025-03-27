export interface PC {
    id: number;
    tesis_id: number;
    nombre_cliente_universidad: string;
    monto_tesis: number;
    cuotas: string;
    estado_id: number;
    fecha_creacion: string;
    fecha_modificacion: string;
    detalles_pago: DetallePago[];
}

export interface DetallePago {
    id: number;
    pagosclientes_id: number;
    cuotaspagadas: string;
    monto_cuotas:number;
    fechapago: string;
    estado_pago_id: number;
    estado_id: number;
}
