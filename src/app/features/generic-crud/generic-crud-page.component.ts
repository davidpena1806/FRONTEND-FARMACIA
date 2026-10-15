import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { CrudListComponent } from '../../shared/crud-list/crud-list.component';
import { ENTITY_CONFIGS, EntityConfig } from '../../shared/entity-config';

@Component({
  selector: 'app-generic-crud-page',
  standalone: true,
  imports: [CommonModule, CrudListComponent],
  template: `
    <div class="page-container">
      <app-crud-list *ngIf="config" [config]="config"></app-crud-list>
    </div>
  `
})
export class GenericCrudPageComponent implements OnInit {
  config: EntityConfig | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      const entityKey = data['entityKey'] as string;
      this.config = ENTITY_CONFIGS[entityKey] ?? null;
    });
  }
}
