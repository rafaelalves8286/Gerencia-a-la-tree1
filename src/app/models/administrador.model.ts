// Coleção: administradores
// Documento: uid_admin (gerado automaticamente pelo Firestore, sem login real)
export interface Administrador {
  id?: string;           // uid_admin (preenchido pelo Firestore)
  nome: string;
  email: string;
  permissao: NivelPermissao;
}

export type NivelPermissao = 'admin' | 'gerente' | 'funcionario';

export const NIVEIS_PERMISSAO: NivelPermissao[] = ['admin', 'gerente', 'funcionario'];
