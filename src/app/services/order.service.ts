// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  placeOrder(orderData: any) {
    return this.http.post<any>('https://barvendor-8d5be5ce5941.herokuapp.com/api/pedidos', orderData);
  }
  getOrders() {
    return this.http.get<any>('https://barvendor-8d5be5ce5941.herokuapp.com/api/pedidos');
  }
}
