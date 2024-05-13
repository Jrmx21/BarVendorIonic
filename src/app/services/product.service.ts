import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:6969/api/productos');
  }
   // Método para obtener todos los productos o productos filtrados por categoría
   getProductsByCategory(categoria?: string): Observable<any[]> {
    // Construye la URL según si se proporciona una categoría o no
    const url = categoria ? `http://localhost:6969/api/productos/categoria/${categoria}` : 'http://localhost:6969/api/productos';
    return this.http.get<any[]>(url);
  }
}
