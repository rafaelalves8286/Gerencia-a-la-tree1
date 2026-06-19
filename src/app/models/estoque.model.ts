// Coleção: estoque
export interface ItemEstoque {
  id?: string;
  nome: string;
  quantidade: number;
  unidade: string;       // ex: kg, un, L, cx
  estoqueMinimo: number;
  fornecedorId?: string; // referência opcional ao id do fornecedor
}
