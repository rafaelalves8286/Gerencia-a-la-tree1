import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { MenuItem, MenuTemplate, AppView, IngredienteUsado } from '../models/menu-item.model';
import { EstoqueService } from './estoque.service';
import { CardapioFirestoreService } from './cardapio-firestore.service';

@Injectable({ providedIn: 'root' })
export class MenuService {
  private estoqueService = inject(EstoqueService);
  private cardapioRemoto = inject(CardapioFirestoreService);

  readonly categoriesList = ['Prato Principal', 'Acompanhamento', 'Salada', 'Sobremesa', 'Bebida'];

  readonly dayLabels = ['SEG','TER','QUA','QUI','SEX','SÁB','DOM'];
  readonly dayNums   = [11, 12, 13, 14, 15, 16, 17];

  // Signals
  items         = signal<MenuItem[]>([]);
  currentDay    = signal<number>(1);
  currentView   = signal<AppView>('list');
  editingId     = signal<string | null>(null);
  topBarTitle   = signal<string>('Gerenciamento de Itens');
  headerSubtitle = signal<string>('Gerenciamento de Itens');
  savedTemplates = signal<MenuTemplate[]>([]);

  // true = sem Firestore disponível, salvando só localmente (localStorage)
  modoOffline = signal<boolean>(false);

  // Form state
  formName     = signal<string>('');
  formDesc     = signal<string>('');
  formPrice    = signal<string>('');
  formCats     = signal<string[]>([]);
  formDays     = signal<number[]>([]);
  formImage    = signal<string | null>(null);
  formIngredientes = signal<IngredienteUsado[]>([]);

  filteredItems = computed(() =>
    this.items().filter(i => i.days.includes(this.currentDay()))
  );

  isFormValid = computed(() =>
    this.formName().trim().length > 0 &&
    this.formCats().length > 0 &&
    this.formDays().length > 0
  );

  constructor() {
    const stored = localStorage.getItem('boteco_templates');
    if (stored) this.savedTemplates.set(JSON.parse(stored));

    // Tenta conectar ao Firestore. Enquanto não sabemos o status (online() === null)
    // o app mostra a lista local (vazia ou do localStorage) sem travar a tela.
    this.cardapioRemoto.conectar();

    effect(() => {
      const online = this.cardapioRemoto.online();
      if (online === true) {
        // Conectado: o Firestore passa a ser a fonte de verdade do cardápio.
        this.modoOffline.set(false);
        this.items.set(this.cardapioRemoto.itensRemotos());
      } else if (online === false) {
        // Sem Firestore: usa o que estiver salvo localmente (não perde o trabalho).
        this.modoOffline.set(true);
        const storedItems = localStorage.getItem('boteco_cardapio_local');
        if (storedItems) this.items.set(JSON.parse(storedItems));
      }
    });
  }

  private saveTemplates() {
    localStorage.setItem('boteco_templates', JSON.stringify(this.savedTemplates()));
  }

  // Salva uma cópia local sempre que os itens mudam, para servir de
  // fallback caso o Firestore fique indisponível em uma próxima visita.
  private saveItemsLocally() {
    localStorage.setItem('boteco_cardapio_local', JSON.stringify(this.items()));
  }

  selectDay(day: number) {
    this.currentDay.set(day);
  }

  openForm(editItem?: MenuItem) {
    if (editItem) {
      this.editingId.set(editItem.id);
      this.formName.set(editItem.name);
      this.formDesc.set(editItem.description || '');
      this.formPrice.set(editItem.price.toFixed(2).replace('.', ','));
      this.formCats.set([...editItem.categories]);
      this.formDays.set([...editItem.days]);
      this.formImage.set(editItem.imageUrl || null);
      this.formIngredientes.set(editItem.ingredientes ? editItem.ingredientes.map(i => ({ ...i })) : []);
      this.topBarTitle.set('Editar Item do Cardápio');
      this.headerSubtitle.set('Editar Item');
    } else {
      this.editingId.set(null);
      this.formName.set('');
      this.formDesc.set('');
      this.formPrice.set('');
      this.formCats.set([]);
      this.formDays.set([this.currentDay()]);
      this.formImage.set(null);
      this.formIngredientes.set([]);
      this.topBarTitle.set('Configurar Prato');
      this.headerSubtitle.set('Novo Item');
    }
    this.currentView.set('form');
  }

