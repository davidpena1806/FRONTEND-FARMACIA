import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Usuario } from '../../core/models/entities';

@Component({
  selector: 'app-caja-apertura-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Aperturar Caja</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form-grid">
        <mat-form-field appearance="outline">
          <mat-label>Usuario</mat-label>
          <mat-select formControlName="usuarioId">
            <mat-option *ngFor="let u of data.usuarios" [value]="u.id">{{ u.nombre }} {{ u.apellido }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Monto inicial</mat-label>
          <input matInput type="number" step="0.01" formControlName="montoInicial">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(null)">Cancelar</button>
      <button mat-flat-button color="primary" (click)="guardar()">Aperturar</button>
    </mat-dialog-actions>
  `
})
export class CajaAperturaDialogComponent {
  form = this.fb.group({
    usuarioId: [null as number | null, Validators.required],
    montoInicial: [0, [Validators.required, Validators.min(0)]]
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CajaAperturaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { usuarios: Usuario[] }
  ) {}

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.dialogRef.close(this.form.value);
  }
}
