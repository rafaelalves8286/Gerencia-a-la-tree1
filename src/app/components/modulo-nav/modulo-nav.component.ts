import { Component, inject } from '@angular/core';
import { NavegacaoService, ModuloApp } from '../../services/navegacao.service';

@Component({
  selector: 'app-modulo-nav',
  standalone: true,
  templateUrl: './modulo-nav.component.html',
  styleUrls: ['./modulo-nav.component.scss']
})
export class ModuloNavComponent {
  nav = inject(NavegacaoService);

  modulos: { id: ModuloApp; label: string }[] = [
    { id: 'cardapio', label: 'Cardápio' },
    { id: 'estoque', label: 'Estoque' },
    { id: 'fornecedores', label: 'Fornecedores' },
    { id: 'admins', label: 'Admins' }
  ];

  selecionar(modulo: ModuloApp) {
    this.nav.irPara(modulo);
  }
}