  openSavedView() {
    this.currentView.set('saved');
    this.topBarTitle.set('Buscar nos Salvos');
    this.headerSubtitle.set('Modelos Salvos');
  }

  goBackToList() {
    this.currentView.set('list');
    this.topBarTitle.set('Gerenciamento de Itens');
    this.headerSubtitle.set('Gerenciamento de Itens');
    this.editingId.set(null);
  }

  toggleFormCat(cat: string) {
    const current = this.formCats();
    if (current.includes(cat)) {
      this.formCats.set(current.filter(c => c !== cat));
    } else {
      this.formCats.set([...current, cat]);
    }
  }

  toggleFormDay(day: number) {
    const current = this.formDays();
    if (current.includes(day)) {
      this.formDays.set(current.filter(d => d !== day));
    } else {
      this.formDays.set([...current, day]);
    }
  }

  // ---- Ingredientes do prato (vinculados ao estoque) ----

  // Itens do estoque que ainda não foram adicionados como ingrediente do prato atual
  ingredientesDisponiveis = computed(() => {
    const usados = new Set(this.formIngredientes().map(i => i.estoqueId));
    return this.estoqueService.itens().filter(i => i.id && !usados.has(i.id));
  });

  adicionarIngrediente(estoqueId: string, quantidade: number) {
    if (!estoqueId || quantidade <= 0) return;
    const item = this.estoqueService.itens().find(e => e.id === estoqueId);
    if (!item || !item.id) return;
    this.formIngredientes.update(list => [
      ...list,
      { estoqueId: item.id!, nome: item.nome, unidade: item.unidade, quantidade }
    ]);
  }

  atualizarQuantidadeIngrediente(estoqueId: string, quantidade: number) {
    this.formIngredientes.update(list =>
      list.map(i => i.estoqueId === estoqueId ? { ...i, quantidade: quantidade > 0 ? quantidade : i.quantidade } : i)
    );
  }

  removerIngrediente(estoqueId: string) {
    this.formIngredientes.update(list => list.filter(i => i.estoqueId !== estoqueId));
  }

  // Quantas porções do prato dá pra fazer com o estoque atual.
  // Prato sem ingredientes vinculados não é controlado por estoque (sempre disponível).
  porcoesDisponiveis(item: MenuItem): number | null {
    if (!item.ingredientes || item.ingredientes.length === 0) return null;
    const estoqueAtual = this.estoqueService.itens();
    let minimo = Infinity;
    for (const ing of item.ingredientes) {
      const atual = estoqueAtual.find(e => e.id === ing.estoqueId);
      const disponivel = atual ? atual.quantidade : 0;
      const porcoes = ing.quantidade > 0 ? Math.floor(disponivel / ing.quantidade) : Infinity;
      minimo = Math.min(minimo, porcoes);
    }
    return minimo === Infinity ? 0 : Math.max(0, minimo);
  }

  itemEstaDisponivel(item: MenuItem): boolean {
    const porcoes = this.porcoesDisponiveis(item);
    return porcoes === null || porcoes > 0;
  }

  // Registra um pedido: baixa do estoque a quantidade de cada ingrediente do prato.
  // Pratos sem ingredientes vinculados não alteram o estoque.
  async registrarPedido(item: MenuItem, quantidade: number = 1): Promise<void> {
    if (!item.ingredientes || item.ingredientes.length === 0) return;
    const estoqueAtual = this.estoqueService.itens();
    for (const ing of item.ingredientes) {
      const atual = estoqueAtual.find(e => e.id === ing.estoqueId);
      if (!atual || !atual.id) continue;
      const novaQuantidade = Math.max(0, atual.quantidade - ing.quantidade * quantidade);
      await this.estoqueService.atualizar(atual.id, { quantidade: novaQuantidade });
    }
  }

