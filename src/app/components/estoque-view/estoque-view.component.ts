import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstoqueService } from '../../services/estoque.service';
import { ItemEstoque } from '../../models/estoque.model';

@Component({
  selector: 'app-estoque-view',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './estoque-view.component.html',
  styleUrls: ['./estoque-view.component.scss']
})
export class EstoqueViewComponent {
  service = inject(EstoqueService);

  mostrarForm = signal(false);
  editandoId = signal<string | null>(null);
  salvando = signal(false);

  nome = signal('');
  quantidade = signal<number | null>(null);
  unidade = signal('un');
  estoqueMinimo = signal<number | null>(null);

  abrirNovo() {
    this.editandoId.set(null);
    this.nome.set('');
    this.quantidade.set(null);
    this.unidade.set('un');
    this.estoqueMinimo.set(null);
    this.mostrarForm.set(true);
  }

  abrirEdicao(item: ItemEstoque) {
    this.editandoId.set(item.id ?? null);
    this.nome.set(item.nome);
    this.quantidade.set(item.quantidade);
    this.unidade.set(item.unidade);
    this.estoqueMinimo.set(item.estoqueMinimo);
    this.mostrarForm.set(true);
  }

  // Getters/setters para compatibilizar os signals com [(ngModel)]
  get nomeValue() { return this.nome(); }
  set nomeValue(v: string) { this.nome.set(v); }

  get quantidadeValue() { return this.quantidade(); }
  set quantidadeValue(v: number | null) { this.quantidade.set(v); }

  get unidadeValue() { return this.unidade(); }
  set unidadeValue(v: string) { this.unidade.set(v); }

  get estoqueMinimoValue() { return this.estoqueMinimo(); }
  set estoqueMinimoValue(v: number | null) { this.estoqueMinimo.set(v); }

  fechar() {
    this.mostrarForm.set(false);
  }

  abaixoDoMinimo(item: ItemEstoque): boolean {
    return item.quantidade <= item.estoqueMinimo;
  }

  async salvar() {
    if (!this.nome().trim() || this.quantidade() === null) {
      alert('Preencha pelo menos o nome e a quantidade.');
      return;
    }
    this.salvando.set(true);
    const dados: ItemEstoque = {
      nome: this.nome().trim(),
      quantidade: this.quantidade() ?? 0,
      unidade: this.unidade().trim() || 'un',
      estoqueMinimo: this.estoqueMinimo() ?? 0
    };

    try {
      const id = this.editandoId();
      if (id) {
        await this.service.atualizar(id, dados);
      } else {
        await this.service.adicionar(dados);
      }
      this.mostrarForm.set(false);
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar no Firestore. Veja o console para detalhes.');
    } finally {
      this.salvando.set(false);
    }
  }

  async excluir(item: ItemEstoque) {
    if (!item.id) return;
    if (!confirm(`Remover "${item.nome}" do estoque?`)) return;
    try {
      await this.service.remover(item.id);
    } catch (e) {
      console.error(e);
      alert('Erro ao excluir no Firestore.');
    }
  }
}
