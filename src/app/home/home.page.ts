import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ProductComponent } from '../components/product/product.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  products: any[]= [];

  constructor(private productService: ProductService,private modalController:ModalController) { }

  ngOnInit() {
    this.productService.getAllProducts()
      .subscribe(
        data => {
          this.products = data;
          console.log(data);
        },
        error => {
          console.error('Error al obtener productos', error);
        }
      );
  }
  async presentProductModal(product: any) {
    const modal = await this.modalController.create({
      component: ProductComponent,
      componentProps: {
        'product': product
      }
    });
    return await modal.present();
  }
}
