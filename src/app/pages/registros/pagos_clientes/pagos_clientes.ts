import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Estado } from '@/./services/estado_service/estado.model';
import { CheckboxModule } from 'primeng/checkbox';
import { EstadoService } from '@/services/estado_service/estado.service';
import { DrawerModule } from 'primeng/drawer';
import { PC } from '@/services/pagos_clientes_service/pagos_clientes.model';
import { PagosClientesService } from '@/services/pagos_clientes_service/pagos_clientes.service';
import { tesisclienteuniversidad_activas } from '@/services/tesis_service/tesisclienteuniversidadactivas.model';
import { TesisService } from '@/services/tesis_service/tesis.service';
import { EstadoPago } from '@/services/estado_service/estadopago.model';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-pagos_clientes',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        DrawerModule,
        FormsModule,
        ButtonModule,
        CheckboxModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './pagosclientes.components.html',
    providers: [MessageService, PagosClientesService, ConfirmationService]
})
export class Pagos_Clientes implements OnInit {
    pagoclienteDialogo: boolean = false;
    pagosclientes = signal<PC[]>([]);
    pagocliente: PC = {
        id: 0,
        tesis_id: 0,
        monto_tesis: 0,
        cuotas_id: 0,
        cuotas_pagadas_id: 0,
        monto_cuotas: 0,
        fecha_pago_inicial: '',
        fecha_pago_final: '',
        estado_pagos_id: 0,
        estado_id: 0,
        fecha_creacion: '',
        fecha_modificacion: '',
    };
    seleccionarPagosClientes!: Pagos_Clientes[] | null;
    enviar: boolean = false;
    isLoading: boolean = false;
    cols!: Column[];
    accion: number = 1;
    opcionesEstado: Estado[] = [];
    opcionesEstadoPago: EstadoPago[] = [];
    opcionesTesisClientesUniversidad_Activas: tesisclienteuniversidad_activas[] = [];
    estado = [
        { label: 'ACTIVO', value: 1 },
        { label: 'INACTIVO', value: 2 }
    ];

    estado_pago = [
        { label: 'CANCELADO', value: 1 },
        { label: 'PENDIENTE', value: 2 }
    ];

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    constructor(
        private pago_clienteService: PagosClientesService,
        private messageService: MessageService,
        private estadoService: EstadoService,
        private tesisService: TesisService
    ) {}

    async cargarPagosClientes() {
        this.isLoading = true;
        try {
            const response: PC[] = await this.pago_clienteService.getPagosClientes();
            console.log(response);
            this.pagosclientes.set(response);
        } catch (error) {
            console.error('Error al cargar los pagos de los clientes:', error);
        }
    }

    async cargarOpciones(service: () => Promise<any>, opcionesRef: Estado[], label: string) {
        try {
            const response = await service();
            opcionesRef.length = 0;
            response.forEach((item: Estado) => {
                opcionesRef.push({
                    id: item.id,
                    nombre: item.nombre
                });
            });
        } catch (error) {
            console.error(`Error al cargar ${label}:`, error);
        }
    }

    async ngOnInit() {
        this.isLoading = true;
        try {
            await Promise.all([this.cargarOpciones(this.tesisService.getTesisClientesUniversidadActivas.bind(this.estadoService), this.opcionesTesisClientesUniversidad_Activas, 'estado')]);
            await Promise.all([this.cargarOpciones(this.estadoService.getEstadoPagos.bind(this.estadoService), this.opcionesEstadoPago, 'estado pago')]);
            await Promise.all([this.cargarOpciones(this.estadoService.getEstado.bind(this.estadoService), this.opcionesEstado, 'estado')]);
            await this.cargarPagosClientes();
        } catch (error) {
            console.error('Error al cargar los clientes:', error);
        } finally {
            this.isLoading = false;
        }
    }

    abrirNuevo() {
        this.accion = 1;
        this.enviar = false;
        this.limpiarDatos();
        this.pagoclienteDialogo = true;
    }

    limpiarDatos() {
        this.pagocliente = {
            id: 0,
            tesis_id: 0,
            monto_tesis: 0,
            cuotas_id: 0,
            cuotas_pagadas_id: 0,
            monto_cuotas: 0,
            fecha_pago_inicial: '',
            fecha_pago_final: '',
            estado_pagos_id: 0,
            estado_id: 1,
            fecha_creacion: '',
            fecha_modificacion: ''
        };
    }

    ocultarDialogo() {
        this.pagoclienteDialogo = false;
        this.enviar = false;
    }

    getEstado(estado_id: number): string {
        switch (estado_id) {
            case 1:
                return 'ACTIVO';
            case 2:
                return 'INACTIVO';
            default:
                return 'ELIMINADO';
        }
    }

    getEstadoSeverity(estado_id: number): 'success' | 'danger' | 'info' {
        switch (estado_id) {
            case 1:
                return 'success';
            case 2:
                return 'danger';
            default:
                return 'info';
        }
    }

    getEstadoPago(estado_pago_id: number): string {
        switch (estado_pago_id) {
            case 1:
                return 'CANCELADO';
            case 2:
                return 'PENDIENTE';
            default:
                return 'ELIMINADO';
        }
    }

    getEstadoPagoSeverity(estado_pago_id: number): 'success' | 'danger' | 'info' {
        switch (estado_pago_id) {
            case 1:
                return 'success';
            case 2:
                return 'danger';
            default:
                return 'info';
        }
    }

    async guardarPagosClientes() {
        this.enviar = true;

        this.isLoading = true;
        try {
            const PagoClienteParaEnviar = {
                id: this.pagocliente.id,
                tesis: this.pagocliente.tesis_id,
                monto_tesis: this.pagocliente.monto_tesis,
                cuotas: this.pagocliente.cuotas_id,
                cuotas_pagadas: this.pagocliente.cuotas_pagadas_id,
                monto_cuotas: this.pagocliente.monto_cuotas,
                fecha_pago_inicial: this.pagocliente.fecha_pago_inicial,
                fecha_pago_final: this.pagocliente.fecha_pago_final,
                estado_pago: this.pagocliente.estado_pagos_id,
                estado: this.pagocliente.estado_id,
                fecha_creacion: this.pagocliente.fecha_creacion,
                fecha_modificacion: this.pagocliente.fecha_modificacion
            };

            const response = this.accion === 1 ? await this.pago_clienteService.createPagosClientes(PagoClienteParaEnviar) : await this.pago_clienteService.updatePagosClientes(this.pagocliente.id, PagoClienteParaEnviar);

            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: response.message_user || 'Operación exitosa' });
            await this.cargarPagosClientes();
            this.ocultarDialogo();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error inesperado';
            this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        } finally {
            this.isLoading = false;
        }
    }

    editarPagoCliente(pagocliente: PC) {
        this.pagocliente = { ...pagocliente };
        this.accion = 2;
        this.pagoclienteDialogo = true;
    }
    /*
    async eliminarCliente(cliente: Cliente) {
        const id = cliente.id;
        this.isLoading = true;
        try {
            const response = await this.clienteService.deleteCliente(id);
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: response.message_user });
            await this.cargarClientes();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error inesperado';
            this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        } finally {
            this.isLoading = false;
        }
    }*/
}
