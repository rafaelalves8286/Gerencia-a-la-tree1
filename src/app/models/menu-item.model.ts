// Um ingrediente vinculado a um item do cardápio: referencia um item do
// estoque (por id) e a quantidade necessária para preparar 1 porção do prato.
export interface IngredienteUsado {
  estoqueId: string;
  nome: string;     // copiado do estoque no momento em que foi vinculado (exibição rápida, sem precisar buscar)
  unidade: string;   // copiado do estoque (kg, un, L...)
  quantidade: number; // quantidade gasta por porção, na mesma unidade do estoque
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  categories: string[];
  days: number[];
  price: number;
  imageUrl?: string;
  ingredientes?: IngredienteUsado[]; // vazio/ausente = não controla estoque
}

export interface MenuTemplate {
  name: string;
  description?: string;
  categories: string[];
  price: number;
  imageUrl?: string;
  ingredientes?: IngredienteUsado[];
}

export type AppView = 'list' | 'form' | 'saved';
