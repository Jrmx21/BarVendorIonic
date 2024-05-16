import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccountsPageRoutingModule } from './accounts-routing.module';

import { AccountsPage } from './accounts.page';
import { DetallesCuentaModalComponent } from 'src/app/components/detalles-cuenta-modal/detalles-cuenta-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccountsPageRoutingModule
  ],
  declarations: [AccountsPage, DetallesCuentaModalComponent],
})
export class AccountsPageModule {}
