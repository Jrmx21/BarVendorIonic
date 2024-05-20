import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetallesCuentaModalComponent } from 'src/app/components/detalles-cuenta-modal/detalles-cuenta-modal.component';
import { AccountService } from 'src/app/services/account.service';
import { TableService } from 'src/app/services/table.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss'],
})
export class AccountsPage implements OnInit {
  accounts: any[] = [];
  newAccount: any = {
    precioTotal: 0,
    pagado: false,
    ubicacion: '',
  };
  closedAccounts: any[] = [];
  arrayMesas: any[] = [];
  filteredTables: any[] = [];
  mesaSelected: any;
  selectedLocation: string = 'INTERIOR';

  constructor(
    private accountService: AccountService,
    private tableService: TableService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
    this.tableService.getAllTables().subscribe((tables) => {
      this.arrayMesas = tables;
      this.filterTables();
    });
    this.loadClosedAccounts();
  }

  loadClosedAccounts() {
    this.accountService.getClosedAccounts().subscribe((data) => {
      this.closedAccounts = data;
    });
  }

  loadAccounts() {
    this.accountService.getOpenAccounts().subscribe((data: any[]) => {
      this.accounts = data;
    });
  }

  filterTables() {
    this.filteredTables = this.arrayMesas.filter(
      (table) => table.ubicacion === this.selectedLocation
    );
  }

  selectTable(table: any) {
    this.mesaSelected = table;
  }
  createAccount() {
    if (this.mesaSelected) {
      // Cambiar el estado de ocupada a true para la mesa seleccionada
      this.mesaSelected.ocupada = true;

      const newAccount = {
        precioTotal: 0,
        pagado: false,
        mesa: this.mesaSelected,
      };

      // Primero, actualizar la mesa como ocupada
      this.tableService
        .updateTable(this.mesaSelected.id, this.mesaSelected)
        .subscribe(() => {
          // Luego, crear la nueva cuenta
          this.accountService.createAccount(newAccount).subscribe(() => {
            this.loadAccounts();
            // Reiniciar valores después de crear la cuenta
            this.newAccount = { precioTotal: 0, pagado: false, ubicacion: '' };
            this.mesaSelected = null;
          });
        });
    } else {
      console.error('Error: No se ha seleccionado ninguna mesa.');
    }
    this.loadAccounts();
    this.loadClosedAccounts();
  }

  async cobrar(accountId: number) {
    const modal = await this.modalController.create({
      component: DetallesCuentaModalComponent,
      componentProps: { accountId: accountId },
    });
    await modal.present();
  }

  handleRefresh(event:any) {
    setTimeout(() => {
     
      
      this.loadAccounts();
      this.loadClosedAccounts();
      this.tableService.getAllTables().subscribe((tables) => {
        this.arrayMesas = tables;
        this.filterTables();
      });
      event.target.complete();
    }, 500);
  }
  markAsPaid(accountId: number) {
    const account = this.accounts.find((a) => a.id === accountId);
    if (account) {
      account.pagado = true;
      this.accountService.markAccountAsPaid(accountId).subscribe(() => {
        if (account.mesa) {
          account.mesa.ocupada = false;
          console.log('MESA');
          console.log(account.mesa);
          this.tableService
            .updateTable(account.mesa.id, account.mesa)
            .subscribe(() => {
              this.loadAccounts();
              this.loadClosedAccounts();
            });
        } else {
          this.loadAccounts();
          console.log('No lo hiso');
          this.loadClosedAccounts();
        }
      });
    }
  }
  
}
