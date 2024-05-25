import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>('https://barvendor-8d5be5ce5941.herokuapp.com/api/productos');
  }
   // Método para obtener todos los productos o productos filtrados por categoría
   getProductsByCategory(categoria?: string): Observable<any[]> {
    // Construye la URL según si se proporciona una categoría o no
    const url = categoria ? `https://barvendor-8d5be5ce5941.herokuapp.com/api/productos/categoria/${categoria}` : 'https://barvendor-8d5be5ce5941.herokuapp.com/api/productos';
    return this.http.get<any[]>(url);
  }
}
