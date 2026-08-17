# API Documentation - CRUD de Pessoas

## Base URL

```
http://localhost:3000/api
```

## Authentication

Nenhuma autenticação é necessária (desenvolvimento/demo).

## Response Format

Todas as respostas são em JSON.

### Success Response

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

### Error Response

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

## Endpoints

### 1. Criar Pessoa

**Endpoint:** `POST /pessoas`

**Description:** Cria uma nova pessoa no sistema.

**Request Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "telefone": "(11) 99999-9999",
  "dataNascimento": "1990-01-15"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| nome | string | Yes | Nome completo (3-255 caracteres) |
| email | string | Yes | Email válido e único |
| telefone | string | No | Telefone (10-15 dígitos) |
| dataNascimento | string | No | Data no formato YYYY-MM-DD |

**Response:**
- **Status:** 201 Created
- **Body:** Objeto Pessoa criado com ID e timestamps

**Example:**
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

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "João Silva",
  "email": "joao@example.com",
  "telefone": "(11) 99999-9999",
  "dataNascimento": "1990-01-15",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Cases:**
- **400 Bad Request** - Validação falhou
  ```json
  {
    "status": 400,
    "message": "Validação falhou",
    "details": {
      "nome": "Nome deve ter no mínimo 3 caracteres",
      "email": "Email inválido"
    }
  }
  ```

- **409 Conflict** - Email já registrado
  ```json
  {
    "status": 409,
    "message": "Email joao@example.com já está registrado"
  }
  ```

---

### 2. Listar Pessoas

**Endpoint:** `GET /pessoas`

**Description:** Lista todas as pessoas com suporte a paginação e busca.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Número da página |
| limit | integer | 10 | Itens por página (máx 100) |
| search | string | - | Buscar por nome ou email |

**Response:**
- **Status:** 200 OK
- **Body:** Objeto com array de pessoas e metadados de paginação

**Example:**
```bash
# Listar primeira página
curl "http://localhost:3000/api/pessoas"

# Listar página 2 com 20 itens
curl "http://localhost:3000/api/pessoas?page=2&limit=20"

# Buscar por nome
curl "http://localhost:3000/api/pessoas?search=João"

# Buscar por email
curl "http://localhost:3000/api/pessoas?search=joao@example.com"
```

**Response:**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nome": "João Silva",
      "email": "joao@example.com",
      "telefone": "(11) 99999-9999",
      "dataNascimento": "1990-01-15",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "nome": "Maria Santos",
      "email": "maria@example.com",
      "telefone": "(11) 88888-8888",
      "dataNascimento": "1992-05-20",
      "createdAt": "2024-01-15T10:35:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  }
}
```

**Notes:**
- Busca é case-insensitive
- Busca funciona em nome e email
- Resultados são ordenados por data de criação (mais recentes primeiro)

---

### 3. Obter Pessoa

**Endpoint:** `GET /pessoas/:id`

**Description:** Obtém os detalhes de uma pessoa específica.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | UUID da pessoa |

**Response:**
- **Status:** 200 OK
- **Body:** Objeto Pessoa completo

**Example:**
```bash
curl "http://localhost:3000/api/pessoas/550e8400-e29b-41d4-a716-446655440000"
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "João Silva",
  "email": "joao@example.com",
  "telefone": "(11) 99999-9999",
  "dataNascimento": "1990-01-15",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Cases:**
- **404 Not Found** - Pessoa não encontrada
  ```json
  {
    "status": 404,
    "message": "Pessoa com ID xxx não encontrada"
  }
  ```

---

### 4. Atualizar Pessoa

**Endpoint:** `PUT /pessoas/:id`

**Description:** Atualiza uma pessoa existente (atualização parcial permitida).

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | UUID da pessoa |

**Request Body:**
```json
{
  "nome": "João Silva Updated",
  "telefone": "(11) 88888-8888"
}
```

**Parameters:**
Todos os campos são opcionais. Apenas os campos fornecidos serão atualizados.

| Field | Type | Description |
|-------|------|-------------|
| nome | string | Nome completo (3-255 caracteres) |
| email | string | Email válido e único |
| telefone | string | Telefone (10-15 dígitos) |
| dataNascimento | string | Data no formato YYYY-MM-DD |

**Response:**
- **Status:** 200 OK
- **Body:** Objeto Pessoa atualizado

