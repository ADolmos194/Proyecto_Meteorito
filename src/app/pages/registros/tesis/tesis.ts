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
import { TesisService } from '@/services/tesis_service/tesis.service';
import { Tesi } from '@/services/tesis_service/tesis.model';
import { Estado } from '@/./services/estado_service/estado.model';
import { CheckboxModule } from 'primeng/checkbox';
import { EstadoService } from '@/services/estado_service/estado.service';
import { DrawerModule } from 'primeng/drawer';
import { ClienteService } from '@/services/clientes_service/clientes.service';
import { Clientesactivos } from '@/services/clientes_service/clientesactivos.model';

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
    selector: 'app-tesis',
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
    templateUrl: './tesis.components.html',
    providers: [MessageService, TesisService, ConfirmationService]
})
export class Tesis implements OnInit {
    tesisDialogo: boolean = false;
    tesis = signal<Tesi[]>([]);
    ttesiss: Tesi = {
        id: 0,
        clientes_id: 0,
        nombre_completo:'',
        nombre_tesis: '',
        universidad: '',
        usuario_plataforma: '',
        clave_plataforma: '',
        estado_id: 1,
        fecha_creacion: '',
        fecha_modificacion: '',
    };
    seleccionarTesis!: Tesis[] | null;
    enviar: boolean = false;
    isLoading: boolean = false;
    cols!: Column[];
    accion: number = 1;
    opcionesEstado: Estado[] = [];
    opcionesClientes: Clientesactivos[] = [];

    estado = [
        { label: 'ACTIVO', value: 1 },
        { label: 'INACTIVO', value: 2 }
    ];

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    constructor(
        private tesisService: TesisService,
        private messageService: MessageService,
        private estadoService: EstadoService,
        private clienteService: ClienteService
    ) {}

    async cargarTesis() {
        this.isLoading = true;
        try {
            const response: Tesi[] = await this.tesisService.getTesis();
            this.tesis.set(response);
        } catch (error) {
            console.error('Error al cargar las tesis:', error);
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
            await Promise.all([this.cargarOpciones(this.clienteService.getClientesActivos.bind(this.clienteService), this.opcionesClientes, 'clientes')]);
            await Promise.all([this.cargarOpciones(this.estadoService.getEstado.bind(this.estadoService), this.opcionesEstado, 'estado')]);
            await this.cargarTesis();
        } catch (error) {
            console.error('Error al cargar las tesis:', error);
        } finally {
            this.isLoading = false;
        }
    }

    abrirNuevo() {
        this.accion = 1;
        this.enviar = false;
        this.limpiarDatos();
        this.tesisDialogo = true;
    }

    limpiarDatos() {
        this.ttesiss = {
            id: 0,
            clientes_id: 0,
            nombre_completo:'',
            nombre_tesis: '',
            universidad: '',
            usuario_plataforma: '',
            clave_plataforma: '',
            estado_id: 1,
            fecha_creacion: '',
            fecha_modificacion: '',
        };
    }

    ocultarDialogo() {
        this.tesisDialogo = false;
        this.enviar = false;
    }

    async guardarTesis() {
        this.enviar = true;

        this.isLoading = true;
        try {

            const tesisParaEnviar = {
                id: this.ttesiss.id,
                clientes: this.ttesiss.clientes_id,
                nombre_tesis: this.ttesiss.nombre_tesis,
                universidad: this.ttesiss.universidad,
                usuario_plataforma: this.ttesiss.usuario_plataforma,
                clave_plataforma: this.ttesiss.clave_plataforma,
                estado: this.ttesiss.estado_id,
                fecha_creacion: this.ttesiss.fecha_creacion,
                fecha_modificacion: this.ttesiss.fecha_modificacion
            };

            const response = this.accion === 1
                ? await this.tesisService.createTesis(tesisParaEnviar)
                : await this.tesisService.updateTesis(this.ttesiss.id, tesisParaEnviar);

            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: response.message_user || 'Operación exitosa' });
            await this.cargarTesis();
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

    editarTesis(ttesiss: Tesi) {
        this.ttesiss = { ...ttesiss };
        this.accion = 2;
        this.tesisDialogo = true;
    }

    async eliminarTesis(ttesiss: Tesi) {
        const id = ttesiss.id;
        this.isLoading = true;
        try {
            const response = await this.tesisService.deleteTesis(id);
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: response.message_user });
            await this.cargarTesis();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error inesperado';
            this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        } finally {
            this.isLoading = false;
        }
    }
}
