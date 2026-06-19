import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FornecedoresService } from '../../services/fornecedores.service';
import { Fornecedor } from '../../models/fornecedor.model';

@Component({
  selector: 'app-fornecedores-view',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './fornecedores-view.component.html',
  styleUrls: ['./fornecedores-view.component.scss']
})
export class FornecedoresViewComponent {
  service = inject(FornecedoresService);

  mostrarForm = signal(false);
  editandoId = signal<string | null>(null);
  salvando = signal(false);

  nome = signal('');
  contato = signal('');
  produtoFornecido = signal('');
  ativo = signal(true);

  abrirNovo() {
    this.editandoId.set(null);
    this.nome.set('');
    this.contato.set('');
    this.produtoFornecido.set('');
    this.ativo.set(true);
    this.mostrarForm.set(true);
  }

  abrirEdicao(f: Fornecedor) {
    this.editandoId.set(f.id ?? null);
    this.nome.set(f.nome);
    this.contato.set(f.contato);
    this.produtoFornecido.set(f.produtoFornecido);
    this.ativo.set(f.ativo);
    this.mostrarForm.set(true);
  }

  // Getters/setters para compatibilizar os signals com [(ngModel)]
  get nomeValue() { return this.nome(); }
  set nomeValue(v: string) { this.nome.set(v); }

  get contatoValue() { return this.contato(); }
  set contatoValue(v: string) { this.contato.set(v); }

  get produtoFornecidoValue() { return this.produtoFornecido(); }
  set produtoFornecidoValue(v: string) { this.produtoFornecido.set(v); }

  get ativoValue() { return this.ativo(); }
  set ativoValue(v: boolean) { this.ativo.set(v); }

  fechar() {
    this.mostrarForm.set(false);
  }

  async salvar() {
    if (!this.nome().trim() || !this.contato().trim()) {
      alert('Preencha nome e contato do fornecedor.');
      return;
    }
    this.salvando.set(true);
    const dados: Fornecedor = {
      nome: this.nome().trim(),
      contato: this.contato().trim(),
      produtoFornecido: this.produtoFornecido().trim(),
      ativo: this.ativo()
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

  async excluir(f: Fornecedor) {
    if (!f.id) return;
    if (!confirm(`Remover o fornecedor "${f.nome}"?`)) return;
    try {
      await this.service.remover(f.id);
    } catch (e) {
      console.error(e);
      alert('Erro ao excluir no Firestore.');
    }
  }
}
