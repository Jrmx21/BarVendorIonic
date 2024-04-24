import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ProductComponent } from '../components/product/product.component';
import { ModalController } from '@ionic/angular';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  cartItems: any[]=[];
  products: any[]= [];

  constructor(private orderService:OrderService,private cartService:CartService,private productService: ProductService,private modalController:ModalController) { }
  cartOpen:boolean=false;
  openCart(isOpen: boolean) {
    this.cartOpen = isOpen;
  }
  ngOnInit() {
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

  placeOrder() {
    // Envía una solicitud HTTP para realizar el pedido con los elementos del carrito
    const orderData = { products: this.cartItems };
    this.orderService.placeOrder(orderData)
      .subscribe(
        response => {
          console.log('Pedido realizado con éxito:', response);
          // Limpia el carrito después de realizar el pedido
          this.cartService.clearCart();
        },
        error => {
          console.error('Error al realizar el pedido:', error);
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
