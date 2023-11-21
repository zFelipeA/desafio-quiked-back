# Teste técnico - Quikdev

Projeto simples que simula uma rede social onde o usuário pode registrar uma conta, fazer login, criar publicações, reagir a essas publicações com 'curtidas' e 'não curtidas' e comentar.

## Stack utilizada

**Back-end:** Node (v20.6.1), Prisma (^5.6.0), Joi (^17.11.0), Nodemailer (^6.9.7) e Bcryptjs (^2.4.3)

## Funcionalidades

-   Autenticação de Usuário:
    -   Registro de novos usuários.
    -   Login para acesso à plataforma.
-   Gerenciamento de Publicações:
    -   Capacidade de criar e editar uma publicação.
    -   Rastreamento do número total de visualizações, curtidas e não curtidas para cada publicação.
-   Interatividade do Usuário:
    -   Opção para curtir ou não curtir as publicações.
    -   Capacidade de deixar comentários nas publicações.
-   API para Relatórios:
    -   Disponibilização de uma API para gerar relatórios estatísticos (JSON).
    -   Métricas de engajamento, como número de visualizações, curtidas e comentários por publicação.

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`EMAIL_HOST` - Endereço do provedor de email.

`EMAIL_USER` Seu usuário do provedor de email.

`EMAIL_PASSWORD` Sua senha do provedor de email.

## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/zFelipeA/desafio-quikdev-back-end
```

Entre no diretório do projeto

```bash
  cd my-project
```

Instale as dependências

```bash
  npm install
```

Crie uma migrate

```bash
  npx prisma migrate dev --name init
```

Inicie o servidor

```bash
  npm run start
```

## Documentação da API

#### Cria uma conta

```http
  POST /api/user
```

| Parâmetro  | Tipo     | Descrição                                 |
| :--------- | :------- | :---------------------------------------- |
| `name`     | `string` | **Obrigatório**. Nome de usuário da conta |
| `password` | `string` | **Obrigatório**. Senha da conta           |
| `email`    | `string` | **Obrigatório**. Email da conta           |

#### Verifica se o usuário possui uma sessão válida.

```http
  GET /api/auth
```

#### Cria a sessão do usuário

```http
  POST /api/auth
```

| Parâmetro  | Tipo     | Descrição                       |
| :--------- | :------- | :------------------------------ |
| `password` | `string` | **Obrigatório**. Senha da conta |
| `email`    | `string` | **Obrigatório**. Email da conta |

#### Exclui a sessão do usuário

```http
  DELETE /api/auth
```

#### Recupera as publicações correspondentes da página fornecida.

```http
  GET /api/post?page={page}
```

#### Cria uma publicação.

```http
  POST /api/post
```

| Parâmetro     | Tipo     | Descrição                          |
| :------------ | :------- | :--------------------------------- |
| `title`       | `string` | **Obrigatório**. Titulo do post    |
| `description` | `string` | **Obrigatório**. Descrição do post |
| `image_url`   | `string` | **Opcional**. URL de uma imagem    |

#### Atualiza uma publicação.

```http
  PATCH /api/post
```

| Parâmetro     | Tipo     | Descrição                       |
| :------------ | :------- | :------------------------------ |
| `post_id`     | `int`    | **Obrigatório**. ID do post     |
| `title`       | `string` | **Opcional**. Titulo do post    |
| `description` | `string` | **Opcional**. Descrição do post |
| `image_url`   | `string` | **Opcional**. URL de uma imagem |

#### Exclui uma publicação.

```http
  DELETE /api/post
```

| Parâmetro | Tipo  | Descrição                   |
| :-------- | :---- | :-------------------------- |
| `post_id` | `int` | **Obrigatório**. ID do post |

#### Adiciona uma reação a publicação.

```http
  POST /api/feedback
```

| Parâmetro  | Tipo     | Descrição                                          |
| :--------- | :------- | :------------------------------------------------- |
| `post_id`  | `int`    | **Obrigatório**. ID do post                        |
| `reaction` | `string` | **Obrigatório**. Tipo da reação (liked e disliked) |

#### Adiciona um comentário a publicação.

```http
  POST /api/comment
```

| Parâmetro | Tipo     | Descrição                            |
| :-------- | :------- | :----------------------------------- |
| `post_id` | `int`    | **Obrigatório**. ID do post          |
| `text`    | `string` | **Obrigatório**. Texto do comentário |

#### Atualiza um comentário de uma publicação.

```http
  PATCH /api/comment
```

| Parâmetro | Tipo     | Descrição                            |
| :-------- | :------- | :----------------------------------- |
| `id`      | `int`    | **Obrigatório**. ID do comentário    |
| `text`    | `string` | **Obrigatório**. Texto do comentário |

#### Deleta um comentário de uma publicação.

```http
  DELETE /api/comment
```

| Parâmetro | Tipo  | Descrição                         |
| :-------- | :---- | :-------------------------------- |
| `id`      | `int` | **Obrigatório**. ID do comentário |

#### Recupera as publicações (relatório).

```http
  GET /api/summary
```

## FAQ

#### Por que você utilizou essas libs/bibliotecas?

-   Prisma ORM

    -   Optei pelo uso do Prisma devido à sua capacidade de facilitar a integração com diversos bancos de dados. Durante o desenvolvimento, utilizei o SQLite, porém é facilmente adaptável para ser utilizado com MySQL, PostgreSQL e outras opções de bancos de dados.

-   Joi

    -   Utilizei com o propósito de garantir a validação de todas as entradas recebidas através das APIs.

-   Nodemailer

    -   Usei para facilitar o envio de e-mails.

-   Bcryptjs
    -   Utilizei essa ferramenta para garantir a segurança dos dados sensíveis dos usuários, como senhas e outras informações sigilosas.

#### A aplicação é segura?

-   Sim, implementei autenticação de usuários em todos os endpoints importantes. Além disso, utilizei bibliotecas para criptografar dados sensíveis, garantindo que em caso de vazamento de informações, o usuário não será afetado.

## Autores

-   [@Felipe Auguto](https://github.com/zFelipeA)
