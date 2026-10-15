import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';

import { EntityApiService } from '../../core/services/entity-api.service';
import { Venta, Cliente, Usuario, Producto } from '../../core/models/entities';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { VentaDetalleDialogComponent } from './venta-detalle-dialog.component';

@Component({
  selector: 'app-ventas-page',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule,
    MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './ventas-page.component.html'
})
export class VentasPageComponent implements OnInit {
  ventas: Venta[] = [];
  clientes: Cliente[] = [];
  usuarios: Usuario[] = [];
  productos: Producto[] = [];

  loading = true;
  showForm = false;
  saving = false;

  tiposComprobante = ['BOLETA', 'FACTURA'];
  displayedColumns = ['id', 'fecha', 'cliente', 'comprobante', 'total', 'estado', 'acciones'];
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: EntityApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadAll();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      clienteId: [null, Validators.required],
      usuarioId: [null, Validators.required],
      fecha: [this.nowForInput(), Validators.required],
      tipoComprobante: ['BOLETA', Validators.required],
      serie: [''],
      numero: [''],
      detalles: this.fb.array([])
    });
    this.addDetalle();
  }

  private nowForInput(): string {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

  private toIsoWithSeconds(value: string): string {
    // <input type="datetime-local"> entrega "yyyy-MM-ddTHH:mm"; completamos los segundos.
    return value && value.length === 16 ? `${value}:00` : value;
  }

  get detalles(): FormArray {
    return this.form.get('detalles') as FormArray;
  }

  addDetalle(): void {
    this.detalles.push(this.fb.group({
      productoId: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioUnitario: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  removeDetalle(index: number): void {
    if (this.detalles.length > 1) this.detalles.removeAt(index);
  }

  onProductoChange(index: number): void {
    const fila = this.detalles.at(index);
    const producto = this.productos.find(p => p.id === fila.value.productoId);
    if (producto) fila.patchValue({ precioUnitario: producto.precioVenta });
  }

  subtotalFila(index: number): number {
    const fila = this.detalles.at(index).value;
    return (fila.cantidad || 0) * (fila.precioUnitario || 0);
  }

  get subtotalGeneral(): number {
    return this.detalles.controls.reduce((sum, _, i) => sum + this.subtotalFila(i), 0);
  }

  get impuestoGeneral(): number {
    return Math.round(this.subtotalGeneral * 0.18 * 100) / 100;
  }

  get totalGeneral(): number {
    return this.subtotalGeneral + this.impuestoGeneral;
  }

  loadAll(): void {
    this.loading = true;
    forkJoin({
      ventas: this.api.getAll<Venta>('ventas'),
      clientes: this.api.getAll<Cliente>('clientes'),
      usuarios: this.api.getAll<Usuario>('usuarios'),
      productos: this.api.getAll<Producto>('productos')
    }).subscribe({
      next: (res) => {
        this.ventas = res.ventas;
        this.clientes = res.clientes;
        this.usuarios = res.usuarios;
        this.productos = res.productos;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  nombreCliente(row: Venta): string {
    return row.cliente ? `${row.cliente.nombre} ${row.cliente.apellido ?? ''}`.trim() : `#${row.clienteId}`;
  }

  openForm(): void {
    this.buildForm();
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snackBar.open('Completa todos los campos requeridos.', 'Cerrar', { duration: 3000 });
      return;
    }
    this.saving = true;
    const payload = {
      clienteId: this.form.value.clienteId,
      usuarioId: this.form.value.usuarioId,
      fecha: this.toIsoWithSeconds(this.form.value.fecha),
      tipoComprobante: this.form.value.tipoComprobante,
      serie: this.form.value.serie,
      numero: this.form.value.numero,
      detalles: this.form.value.detalles
    };
    this.api.create<Venta>('ventas', payload).subscribe({
      next: () => {
        this.snackBar.open('Venta registrada. El stock se descontó automáticamente.', 'Cerrar', { duration: 4000 });
        this.saving = false;
        this.showForm = false;
        this.loadAll();
      },
      error: () => { this.saving = false; }
    });
  }

  verDetalle(row: Venta): void {
    this.api.getById<Venta>('ventas', row.id).subscribe((venta) => {
      this.dialog.open(VentaDetalleDialogComponent, { width: '700px', data: { venta } });
    });
  }

  anular(row: Venta): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '460px',
      data: {
        title: 'Anular Venta',
        message: `Esto repondrá el stock vendido en la Venta #${row.id}. ¿Deseas continuar?`,
        confirmLabel: 'Anular'
      }
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.api.postAction('ventas', row.id, 'anular').subscribe({
        next: () => {
          this.snackBar.open('Venta anulada y stock repuesto.', 'Cerrar', { duration: 3000 });
          this.loadAll();
        }
      });
    });
  }
}
