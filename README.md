# 📚 Sistema de Biblioteca

Sistema de gerenciamento de biblioteca, desenvolvido em **Node.js + TypeScript + Prisma + MySQL**.  
Inclui controle de **usuários, livros, empréstimos e reservas**, com regras de negócio para uma administração eficiente.

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
Edite o arquivo `.env`:

```env
# Porta da API
PORT=3000

# Banco MySQL
DATABASE_URL="mysql://app_user:app_password123@localhost:3307/alexandria_library"
```

> ⚠️ Se rodar o backend dentro do Docker, use `mysql` como host:
> ```env
> DATABASE_URL="mysql://app_user:app_password123@mysql:3306/alexandria_library"
> ```

### 4. Rodar migrations
```bash
npx prisma migrate dev --name init
```

### 5. (Opcional) Resetar o banco
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
 ├── app.ts          # configuração principal da aplicação
 ├── presentation/   # controllers e rotas
 ├── application/    # casos de uso (use-cases)
 ├── domain/         # entidades e enums
 ├── infrastructure/ # repositórios e integração DB
 └── prisma/         # schema, migrations e seeds
```

---

## 🛠️ Comandos úteis

| Comando                      | Descrição                            |
| ---------------------------- | ------------------------------------ |
| `docker-compose up -d`       | Sobe o MySQL em container            |
| `npx prisma migrate dev`     | Cria/aplica migrations               |
| `npx prisma migrate reset`   | Reseta o banco e reaplica migrations |
| `npx prisma db seed`         | Popula o banco com dados iniciais    |
| `npx prisma studio`          | Interface web para gerenciar o banco |
| `npm run dev`                | Roda backend em modo desenvolvimento |
| `npm run build && npm start` | Roda backend em modo produção        |

---

## 📐 DER

```mermaid
erDiagram
    USER {
        int id PK
        string name
        string email
        string passwordHash
        string userType
        datetime registrationDate
        string libraryCard
        string phone
        string status
        datetime membershipDate
        datetime lastLogin
    }

    BOOK {
        int id PK
        string title
        string author
        string isbn UNIQUE
        string category
        string publisher
        int publicationYear
        int totalQuantity
        int quantityAvailable
        string coverUrl
    }

    LOAN {
        int id PK
        int userId FK
        int bookId FK
        date loanDate
        date expectedReturnDate
        date returnDate
        string status
    }

    RESERVATION {
        int id PK
        int userId FK
        int bookId FK
        date reservationDate
        string status
    }

    USER ||--o{ LOAN : realiza
    BOOK ||--o{ LOAN : contem
    USER ||--o{ RESERVATION : faz
    BOOK ||--o{ RESERVATION : pertence
```

---

## 📊 Modelos Prisma

### User
- `libraryCard` é **gerado automaticamente** e **não pode ser alterado**.  
- `status` controla se o usuário está ativo, suspenso ou pendente.  
- `membershipDate` marca quando o usuário entrou.  
- `lastLogin` é atualizado no login.  

### Book
- Controla estoque (`totalQuantity`, `quantityAvailable`).  

### Loan
- Gerencia empréstimos, com atualização automática de disponibilidade.  

### Reservation
- Atende reservas em ordem cronológica.  
