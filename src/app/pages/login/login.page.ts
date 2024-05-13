// login.page.ts
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
  username: string = '';
  password: string = '';

  constructor(
    private toastController: ToastController,
    private authService: AuthService,
    private router: Router
  ) {}

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom',
      color: color,
    });

    await toast.present();
  }
  login() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        console.log("RESPUESTA DEL SERVIDOR", response);
        // Verifica si la respuesta no es nula
        if (response) {
         
          if (response.role === 'Camarero') {
            this.router.navigate(['/home']);
            this.presentToast('Inicio de sesión exitoso', 'success');
          } else {
            console.error('El usuario no tiene el rol adecuado');
            this.presentToast('No tienes permisos para acceder', 'danger');
          }
        } else {
          console.error('Respuesta inválida del servidor');
          this.presentToast('Inicio de sesión fallido', 'danger');
        }
      },
      (error) => {
        // Manejar errores aquí
        console.error('Error en el servidor', error);
        this.presentToast('Fallo en el servidor', 'danger');
      }
    );
  }
}
