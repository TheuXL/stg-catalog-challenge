

? REQUISITOS OBRIGATÓRIOS
1. FUNCIONALIDADES PRINCIPAIS
Autenticação (Supabase):
 Tela de login e registro
 Autenticação via email/senha
 Logout funcional
 Proteção de rotas (usuários não logados não acessam o catálogo)
 Recuperação de senha 




Catálogo de Produtos:
 Listagem de produtos com imagem, nome, preço e descrição
 Busca/filtro por nome do produto
 Visualização detalhada do produto (modal ou página)
 Adicionar produto ao carrinho
 Visualizar carrinho com produtos selecionados
 Interface responsiva (desktop e mobile)
Finalização via WhatsApp:
 Botão "Finalizar Pedido" no carrinho
 Gerar mensagem formatada com os produtos
 Redirecionar para wa.me do link com pedido
 Limpar carrinho após envio

2. REQUISITOS TÉCNICOS
Stack Obrigatória:
 TypeScript (todo o código deve ser tipado)
 React

 Supabase (autenticação + banco de dados)
 Tailwind CSS para estilização
 GitHub com repositório público
Integração WhatsApp:
  link direto wa.me
 Formatar pedido de forma legível
 Incluir dados do cliente e produtos escolhidos

3. ESTRUTURA DO BANCO (SUPABASE)
Tabelas necessárias:
products: id, name, description, price, image_url, category, created_at
cart_items: id, user_id, product_id, quantity, created_at
users: gerenciado automaticamente pelo Supabase Auth
Popule com pelo menos 12 produtos de diferentes categorias (eletrônicos, roupas, casa, etc.)




TELAS OBRIGATÓRIAS
Tela 1: Login/Registro
Formulário de login (email + senha)
Link para registro
Formulário de registro (nome completo, email, senha, confirmar senha)
Validações básicas de formulário
Feedback de erro/sucesso
Redirecionamento automático após login
Tela 2: Catálogo Principal
Grid de produtos responsivo (mínimo 12 produtos)
Cada produto deve mostrar: imagem, nome, preço
Botão "Adicionar ao Carrinho" em cada produto
Navegação para carrinho
Tela 3: Detalhes do Produto
Modal ou página com informações completas
Imagem maior, nome, descrição completa, preço
Botão "Adicionar ao Carrinho"
Botão para voltar ao catálogo
Tela 4: Carrinho de Compras
Lista dos produtos adicionados
Quantidade editável para cada item
Botão "Remover" para cada item
Botão "Finalizar Pedido via WhatsApp"
Botão "Continuar Comprando"
Tela 5: Confirmação
Resumo do pedido antes do envio
Dados do cliente
Lista final dos produtos
Valor total
Botão confirmar que redireciona para WhatsApp


Estilo Visual:
Design moderno e limpo estilo e-commerce
Paleta de cores profissional (sugestão: verde/azul para e-commerce)
Componentes bem espaçados e organizados
Ícones consistentes (use Lucide React ou Heroicons)
Cards de produtos atrativos
UX/UI:
Interface intuitiva tipo marketplace
Loading states durante requisições
Feedback visual para ações (adicionar carrinho, login, etc.)
Animações sutis para melhor experiência
Responsividade em pelo menos 3 breakpoints (mobile, tablet, desktop)


? DADOS PARA POPULAR
Popule com produtos variados:
Eletrônicos (smartphones, notebooks, fones)
Roupas (camisetas, calças, sapatos)
Casa (decoração, utensílios, móveis)
Esportes (equipamentos, roupas esportivas)
Use imagens do Unsplash ou Pexels Preços realistas em Real (R$) Descrições atrativas de produtos


? INTEGRAÇÃO WHATSAPP
Formato da Mensagem:
 
 
? *NOVO PEDIDO - STG CATALOG*

? *Cliente:* [Nome do usuário]
? *Email:* [email do usuário]

? *PRODUTOS:*
- [Nome do Produto] - Qtd: [X] - R$ [valor]
- [Nome do Produto] - Qtd: [X] - R$ [valor]

? *TOTAL: R$ [valor total]*

---
Pedido realizado via STG Catalog
Implementação:
Capturar dados do usuário logado
Formatar lista de produtos do carrinho
Calcular total
Gerar link wa.me com mensagem
Abrir em nova aba
Limpar carrinho após confirmação


 Histórico de pedidos do usuário
 Filtros avançados (categoria, faixa de preço)
Testes unitários (Jest
 Animações suaves (Framer Motion)

 ÚVIDAS FREQUENTES
P: Posso usar bibliotecas de componentes como Material-UI ou Chakra? R: Prefira Headless UI + Tailwind, mas se usar outras, justifique no README.

P: Como devo tratar erros de API? R: Implemente tratamento adequado com try/catch e feedback visual ao usuário.

P: Posso usar Context API ou Redux? R: Context API é suficiente. Se usar Redux, justifique a necessidade.

P: E se não conseguir implementar tudo? R: Entregue o que conseguir funcionando. Priorize funcionalidades obrigatórias.

P: Preciso implementar pagamento real? R: Não, apenas simule até o envio para WhatsApp.

P: Como configurar o Supabase? R: Crie conta gratuita, configure Auth e Database. Documente no README.


2. README.md Obrigatório
Seção: Sobre o Projeto Descrição completa do sistema desenvolvido, suas funcionalidades principais e objetivo. Explicar que é um e-commerce completo com finalização via WhatsApp.
Seção: Tecnologias Utilizadas Lista detalhada de todas as tecnologias, bibliotecas e ferramentas utilizadas no projeto, com justificativa para escolhas principais.
Seção: IA Utilizada Documentação específica sobre quais IAs foram utilizadas (ChatGPT, Claude, Cursor, etc.), como ajudaram no desenvolvimento, e quais partes foram geradas vs. escritas manualmente.
Seção: Como Rodar o Projeto Passo a passo detalhado para clonar, instalar dependências, configurar variáveis de ambiente e executar o projeto localmente.
Seção: Links Deploy da aplicação funcionando e link do projeto Supabase (se público). Todos os links devem estar funcionais.
Seção: Funcionalidades Checklist completo de todas as funcionalidades implementadas, separando obrigatórias de opcionais/diferenciais.



 CRITÉRIOS DE AVALIAÇÃO
Funcionalidade (40%):

Sistema de autenticação funciona completamente
Catálogo carrega e exibe produtos corretamente
Carrinho de compras funcional
Integração WhatsApp operacional
Deploy acessível e estável
Código (30%):

TypeScript bem utilizado com tipagem adequada
Estrutura de projeto organizada e escalável
Boas práticas React/Next.js aplicadas
Código limpo, legível e bem documentado
UI/UX (20%):

Design profissional e atrativo
Experiência de usuário intuitiva
Responsividade em diferentes dispositivos
Estados de loading, erro e feedback adequados
Uso de IA (10%):

Documentação clara e honesta do uso de IA
Código gerado por IA bem revisado e adaptado
Aproveitamento inteligente das ferramentas de IA
Demonstração de entendimento do código gerado

melhore o readme, explique detalhadamente cada codigo individualmente e não só por pasta, use partes dos codigos para mostra as fucionalidades, explique todo o fucionamento sistema, use os resultados dos tests para mostra graficos sobre o sistema, explque os tests, como foicriado e como estão fucionando