  parsePrice(raw: string): number {
    return parseFloat(raw.replace('.', '').replace(',', '.')) || 0;
  }

  async submitItem() {
    if (!this.isFormValid()) return;
    const price = this.parsePrice(this.formPrice());
    const editId = this.editingId();
    const ingredientes = [...this.formIngredientes()];
    const online = this.cardapioRemoto.online() === true;

    if (editId) {
      const atualizado: MenuItem = {
        id: editId,
        name: this.formName().trim(),
        description: this.formDesc().trim(),
        categories: [...this.formCats()],
        days: [...this.formDays()],
        price,
        imageUrl: this.formImage() || undefined,
        ingredientes
      };
      if (online) {
        await this.cardapioRemoto.salvar(atualizado);
        // O signal "items" é atualizado automaticamente pelo listener (onSnapshot).
      } else {
        this.items.update(list => list.map(i => i.id === editId ? atualizado : i));
        this.saveItemsLocally();
      }
    } else {
      if (online) {
        const novoId = await this.cardapioRemoto.criar({
          id: '',
          name: this.formName().trim(),
          description: this.formDesc().trim(),
          categories: [...this.formCats()],
          days: [...this.formDays()],
          price,
          imageUrl: this.formImage() || undefined,
          ingredientes
        });
        void novoId; // o listener (onSnapshot) já vai trazer o item novo com o id certo
      } else {
        this.items.update(list => [...list, {
          id: Date.now().toString(),
          name: this.formName().trim(),
          description: this.formDesc().trim(),
          categories: [...this.formCats()],
          days: [...this.formDays()],
          price,
          imageUrl: this.formImage() || undefined,
          ingredientes
        }]);
        this.saveItemsLocally();
      }
    }
    this.goBackToList();
  }

  async deleteItem(id: string) {
    if (!confirm('Deseja realmente excluir este item?')) return;
    if (this.cardapioRemoto.online() === true) {
      await this.cardapioRemoto.remover(id);
      // O listener (onSnapshot) atualiza "items" automaticamente.
    } else {
      this.items.update(list => list.filter(i => i.id !== id));
      this.saveItemsLocally();
    }
  }

  saveAsTemplate() {
    const name = this.formName().trim();
    if (!name) { alert('Digite pelo menos o nome do item para salvá-lo como modelo.'); return; }
    const price = this.parsePrice(this.formPrice());
    const ingredientes = [...this.formIngredientes()];
    this.savedTemplates.update(list => {
      const filtered = list.filter(t => t.name.toLowerCase() !== name.toLowerCase());
      return [...filtered, { name, description: this.formDesc().trim(), categories: [...this.formCats()], price, imageUrl: this.formImage() || undefined, ingredientes }];
    });
    this.saveTemplates();
    alert(`"${name}" foi salvo permanentemente nos seus modelos com sucesso!`);
  }

  deleteTemplate(index: number) {
    if (confirm('Deseja excluir este prato permanentemente dos salvos?')) {
      this.savedTemplates.update(list => list.filter((_, i) => i !== index));
      this.saveTemplates();
    }
  }

  loadTemplateIntoForm(template: MenuTemplate) {
    this.openForm();
    this.formName.set(template.name);
    this.formDesc.set(template.description || '');
    this.formPrice.set(template.price > 0 ? template.price.toFixed(2).replace('.', ',') : '');
    this.formCats.set([...template.categories]);
    this.formImage.set(template.imageUrl || null);
    this.formIngredientes.set(template.ingredientes ? template.ingredientes.map(i => ({ ...i })) : []);
    this.topBarTitle.set('Adicionar Prato Salvo');
  }

  groupedItems() {
    const filtered = this.filteredItems();
    const grouped: Record<string, MenuItem[]> = {};
    this.categoriesList.forEach(cat => grouped[cat] = []);
    filtered.forEach(item => item.categories.forEach(cat => { if (grouped[cat]) grouped[cat].push(item); }));
    return this.categoriesList
      .filter(cat => grouped[cat].length > 0)
      .map(cat => ({ category: cat, items: grouped[cat] }));
  }
}
