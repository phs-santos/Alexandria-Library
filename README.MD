# 📚 Sistema de Biblioteca

Sistema de gerenciamento de biblioteca, desenvolvido em **Node.js + TypeScript + Prisma + MySQL**.  
Inclui controle de **usuários, livros, empréstimos e reservas**, com regras de negócio básicas para administração da biblioteca.

---

## ⚙️ Requisitos

- [Docker](https://docs.docker.com/get-docker/) + [Docker Compose](https://docs.docker.com/compose/)  
- Node.js `>= 18`  
- NPM ou Yarn  

---

## 🚀 Como rodar o projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/alexandria-library.git
cd alexandria-library
```

### 2. Subir o banco de dados com Docker
```bash
docker-compose up -d
```

Isso vai criar um container **MySQL 8.0** exposto na porta `3307`.

### 3. Configurar variáveis de ambiente
Edite o arquivo `.env` na raiz do projeto:

```env
# Porta da API
PORT=3000

# Banco MySQL (quando rodar localmente fora do container do backend)
DATABASE_URL="mysql://app_user:app_password123@localhost:3307/arcane_library"
```

> ⚠️ Se rodar o backend **dentro do Docker**, use `mysql` como host:
> ```env
> DATABASE_URL="mysql://app_user:app_password123@mysql:3306/arcane_library"
> ```

### 4. Rodar migrations
Cria as tabelas do banco de acordo com o schema Prisma:

```bash
npx prisma migrate dev --name init
```

### 5. (Opcional) Resetar o banco
Se quiser apagar tudo e recriar do zero:
```bash
npx prisma migrate reset
```

### 6. Rodar o seed inicial (Admin + livros de exemplo)
```bash
npx prisma db seed
```

### 7. Subir o backend
Modo desenvolvimento:
```bash
npm run dev
```

Modo produção:
```bash
npm run build
npm start
```

A API estará disponível em:  
👉 [http://localhost:3000/health](http://localhost:3000/health)

---

## 🗂️ Estrutura do Projeto

```
src/
 ├── index.ts        # entrypoint do servidor Express
 ├── routes/         # rotas da aplicação
 ├── services/       # regras de negócio
 └── prisma/         # schema, migrations e seed
```

---

## 🛠️ Comandos úteis

| Comando                          | Descrição                                      |
|----------------------------------|------------------------------------------------|
| `docker-compose up -d`           | Sobe o MySQL em container                      |
| `npx prisma migrate dev`         | Cria ou aplica migrations                      |
| `npx prisma migrate reset`       | Reseta o banco e reaplica migrations           |
| `npx prisma db seed`             | Popula o banco com dados iniciais              |
| `npx prisma studio`              | Abre interface web para gerenciar o banco      |
| `npm run dev`                    | Roda o backend em modo desenvolvimento         |
| `npm run build && npm start`     | Roda o backend em modo produção                |

---

## 📐 DER

```mermaid
erDiagram
    USUARIO {
        int id PK
        string nome
        string email
        string senha
        string tipo  // Admin, Bibliotecário, Leitor
    }

    LIVRO {
        int id PK
        string titulo
        string autor
        string editora
        int ano
        string isbn
        int quantidade_total
        int quantidade_disponivel
    }

    EMPRESTIMO {
        int id PK
        date data_emprestimo
        date data_prevista
        date data_devolucao
        string status  // Ativo, Devolvido, Atrasado
    }

    RESERVA {
        int id PK
        date data_reserva
        string status // Ativa, Atendida, Cancelada
    }

    CATEGORIA {
        int id PK
        string nome
        string descricao
    }

    USUARIO ||--o{ EMPRESTIMO : realiza
    LIVRO   ||--o{ EMPRESTIMO : contem
    USUARIO ||--o{ RESERVA   : faz
    LIVRO   ||--o{ RESERVA   : pertence
    LIVRO   }o--|| CATEGORIA : classificado
```
