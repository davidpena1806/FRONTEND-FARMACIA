import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Venta } from '../../core/models/entities';

@Component({
  selector: 'app-venta-detalle-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule],
  template: `
    <h2 mat-dialog-title>Venta #{{ venta.id }} - {{ venta.estado }}</h2>
    <mat-dialog-content>
      <p><strong>Cliente:</strong> {{ venta.cliente?.nombre || ('#' + venta.clienteId) }} {{ venta.cliente?.apellido }}</p>
      <p><strong>Fecha:</strong> {{ (venta.fecha || '').replace('T',' ').substring(0,16) }}</p>
      <p><strong>Comprobante:</strong> {{ venta.tipoComprobante }} {{ venta.serie }}-{{ venta.numero }}</p>

      <table mat-table [dataSource]="venta.detalles" class="mat-elevation-z1 full-width">
        <ng-container matColumnDef="producto">
          <th mat-header-cell *matHeaderCellDef>Producto</th>
          <td mat-cell *matCellDef="let d">{{ d.producto?.nombre || ('#' + d.productoId) }}</td>
        </ng-container>
        <ng-container matColumnDef="cantidad">
          <th mat-header-cell *matHeaderCellDef>Cantidad</th>
          <td mat-cell *matCellDef="let d">{{ d.cantidad }}</td>
        </ng-container>
        <ng-container matColumnDef="precioUnitario">
          <th mat-header-cell *matHeaderCellDef>P. Unitario</th>
          <td mat-cell *matCellDef="let d">S/ {{ d.precioUnitario.toFixed(2) }}</td>
        </ng-container>
        <ng-container matColumnDef="subtotal">
          <th mat-header-cell *matHeaderCellDef>Subtotal</th>
          <td mat-cell *matCellDef="let d">S/ {{ (d.subtotal ?? (d.cantidad * d.precioUnitario)).toFixed(2) }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="columnas"></tr>
        <tr mat-row *matRowDef="let row; columns: columnas;"></tr>
      </table>

      <div class="totales-box">
        <span>Subtotal: S/ {{ (venta.subtotal ?? 0).toFixed(2) }}</span>
        <span>Impuesto: S/ {{ (venta.impuesto ?? 0).toFixed(2) }}</span>
        <span class="total-final">Total: S/ {{ (venta.total ?? 0).toFixed(2) }}</span>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cerrar</button>
    </mat-dialog-actions>
  `
})
export class VentaDetalleDialogComponent {
  columnas = ['producto', 'cantidad', 'precioUnitario', 'subtotal'];
  venta: Venta;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { venta: Venta }) {
    this.venta = data.venta;
  }
}
