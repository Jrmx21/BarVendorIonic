// login.page.ts
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  username: string="";
  password: string="";
  errorMessage: string="";

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        // Almacena el token en localStorage o donde prefieras
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/home']); // Redirige a la página principal
      },
      error: (error) => {
        this.errorMessage = 'Credenciales inválidas';
        console.log(error);
      }
    });
  }
}