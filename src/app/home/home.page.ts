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
  calcularPrecioTotal(): number {
    let total = 0;
    for (const item of this.cartItems) {
      total += item.precio;
    }
    return total;
  }
  placeOrder() {
    // Construye el objeto de pedido con los campos necesarios
    const pedido = {
      id: 1, // Puedes generar un ID único aquí o en el backend
      fecha: new Date().toISOString(), // Fecha actual en formato ISOString
      notas: 'Notas del pedido', // Notas del pedido (puedes ajustar esto según tus necesidades)
      user: {
        id: 1,
        username: 'Jrmx21',
        firstName: 'david',
        lastName: 'ruiz',
        password: 'eminem',
        email: 'jrmx1000@gmail.com',
        role: 'Admin',
        edad: 20
      },
      products: this.cartItems.map(item => ({
        id: item.id,
        nombreProducto: item.nombreProducto,
        categoria: item.categoria,
        alergenos: item.alergenos,
        precio: item.precio,
        existencias: item.existencias
      })),
    };
    
    // Envía una solicitud HTTP para realizar el pedido con los datos del pedido
    this.orderService.placeOrder(pedido).subscribe(
      response => {
        console.log('Pedido realizado con éxito:', response);
        // Limpia el carrito después de realizar el pedido
        this.cartService.clearCart();
        // Actualiza la lista de elementos del carrito
        this.actualizarCarro();
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
