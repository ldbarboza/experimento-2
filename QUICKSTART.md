# Quick Start Guide - CRUD de Pessoas

## 🚀 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: `http://localhost:3000`

You'll be automatically redirected to the people management page.

## 📱 Using the Application

### Create a New Person
1. Click the **"+ Nova Pessoa"** button
2. Fill in the form:
   - **Nome** (required): Full name (min 3 chars)
   - **Email** (required): Valid email address
   - **Telefone** (optional): Phone number
   - **Data de Nascimento** (optional): Date of birth
3. Click **"Criar"** button
4. You'll be redirected to the list

### View All People
- The main page (`/pessoas`) shows all people in a table
- Use the **search bar** to filter by name or email
- Navigate pages using the pagination controls

### View Person Details
1. Click the **"Ver"** button on any person
2. View all their information
3. Click **"Editar"** to modify or **"Deletar"** to remove

### Edit a Person
1. Click the **"Editar"** button on any person
2. Modify the fields you want to change
3. Click **"Atualizar"** to save
4. You'll be redirected to the detail page

### Delete a Person
1. Click the **"Deletar"** button
2. Confirm the deletion in the dialog
3. The person will be removed from the list

## 🧪 Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## 🔨 Build for Production

```bash
npm run build
npm start
```

## 📚 API Examples

### Create a Person
```bash
curl -X POST http://localhost:3000/api/pessoas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "telefone": "11999999999",
    "dataNascimento": "1990-01-15"
  }'
```

### List People
```bash
curl http://localhost:3000/api/pessoas?page=1&limit=10&search=João
```

### Get a Person
```bash
curl http://localhost:3000/api/pessoas/{id}
```

### Update a Person
```bash
curl -X PUT http://localhost:3000/api/pessoas/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva Updated"
  }'
```

### Delete a Person
```bash
curl -X DELETE http://localhost:3000/api/pessoas/{id}
```

## ✅ Validation Rules

| Field | Rules |
|-------|-------|
| **Nome** | Required, 3-255 characters |
| **Email** | Required, valid format, unique |
| **Telefone** | Optional, 10-15 digits |
| **Data de Nascimento** | Optional, YYYY-MM-DD format, past date |

## 🎨 UI Features

- ✅ Responsive design (works on mobile, tablet, desktop)
- ✅ Real-time form validation
- ✅ Search and filter
- ✅ Pagination
- ✅ Delete confirmation dialog
- ✅ Success/error notifications
- ✅ Loading states

## 📂 Project Structure

```
projeto/
├── app/
│   ├── api/pessoas/          # API endpoints
│   ├── pessoas/              # Pages
│   └── layout.tsx            # Layout
├── lib/
│   ├── database/             # Database service
│   ├── validation/           # Validation rules
│   └── types/                # TypeScript types
├── components/               # React components
└── package.json
```

## 🔍 Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
```

### Clear Node Modules
```bash
rm -rf node_modules
npm install
```

### Reset Database
Just restart the server - all data is in memory and will be cleared.

## 📖 More Information

- See `CRUD_README.md` for detailed documentation
- See `IMPLEMENTATION_SUMMARY.md` for technical details
- Check `lib/types/pessoa.ts` for data structure
- Review `lib/validation/pessoasValidator.ts` for validation rules

## 💡 Tips

1. **Email must be unique** - You can't create two people with the same email
2. **Phone formatting** - Enter phone numbers with or without formatting, they'll be normalized
3. **Date format** - Use YYYY-MM-DD format for dates (e.g., 1990-01-15)
4. **Search is case-insensitive** - Search for "joão" or "JOÃO" works the same
5. **Pagination** - Default is 10 items per page, adjustable via API

## 🎯 Next Steps

1. Create some test people
2. Try searching and filtering
3. Edit and delete people
4. Run the tests to see how it works
5. Check the API endpoints with curl or Postman
6. Review the code to understand the implementation

Enjoy! 🎉
