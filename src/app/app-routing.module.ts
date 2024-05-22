import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard], // Protege esta ruta con el guard
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
   // Protege esta ruta con el guard
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
    // canActivate: [AuthGuard], // Protege esta ruta con el guard
  },
  {
    path: 'accounts',
    loadChildren: () =>
      import('./pages/accounts/accounts.module').then(
        (m) => m.AccountsPageModule
      ),
    canActivate: [AuthGuard], // Protege esta ruta con el guard
  },
  {
    path: 'last-orders',
    loadChildren: () =>
      import('./pages/last-orders/last-orders.module').then(
        (m) => m.LastOrdersPageModule
      ),
    canActivate: [AuthGuard], // Protege esta ruta con el guard
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
