import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';

import { EntityApiService } from '../../core/services/entity-api.service';
import { Producto } from '../../core/models/entities';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  loading = true;
  totalProductos = 0;
  totalClientes = 0;
  productosStockBajo: Producto[] = [];
  cajaAbierta = false;

  constructor(private api: EntityApiService) {}

  ngOnInit(): void {
    forkJoin({
      productos: this.api.getAll<Producto>('productos'),
      clientes: this.api.getAll<any>('clientes'),
      cajas: this.api.getAll<any>('cajas', { estado: 'ABIERTA' })
    }).subscribe({
      next: (res) => {
        this.totalProductos = res.productos.length;
        this.totalClientes = res.clientes.length;
        this.productosStockBajo = res.productos.filter(p => p.stock <= p.stockMinimo && p.activo);
        this.cajaAbierta = res.cajas.length > 0;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
