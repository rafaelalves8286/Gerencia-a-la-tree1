import { Component, inject, signal } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { MenuItem } from '../../models/menu-item.model';

@Component({
  selector: 'app-list-view',
  standalone: true,
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent {
  menu = inject(MenuService);

  pedindoId = signal<string | null>(null);

  editItem(item: MenuItem) {
    this.menu.openForm(item);
  }

  deleteItem(id: string) {
    this.menu.deleteItem(id);
  }

  formatPrice(price: number): string {
    return price.toFixed(2).replace('.', ',');
  }

  temControleEstoque(item: MenuItem): boolean {
    return !!item.ingredientes && item.ingredientes.length > 0;
  }

  porcoesDisponiveis(item: MenuItem): number | null {
    return this.menu.porcoesDisponiveis(item);
  }

  estaDisponivel(item: MenuItem): boolean {
    return this.menu.itemEstaDisponivel(item);
  }

  async pedir(item: MenuItem) {
    if (!this.estaDisponivel(item)) return;
    this.pedindoId.set(item.id);
    try {
      await this.menu.registrarPedido(item, 1);
    } catch (e) {
      console.error(e);
      alert('Erro ao registrar o pedido no estoque.');
    } finally {
      this.pedindoId.set(null);
    }
  }
}
