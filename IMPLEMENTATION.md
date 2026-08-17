# Guia de Implementação - CRUD de Pessoas

## 📋 Resumo da Implementação

Este documento descreve a implementação completa do sistema CRUD de pessoas com Next.js e banco de dados em memória.

## 🏗️ Arquitetura

### Camadas da Aplicação

```
┌─────────────────────────────────────────┐
│         Frontend (React Components)      │
│  - PessoasList, PessoaForm, Pages       │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      API Routes (Next.js Route Handlers) │
│  - POST, GET, PUT, DELETE                │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│    Validation Layer (Shared Utilities)   │
│  - validateNome, validateEmail, etc.     │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│    Database Layer (In-Memory Service)    │
│  - PessoasDatabase Singleton             │
└─────────────────────────────────────────┘
```

## 📁 Estrutura de Arquivos

### Core Data Layer

**`lib/types/pessoa.ts`**
- Define todas as interfaces TypeScript
- `Pessoa` - Entidade completa
- `CreatePessoaDTO` - Dados para criação
- `UpdatePessoaDTO` - Dados para atualização
- `PaginatedResponse<T>` - Resposta paginada
- `ErrorResponse` - Formato de erro padrão

**`lib/database/pessoasDb.ts`**
- Implementa padrão Singleton
- Armazena dados em `Map<string, Pessoa>`
- Mantém índice de emails para validação rápida
- Métodos: `create()`, `read()`, `readAll()`, `update()`, `delete()`, `search()`
- Gera UUIDs para IDs
- Normaliza emails (lowercase)

**`lib/validation/pessoasValidator.ts`**
- Validações reutilizáveis
- Funções individuais: `validateNome()`, `validateEmail()`, etc.
- Funções compostas: `validateCreatePessoa()`, `validateUpdatePessoa()`
- Normalização: `normalizeEmail()`, `normalizeTelefone()`

### API Routes

**`app/api/pessoas/route.ts`**
- `POST /api/pessoas` - Criar pessoa
  - Valida dados
  - Verifica email duplicado (409 Conflict)
  - Retorna 201 Created com objeto criado
  
- `GET /api/pessoas` - Listar pessoas
  - Query params: `page`, `limit`, `search`
  - Retorna resposta paginada
  - Suporta busca por nome/email

**`app/api/pessoas/[id]/route.ts`**
- `GET /api/pessoas/:id` - Obter pessoa
  - Retorna 404 se não encontrada
  
- `PUT /api/pessoas/:id` - Atualizar pessoa
  - Suporta atualização parcial
  - Valida dados
  - Verifica email duplicado
  - Retorna 200 com objeto atualizado
  
- `DELETE /api/pessoas/:id` - Deletar pessoa
  - Retorna 204 No Content
  - Retorna 404 se não encontrada

### Frontend Components

**`components/PessoaForm.tsx`**
- Componente reutilizável para criar/editar
- Validação em tempo real
- Feedback de sucesso/erro
- Suporta dados iniciais (para edição)
- Estados: `formData`, `errors`, `isSubmitting`

**`components/PessoasList.tsx`**
- Lista com paginação
- Busca/filtro por nome ou email
- Ações: Ver, Editar, Deletar
- Confirmação antes de deletar
- Estados: `pessoas`, `pagination`, `search`, `isLoading`

### Pages

**`app/pessoas/page.tsx`**
- Página principal com lista de pessoas
- Layout com navegação

**`app/pessoas/novo/page.tsx`**
- Página para criar nova pessoa
- Usa `PessoaForm`
- Redireciona para lista após sucesso

**`app/pessoas/[id]/page.tsx`**
- Página de detalhes da pessoa
- Exibe todas as informações
- Botões para editar e deletar

**`app/pessoas/[id]/editar/page.tsx`**
- Página para editar pessoa
- Carrega dados existentes
- Usa `PessoaForm` com dados iniciais
- Redireciona para detalhes após sucesso

