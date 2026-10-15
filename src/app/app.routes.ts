import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { GenericCrudPageComponent } from './features/generic-crud/generic-crud-page.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { IngresosPageComponent } from './features/ingresos/ingresos-page.component';
import { VentasPageComponent } from './features/ventas/ventas-page.component';
import { CajasPageComponent } from './features/cajas/cajas-page.component';
import { adminGuard, authGuard } from './core/services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    // Todo lo demás requiere sesión iniciada
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'categorias', component: GenericCrudPageComponent, data: { entityKey: 'categorias' } },
      { path: 'productos', component: GenericCrudPageComponent, data: { entityKey: 'productos' } },
      { path: 'lotes-producto', component: GenericCrudPageComponent, data: { entityKey: 'lotes-producto' } },
      { path: 'proveedores', component: GenericCrudPageComponent, data: { entityKey: 'proveedores' } },
      { path: 'clientes', component: GenericCrudPageComponent, data: { entityKey: 'clientes' } },
      { path: 'ingresos', component: IngresosPageComponent },
      { path: 'ventas', component: VentasPageComponent },
      { path: 'cajas', component: CajasPageComponent },
      { path: 'movimientos-inventario', component: GenericCrudPageComponent, data: { entityKey: 'movimientos-inventario' } },
      { path: 'movimientos-caja', component: GenericCrudPageComponent, data: { entityKey: 'movimientos-caja' } },
      // Solo ADMIN
      { path: 'usuarios', component: GenericCrudPageComponent, canActivate: [adminGuard], data: { entityKey: 'usuarios' } },
      { path: 'roles', component: GenericCrudPageComponent, canActivate: [adminGuard], data: { entityKey: 'roles' } }
    ]
  },
  { path: '**', redirectTo: '' }
];
