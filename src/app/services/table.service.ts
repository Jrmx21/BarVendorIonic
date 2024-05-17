import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private apiUrl = 'http://localhost:6969/api/mesas'; // La URL de tu backend

  constructor(private http: HttpClient) { }
  getAllTables(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  getTable(tableId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${tableId}`);
  }

  updateTable(tableId: number, tableData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${tableId}`, tableData);
  }
}
