import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-last-orders',
  templateUrl: './last-orders.page.html',
  styleUrls: ['./last-orders.page.scss'],
})
export class LastOrdersPage implements OnInit {
  ultimosPedidos: any[] = [];
  usuarioSeleccionado: string | null = ""; // ID del usuario seleccionado

  constructor(private orderService: OrderService) { }

  handleRefresh(event: any) {
    setTimeout(() => {
      this.usuarioSeleccionado = localStorage.getItem('username');
      this.loadOrders();
      event.target.complete();
    }, 2000);
  }

  soloBebidasYEntrantes(pedido: any): boolean {
    return pedido.products.every((producto: any) =>
      producto.categoria === 'Bebida' || producto.categoria === 'Entrante');
  }

  ngOnInit(): void {
    this.usuarioSeleccionado = localStorage.getItem('username');
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders()
      .subscribe(
        data => {
          // Filtra los pedidos para obtener solo los del usuario seleccionado.
          this.ultimosPedidos = data.filter((pedido: any) => pedido.user.username === this.usuarioSeleccionado);
          // Limita la lista a los últimos 30 pedidos sin orden específico.
          this.ultimosPedidos.reverse();
          this.ultimosPedidos = this.ultimosPedidos.slice(-30);
          console.log(this.ultimosPedidos); // Puedes ver los datos en la consola para verificar que se hayan filtrado correctamente.
        },
        error => {
          console.error('Error al obtener los pedidos:', error);
        }
      );
  }
}