### Styling

**`app/globals.css`**
- Estilos globais
- Utility classes (similar a Tailwind)
- Sem dependências externas
- Responsivo e mobile-first

## 🔄 Fluxos de Dados

### Criar Pessoa

```
1. Usuário preenche formulário em /pessoas/novo
2. Clica "Criar"
3. PessoaForm valida dados no cliente
4. POST /api/pessoas com dados
5. API valida dados novamente
6. Database.create() verifica email duplicado
7. Gera UUID e timestamps
8. Armazena em Map
9. Retorna 201 com objeto criado
10. Redireciona para /pessoas
```

### Listar Pessoas

```
1. Usuário acessa /pessoas
2. PessoasList faz GET /api/pessoas?page=1&limit=10
3. API chama Database.readAll(1, 10)
4. Database filtra, ordena e pagina
5. Retorna resposta paginada
6. Componente renderiza tabela
7. Usuário pode buscar, paginar, editar, deletar
```

### Atualizar Pessoa

```
1. Usuário clica "Editar" em /pessoas/:id
2. Carrega dados via GET /api/pessoas/:id
3. Preenche formulário em /pessoas/:id/editar
4. Modifica dados e clica "Atualizar"
5. PUT /api/pessoas/:id com dados parciais
6. API valida apenas campos fornecidos
7. Database.update() verifica email duplicado
8. Atualiza campos e timestamp
9. Retorna 200 com objeto atualizado
10. Redireciona para /pessoas/:id
```

### Deletar Pessoa

```
1. Usuário clica "Deletar"
2. Confirmação: "Tem certeza?"
3. DELETE /api/pessoas/:id
4. API verifica se existe
5. Database.delete() remove de Map e índice
6. Retorna 204 No Content
7. Atualiza lista
```

## 🧪 Testes

### Database Tests (`__tests__/database/pessoasDb.test.ts`)

- **Singleton Pattern**: Verifica instância única
- **Create**: Criação, normalização, duplicatas
- **Read**: Leitura por ID, não encontrado
- **ReadAll**: Paginação, busca, ordenação
- **Update**: Atualização, parcial, duplicatas
- **Delete**: Deleção, índice
- **Search**: Busca por nome/email
- **Count**: Contagem
- **Clear**: Limpeza

Total: 40+ testes

### Validation Tests (`__tests__/validation/pessoasValidator.test.ts`)

- **Nome**: Obrigatório, tamanho, trim
- **Email**: Obrigatório, formato, normalização
- **Telefone**: Opcional, dígitos, formatação
- **Data**: Opcional, formato ISO, passado
- **Composite**: Validação completa de criação/atualização

Total: 50+ testes

## 🔐 Validações Implementadas

### Nome
```typescript
- Obrigatório
- Mínimo 3 caracteres
- Máximo 255 caracteres
- Trim automático
```

### Email
```typescript
- Obrigatório
- Formato válido (regex)
- Único (case-insensitive)
- Normalizado para lowercase
- Trim automático
```

### Telefone
```typescript
- Opcional
- 10-15 dígitos
- Aceita formatação: (), -, espaços
- Trim automático
```

### Data de Nascimento
```typescript
- Opcional
- Formato ISO 8601: YYYY-MM-DD
- Deve ser no passado
- Validação de data válida
```

## 🚀 Decisões de Design

### 1. Singleton Pattern para Database
- Garante instância única
- Compartilhado entre requisições
- Simples e eficiente

### 2. Map para Armazenamento
- Melhor performance que Object
- Índice de emails para validação rápida
- Fácil de iterar e filtrar

### 3. UUID para IDs
- Único globalmente
- Não sequencial (segurança)
- Padrão da indústria

