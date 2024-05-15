import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-last-orders',
  templateUrl: './last-orders.page.html',
  styleUrls: ['./last-orders.page.scss'],
})
export class LastOrdersPage implements OnInit {
  ultimosPedidos: any[] = [];
  usuarioSeleccionadoId: number = 1; // ID del usuario seleccionado

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    // Llama al método del servicio para obtener todos los pedidos.
    this.orderService.getOrders()
      .subscribe(
        data => {
          // Filtra los pedidos para obtener solo los del usuario seleccionado.
          this.ultimosPedidos = data.filter((pedido:any) => pedido.user.id === this.usuarioSeleccionadoId);
          // Ordena los pedidos por fecha en orden descendente.
          this.ultimosPedidos.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
          // Limita la lista a los últimos 10 pedidos.
          this.ultimosPedidos = this.ultimosPedidos.slice(0, 10);
          console.log(this.ultimosPedidos); // Puedes ver los datos en la consola para verificar que se hayan filtrado correctamente.
        },
        error => {
          console.error('Error al obtener los pedidos:', error);
        }
      );
  }


}
