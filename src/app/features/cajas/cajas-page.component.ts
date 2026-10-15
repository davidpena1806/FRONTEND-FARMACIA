import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';

import { EntityApiService } from '../../core/services/entity-api.service';
import { Caja, Usuario } from '../../core/models/entities';
import { CajaAperturaDialogComponent } from './caja-apertura-dialog.component';
import { CajaCierreDialogComponent } from './caja-cierre-dialog.component';

@Component({
  selector: 'app-cajas-page',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './cajas-page.component.html'
})
export class CajasPageComponent implements OnInit {
  cajas: Caja[] = [];
  usuarios: Usuario[] = [];
  loading = true;
  displayedColumns = ['id', 'usuario', 'fechaApertura', 'montoInicial', 'estado', 'fechaCierre', 'montoFinal', 'acciones'];

  constructor(
    private api: EntityApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    forkJoin({
      cajas: this.api.getAll<Caja>('cajas'),
      usuarios: this.api.getAll<Usuario>('usuarios')
    }).subscribe({
      next: (res) => {
        this.cajas = res.cajas;
        this.usuarios = res.usuarios;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  nombreUsuario(row: Caja): string {
    return row.usuario ? `${row.usuario.nombre} ${row.usuario.apellido}` : `#${row.usuarioId}`;
  }

  fechaCorta(fecha?: string | null): string {
    return fecha ? fecha.replace('T', ' ').substring(0, 16) : '-';
  }

  aperturar(): void {
    const ref = this.dialog.open(CajaAperturaDialogComponent, {
      width: '420px',
      data: { usuarios: this.usuarios }
    });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.api.create<Caja>('cajas', value).subscribe({
        next: () => {
          this.snackBar.open('Caja aperturada correctamente.', 'Cerrar', { duration: 3000 });
          this.loadAll();
        }
      });
    });
  }

  cerrar(row: Caja): void {
    const ref = this.dialog.open(CajaCierreDialogComponent, {
      width: '420px',
      data: { caja: row }
    });
    ref.afterClosed().subscribe((value) => {
      if (!value) return;
      this.api.postAction<Caja>('cajas', row.id, 'cierre', value).subscribe({
        next: () => {
          this.snackBar.open('Caja cerrada correctamente.', 'Cerrar', { duration: 3000 });
          this.loadAll();
        }
      });
    });
  }
}
