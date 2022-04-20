import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then((m) => m.WelcomeModule) },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule)
  },
  { path: 'orders', loadChildren: () => import('./pages/orders/orders.module').then((m) => m.OrdersModule) },
  { path: 'earnings', loadChildren: () => import('./pages/earnings/earnings.module').then((m) => m.EarningsModule) },
  { path: 'estimator', loadChildren: () => import('./pages/estimator/estimator.module').then((m) => m.EstimatorModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
