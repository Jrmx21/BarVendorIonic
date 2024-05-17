import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-detalles-cuenta-modal',
  templateUrl: './detalles-cuenta-modal.component.html',
  styleUrls: ['./detalles-cuenta-modal.component.scss'],
})
export class DetallesCuentaModalComponent  implements OnInit {

  @Input() accountId: number=0;
  orders: any[]=[]; // Ajusta el tipo de datos según la respuesta de tu API
  totalPrecioPedidos: number=0;
  accounts: any[]=[];

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    private accountService:  AccountService // Inyecta tu servicio de API
  ) {}

  ngOnInit() {
    this.loadOrders();
   this.loadAccounts();
  }

  calculateTotalPrice() {
    this.totalPrecioPedidos = 0; // Reinicia el total
    for (let order of this.orders) {
      this.totalPrecioPedidos += order.precio; // Suma los precios de los pedidos
      // Si quieres sumar los precios de los productos de cada pedido:
      // for (let product of order.products) {
      //   this.totalPrecioPedidos += product.precio;
      // }
    }
    this.totalPrecioPedidos = parseFloat(this.totalPrecioPedidos.toFixed(2))
  }
  loadAccounts() {
    this.accountService.getAllAccounts()
      .subscribe((data: any[]) => {
        this.accounts = data; // Asigna los datos de las cuentas a this.accounts
        console.log("Cuentas");
        console.log(this.accounts); // Imprime this.accounts después de obtener los datos
      });
  }
  
  loadOrders() {
    this.accountService.getOrdersForAccount(this.accountId)
      .subscribe((data: any[]) => {
        this.orders = data; // Asigna los datos a la variable orders
        this.calculateTotalPrice()
      });
  }
  closeModal() {
    this.modalController.dismiss();
  }
  cargarCuentas() {
    this.accountService.getAllAccounts().subscribe((accounts) => {
      this.accounts = accounts;
    });
  }
  async markAsPaid(accountId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas marcar esta cuenta como pagada?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Acción cancelada');
          }
        }, {
          text: 'Sí',
          handler: () => {
            this.accountService.markAccountAsPaid(accountId).subscribe(() => {
              console.log('La cuenta ha sido marcada como pagada correctamente.');
              // Aquí puedes realizar otras acciones después de que la cuenta se marque como pagada en el servidor
            }, (error) => {
              console.error('Error al marcar la cuenta como pagada:', error);
              // Aquí puedes manejar errores de manera apropiada
            });
          }
        }
      ]
    });
  
    await alert.present();
  }
  
}