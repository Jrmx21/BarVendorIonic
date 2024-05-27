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
  passwordType: string="password";
  passwordIcon: string="eye-off";

  constructor(private authService: AuthService,private toastController:ToastController ,private router: Router) {}

  async presentToast(message: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 1000,
      position: 'top',
      color: color
    });
    toast.present();
  }
  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        // Almacena el token en localStorage o donde prefieras
        localStorage.setItem('authToken', response.token);
        this.router.navigate(['/home']); // Redirige a la página principal
        this.presentToast('Inicio de sesión exitoso', 'success');
      },
      error: (error) => {
        this.errorMessage = 'Credenciales inválidas';
        this.presentToast('Credenciales inválidas', 'danger');
        console.log(error);
      }
    });
  }
  togglePasswordVisibility() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off';
    }
  }
}