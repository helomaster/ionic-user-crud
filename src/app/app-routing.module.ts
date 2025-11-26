import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
const routes: Routes = [
// Rota raiz aponta para Home
{ path: '', loadComponent: () => import('./pages/home.page').then(m => m.HomePage) },
];
@NgModule({
imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
exports: [RouterModule]
})
export class AppRoutingModule {}