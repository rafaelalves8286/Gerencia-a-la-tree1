import { Injectable, signal } from '@angular/core';

export type ModuloApp = 'cardapio' | 'admins' | 'estoque' | 'fornecedores';

@Injectable({ providedIn: 'root' })
export class NavegacaoService {
  moduloAtivo = signal<ModuloApp>('cardapio');

  irPara(modulo: ModuloApp) {
    this.moduloAtivo.set(modulo);
  }
}
