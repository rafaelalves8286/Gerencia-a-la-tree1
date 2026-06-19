import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdministradoresService } from '../../services/administradores.service';
import { Administrador, NIVEIS_PERMISSAO, NivelPermissao } from '../../models/administrador.model';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})
export class AdminViewComponent {
  service = inject(AdministradoresService);
  niveis = NIVEIS_PERMISSAO;

  mostrarForm = signal(false);
  editandoId = signal<string | null>(null);
  salvando = signal(false);

  nome = signal('');
  email = signal('');
  permissao = signal<NivelPermissao>('funcionario');

  abrirNovo() {
    this.editandoId.set(null);
    this.nome.set('');
    this.email.set('');
    this.permissao.set('funcionario');
    this.mostrarForm.set(true);
  }

  abrirEdicao(admin: Administrador) {
    this.editandoId.set(admin.id ?? null);
    this.nome.set(admin.nome);
    this.email.set(admin.email);
    this.permissao.set(admin.permissao);
    this.mostrarForm.set(true);
  }

  // Getters/setters para compatibilizar os signals com [(ngModel)]
  get nomeValue() { return this.nome(); }
  set nomeValue(v: string) { this.nome.set(v); }

  get emailValue() { return this.email(); }
  set emailValue(v: string) { this.email.set(v); }

  get permissaoValue() { return this.permissao(); }
  set permissaoValue(v: NivelPermissao) { this.permissao.set(v); }

  fechar() {
    this.mostrarForm.set(false);
  }

  async salvar() {
    if (!this.nome().trim() || !this.email().trim()) {
      alert('Preencha nome e e-mail do administrador.');
      return;
    }
    this.salvando.set(true);
    const dados: Administrador = {
      nome: this.nome().trim(),
      email: this.email().trim(),
      permissao: this.permissao()
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

  async excluir(admin: Administrador) {
    if (!admin.id) return;
    if (!confirm(`Remover o administrador "${admin.nome}"?`)) return;
    try {
      await this.service.remover(admin.id);
    } catch (e) {
      console.error(e);
      alert('Erro ao excluir no Firestore.');
    }
  }
}
