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
import { ClienteService } from '@/services/clientes_service/clientes.service';
import { Cliente } from './clientes.model';
import { Estado } from '@/./services/estado_service/estado.model';
import { CheckboxModule } from 'primeng/checkbox';
import { EstadoService } from '@/services/estado_service/estado.service';
import { TipoDocumento } from '@/services/tipodocumento_service/tipodocumento.model';
import { TipoDocumentoService } from '@/services/tipodocumento_service/tipodocumento.service';
import { DrawerModule } from 'primeng/drawer';

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
    selector: 'app-clientes',
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
    templateUrl: './clientes.components.html',
    providers: [MessageService, ClienteService, ConfirmationService]
})
export class Clientes implements OnInit {
    clienteDialogo: boolean = false;
    clientes = signal<Cliente[]>([]);
    cliente: Cliente = {
        id: 0,
        tipodocumento_id: 0,
        nro_documento: '',
        nombre_completo: '',
        correo_electronico: '',
        nro_celular: '',
        estado_id: 1,
        fecha_creacion: '',
        fecha_modificacion: ''
    };
    seleccionarClientes!: Cliente[] | null;
    enviar: boolean = false;
    isLoading: boolean = false;
    cols!: Column[];
    accion: number = 1;
    opcionesEstado: Estado[] = [];
    opcionesTipodocumento: TipoDocumento[] = [];

    estado = [
        { label: 'ACTIVO', value: 1 },
        { label: 'INACTIVO', value: 2 }
    ];

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    constructor(
        private clienteService: ClienteService,
        private messageService: MessageService,
        private estadoService: EstadoService,
        private tipodocumentoService: TipoDocumentoService
    ) {}

    async cargarClientes() {
        try {
            const response: Cliente[] = await this.clienteService.getClientes();
            const TipoDocumento = response.map((cliente: Cliente) => {
                const tipodocumento = this.opcionesTipodocumento.find((e) => e.id === cliente.tipodocumento_id);
                return {
                    ...cliente,
                    tipodocumento_nombre: tipodocumento ? tipodocumento.nombre : 'Desconocido'
                };
            });
            this.clientes.set(TipoDocumento);
        } catch (error) {
            console.error('Error al cargar los clientes:', error);
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
            await Promise.all([this.cargarOpciones(this.tipodocumentoService.getTipoDocumento.bind(this.tipodocumentoService), this.opcionesTipodocumento, 'tipo documento')]);
            await Promise.all([this.cargarOpciones(this.estadoService.getEstado.bind(this.estadoService), this.opcionesEstado, 'estado')]);
            await this.cargarClientes();
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
        this.clienteDialogo = true;
    }

    limpiarDatos() {
        this.cliente = {
            id: 0,
            tipodocumento_id: 0,
            nro_documento: '',
            nombre_completo: '',
            correo_electronico: '',
            nro_celular: '',
            estado_id: 1,
            fecha_creacion: '',
            fecha_modificacion: ''
        };
    }

    ocultarDialogo() {
        this.clienteDialogo = false;
        this.enviar = false;
    }

    async guardarClientes() {
        this.isLoading = true;
        try {

            const clienteParaEnviar = {
                id: this.cliente.id,
                tipodocumento: this.cliente.tipodocumento_id,
                nro_documento: this.cliente.nro_documento,
                nombre_completo: this.cliente.nombre_completo,
                correo_electronico: this.cliente.correo_electronico,
                nro_celular: this.cliente.nro_celular,
                estado: this.cliente.estado_id,
                fecha_creacion: this.cliente.fecha_creacion,
                fecha_modificacion: this.cliente.fecha_modificacion
            };

            const response = this.accion === 1
                ? await this.clienteService.createCliente(clienteParaEnviar)
                : await this.clienteService.updateCliente(this.cliente.id, clienteParaEnviar);

            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: response.message_user || 'Operación exitosa' });
            await this.cargarClientes();
            this.ocultarDialogo();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error inesperado';
            this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        } finally {
            this.isLoading = false;
        }
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

    editarCliente(cliente: Cliente) {
        this.cliente = { ...cliente };
        this.accion = 2;
        this.clienteDialogo = true;
    }

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
    }
}
