import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl = 'http://localhost:6969/api/cuentas'; // La URL de tu backend

  constructor(private http: HttpClient) { }

  // Método para obtener cuentas abiertas
  getOpenAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/abiertas`);
  }


  getClosedAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cerradas`);
  }
  
  getAllAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  getOrdersForAccount(accountId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${accountId}/pedidos`);
  }
  createAccount(account: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, account);
  }

  updateAccount(id: number, account: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, account);
  }
  markAccountAsPaid(id: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}/pagar`, Date.now());
  }
}
