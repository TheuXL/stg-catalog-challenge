# STG Catalog Challenge 🚀

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

---

## 📄 Sobre o Projeto

O **STG Catalog Challenge** é uma aplicação de e-commerce full-stack que simula uma experiência de compra online real, desde a autenticação do usuário até a finalização do pedido via WhatsApp. O projeto foi construído com foco em boas práticas de desenvolvimento, componentização, testabilidade e uma arquitetura moderna e escalável.

O objetivo é demonstrar a construção de um sistema coeso, onde o frontend e o backend se comunicam de forma segura e eficiente, utilizando tecnologias modernas para criar uma experiência de usuário fluida e uma base de código robusta.

---
Link do projeto 
https://shre.ink/stg-catalog-challenge
---

## ✨ Funcionalidades

-   [x] **Autenticação Completa:** Registro, login e recuperação de senha utilizando Supabase Auth.
-   [x] **Catálogo de Produtos Dinâmico:** Listagem de produtos com busca em tempo real.
-   [x] **Página de Detalhes do Produto:** Visualização de informações completas sobre um item específico.
-   [x] **Carrinho de Compras Persistente:** O carrinho de cada usuário é salvo no banco de dados, acessível de qualquer dispositivo.
-   [x] **Proteção de Rotas:** Acesso a páginas como carrinho e checkout restrito a usuários autenticados.
-   [x] **Checkout via WhatsApp:** Geração de uma mensagem de pedido formatada para um checkout rápido e prático.
-   [x] **Testes de Integração (Backend):** Suíte de testes robusta para a API, garantindo a confiabilidade das regras de negócio.

---

## 🔧 Arquitetura e Funcionamento do Sistema

O projeto é um monorepo com duas aplicações principais: `backend` e `frontend`. A comunicação entre elas é feita através de uma API RESTful, com o Supabase atuando como a camada de banco de dados e autenticação.

### 🌐 **Backend (Node.js + Express + TypeScript)**

O backend é o cérebro da operação, responsável por todas as regras de negócio, interações com o banco de dados e segurança da aplicação.

#### Estrutura de Arquivos

A estrutura do backend segue uma abordagem em camadas (Controllers, Services, Routes) para separar as responsabilidades:

```
backend/src/
├── api/
│   ├── controllers/  # Controla o fluxo da requisição
│   ├── middlewares/  # Funções que interceptam requisições
│   ├── routes/       # Define os endpoints da API
│   └── services/     # Contém a lógica de negócio
├── config/           # Configuração de clientes (ex: Supabase)
├── __tests__/        # Testes de integração
└── server.ts         # Ponto de entrada do servidor
```

#### Fluxo de uma Requisição

1.  **`server.ts`**: O servidor Express é iniciado e configurado com middlewares essenciais como `cors` e `express.json()`. Todas as rotas são centralizadas sob o prefixo `/api`.
2.  **`api/routes/index.ts`**: Atua como um agregador, importando e distribuindo as rotas de cada módulo (produtos, carrinho, autenticação).
3.  **`api/routes/*.routes.ts`**: Define os endpoints específicos para um recurso. Por exemplo, `cart.routes.ts` define que a rota `POST /` será manipulada pelo `cartController`. Crucialmente, é aqui que o `authMiddleware` é aplicado, protegendo todas as rotas de carrinho.
4.  **`api/controllers/*.controller.ts`**: O controller extrai dados da requisição (como `body` e `params`) e o `userId` (anexado pelo middleware de autenticação). Ele não contém lógica de negócio, apenas orquestra o fluxo, chamando o serviço apropriado.
5.  **`api/services/*.service.ts`**: Esta é a camada que contém a lógica de negócio real. O `cart.service.ts`, por exemplo, executa as operações de `upsert` ou `delete` no banco de dados usando o cliente `supabaseAdmin`.

#### Autenticação e Autorização com `auth.middleware.ts`

A segurança das rotas é garantida por um middleware que valida o token JWT do usuário em cada requisição para endpoints protegidos.

