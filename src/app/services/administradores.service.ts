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
import { Administrador } from '../models/administrador.model';

@Injectable({ providedIn: 'root' })
export class AdministradoresService {
  private readonly colecao = collection(firestoreDb, 'administradores');

  administradores = signal<Administrador[]>([]);
  carregando = signal<boolean>(true);
  erro = signal<string | null>(null);

  constructor() {
    onSnapshot(
      this.colecao,
      (snapshot) => {
        const lista: Administrador[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<Administrador, 'id'>)
        }));
        this.administradores.set(lista);
        this.carregando.set(false);
      },
      (err) => {
        console.error('Erro ao escutar administradores:', err);
        this.erro.set('Não foi possível conectar ao Firestore. Verifique as credenciais no environment.ts.');
        this.carregando.set(false);
      }
    );
  }

  async adicionar(admin: Administrador): Promise<void> {
    const { id, ...dados } = admin;
    await addDoc(this.colecao, dados);
  }

  async atualizar(id: string, admin: Partial<Administrador>): Promise<void> {
    const ref = doc(firestoreDb, 'administradores', id);
    await updateDoc(ref, { ...admin });
  }

  async remover(id: string): Promise<void> {
    const ref = doc(firestoreDb, 'administradores', id);
    await deleteDoc(ref);
  }
}
