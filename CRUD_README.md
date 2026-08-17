# CRUD de Pessoas com Next.js e Banco em Memória

Um sistema completo de gerenciamento de pessoas (CRUD) desenvolvido com Next.js 14, React 18 e banco de dados em memória.

## 🎯 Características

- ✅ **CRUD Completo**: Create, Read, Update, Delete de pessoas
- ✅ **API RESTful**: Endpoints bem definidos com tratamento de erros
- ✅ **Banco em Memória**: Armazenamento de dados durante a execução da aplicação
- ✅ **Validação**: Validação de dados no cliente e servidor
- ✅ **Paginação**: Suporte a paginação com limite configurável
- ✅ **Busca**: Filtro por nome ou email
- ✅ **Interface Responsiva**: Design mobile-first com Tailwind CSS
- ✅ **Testes**: Testes unitários para database e validação
- ✅ **TypeScript**: Type-safe em toda a aplicação

## 📋 Requisitos

- Node.js 18+
- npm ou yarn

## 🚀 Instalação e Execução

### 1. Instalar dependências

```bash
npm install
```

### 2. Executar em desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### 3. Executar testes

```bash
npm test
```

### 4. Build para produção

```bash
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
projeto/
├── app/
│   ├── api/
│   │   └── pessoas/
│   │       ├── route.ts              # GET (listar), POST (criar)
│   │       └── [id]/
│   │           └── route.ts          # GET (detalhe), PUT (atualizar), DELETE
│   ├── pessoas/
│   │   ├── page.tsx                  # Página de listagem
│   │   ├── novo/
│   │   │   └── page.tsx              # Página de criação
│   │   └── [id]/
│   │       ├── page.tsx              # Página de detalhes
│   │       └── editar/
│   │           └── page.tsx          # Página de edição
│   ├── layout.tsx                    # Layout raiz
│   ├── page.tsx                      # Redirecionamento para /pessoas
│   └── globals.css                   # Estilos globais
├── lib/
│   ├── database/
│   │   ├── pessoasDb.ts              # Serviço de banco em memória
│   │   └── pessoasDb.test.ts         # Testes do banco
│   ├── validation/
│   │   ├── pessoasValidator.ts       # Validações
│   │   └── pessoasValidator.test.ts  # Testes de validação
│   └── types/
│       └── pessoa.ts                 # Tipos TypeScript
├── components/
│   ├── PessoaForm.tsx                # Formulário de criar/editar
│   ├── PessoasList.tsx               # Listagem com paginação
│   └── ConfirmDialog.tsx             # Modal de confirmação
├── jest.config.js                    # Configuração Jest
├── jest.setup.js                     # Setup Jest
├── package.json
├── tsconfig.json
└── next.config.js
```

## 🔌 API Endpoints

### Listar Pessoas

```http
GET /api/pessoas?page=1&limit=10&search=João
```

**Query Parameters:**
- `page` (opcional, padrão: 1) - Número da página
- `limit` (opcional, padrão: 10) - Itens por página
- `search` (opcional) - Buscar por nome ou email

**Response (200):**
```json
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
    "total": 25,
    "pages": 3
  }
}
```

### Criar Pessoa

```http
POST /api/pessoas
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@example.com",
  "telefone": "11999999999",
  "dataNascimento": "1990-01-15"
}
```

**Response (201):**
```json
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

**Erros:**
- `400` - Validação falhou
- `409` - Email já registrado

### Obter Pessoa

```http
GET /api/pessoas/:id
```

**Response (200):**
```json
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

**Erros:**
- `404` - Pessoa não encontrada

### Atualizar Pessoa

```http
PUT /api/pessoas/:id
Content-Type: application/json

{
  "nome": "João Silva Updated",
  "email": "joao.updated@example.com"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "nome": "João Silva Updated",
  "email": "joao.updated@example.com",
  "telefone": "11999999999",
  "dataNascimento": "1990-01-15",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:35:00Z"
}
```

**Erros:**
- `400` - Validação falhou
- `404` - Pessoa não encontrada
- `409` - Email já registrado

### Deletar Pessoa

```http
DELETE /api/pessoas/:id
```

**Response (204):** No Content

**Erros:**
- `404` - Pessoa não encontrada

## 📝 Regras de Validação

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
- Entre 10 e 15 dígitos
- Aceita formatação: `(11) 99999-9999`, `11 99999-9999`, `11999999999`

### Data de Nascimento
- Opcional
- Formato ISO 8601: `YYYY-MM-DD`
- Deve ser no passado

## 🎨 Interface do Usuário

### Página de Listagem (`/pessoas`)
- Tabela com todas as pessoas
- Busca por nome ou email
- Paginação com navegação
- Botões de ação: Ver, Editar, Deletar
- Botão para criar nova pessoa

### Página de Criação (`/pessoas/novo`)
- Formulário com campos: nome, email, telefone, data de nascimento
- Validação em tempo real
- Mensagens de sucesso/erro
- Botões: Criar, Cancelar

### Página de Detalhes (`/pessoas/:id`)
- Exibição completa dos dados
- Timestamps de criação e atualização
- Botões: Editar, Deletar
- Botão para voltar à listagem

### Página de Edição (`/pessoas/:id/editar`)
- Formulário pré-preenchido
- Validação em tempo real
- Mensagens de sucesso/erro
- Botões: Atualizar, Cancelar

## 🧪 Testes

### Executar todos os testes

```bash
npm test
```

### Executar testes em modo watch

```bash
npm run test:watch
```

### Cobertura de testes

Os testes cobrem:
- ✅ Criação de pessoas
- ✅ Leitura de pessoas (individual e listagem)
- ✅ Atualização de pessoas
- ✅ Deleção de pessoas
- ✅ Validação de email único
- ✅ Paginação e busca
- ✅ Validação de dados
- ✅ Normalização de dados

## 🔒 Segurança

- Validação de dados no servidor (não confia apenas em validação do cliente)
- Normalização de emails (case-insensitive)
- Tratamento de erros apropriado
- Sem exposição de detalhes internos em mensagens de erro

## 📊 Limitações Conhecidas

- **Dados em Memória**: Todos os dados são perdidos ao reiniciar o servidor
- **Sem Autenticação**: Não há controle de acesso
- **Sem Persistência**: Não há backup ou recuperação de dados
- **Single Instance**: Não funciona em ambientes multi-instância
- **Limite de Registros**: Recomendado para até 10.000 registros

## 🚀 Próximas Melhorias

- [ ] Integração com banco de dados real (PostgreSQL, MongoDB)
- [ ] Autenticação e autorização
- [ ] Soft delete com audit trail
- [ ] Exportação de dados (CSV, PDF)
- [ ] Operações em lote
- [ ] Validação de telefone por país
- [ ] Temas escuro/claro
- [ ] Internacionalização (i18n)

## 📄 Licença

MIT

## 👨‍💻 Autor

Desenvolvido como parte do projeto de aprendizado com Next.js e TypeScript.
