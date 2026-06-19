// Coleção: fornecedores
export interface Fornecedor {
  id?: string;
  nome: string;
  contato: string;       // telefone ou e-mail
  produtoFornecido: string;
  ativo: boolean;
}
