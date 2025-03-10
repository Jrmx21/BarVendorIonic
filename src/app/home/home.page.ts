import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ProductComponent } from '../components/product/product.component';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { AccountService } from '../services/account.service';
import { UserService } from '../services/user.service';
import { IonSegmentCustomEvent } from '@ionic/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  cartItems: any[] = [];
  products: any[] = [];
  mesaSelected: number = 1;
  cuentaSelected: any;
  cuentasAbiertas: any;
  users: any;
  categoria = '';
  userSelected: any;
  interior: boolean = true;
  notasPedido: string = '';
  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private cartService: CartService,
    private productService: ProductService,
    private modalController: ModalController,
    private accountService: AccountService,
    private authService: AuthService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}
  cartOpen: boolean = false;
  openCart(isOpen: boolean) {
    this.cartOpen = isOpen;
  }
  segmentChanged(event: any) {
    this.productService.getProductsByCategory(this.categoria).subscribe(
      (data) => {
        this.products = data;
        console.log(data);
      },
      (error) => {
        console.error('Error al obtener productos', error);
      }
    );
  }
  async presentToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      position: 'top',
      color: color,
    });
    toast.present();
  }
 async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Seguro que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Logout cancelado');
          }
        }, {
          text: 'Cerrar Sesión',
          handler: () => {
            this.authService.logout();
          }
        }
      ]
    });

    await alert.present();
  }
  ngOnInit() {
    this.userService.getAllUsers().subscribe((users) => {
      this.users = users;
    });

    this.userSelected = localStorage.getItem('username');
    // Obtener cuentas abiertas del usuario
    this.accountService.getOpenAccounts().subscribe(
      (cuentas) => {
        this.cuentasAbiertas = cuentas;
        console.log(cuentas);
      },
      (error) => {
        console.error('Error al obtener cuentas abiertas:', error);
      }
    );
    this.productService.getProductsByCategory(this.categoria).subscribe(
      (data) => {
        this.products = data;
        console.log(data);
      },
      (error) => {
        this.presentToast('Error al obtener productos', 'danger');
        console.error('Error al obtener productos', error);
      }
    );
    this.cartItems = this.cartService.getCartItems();
    console.log(this.cartItems);
  }

  async presentProductModal(product: any) {
    const modal = await this.modalController.create({
      component: ProductComponent,
      componentProps: {
        product: product,
      },
    });
    return await modal.present();
  }
  addProduct(producto: any) {
    this.cartItems.push(producto);
    this.presentToast(producto.nombreProducto + ' añadido.', 'success');
    console.log(this.cartItems);
  }
clearNotasPedido(){
  this.notasPedido = '';
}
  calcularPrecioTotal(): number {
    let total = 0;
    for (const item of this.cartItems) {
      total += item.precio;
    }
    total = Math.round(total * 100) / 100;
    return Math.round(total * 100) / 100; // Redondea a dos decimales
  }
  sumarPrecioTotalCuenta(precioTotalPedido: number) {
    if (this.cuentaSelected && this.cuentaSelected.precioTotal) {
      this.cuentaSelected.precioTotal += precioTotalPedido;
      this.accountService
        .updateAccount(this.cuentaSelected.id, this.cuentaSelected)
        .subscribe(
          (response) => {
            console.log(
              'Precio total de la cuenta actualizado con éxito:',
              response
            );
          },
          (error) => {
            console.error(
              'Error al actualizar el precio total de la cuenta:',
              error
            );
          }
        );
    }
  }

  selectCuenta(cuenta: any) {
    this.cuentaSelected = cuenta;
  }
  handleRefresh(event: any) {
    setTimeout(() => {
      this.userService.getAllUsers().subscribe((users) => {
        this.users = users;
      });
      this.userSelected = localStorage.getItem('username');
      // Obtener cuentas abiertas del usuario
      this.accountService.getOpenAccounts().subscribe(
        (cuentas) => {
          this.cuentasAbiertas = cuentas;
          console.log(cuentas);
        },
        (error) => {
          this.presentToast('Error al obtener cuentas abiertas', 'danger');
          console.error('Error al obtener cuentas abiertas:', error);
        }
      );
      this.productService.getProductsByCategory(this.categoria).subscribe(
        (data) => {
          this.products = data;
          console.log(data);
        },
        (error) => {
          this.presentToast('Error al obtener productos', 'danger');
          console.error('Error al obtener productos', error);
        }
      );
      this.cartItems = this.cartService.getCartItems();
      console.log(this.cartItems);
      event.target.complete();
    }, 800);
  }

  placeOrder() {
    let precioTotalPedido = this.calcularPrecioTotal();

    // Filtra el usuario seleccionado de la lista de usuarios
    let selectedUser = this.users.find(
      (user: any) => user.username === this.userSelected
    );

    if (!selectedUser) {
      console.error('Usuario no encontrado');
      this.presentToast('Usuario no encontrado', 'danger');
      return;
    }
    if (this.notasPedido == null || this.notasPedido == '') {
      this.notasPedido = 'Sin notas';
    }
    let pedido = {
      fecha: new Date().toISOString(),
      notas: this.notasPedido,
      precio: precioTotalPedido.toString(),
      user: selectedUser,
      listoParaServir: false,
      cuenta: this.cuentaSelected,
      products: this.cartItems.map((item) => ({
        id: item.id,
        nombreProducto: item.nombreProducto,
        categoria: item.categoria,
        alergenos: item.alergenos,
        precio: item.precio,
        existencias: item.existencias,
      })),
    };

    // Envía una solicitud HTTP para realizar el pedido con los datos del pedido
    this.orderService.placeOrder(pedido).subscribe(
      (response) => {
        console.log(pedido);
        console.log('Pedido realizado con éxito:', response);
        this.presentToast('Pedido realizado con éxito', 'success');
        // Limpia el carrito después de realizar el pedido
        this.cartService.clearCart();
        // Actualiza la lista de elementos del carrito
        this.actualizarCarro();
        this.notasPedido = '';
      },
      (error) => {
        console.error('Error al realizar el pedido:', error);
        this.presentToast('Error al realizar el pedido', 'danger');
        console.log(pedido);
      }
    );
  }

  removeItem(index: number) {
    // Verificar si el índice proporcionado está dentro de los límites del array
    if (index >= 0 && index < this.cartItems.length) {
      if (this.cartItems[index].quantity > 1) {
        this.cartItems[index].quantity--;
      } else {
        this.cartItems.splice(index, 1);
      }
      this.actualizarCarro();
    }
  }
  clearCart() {
    this.cartService.clearCart();
  }
  actualizarCarro() {
    this.cartItems = this.cartService.getCartItems();
  }
}