**Example:**
```bash
curl -X PUT http://localhost:3000/api/pessoas/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva Updated",
    "telefone": "(11) 88888-8888"
  }'
```

**Response:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nome": "João Silva Updated",
  "email": "joao@example.com",
  "telefone": "(11) 88888-8888",
  "dataNascimento": "1990-01-15",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:35:00.000Z"
}
```

**Error Cases:**
- **400 Bad Request** - Validação falhou
- **404 Not Found** - Pessoa não encontrada
- **409 Conflict** - Email já registrado por outra pessoa

---

### 5. Deletar Pessoa

**Endpoint:** `DELETE /pessoas/:id`

**Description:** Deleta uma pessoa do sistema.

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | UUID da pessoa |

**Response:**
- **Status:** 204 No Content
- **Body:** Vazio

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/pessoas/550e8400-e29b-41d4-a716-446655440000
```

**Error Cases:**
- **404 Not Found** - Pessoa não encontrada
  ```json
  {
    "status": 404,
    "message": "Pessoa com ID xxx não encontrada"
  }
  ```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 204 | No Content - Deleção bem-sucedida |
| 400 | Bad Request - Validação falhou |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Email já registrado |
| 500 | Internal Server Error - Erro no servidor |

---

## Validation Rules

### Nome
- **Obrigatório** em criação
- **Mínimo:** 3 caracteres
- **Máximo:** 255 caracteres
- **Trim:** Espaços em branco removidos automaticamente

### Email
- **Obrigatório** em criação
- **Formato:** Deve ser um email válido (user@domain.com)
- **Único:** Não pode haver dois emails iguais (case-insensitive)
- **Normalização:** Convertido para lowercase automaticamente

### Telefone
- **Opcional**
- **Formato:** 10-15 dígitos
- **Aceita:** Parênteses, hyphens, espaços
- **Exemplo:** (11) 99999-9999, 11 99999-9999, 11999999999

### Data de Nascimento
- **Opcional**
- **Formato:** YYYY-MM-DD (ISO 8601)
- **Validação:** Deve ser uma data válida no passado
- **Exemplo:** 1990-01-15

---

## Rate Limiting

Não implementado (desenvolvimento/demo).

---

## CORS

Não configurado (desenvolvimento/demo).

---

## Examples

### JavaScript/Fetch

```javascript
// Criar pessoa
const response = await fetch('/api/pessoas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'João Silva',
    email: 'joao@example.com',
    telefone: '11999999999',
    dataNascimento: '1990-01-15'
  })
});

const pessoa = await response.json();
console.log(pessoa);

// Listar pessoas
const listResponse = await fetch('/api/pessoas?page=1&limit=10');
const { data, pagination } = await listResponse.json();
console.log(data, pagination);

// Atualizar pessoa
const updateResponse = await fetch(`/api/pessoas/${pessoa.id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome: 'João Updated' })
});

// Deletar pessoa
await fetch(`/api/pessoas/${pessoa.id}`, { method: 'DELETE' });
```

### cURL

```bash
# Criar
curl -X POST http://localhost:3000/api/pessoas \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@example.com"}'

# Listar
curl http://localhost:3000/api/pessoas

# Obter
curl http://localhost:3000/api/pessoas/uuid

# Atualizar
curl -X PUT http://localhost:3000/api/pessoas/uuid \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Updated"}'

# Deletar
curl -X DELETE http://localhost:3000/api/pessoas/uuid
```

### Python

```python
import requests

# Criar
response = requests.post('http://localhost:3000/api/pessoas', json={
    'nome': 'João Silva',
    'email': 'joao@example.com',
    'telefone': '11999999999',
    'dataNascimento': '1990-01-15'
})
pessoa = response.json()

# Listar
response = requests.get('http://localhost:3000/api/pessoas', params={
    'page': 1,
    'limit': 10,
    'search': 'João'
})
data = response.json()

# Atualizar
response = requests.put(f'http://localhost:3000/api/pessoas/{pessoa["id"]}', json={
    'nome': 'João Updated'
})

# Deletar
requests.delete(f'http://localhost:3000/api/pessoas/{pessoa["id"]}')
```

---

## Changelog

### v1.0.0 (2024-01-15)
- Initial release
- CRUD operations
- Pagination and search
- Validation
- In-memory database
