# Compadre Padeiro API

Compadre Padeiro API é uma aplicação Node.js que fornece serviços de autenticação, gerenciamento de posts e mensagens para a plataforma Compadre Padeiro.

## Sumário

- [Instalação](#instalação)
- [Configuração](#configuração)
- [Endpoints](#endpoints)
  - [Autenticação](#autenticação)
  - [Posts](#posts)
- [Modelos](#modelos)
- [Controllers](#controllers)
- [Rotas](#rotas)

## Instalação

Clone o repositório.

```bash
git clone https://github.com/narradorww/cp-backend.git
```

Entre no diretório do projeto e instale as dependências.

```bash
cd cp-backend
npm install
```

Inicie o servidor.
```bash

npm start
```
O servidor estará rodando na porta 3001.

##Configuração

Crie um arquivo *.env* na raiz do projeto com as seguintes variáveis:

```bash
MONGODB_URI=<Sua URI de conexão ao MongoDB>
GOOGLE_CLIENT_ID=<Seu Client ID do Google>
GOOGLE_CLIENT_SECRET=<Seu Client Secret do Google>
FACEBOOK_APP_ID=<Seu App ID do Facebook>
FACEBOOK_APP_SECRET=<Seu App Secret do Facebook>
JWT_SECRET=<Sua chave secreta para JWT>
JWT_REFRESH_SECRET=<Sua chave secreta para refresh tokens>

```

##Endpoints

###Autenticação
Autenticação com Google: GET /auth/google
Callback do Google: GET /auth/google/callback
Autenticação com Facebook: GET /auth/facebook
Callback do Facebook: GET /auth/facebook/callback
Verificação de token de acesso protegido: GET /auth/protected
Atualização de token de acesso: POST /auth/refresh-token


###Posts
Listar todos os posts: GET /posts
Obter um post específico: GET /posts/:id
Criar um novo post: POST /posts
Atualizar um post existente: PUT /posts/:id
Excluir um post: DELETE /posts/:id

##Modelos
A API utiliza três modelos principais:

User: Representa um usuário com informações como nome de usuário, nome de exibição, email, foto, localização e data de criação.

Post: Representa um post com informações como o usuário criador, título, descrição, tipo (oferta ou pedido), status (aberto ou fechado) e data de criação.

Message: Representa uma mensagem entre usuários com informações como remetente, destinatário, post relacionado, conteúdo e data de criação.

##Controllers
Os controladores da API são responsáveis por gerenciar as operações de CRUD para os modelos:

postController: Gerencia a criação, leitura, atualização e exclusão de posts.
Rotas
As rotas da API estão organizadas nos seguintes arquivos:

authRoutes.js: Define as rotas relacionadas à autenticação e autorização dos usuários.
postRoutes.js: Define as rotas relacionadas aos posts.