1.  O **Frontend** envia o token JWT no cabeçalho `Authorization: Bearer <token>`.
2.  O **Backend** intercepta a requisição com o `auth.middleware.ts`.
3.  O middleware usa `supabase.auth.getUser(token)` para verificar a validade do token com o Supabase.
4.  Se o token for válido, o usuário correspondente é extraído e anexado ao objeto `req`, permitindo que os controllers subsequentes saibam quem está fazendo a requisição. Se inválido, a requisição é bloqueada com um status `401 Unauthorized`.

```typescript
// backend/src/api/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../../config/supabaseClient';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não fornecido ou mal formatado.' });
  }

  const token = authHeader.split(' ')[1];
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }

  (req as any).user = data.user; // Anexa o usuário na requisição
  next();
};
```

#### Gerenciamento do Carrinho com `supabaseAdmin`

Para garantir que um usuário só possa modificar o seu próprio carrinho, o Supabase é configurado com **Row Level Security (RLS)**. No entanto, o backend precisa de acesso para realizar operações em nome do usuário. Para isso, utilizamos um cliente especial, o `supabaseAdmin`, inicializado com a `SERVICE_ROLE_KEY`. Este cliente tem permissões de administrador e pode contornar as políticas de RLS de forma segura.

A lógica de "adicionar ou atualizar" (upsert) é tratada de forma eficiente pelo serviço do carrinho, que utiliza a cláusula `onConflict` do Supabase.

```typescript
// backend/src/api/services/cart.service.ts
import { supabaseAdmin } from '../../config/supabaseClient';

export const upsertCartItem = async (userId: string, productId: number, quantity: number) => {
  const { data, error } = await supabaseAdmin
    .from('cart_items')
    .upsert(
      { user_id: userId, product_id: productId, quantity: quantity },
      // Se o par (user_id, product_id) já existir, atualiza a coluna 'quantity'.
      { onConflict: 'user_id,product_id' }
    )
    .select();

  if (error) throw new Error(error.message);
  return data;
};
```

### ⚛️ **Frontend (React + Vite + TypeScript)**

O frontend é uma Single Page Application (SPA) construída com React, responsável por toda a interface do usuário e pela interação com a API do backend.

#### Estrutura de Arquivos

A organização dos arquivos visa a componentização e a separação de responsabilidades, facilitando a manutenção e escalabilidade.

```
frontend/src/
├── api/          # Configuração do cliente Axios (com interceptor)
├── components/   # Componentes reutilizáveis (Auth, Cart, Common, Layout)
├── contexts/     # Estado global (AuthContext, CartContext)
├── lib/          # Configuração do cliente Supabase para o frontend
├── pages/        # Componentes que representam páginas inteiras
├── routes/       # Configuração de rotas (públicas e protegidas)
└── App.tsx       # Componente raiz que une os providers e rotas
```

#### Gerenciamento de Estado com Context API

O estado global da aplicação é gerenciado através da Context API do React, evitando a complexidade de bibliotecas de estado externas para este escopo de projeto.

-   **`AuthContext.tsx`**:
    -   Utiliza `supabase.auth.onAuthStateChange` para ouvir eventos de login e logout em tempo real.
    -   Mantém o estado do `user` e da `session` atualizados.
    -   Disponibiliza um estado de `loading` para que a aplicação saiba quando a sessão inicial está sendo verificada, evitando "flashes" de conteúdo indevido.
-   **`CartContext.tsx`**:
    -   Abstrai toda a lógica de comunicação com a API de carrinho (`/api/cart`).
    -   Provê funções como `addToCart`, `removeFromCart` e `clearCart`.
    -   Sempre que uma ação é realizada, o contexto chama a função `fetchCart` para buscar os dados atualizados do backend, garantindo que a UI esteja sempre sincronizada com o banco de dados.

#### Proteção de Rotas com `ProtectedRoute.tsx`

