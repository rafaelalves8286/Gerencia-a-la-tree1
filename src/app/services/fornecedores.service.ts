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
import { Fornecedor } from '../models/fornecedor.model';

@Injectable({ providedIn: 'root' })
export class FornecedoresService {
  private readonly colecao = collection(firestoreDb, 'fornecedores');

  fornecedores = signal<Fornecedor[]>([]);
  carregando = signal<boolean>(true);
  erro = signal<string | null>(null);

  constructor() {
    onSnapshot(
      this.colecao,
      (snapshot) => {
        const lista: Fornecedor[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<Fornecedor, 'id'>)
        }));
        this.fornecedores.set(lista);
        this.carregando.set(false);
      },
      (err) => {
        console.error('Erro ao escutar fornecedores:', err);
        this.erro.set('Não foi possível conectar ao Firestore. Verifique as credenciais no environment.ts.');
        this.carregando.set(false);
      }
    );
  }

  async adicionar(fornecedor: Fornecedor): Promise<void> {
    const { id, ...dados } = fornecedor;
    await addDoc(this.colecao, dados);
  }

  async atualizar(id: string, fornecedor: Partial<Fornecedor>): Promise<void> {
    const ref = doc(firestoreDb, 'fornecedores', id);
    await updateDoc(ref, { ...fornecedor });
  }

  async remover(id: string): Promise<void> {
    const ref = doc(firestoreDb, 'fornecedores', id);
    await deleteDoc(ref);
  }
}
