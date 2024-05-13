import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ProductComponent } from '../components/product/product.component';
import { ModalController } from '@ionic/angular';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { AccountService } from '../services/account.service';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  cartItems: any[]=[];
  products: any[]= [];
  mesaSelected: number=1;
  cuentaSelected: any;
  cuentasAbiertas: any;
  users: any;
userSelected: any;

  constructor(private orderService:OrderService,private userService: UserService,private cartService:CartService,private productService: ProductService,private modalController:ModalController, private accountService:AccountService) { }
  cartOpen:boolean=false;
  openCart(isOpen: boolean) {
    this.cartOpen = isOpen;
  }
  ngOnInit() {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  
     // Obtener cuentas abiertas del usuario
     this.accountService.getOpenAccounts().subscribe(
      cuentas => {
        this.cuentasAbiertas = cuentas;
        console.log(cuentas);
      },
      error => {
        console.error('Error al obtener cuentas abiertas:', error);
      }
    );
    this.productService.getAllProducts()
      .subscribe(
        data => {
          this.products = data;
          console.log(data);
        },
        error => {
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
        'product': product
      }
    });
    return await modal.present();
  }
  addProduct(producto:any) {
    console.log('Añadir producto');
    this.cartService.addToCart(producto);
    console.log(producto);
    console.log(this.cartService.getCartItems());
    this.cartItems = this.cartService.getCartItems();
  }
  calcularPrecioTotal(): number {
    let total = 0;
    for (const item of this.cartItems) {
      total += item.precio;
    }
    return total;
  }
  handleRefresh(event:any) {
    setTimeout(() => {
      this.userService.getAllUsers().subscribe(users => {
        this.users = users;
      });
    
       // Obtener cuentas abiertas del usuario
       this.accountService.getOpenAccounts().subscribe(
        cuentas => {
          this.cuentasAbiertas = cuentas;
          console.log(cuentas);
        },
        error => {
          console.error('Error al obtener cuentas abiertas:', error);
        }
      );
      this.productService.getAllProducts()
        .subscribe(
          data => {
            this.products = data;
            console.log(data);
          },
          error => {
            console.error('Error al obtener productos', error);
          }
        );
        this.cartItems = this.cartService.getCartItems();
        console.log(this.cartItems);
      event.target.complete();
      
    }, 800);
  }
  placeOrder() {
    
    // Construye el objeto de pedido con los campos necesarios
    let pedido = {
      fecha: new Date().toISOString(),
      notas: 'Notas del pedido',
      precio: this.calcularPrecioTotal().toString(),
      user: this.userSelected,
      cuenta: this.cuentaSelected,
      products: this.cartItems.map(item => ({
        id: item.id,
        nombreProducto: item.nombreProducto,
        categoria: item.categoria,
        alergenos: item.alergenos,
        precio: item.precio,
        existencias: item.existencias
      }))
    };
  
   
    
  
    
    // Envía una solicitud HTTP para realizar el pedido con los datos del pedido
    this.orderService.placeOrder(pedido).subscribe(
      response => {
        console.log(pedido);
        console.log('Pedido realizado con éxito:', response);
        // Limpia el carrito después de realizar el pedido
        this.cartService.clearCart();
        // Actualiza la lista de elementos del carrito
        this.actualizarCarro();
      },
      error => {
  
        console.error('Error al realizar el pedido:', error);
        console.log(pedido);
      }
    );
  }
  
  removeItem(index: number) {
    this.cartService.removeFromCart(index);
  }
  clearCart() {
    this.cartService.clearCart();
  }
  actualizarCarro(){
    this.cartItems=this.cartService.getCartItems();
  }
 
}
