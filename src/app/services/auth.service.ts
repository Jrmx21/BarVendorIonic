import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'https://barvendor-8d5be5ce5941.herokuapp.com/api/login';

  constructor(private http: HttpClient,private router :Router) {}

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    localStorage.setItem('username', username);
    return this.http.post(this.loginUrl, body, { responseType: 'text' }).pipe(
      catchError((error: any) => {
        return throwError(() => error); // Transforma el error para que el componente lo maneje
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      localStorage.removeItem('username');
    }
    return of(!!token); // Devuelve true si el token existe, false si no
  }
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    //redirige a login
    this.router.navigate(['/login']);
  }
}