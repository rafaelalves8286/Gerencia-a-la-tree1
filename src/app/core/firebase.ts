import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../environments/environment';

// Inicializa o app do Firebase uma única vez para todo o projeto
export const firebaseApp = initializeApp(environment.firebaseConfig);

// Instância do Firestore usada por todos os services (cardápio, admins, estoque, fornecedores)
export const firestoreDb = getFirestore(firebaseApp);
