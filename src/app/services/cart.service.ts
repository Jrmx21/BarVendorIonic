// cart.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: any[] = [];

  constructor() { }

  addToCart(product: any) {
    const existingItem = this.cartItems.find(item => item.id === product.id);

    if (existingItem) {
      // Si el producto ya está en el carrito, actualizar la cantidad
      existingItem.quantity += product.quantity;
    } else {
      // Si el producto no está en el carrito, agregarlo al carrito
      this.cartItems.push(product);
    }
  }
  
  removeFromCart(index: number) {
    this.cartItems.splice(index, 1);
  }

  getCartItems() {
    return this.cartItems;
  }

  clearCart() {
    this.cartItems = [];
  }
}
