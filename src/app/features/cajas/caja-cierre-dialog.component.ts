import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Caja } from '../../core/models/entities';

@Component({
  selector: 'app-caja-cierre-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Cerrar Caja #{{ data.caja.id }}</h2>
    <mat-dialog-content>
      <p>Monto inicial: S/ {{ data.caja.montoInicial.toFixed(2) }}</p>
      <form [formGroup]="form" class="form-grid">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Monto final (efectivo contado)</mat-label>
          <input matInput type="number" step="0.01" formControlName="montoFinal">
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(null)">Cancelar</button>
      <button mat-flat-button color="primary" (click)="guardar()">Cerrar caja</button>
    </mat-dialog-actions>
  `
})
export class CajaCierreDialogComponent {
  form = this.fb.group({
    montoFinal: [0, [Validators.required, Validators.min(0)]]
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CajaCierreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { caja: Caja }
  ) {}

  guardar(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.dialogRef.close(this.form.value);
  }
}
