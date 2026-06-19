import { Injectable, signal } from '@angular/core';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { firestoreDb } from '../core/firebase';
import { ItemEstoque } from '../models/estoque.model';

@Injectable({ providedIn: 'root' })
export class EstoqueService {
  private readonly colecao = collection(firestoreDb, 'estoque');

  itens = signal<ItemEstoque[]>([]);
  carregando = signal<boolean>(true);
  erro = signal<string | null>(null);

  constructor() {
    onSnapshot(
      this.colecao,
      (snapshot) => {
        const lista: ItemEstoque[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<ItemEstoque, 'id'>)
        }));
        this.itens.set(lista);
        this.carregando.set(false);
      },
      (err) => {
        console.error('Erro ao escutar estoque:', err);
        this.erro.set('Não foi possível conectar ao Firestore. Verifique as credenciais no environment.ts.');
        this.carregando.set(false);
      }
    );
  }

  async adicionar(item: ItemEstoque): Promise<void> {
    const { id, ...dados } = item;
    await addDoc(this.colecao, dados);
  }

  async atualizar(id: string, item: Partial<ItemEstoque>): Promise<void> {
    const ref = doc(firestoreDb, 'estoque', id);
    await updateDoc(ref, { ...item });
  }

  async remover(id: string): Promise<void> {
    const ref = doc(firestoreDb, 'estoque', id);
    await deleteDoc(ref);
  }
}
