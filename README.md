# CRUD de Pessoas com Next.js e Banco em Memória

Um sistema completo de CRUD (Create, Read, Update, Delete) para gerenciamento de pessoas, desenvolvido com Next.js 14 e banco de dados em memória.

## 🚀 Características

- ✅ **API RESTful completa** - Endpoints para criar, ler, atualizar e deletar pessoas
- ✅ **Banco de dados em memória** - Armazenamento rápido durante a execução da aplicação
- ✅ **Validação robusta** - Validação de dados no servidor e cliente
- ✅ **Paginação** - Suporte a paginação com limite configurável
- ✅ **Busca e filtro** - Buscar pessoas por nome ou email
- ✅ **Interface responsiva** - Design mobile-first com CSS puro
- ✅ **Testes abrangentes** - Suite de testes para database e validação
- ✅ **TypeScript** - Type-safe em toda a aplicação

## 📋 Requisitos

- Node.js 18+
- npm ou yarn

## 🛠️ Instalação

```bash
# Clonar repositório
git clone https://github.com/ldbarboza/experimento-2.git
cd experimento-2

# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev

# Abrir no navegador
# http://localhost:3000/pessoas
```

## 📚 Estrutura do Projeto

```
projeto/
├── app/
│   ├── api/
│   │   └── pessoas/              # API routes
│   │       ├── route.ts          # POST (criar), GET (listar)
│   │       └── [id]/
│   │           └── route.ts      # GET, PUT, DELETE
│   ├── pessoas/                  # Páginas frontend
│   │   ├── page.tsx              # Lista de pessoas
│   │   ├── novo/
│   │   │   └── page.tsx          # Criar nova pessoa
│   │   └── [id]/
│   │       ├── page.tsx          # Detalhes da pessoa
│   │       └── editar/
│   │           └── page.tsx      # Editar pessoa
│   ├── layout.tsx                # Layout raiz
│   └── globals.css               # Estilos globais
├── lib/
│   ├── database/
│   │   └── pessoasDb.ts          # Serviço de banco de dados
│   ├── validation/
│   │   └── pessoasValidator.ts   # Validações
│   └── types/
│       └── pessoa.ts             # Tipos TypeScript
├── components/
│   ├── PessoaForm.tsx            # Formulário reutilizável
│   └── PessoasList.tsx           # Lista com paginação
├── __tests__/
│   ├── database/
│   │   └── pessoasDb.test.ts     # Testes do banco
│   └── validation/
│       └── pessoasValidator.test.ts  # Testes de validação
└── package.json
```

## 🔌 API Endpoints

### Criar Pessoa
```bash
POST /api/pessoas
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@example.com",
  "telefone": "11999999999",
  "dataNascimento": "1990-01-15"
}

# Response: 201 Created
{
  "id": "uuid",
  "nome": "João Silva",
  "email": "joao@example.com",
  "telefone": "11999999999",
  "dataNascimento": "1990-01-15",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Listar Pessoas
```bash
GET /api/pessoas?page=1&limit=10&search=João

# Response: 200 OK
{
  "data": [
    {
      "id": "uuid",
      "nome": "João Silva",
      "email": "joao@example.com",
      "telefone": "11999999999",
      "dataNascimento": "1990-01-15",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

### Obter Pessoa
```bash
GET /api/pessoas/:id

# Response: 200 OK
{
  "id": "uuid",
  "nome": "João Silva",
  "email": "joao@example.com",
  "telefone": "11999999999",
  "dataNascimento": "1990-01-15",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Atualizar Pessoa
```bash
PUT /api/pessoas/:id
Content-Type: application/json

{
  "nome": "João Silva Updated"
}

# Response: 200 OK
{
  "id": "uuid",
  "nome": "João Silva Updated",
  "email": "joao@example.com",
  "telefone": "11999999999",
  "dataNascimento": "1990-01-15",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:35:00Z"
}
```

### Deletar Pessoa
```bash
DELETE /api/pessoas/:id

# Response: 204 No Content
```

## ✅ Validações

### Nome
- Obrigatório
- Mínimo 3 caracteres
- Máximo 255 caracteres

### Email
- Obrigatório
- Formato válido de email
- Único (case-insensitive)

### Telefone
- Opcional
- 10-15 dígitos (aceita formatação)

### Data de Nascimento
- Opcional
- Formato: YYYY-MM-DD
- Deve ser no passado

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes em modo watch
npm test:watch

# Executar testes com cobertura
npm test -- --coverage
```

### Cobertura de Testes

- **Database Service**: 100% - Todos os métodos CRUD testados
- **Validation**: 100% - Todas as regras de validação testadas
- **API Routes**: Testáveis via integração

## 🎨 Interface

### Página de Lista
- Tabela com todas as pessoas
- Busca por nome ou email
- Paginação com controles
- Ações: Ver, Editar, Deletar

### Página de Criar
- Formulário com validação em tempo real
- Feedback de sucesso/erro
- Redirecionamento automático

### Página de Detalhes
- Exibição completa dos dados
- Opções de editar e deletar
- Navegação de volta

### Página de Editar
- Formulário pré-preenchido
- Validação parcial (campos opcionais)
- Atualização em tempo real

## 🔒 Segurança

- ✅ Validação de entrada no servidor
- ✅ Normalização de email (case-insensitive)
- ✅ Prevenção de duplicatas
- ✅ Tratamento de erros apropriado
- ✅ Mensagens de erro informativas

## 📊 Limitações Conhecidas

- Dados são perdidos ao reiniciar o servidor
- Não adequado para produção (use banco de dados real)
- Sem autenticação/autorização
- Sem audit trail
- Sem soft delete

## 🚀 Próximos Passos

Para migrar para produção:

1. Substituir `PessoasDatabase` por um banco de dados real (PostgreSQL, MongoDB, etc.)
2. Adicionar autenticação e autorização
3. Implementar soft delete com audit trail
4. Adicionar rate limiting
5. Implementar cache
6. Adicionar logging estruturado
7. Configurar CORS apropriadamente

## 📝 Licença

MIT

## 👨‍💻 Autor

Desenvolvido como parte do projeto experimento-2