### 4. Validação Compartilhada
- Mesmo código cliente/servidor
- DRY (Don't Repeat Yourself)
- Fácil manutenção

### 5. Paginação Server-Side
- Escalável
- Padrão RESTful
- Pronto para migração para DB real

### 6. Hard Delete
- Simples para desenvolvimento
- Sem overhead de soft delete
- Adequado para demo

### 7. Normalização de Email
- Case-insensitive
- Padrão da indústria
- Evita duplicatas

## 📊 Performance

### Complexidade de Tempo

| Operação | Complexidade | Notas |
|----------|-------------|-------|
| Create | O(1) | Map insert + email index |
| Read | O(1) | Map lookup |
| ReadAll | O(n log n) | Sort + filter + paginate |
| Update | O(1) | Map update + email index |
| Delete | O(1) | Map delete + email index |
| Search | O(n) | Linear scan |

### Limites

- Até 10.000 registros: Performance excelente
- 10.000-100.000: Performance aceitável
- 100.000+: Considerar banco de dados real

## 🔄 Fluxo de Erro

### Validação Falha (400)
```json
{
  "status": 400,
  "message": "Validação falhou",
  "details": {
    "nome": "Nome deve ter no mínimo 3 caracteres",
    "email": "Email inválido"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Email Duplicado (409)
```json
{
  "status": 409,
  "message": "Email joao@example.com já está registrado",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Não Encontrado (404)
```json
{
  "status": 404,
  "message": "Pessoa com ID xxx não encontrada",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Erro Interno (500)
```json
{
  "status": 500,
  "message": "Erro ao criar pessoa",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🔄 Migração para Banco de Dados Real

Para migrar para um banco de dados real (PostgreSQL, MongoDB, etc.):

1. **Substituir PessoasDatabase**
   ```typescript
   // Antes: Map em memória
   // Depois: Queries SQL/NoSQL
   ```

2. **Manter mesma interface**
   ```typescript
   // Mesmo contrato de métodos
   // Mesmo retorno de tipos
   ```

3. **Adicionar migrations**
   ```typescript
   // Schema de banco de dados
   // Seed data se necessário
   ```

4. **Adicionar pool de conexões**
   ```typescript
   // Gerenciar conexões
   // Retry logic
   ```

5. **Adicionar índices**
   ```typescript
   // Email (unique)
   // Nome (para busca)
   // CreatedAt (para ordenação)
   ```

## 📝 Exemplo de Uso

### Criar Pessoa via API

```bash
curl -X POST http://localhost:3000/api/pessoas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "telefone": "(11) 99999-9999",
    "dataNascimento": "1990-01-15"
  }'
```

### Listar com Busca

```bash
curl "http://localhost:3000/api/pessoas?page=1&limit=10&search=João"
```

### Atualizar

```bash
curl -X PUT http://localhost:3000/api/pessoas/uuid \
  -H "Content-Type: application/json" \
  -d '{
    "telefone": "(11) 88888-8888"
  }'
```

### Deletar

```bash
curl -X DELETE http://localhost:3000/api/pessoas/uuid
```

## 🎯 Checklist de Implementação

- [x] Tipos TypeScript
- [x] Database service (CRUD)
- [x] Validações
- [x] API routes (POST, GET, PUT, DELETE)
- [x] Componentes frontend
- [x] Páginas (list, create, detail, edit)
- [x] Paginação
- [x] Busca/filtro
- [x] Tratamento de erros
- [x] Estilos CSS
- [x] Testes database
- [x] Testes validação
- [x] README
- [x] Documentação

## 🚀 Próximos Passos Sugeridos

1. **Testes E2E** - Cypress ou Playwright
2. **Autenticação** - NextAuth.js
3. **Autorização** - RBAC
4. **Logging** - Winston ou Pino
5. **Monitoring** - Sentry
6. **Cache** - Redis
7. **Rate Limiting** - Middleware
8. **Soft Delete** - Audit trail
9. **Backup** - Exportar dados
10. **Documentação API** - Swagger/OpenAPI

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- README.md - Guia de uso
- Testes - Exemplos de uso
- Código comentado - Explicações inline
