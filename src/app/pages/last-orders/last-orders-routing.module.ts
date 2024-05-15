import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LastOrdersPage } from './last-orders.page';

const routes: Routes = [
  {
    path: '',
    component: LastOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LastOrdersPageRoutingModule {}
