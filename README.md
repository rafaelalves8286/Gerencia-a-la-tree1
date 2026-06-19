# Gerência À La Tree

Sistema web desenvolvido para gerenciamento de restaurantes, permitindo o controle de cardápio, estoque de ingredientes e integração com Firebase Firestore.

## 📋 Descrição

O Gerência À La Tree foi desenvolvido para auxiliar na administração de estabelecimentos gastronômicos, centralizando informações de pratos, ingredientes e estoque em uma única plataforma.

O sistema utiliza Angular no frontend e Firebase Firestore como banco de dados em nuvem, permitindo armazenamento e sincronização em tempo real.

---

## 🚀 Funcionalidades

### Cardápio

- Cadastro de pratos
- Edição e exclusão de pratos
- Controle de disponibilidade
- Cadastro de descrição e preço
- Upload e exibição de imagens
- Organização por categorias

### Estoque

- Cadastro de ingredientes
- Controle de quantidade disponível
- Controle de unidade de medida
- Atualização de estoque em tempo real

### Integração entre Cardápio e Estoque

- Associação de ingredientes aos pratos
- Definição da quantidade necessária de cada ingrediente
- Estrutura preparada para baixa automática de estoque conforme pedidos realizados

### Firebase Firestore

- Armazenamento em nuvem
- Persistência de dados
- Sincronização em tempo real
- Estrutura escalável para futuras funcionalidades

---

## 🛠️ Tecnologias Utilizadas

- Angular
- TypeScript
- HTML5
- CSS3
- Firebase
- Cloud Firestore
- RxJS

---

## 📂 Estrutura do Banco de Dados

### Coleção: cardapio

```json
{
  "name": "X-Bacon",
  "description": "Hambúrguer artesanal",
  "price": 35.9,
  "imageUrl": "",
  "categories": ["Lanches"],
  "disponivel": true,
  "ingredientes": [
    {
      "estoqueId": "abc123",
      "nome": "Pão",
      "unidade": "un",
      "quantidade": 1
    }
  ]
}
```

### Coleção: estoque

```json
{
  "nome": "Pão",
  "quantidade": 100,
  "unidade": "un"
}
```

---

## ⚙️ Configuração do Projeto

### Pré-requisitos

- Node.js 18+
- npm
- Angular CLI
- Conta Firebase

### Instalação

Clone o repositório:

```bash
git clone <url-do-repositorio>
```

Acesse a pasta do projeto:

```bash
cd gerencia-alatree
```

Instale as dependências:

```bash
npm install
```

Instale o Firebase:

```bash
npm install firebase
```

Execute o projeto:

```bash
ng serve
```

Acesse:

```text
http://localhost:4200
```

---

## 🔥 Configuração do Firebase

No arquivo:

```text
src/environments/environment.ts
```

Configure as credenciais do projeto Firebase:

```typescript
firebaseConfig: {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO",
  storageBucket: "SEU_PROJETO.firebasestorage.app",
  messagingSenderId: "SEU_ID",
  appId: "SEU_APP_ID"
}
```

---

## 📈 Melhorias Futuras

- Controle de pedidos
- Painel da cozinha
- Baixa automática de estoque
- Controle de usuários
- Níveis de acesso
- Dashboard administrativo
- Relatórios gerenciais
- Controle de fornecedores
- Histórico de movimentação de estoque

---

## 👨‍💻 Autor

**Rafael Alves**

Desenvolvedor responsável pela análise, modelagem, implementação e integração do sistema Gerência À La Tree, incluindo as funcionalidades de gerenciamento de cardápio, estoque e banco de dados Firebase Firestore.

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos e educacionais.