Para garantir que apenas usuários autenticados acessem páginas como o carrinho ou o checkout, foi criado um componente `ProtectedRoute`.

Ele utiliza o `useAuth()` para verificar o estado de `user` e `loading`.
-   Se `loading` for `true`, exibe um spinner, aguardando a verificação da sessão.
-   Se `loading` for `false` e não houver `user`, redireciona o usuário para a página `/login`.
-   Se houver um `user`, ele renderiza o componente `<Outlet />`, que representa as rotas filhas protegidas.

```jsx
// frontend/src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from '../components/common/Spinner';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center"><Spinner /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Renderiza o conteúdo protegido
};
```

#### Comunicação com a API

Todas as chamadas para o backend são feitas através de uma instância do Axios, configurada no arquivo `api/index.ts`. A parte mais importante é o **interceptor de requisição**, que garante que o token de autenticação seja enviado em todas as chamadas.

```typescript
// frontend/src/api/index.ts
import axios from 'axios';
import { supabase } from '../lib/supabase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333/api',
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export { api };
```

### 🧪 Testes de Integração (Backend com Jest e Supertest)

A confiabilidade da API é garantida por uma suíte de testes de integração que simula requisições HTTP reais aos endpoints e verifica as respostas e os efeitos colaterais no banco de dados de teste.

#### Estratégia de Teste

-   **Banco de Dados Isolado**: Os testes rodam contra um banco de dados Supabase real (geralmente um ambiente de desenvolvimento ou staging), garantindo que as queries e políticas de segurança sejam testadas de forma fiel à produção.
-   **Ciclo de Vida do Teste**:
    -   `beforeEach`: Antes de cada teste, um novo usuário de teste é criado, e seu carrinho é limpo para garantir um estado inicial previsível.
    -   `afterEach`: Após cada teste, o usuário criado é removido do banco de dados para não interferir nos testes seguintes.
    -   `afterAll`: Ao final de todos os testes em um arquivo, o servidor Express é desligado (`server.close()`).

#### `auth.helper.ts`: O Auxiliar de Autenticação

Para evitar duplicação de código, o arquivo `__tests__/utils/auth.helper.ts` centraliza a lógica de criação e autenticação de usuários para os testes.

-   `createTestUser()`: Usa a `supabaseAdmin.auth.admin.createUser` para criar um usuário instantaneamente, já com o e-mail confirmado. Isso é vital para testes, pois não é possível interagir com um e-mail de confirmação.
-   `getAuthToken()`: Simula o fluxo de login para obter um token JWT válido para o usuário de teste.

#### Exemplos de Casos de Teste

##### Testando o Carrinho (`cart.test.ts`)

Este teste verifica se um item é adicionado corretamente ao carrinho de um usuário autenticado.

```typescript
// backend/src/__tests__/cart.test.ts
test('deve adicionar um item ao carrinho e retorná-lo', async () => {
  const res = await request(expressApp)
    .post('/api/cart')
    .set('Authorization', `Bearer ${authToken}`) // Usa o token do usuário de teste
    .send({ productId: 2, quantity: 1 });

  expect(res.statusCode).toEqual(201);
  expect(res.body[0]).toHaveProperty('product_id', 2);
});
```

##### Testando Produtos (`products.test.ts`)

Verifica se a API retorna um erro 404 quando um produto inexistente é solicitado.

```typescript
// backend/src/__tests__/products.test.ts
test('deve retornar 404 para um produto inexistente', async () => {
  const res = await request(app).get('/api/products/999999');
  
  expect(res.statusCode).toEqual(404);
  expect(res.body).toHaveProperty('error', 'Product not found');
});
```

#### Como Rodar os Testes

Para executar a suíte de testes do backend, certifique-se de que seu arquivo `.env` está configurado com as chaves do Supabase e execute:

```bash
cd backend
npm install
npm test
```

Os resultados serão exibidos no terminal, mostrando os testes que passaram e quaisquer falhas encontradas.
