import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { EntityConfig } from '../entity-config';
import { EntityApiService } from '../../core/services/entity-api.service';
import { CrudFormDialogComponent } from '../crud-form-dialog/crud-form-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-crud-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatButtonModule, MatIconModule,
    MatDialogModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './crud-list.component.html'
})
export class CrudListComponent implements OnInit, OnChanges {
  @Input({ required: true }) config!: EntityConfig;

  items: any[] = [];
  loading = true;
  displayedColumns: string[] = [];

  constructor(
    private api: EntityApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.load();
  }

  ngOnChanges(): void {
    if (this.config) this.load();
  }

  get allowEdit(): boolean { return this.config.allowEdit !== false; }
  get allowDelete(): boolean { return this.config.allowDelete !== false; }

  load(): void {
    this.loading = true;
    this.displayedColumns = [...this.config.columns.map(c => c.key), 'acciones'];
    this.api.getAll<any>(this.config.apiPath).subscribe({
      next: (data) => { this.items = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  cellValue(row: any, columnKey: string): string {
    const column = this.config.columns.find(c => c.key === columnKey);
    if (!column) return '';
    if (column.valueFn) return column.valueFn(row);
    const value = row[column.key];
    return value === null || value === undefined ? '' : String(value);
  }

  cellIsBoolean(columnKey: string): boolean {
    return !!this.config.columns.find(c => c.key === columnKey)?.isBoolean;
  }

  boolValue(row: any, columnKey: string): boolean {
    return !!row[columnKey];
  }

  openCreate(): void {
    const ref = this.dialog.open(CrudFormDialogComponent, {
      width: '600px',
      data: { config: this.config, item: null }
    });
    ref.afterClosed().subscribe((formValue) => {
      if (!formValue) return;
      this.api.create(this.config.apiPath, formValue).subscribe({
        next: () => {
          this.snackBar.open(`${this.config.singular} creado correctamente.`, 'Cerrar', { duration: 3000 });
          this.load();
        }
      });
    });
  }

  openEdit(row: any): void {
    const ref = this.dialog.open(CrudFormDialogComponent, {
      width: '600px',
      data: { config: this.config, item: row }
    });
    ref.afterClosed().subscribe((formValue) => {
      if (!formValue) return;
      this.api.update(this.config.apiPath, row.id, formValue).subscribe({
        next: () => {
          this.snackBar.open(`${this.config.singular} actualizado correctamente.`, 'Cerrar', { duration: 3000 });
          this.load();
        }
      });
    });
  }

  confirmDelete(row: any): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: `Eliminar ${this.config.singular}`,
        message: `¿Seguro que deseas eliminar este registro (Id ${row.id})? Esta acción no se puede deshacer.`
      }
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.api.delete(this.config.apiPath, row.id).subscribe({
        next: () => {
          this.snackBar.open(`${this.config.singular} eliminado.`, 'Cerrar', { duration: 3000 });
          this.load();
        }
      });
    });
  }
}
