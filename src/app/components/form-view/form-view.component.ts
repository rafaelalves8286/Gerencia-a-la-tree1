import { Component, inject, ElementRef, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../services/menu.service';
import { EstoqueService } from '../../services/estoque.service';

@Component({
  selector: 'app-form-view',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.scss']
})
export class FormViewComponent {
  menu = inject(MenuService);
  estoque = inject(EstoqueService);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Controla qual aba do form está aberta: dados básicos ou ingredientes
  abaAtiva = signal<'detalhes' | 'ingredientes'>('detalhes');

  // Campos do mini-formulário "adicionar ingrediente"
  novoIngredienteId = signal<string>('');
  novoIngredienteQtd = signal<number | null>(null);

  selecionarAba(aba: 'detalhes' | 'ingredientes') {
    this.abaAtiva.set(aba);
  }

  get novoIngredienteIdValue() { return this.novoIngredienteId(); }
  set novoIngredienteIdValue(v: string) { this.novoIngredienteId.set(v); }

  get novoIngredienteQtdValue() { return this.novoIngredienteQtd(); }
  set novoIngredienteQtdValue(v: number | null) { this.novoIngredienteQtd.set(v); }

  adicionarIngrediente() {
    const id = this.novoIngredienteId();
    const qtd = this.novoIngredienteQtd();
    if (!id || !qtd || qtd <= 0) return;
    this.menu.adicionarIngrediente(id, qtd);
    this.novoIngredienteId.set('');
    this.novoIngredienteQtd.set(null);
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.menu.formImage.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  get name()  { return this.menu.formName(); }
  set name(v: string)  { this.menu.formName.set(v); }

  get desc()  { return this.menu.formDesc(); }
  set desc(v: string)  { this.menu.formDesc.set(v); }

  get price() { return this.menu.formPrice(); }
  set price(v: string) { this.menu.formPrice.set(v); }
}
