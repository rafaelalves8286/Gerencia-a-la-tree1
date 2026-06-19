import { Injectable, signal } from '@angular/core';
import {
  collection,
  onSnapshot,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { firestoreDb } from '../core/firebase';
import { MenuItem } from '../models/menu-item.model';

// Documento salvo no Firestore para cada prato do cardápio.
// Igual ao MenuItem, mas sem o campo "id" (que é o id do próprio documento).
type CardapioDoc = Omit<MenuItem, 'id'>;

/**
 * Sincroniza a coleção "cardapio" do Firestore com o app.
 *
 * Este service não é a fonte de verdade do estado da tela (isso continua
 * sendo o MenuService, com Signals locais) — ele só espelha os pratos no
 * Firestore para que outras telas/apps (ex: um cardápio público para o
 * cliente) possam ler os mesmos dados no futuro.
 *
 * Se o Firebase não estiver configurado (ou a conexão falhar), o service
 * marca `online.set(false)` e o MenuService passa a funcionar 100% local,
 * sem travar o app.
 */
@Injectable({ providedIn: 'root' })
export class CardapioFirestoreService {
  private readonly colecao = collection(firestoreDb, 'cardapio');

  // null = ainda não sabemos (conectando); true = conectado; false = offline/erro
  online = signal<boolean | null>(null);
  itensRemotos = signal<MenuItem[]>([]);

  private pararEscuta: (() => void) | null = null;

  /** Começa a escutar a coleção "cardapio" em tempo real. */
  conectar() {
    if (this.pararEscuta) return; // já conectado
    this.pararEscuta = onSnapshot(
      this.colecao,
      (snapshot) => {
        const lista: MenuItem[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as CardapioDoc)
        }));
        this.itensRemotos.set(lista);
        this.online.set(true);
      },
      (err) => {
        console.warn('Cardápio: não foi possível conectar ao Firestore, usando modo offline (local).', err);
        this.online.set(false);
      }
    );
  }

  /** Remove chaves com valor undefined — o Firestore rejeita gravar "undefined". */
  private limpar(dados: CardapioDoc): CardapioDoc {
    const limpo: any = {};
    Object.entries(dados).forEach(([k, v]) => {
      if (v !== undefined) limpo[k] = v;
    });
    return limpo as CardapioDoc;
  }

  async salvar(item: MenuItem): Promise<void> {
    const { id, ...dados } = item;
    await setDoc(doc(firestoreDb, 'cardapio', id), this.limpar(dados));
  }

  async criar(item: MenuItem): Promise<string> {
    const { id, ...dados } = item;
    const ref = await addDoc(this.colecao, this.limpar(dados));
    return ref.id;
  }

  async remover(id: string): Promise<void> {
    await deleteDoc(doc(firestoreDb, 'cardapio', id));
  }

  async atualizarCampos(id: string, dados: Partial<CardapioDoc>): Promise<void> {
    await updateDoc(doc(firestoreDb, 'cardapio', id), { ...dados });
  }
}
