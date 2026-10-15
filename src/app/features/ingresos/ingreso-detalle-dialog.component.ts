import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Ingreso } from '../../core/models/entities';

@Component({
  selector: 'app-ingreso-detalle-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule],
  template: `
    <h2 mat-dialog-title>Ingreso #{{ ingreso.id }}</h2>
    <mat-dialog-content>
      <p><strong>Proveedor:</strong> {{ ingreso.proveedor?.razonSocial || ('#' + ingreso.proveedorId) }}</p>
      <p><strong>Fecha:</strong> {{ (ingreso.fecha || '').replace('T',' ').substring(0,16) }}</p>
      <p *ngIf="ingreso.observacion"><strong>Observación:</strong> {{ ingreso.observacion }}</p>

      <table mat-table [dataSource]="ingreso.detalles" class="mat-elevation-z1 full-width">
        <ng-container matColumnDef="producto">
          <th mat-header-cell *matHeaderCellDef>Producto</th>
          <td mat-cell *matCellDef="let d">{{ d.producto?.nombre || ('#' + d.productoId) }}</td>
        </ng-container>
        <ng-container matColumnDef="lote">
          <th mat-header-cell *matHeaderCellDef>Lote</th>
          <td mat-cell *matCellDef="let d">{{ d.loteProducto?.numeroLote || ('#' + d.loteProductoId) }}</td>
        </ng-container>
        <ng-container matColumnDef="cantidad">
          <th mat-header-cell *matHeaderCellDef>Cantidad</th>
          <td mat-cell *matCellDef="let d">{{ d.cantidad }}</td>
        </ng-container>
        <ng-container matColumnDef="precioCompra">
          <th mat-header-cell *matHeaderCellDef>P. Compra</th>
          <td mat-cell *matCellDef="let d">S/ {{ d.precioCompra.toFixed(2) }}</td>
        </ng-container>
        <ng-container matColumnDef="subtotal">
          <th mat-header-cell *matHeaderCellDef>Subtotal</th>
          <td mat-cell *matCellDef="let d">S/ {{ (d.subtotal ?? (d.cantidad * d.precioCompra)).toFixed(2) }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columnas"></tr>
        <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
      </table>

      <div class="totales-box">
        <span>Subtotal: S/ {{ (ingreso.subtotal ?? 0).toFixed(2) }}</span>
        <span>Impuesto: S/ {{ (ingreso.impuesto ?? 0).toFixed(2) }}</span>
        <span class="total-final">Total: S/ {{ (ingreso.total ?? 0).toFixed(2) }}</span>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `
})
export class IngresoDetalleDialogComponent {
  columnas = ['producto', 'lote', 'cantidad', 'precioCompra', 'subtotal'];
  ingreso: Ingreso;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { ingreso: Ingreso }) {
    this.ingreso = data.ingreso;
  }
}
