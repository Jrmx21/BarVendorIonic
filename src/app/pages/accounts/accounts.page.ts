import { Component, OnInit } from '@angular/core';
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
  arrayMesas: any[] = [];
  mesaSelected: any;

  constructor(
    private accountService: AccountService,
    private tableService: TableService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
    this.tableService.getAllTables().subscribe((tables) => {
      console.log(tables);
      this.arrayMesas = tables;
    });
  }

  loadAccounts() {
    this.accountService.getAllAccounts().subscribe((accounts) => {
      this.accounts = accounts;
    });
  }

  createAccount() {
    // Verifica que mesaSelected no sea null y tenga un objeto de mesa válido
    if (this.mesaSelected) {
      // Creamos el objeto newAccount utilizando la mesa seleccionada
      const newAccount = {
        precioTotal: 0,
        pagado: false,
        mesa: this.mesaSelected
      };
      console.log(this.mesaSelected);
  
      console.log(newAccount);
      // Llamamos al método createAccount del servicio, pasando el objeto newAccount
      this.accountService.createAccount(newAccount).subscribe(() => {
        this.loadAccounts();
        console.log(newAccount);
        // Reiniciamos newAccount para futuras creaciones
        this.newAccount = { precioTotal: 0, pagado: false };
        
      });
    } else {
      console.error('Error: No se ha seleccionado ninguna mesa.');
    }
  }
  
  markAsPaid(accountId: number) {
    const account = this.accounts.find((a) => a.id === accountId);
    console.log(account);
    if (account) {
      account.pagado = true; // Marcar la cuenta como pagada localmente
      this.accountService.markAccountAsPaid(accountId).subscribe(() => {
        // Aquí podrías manejar la lógica después de marcar la cuenta como pagada en el servidor
      });
    }
  }
}
