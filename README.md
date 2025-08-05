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

O projeto é um monorepo com duas aplicações principais: `backend` e `frontend`. A comunicação entre elas é feita através de uma API RESTful.

### 🌐 **Backend (Node.js + Express + TypeScript)**

O backend é responsável por todas as regras de negócio, interações com o banco de dados e segurança.

#### Autenticação e Autorização

A autenticação é delegada ao Supabase, mas a autorização é controlada pela nossa API através de um middleware.

1.  O **Frontend** utiliza a biblioteca cliente do Supabase para registrar/logar o usuário, recebendo um token JWT.
2.  Para requisições a rotas protegidas (ex: `/api/cart`), o token JWT é enviado no cabeçalho `Authorization`.
3.  O **Backend** intercepta essa requisição com o `auth.middleware.ts`, que valida o token junto ao Supabase. Se o token for válido, a requisição prossegue; caso contrário, é barrada.

```typescript
// backend/src/api/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../../config/supabaseClient';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido ou mal formatado.' });
  }

  const token = authHeader.split(' ')[1];
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }

  (req as any).user = data.user; // Anexa o usuário na requisição para uso posterior
  next();
};
```

#### Gerenciamento do Carrinho

O carrinho de compras de cada usuário é persistido na tabela `cart_items`. Para garantir a segurança e o isolamento dos dados, utilizamos a **Row Level Security (RLS)** do Supabase. No entanto, para operações internas do backend (como adicionar um item), utilizamos um cliente Supabase com privilégios de administrador (`supabaseAdmin`) que pode contornar a RLS de forma segura.

A lógica de "adicionar ou atualizar" (upsert) é tratada de forma eficiente pelo serviço do carrinho, utilizando a funcionalidade `onConflict` do Supabase para evitar duplicatas do mesmo produto para o mesmo usuário, atualizando a quantidade se o item já existir.

```typescript
// backend/src/api/services/cart.service.ts
import { supabaseAdmin } from '../../config/supabaseClient';

// O serviço usa o supabaseAdmin para operar com segurança no banco.
export const upsertCartItem = async (userId: string, productId: number, quantity: number) => {
  const { data, error } = await supabaseAdmin
    .from('cart_items')
    .upsert(
      { user_id: userId, product_id: productId, quantity: quantity },
      // Se o par user_id/product_id já existir, apenas atualiza a coluna 'quantity'.
      { onConflict: 'user_id,product_id' }
    )
    .select();

  if (error) throw new Error(error.message);
  return data;
};
```
