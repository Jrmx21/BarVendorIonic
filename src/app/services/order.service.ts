// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  placeOrder(orderData: any) {
    return this.http.post<any>('http://localhost:6969/api/pedidos', orderData);
  }
}
