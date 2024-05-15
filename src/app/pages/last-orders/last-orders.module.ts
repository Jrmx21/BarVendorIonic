import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LastOrdersPageRoutingModule } from './last-orders-routing.module';

import { LastOrdersPage } from './last-orders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LastOrdersPageRoutingModule
  ],
  declarations: [LastOrdersPage]
})
export class LastOrdersPageModule {}
