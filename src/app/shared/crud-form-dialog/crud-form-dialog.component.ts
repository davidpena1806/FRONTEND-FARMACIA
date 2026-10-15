import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin, Observable, of } from 'rxjs';

import { EntityConfig, FieldConfig, ENTITY_CONFIGS, FIXED_OPTIONS } from '../entity-config';
import { EntityApiService } from '../../core/services/entity-api.service';

export interface CrudFormDialogData {
  config: EntityConfig;
  item: any | null; // null = creación, objeto = edición
}

@Component({
  selector: 'app-crud-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatCheckboxModule, MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './crud-form-dialog.component.html'
})
export class CrudFormDialogComponent implements OnInit {
  form!: FormGroup;
  loadingOptions = true;
  selectOptions: Record<string, any[]> = {}; // key: nombre de campo -> lista de opciones
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private api: EntityApiService,
    public dialogRef: MatDialogRef<CrudFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CrudFormDialogData
  ) {
    this.isEdit = !!data.item;
  }

  get config(): EntityConfig {
    return this.data.config;
  }

  ngOnInit(): void {
    this.buildForm();
    this.loadSelectOptions();
  }

  private buildForm(): void {
    const group: Record<string, any> = {};
    for (const field of this.config.fields) {
      const currentValue = this.data.item
        ? (this.data.item[field.key] ?? (field.type === 'password' ? '' : this.data.item[field.key]))
        : (field.defaultValue ?? (field.type === 'checkbox' ? false : ''));

      const value = field.type === 'date' && currentValue
        ? String(currentValue).substring(0, 10)
        : currentValue;

      const esRequerido = !!field.required || (!!field.requiredOnCreate && !this.isEdit);
      group[field.key] = [
        value,
        esRequerido ? [Validators.required] : []
      ];
    }
    if (this.isEdit) {
      group['id'] = [this.data.item.id];
    }
    this.form = this.fb.group(group);
  }

  private loadSelectOptions(): void {
    const selectFields = this.config.fields.filter(f => f.type === 'select' && f.select);
    if (selectFields.length === 0) {
      this.loadingOptions = false;
      return;
    }

    const requests: Record<string, Observable<any[]>> = {};
    for (const field of selectFields) {
      const entityKey = field.select!.entityKey;
      if (FIXED_OPTIONS[entityKey]) {
        requests[field.key] = of(FIXED_OPTIONS[entityKey]);
      } else {
        const relatedConfig = ENTITY_CONFIGS[entityKey];
        requests[field.key] = this.api.getAll<any>(relatedConfig.apiPath);
      }
    }

    forkJoin(requests).subscribe({
      next: (results: Record<string, any[]>) => {
        this.selectOptions = results;
        this.loadingOptions = false;
      },
      error: () => { this.loadingOptions = false; }
    });
  }

  optionLabel(field: FieldConfig, option: any): string {
    return field.select ? field.select.labelFn(option) : '';
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.sanitize(this.form.value));
  }

  /** Antes de enviar al backend: '' -> null en selects/números/fechas, y no enviar contraseñas vacías. */
  private sanitize(value: Record<string, any>): Record<string, any> {
    const result = { ...value };
    for (const field of this.config.fields) {
      const v = result[field.key];
      if (field.type === 'password' && (v === '' || v === null || v === undefined)) {
        delete result[field.key];
      } else if (['select', 'number', 'date'].includes(field.type) && v === '') {
        result[field.key] = null;
      }
    }
    return result;
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
