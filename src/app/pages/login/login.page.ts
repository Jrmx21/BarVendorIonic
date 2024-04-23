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
  username: string="";
  password: string="";

  constructor(private toastController:ToastController,private authService: AuthService, private router: Router) { }

  async presentToast(message:string,color:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: "bottom",
      color: color,
    });

    await toast.present();
  }
  login() {
    this.authService.login(this.username, this.password)
      .subscribe(
        response => {
          // Manejar la respuesta del backend aquí
          if (response.success) {
            // Redirigir al usuario a otra página
            this.router.navigate(['/home']);
            this.presentToast("Inicio de sesión exitoso",'success')
          } else {
            // Mostrar un mensaje de error al usuario
            console.error(response.message);
            this.presentToast("Inicio de sesión fallido",'danger')
          }
        },
        error => {
          // Manejar errores aquí
          console.error('Error en el servidor', error);
          this.presentToast("Fallo en el servidor",'danger')

        }
      );
  }
}
