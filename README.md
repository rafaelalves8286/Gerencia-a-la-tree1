# Boteco da Árvore — Gerenciamento de Cardápio (Angular + Firestore)

Projeto Angular 19 com integração ao **Firebase Firestore**, contendo as telas de
**Cardápio**, **Estoque**, **Fornecedores** e **Administradores**.

## ⚠️ Antes de rodar: configure o Firebase

1. Crie um projeto em [console.firebase.google.com](https://console.firebase.google.com)
2. Ative o **Firestore Database** (Compilação → Firestore Database → Criar banco de dados → modo de teste)
3. Em Configurações do projeto → Seus aplicativos → adicione um app Web (`</>`) e copie o `firebaseConfig`
4. Cole essas credenciais em `src/environments/environment.ts`

Sem isso, as telas de Administradores, Estoque e Fornecedores vão mostrar
uma mensagem de erro de conexão. O **Cardápio** é a exceção: ele detecta a
falta de conexão automaticamente e continua funcionando em modo offline local
(veja a seção abaixo).

## Ingredientes e controle de estoque por prato

Ao criar ou editar um item do Cardápio, o formulário tem duas abas:

- **Detalhes**: foto, nome, descrição, categorias, preço e dias da semana (como antes).
- **Ingredientes**: opcional. Aqui você vincula itens já cadastrados no **Estoque**
  e informa quanto cada porção do prato consome (ex: Picanha ao Molho de Alho
  consome 0.5 kg de Picanha por porção).

Regras:

- Prato **sem** ingredientes vinculados → fica sempre disponível no cardápio e
  nunca mexe no estoque. Útil para cadastrar o prato rápido e completar os
  ingredientes depois.
- Prato **com** ingredientes vinculados → o cardápio mostra quantas porções
  ainda dá pra preparar com o estoque atual, calculado a partir do ingrediente
  mais escasso. Quando chega a 0 porções, o prato fica marcado como
  "Ingredientes esgotados" e o botão de pedido é bloqueado.
- O botão de carrinho 🛒 no card do prato (só aparece em pratos com ingredientes
  vinculados) registra um pedido: desconta a quantidade de cada ingrediente do
  Estoque (Firestore) e atualiza a contagem de porções na hora.

## Cardápio no Firestore (com modo offline automático)

O Cardápio (pratos + ingredientes) é salvo na coleção **`cardapio`** do Firestore.
Isso permite, no futuro, ler os mesmos pratos a partir de outra tela ou app
(ex: um cardápio público para o cliente, um app de pedidos, etc).

O app **não depende** do Firebase estar configurado para funcionar:

- Se a conexão com o Firestore funcionar normalmente, o Cardápio lê e grava
  direto na coleção `cardapio` em tempo real (qualquer mudança aparece na hora
  em todos os dispositivos conectados).
- Se o Firebase não estiver configurado (`environment.ts` com os valores de
  exemplo) ou a conexão falhar por qualquer motivo, o app detecta isso
  automaticamente e passa a salvar os pratos só no navegador local
  (`localStorage`), sem travar nem mostrar erro feio — aparece apenas um aviso
  discreto no topo: **"Cardápio em modo offline — salvando apenas neste
  dispositivo"**. Assim que o Firebase voltar a funcionar (em uma próxima
  visita), o Cardápio volta a usar a nuvem normalmente.

O **Estoque** continua sempre dependendo do Firestore (sem fallback offline),
porque ele é a referência usada para calcular quantas porções de cada prato
ainda podem ser feitas.

## Estrutura

```
src/
  environments/
    environment.ts             # Credenciais do Firebase (preencher aqui)
  app/
    core/
      firebase.ts               # Inicialização do Firebase App + Firestore
    models/
      menu-item.model.ts        # Interfaces do cardápio (MenuItem, MenuTemplate, IngredienteUsado)
      administrador.model.ts    # Administrador (coleção "administradores")
      estoque.model.ts          # ItemEstoque (coleção "estoque")
      fornecedor.model.ts       # Fornecedor (coleção "fornecedores")
    services/
      menu.service.ts           # Estado do cardápio (Signals) + lógica de ingredientes/estoque + fallback offline
      cardapio-firestore.service.ts  # Sincronização da coleção "cardapio" com o Firestore
      navegacao.service.ts      # Controla qual módulo está ativo
      administradores.service.ts
      estoque.service.ts
      fornecedores.service.ts
    components/
      header/                   # Barra superior + header laranja + aviso de modo offline
      modulo-nav/                # Botões de navegação entre os módulos
      list-view/ form-view/ saved-items-view/   # Telas do cardápio (form-view tem a aba Ingredientes)
      admin-view/                # Tela de Administradores (CRUD no Firestore)
      estoque-view/              # Tela de Estoque (CRUD no Firestore)
      fornecedores-view/         # Tela de Fornecedores (CRUD no Firestore)
  main.ts
  styles.scss
  index.html
```

## Estrutura das coleções no Firestore

```
cardapio
  └── id (auto)
        name: string
        description?: string
        categories: string[]
        days: number[]              // dias da semana em que o prato aparece (1-7)
        price: number
        imageUrl?: string
        ingredientes?: [
          { estoqueId: string, nome: string, unidade: string, quantidade: number }
        ]

administradores
  └── uid_admin (auto)
        nome: string
        email: string
        permissao: 'admin' | 'gerente' | 'funcionario'

estoque
  └── id (auto)
        nome: string
        quantidade: number
        unidade: string
        estoqueMinimo: number

fornecedores
  └── id (auto)
        nome: string
        contato: string
        produtoFornecido: string
        ativo: boolean
```

As coleções e documentos são criados automaticamente pelo app na primeira vez
que você cadastrar algo por cada tela — não é preciso criá-las manualmente no Console.

## Como rodar

### Pré-requisitos
- Node.js 18+ instalado
- Angular CLI 19

### Instalação e execução

```bash
npm install
npm start
```

Abra [http://localhost:4200](http://localhost:4200) no navegador.

### Build de produção

```bash
npm run build
```

Os arquivos finais estarão em `dist/boteco-cardapio/browser/`.

## Logo

Coloque o arquivo `logo-boteco-da-arvore.jpg` dentro da pasta `public/assets/`.

## Tecnologias

- Angular 19 (Standalone Components)
- Angular Signals para gerenciamento de estado
- Firebase Firestore (SDK modular `firebase`) para persistência em nuvem
- TypeScript 5.6
- SCSS
- localStorage como modelos salvos do cardápio e como fallback automático do
  Cardápio quando o Firestore está indisponível (modo offline)

# Gerencia-a-la-tree1
