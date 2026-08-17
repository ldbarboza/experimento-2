# Quick Start Guide - CRUD de Pessoas

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
```
http://localhost:3000/pessoas
```

That's it! You now have a fully functional CRUD system.

---

## 📝 Basic Usage

### Create a Person
1. Click "Nova Pessoa" button
2. Fill in the form:
   - **Nome** (required): Full name, 3+ characters
   - **Email** (required): Valid email address
   - **Telefone** (optional): Phone number
   - **Data de Nascimento** (optional): Birth date
3. Click "Criar"
4. You'll be redirected to the list

### View Person Details
1. Click "Ver" button next to a person in the list
2. See all their information
3. Click "Editar" or "Deletar" if needed

### Edit a Person
1. Click "Editar" button next to a person
2. Modify the fields you want to change
3. Click "Atualizar"
4. Changes are saved immediately

### Delete a Person
1. Click "Deletar" button
2. Confirm the deletion
3. Person is removed from the list

### Search for People
1. Use the search box at the top
2. Type a name or email
3. Results update automatically

### Navigate Pages
1. Use the pagination controls at the bottom
2. Click page numbers to jump to a specific page
3. Use "Anterior" and "Próxima" buttons to navigate

---

## 🧪 Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test -- --coverage
```

---

## 📚 API Examples

### Using cURL

**Create Person:**
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

**List People:**
```bash
curl "http://localhost:3000/api/pessoas?page=1&limit=10"
```

**Search:**
```bash
curl "http://localhost:3000/api/pessoas?search=João"
```

**Get Person:**
```bash
curl "http://localhost:3000/api/pessoas/550e8400-e29b-41d4-a716-446655440000"
```

**Update Person:**
```bash
curl -X PUT http://localhost:3000/api/pessoas/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"nome": "João Updated"}'
```

**Delete Person:**
```bash
curl -X DELETE http://localhost:3000/api/pessoas/550e8400-e29b-41d4-a716-446655440000
```

### Using JavaScript

```javascript
// Create
const response = await fetch('/api/pessoas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'João Silva',
    email: 'joao@example.com'
  })
});
const pessoa = await response.json();

// List
const list = await fetch('/api/pessoas').then(r => r.json());

// Get
const detail = await fetch(`/api/pessoas/${pessoa.id}`).then(r => r.json());

// Update
const updated = await fetch(`/api/pessoas/${pessoa.id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome: 'Updated' })
}).then(r => r.json());

// Delete
await fetch(`/api/pessoas/${pessoa.id}`, { method: 'DELETE' });
```

---

## 🎯 Common Tasks

### Add Sample Data

Create a file `scripts/seed.js`:
```javascript
const { db } = require('./lib/database/pessoasDb');

const sampleData = [
  {
    nome: 'João Silva',
    email: 'joao@example.com',
    telefone: '11999999999',
    dataNascimento: '1990-01-15'
  },
  {
    nome: 'Maria Santos',
    email: 'maria@example.com',
    telefone: '11888888888',
    dataNascimento: '1992-05-20'
  }
];

sampleData.forEach(data => db.create(data));
console.log('Sample data added!');
```

Then run:
```bash
node scripts/seed.js
```

### Export Data

```javascript
const { db } = require('./lib/database/pessoasDb');

const allPeople = db.getAll();
console.log(JSON.stringify(allPeople, null, 2));
```

### Clear All Data

```javascript
const { db } = require('./lib/database/pessoasDb');
db.clear();
console.log('All data cleared!');
```

---

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

### Tests Failing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### Data Not Persisting
This is expected! Data is stored in memory and lost when the server restarts. This is by design for development/demo purposes.

### Email Already Exists Error
Each email must be unique. Try using a different email address.

### Invalid Date Error
Use ISO 8601 format: YYYY-MM-DD (e.g., 1990-01-15)

---

## 📖 Documentation

- **README.md** - Project overview and features
- **API.md** - Complete API documentation
- **IMPLEMENTATION.md** - Architecture and design decisions
- **CHANGES.md** - Summary of all changes

---

## 🛠️ Development

### Project Structure
```
projeto/
├── app/                    # Next.js app directory
│   ├── api/pessoas/       # API routes
│   ├── pessoas/           # Frontend pages
│   └── layout.tsx         # Root layout
├── lib/                    # Shared utilities
│   ├── database/          # Database service
│   ├── validation/        # Validation logic
│   └── types/             # TypeScript types
├── components/            # React components
├── __tests__/             # Test files
└── package.json
```

### Key Files
- **Database:** `lib/database/pessoasDb.ts`
- **Validation:** `lib/validation/pessoasValidator.ts`
- **API:** `app/api/pessoas/route.ts` and `[id]/route.ts`
- **Components:** `components/PessoaForm.tsx`, `components/PessoasList.tsx`

### Adding Features

1. **New Field:** Update `Pessoa` type, add validation, update form
2. **New Endpoint:** Add route handler in `app/api/pessoas/`
3. **New Page:** Create file in `app/pessoas/`
4. **New Component:** Create file in `components/`

---

## 🚀 Next Steps

1. **Explore the Code** - Read through the implementation
2. **Run Tests** - Verify everything works: `npm test`
3. **Try the API** - Use cURL or Postman to test endpoints
4. **Customize** - Modify styles, add fields, extend functionality
5. **Deploy** - Build and deploy to production

---

## 📞 Need Help?

- Check the **README.md** for detailed information
- Review **API.md** for endpoint documentation
- Look at **IMPLEMENTATION.md** for architecture details
- Check test files for usage examples

---

## ✅ Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Server running (`npm run dev`)
- [ ] Can access http://localhost:3000/pessoas
- [ ] Can create a person
- [ ] Can view person details
- [ ] Can edit a person
- [ ] Can delete a person
- [ ] Can search for people
- [ ] Tests pass (`npm test`)

---

**You're all set! Happy coding! 🎉**
