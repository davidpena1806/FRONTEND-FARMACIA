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
import { Ingreso, Proveedor, Usuario, Producto, LoteProducto } from '../../core/models/entities';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { IngresoDetalleDialogComponent } from './ingreso-detalle-dialog.component';

@Component({
  selector: 'app-ingresos-page',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule, MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './ingresos-page.component.html'
})
export class IngresosPageComponent implements OnInit {
  ingresos: Ingreso[] = [];
  proveedores: Proveedor[] = [];
  usuarios: Usuario[] = [];
  productos: Producto[] = [];
  lotes: LoteProducto[] = [];

  loading = true;
  showForm = false;
  saving = false;

  displayedColumns = ['id', 'fecha', 'proveedor', 'usuario', 'total', 'acciones'];
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
      proveedorId: [null, Validators.required],
      usuarioId: [null, Validators.required],
      fecha: [this.nowForInput(), Validators.required],
      observacion: [''],
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
      loteProductoId: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioCompra: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  removeDetalle(index: number): void {
    if (this.detalles.length > 1) this.detalles.removeAt(index);
  }

  lotesDeProducto(productoId: number): LoteProducto[] {
    return this.lotes.filter(l => l.productoId === productoId);
  }

  subtotalFila(index: number): number {
    const fila = this.detalles.at(index).value;
    return (fila.cantidad || 0) * (fila.precioCompra || 0);
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
      ingresos: this.api.getAll<Ingreso>('ingresos'),
      proveedores: this.api.getAll<Proveedor>('proveedores'),
      usuarios: this.api.getAll<Usuario>('usuarios'),
      productos: this.api.getAll<Producto>('productos'),
      lotes: this.api.getAll<LoteProducto>('lotes-producto')
    }).subscribe({
      next: (res) => {
        this.ingresos = res.ingresos;
        this.proveedores = res.proveedores;
        this.usuarios = res.usuarios;
        this.productos = res.productos;
        this.lotes = res.lotes;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  nombreProveedor(row: Ingreso): string {
    return row.proveedor?.razonSocial ?? `#${row.proveedorId}`;
  }
  nombreUsuario(row: Ingreso): string {
    return row.usuario ? `${row.usuario.nombre} ${row.usuario.apellido}` : `#${row.usuarioId}`;
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
      proveedorId: this.form.value.proveedorId,
      usuarioId: this.form.value.usuarioId,
      fecha: this.toIsoWithSeconds(this.form.value.fecha),
      observacion: this.form.value.observacion,
      detalles: this.form.value.detalles
    };
    this.api.create<Ingreso>('ingresos', payload).subscribe({
      next: () => {
        this.snackBar.open('Ingreso registrado. El stock se actualizó automáticamente.', 'Cerrar', { duration: 4000 });
        this.saving = false;
        this.showForm = false;
        this.loadAll();
      },
      error: () => { this.saving = false; }
    });
  }

  verDetalle(row: Ingreso): void {
    this.api.getById<Ingreso>('ingresos', row.id).subscribe((ingreso) => {
      this.dialog.open(IngresoDetalleDialogComponent, {
        width: '700px',
        data: { ingreso }
      });
    });
  }

  eliminar(row: Ingreso): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '460px',
      data: {
        title: 'Eliminar Ingreso',
        message: `Esto revertirá el stock que sumó el Ingreso #${row.id}. ¿Deseas continuar?`
      }
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.api.delete('ingresos', row.id).subscribe({
        next: () => {
          this.snackBar.open('Ingreso eliminado y stock revertido.', 'Cerrar', { duration: 3000 });
          this.loadAll();
        }
      });
    });
  }
}
