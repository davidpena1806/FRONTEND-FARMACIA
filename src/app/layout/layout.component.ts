import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../core/services/auth.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  adminOnly?: boolean;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, RouterLink, RouterLinkActive,
    MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  title = 'Farmacia - Panel de Administración';

  private allGroups: NavGroup[] = [
    {
      title: 'General',
      items: [{ path: '/', label: 'Panel principal', icon: 'dashboard' }]
    },
    {
      title: 'Catálogos',
      items: [
        { path: '/categorias', label: 'Categorías', icon: 'category' },
        { path: '/productos', label: 'Productos', icon: 'medication' },
        { path: '/lotes-producto', label: 'Lotes de Producto', icon: 'inventory_2' },
        { path: '/proveedores', label: 'Proveedores', icon: 'local_shipping' },
        { path: '/clientes', label: 'Clientes', icon: 'people' }
      ]
    },
    {
      title: 'Operaciones',
      items: [
        { path: '/ingresos', label: 'Ingresos (Compras)', icon: 'move_to_inbox' },
        { path: '/ventas', label: 'Ventas', icon: 'point_of_sale' },
        { path: '/cajas', label: 'Cajas', icon: 'savings' },
        { path: '/movimientos-caja', label: 'Movimientos de Caja', icon: 'currency_exchange' },
        { path: '/movimientos-inventario', label: 'Movimientos de Inventario', icon: 'swap_horiz' }
      ]
    },
    {
      title: 'Administración',
      items: [
        { path: '/usuarios', label: 'Usuarios', icon: 'manage_accounts', adminOnly: true },
        { path: '/roles', label: 'Roles', icon: 'admin_panel_settings', adminOnly: true }
      ]
    }
  ];

  /** Menú ya filtrado según el rol (se calcula una sola vez por sesión). */
  navGroups: NavGroup[] = [];

  constructor(public auth: AuthService) {
    // Los ítems solo para ADMIN se ocultan a los demás roles.
    const isAdmin = this.auth.isAdmin();
    this.navGroups = this.allGroups
      .map((g) => ({ ...g, items: g.items.filter((i) => !i.adminOnly || isAdmin) }))
      .filter((g) => g.items.length > 0);
  }

  logout(): void {
    this.auth.logout();
  }
}
