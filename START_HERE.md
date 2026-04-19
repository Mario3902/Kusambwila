# 🚀 KUSAMBWILA - START HERE

## ⚡ Comece Agora em 3 Passos!

---

## PASSO 1️⃣ - CONFIGURAR BANCO DE DADOS (2 minutos)

### Terminal 1 - Criar Banco de Dados:

```bash
cd "Kusambwila website design/backend"
node setup-db.js
```

**Esperado:**
```
✅ Conectado ao MySQL
✅ Base de dados criada
✅ Todas as tabelas criadas
✅ DATABASE SETUP COMPLETO COM SUCESSO!

🔑 Credenciais de Teste:
  Admin:        admin@kusambwila.ao / adminpassword123
  Proprietário: maria@test.com / pass123
  Proprietário: carlos@test.com / pass123
  Inquilino:    joana@test.com / pass123
```

Se aparecer erro sobre MySQL:
```bash
# Windows - Verificar se MySQL está rodando
net start MySQL80

# Linux/Mac
sudo systemctl start mysql
```

---

## PASSO 2️⃣ - INSTALAR E RODAR BACKEND (3 minutos)

### Terminal 1 (Mesmo terminal anterior):

```bash
# Já está na pasta backend
npm install
npm run dev
```

**Esperado:**
```
Servidor rodando na porta 5000
```

✅ Backend pronto!

---

## PASSO 3️⃣ - INSTALAR E RODAR FRONTEND (3 minutos)

### Terminal 2 (Novo terminal):

```bash
cd "Kusambwila website design"
npm install
npm run dev
```

**Esperado:**
```
  ➜  Local:   http://localhost:5173/
  ➜  Press h + enter to show help
```

✅ Frontend pronto!

---

## 🌐 ABRIR NO NAVEGADOR

```
http://localhost:5173
```

---

## 🧪 TESTAR O SISTEMA

### 1️⃣ Teste como Proprietário

1. Clique em **"Login"**
2. Email: `maria@test.com`
3. Senha: `pass123`
4. Clique em **"Meus Documentos"** (no menu)
5. Faça upload de documentos:
   - Bilhete de Identidade (PDF/JPG/PNG até 10MB)
   - Título de Propriedade
   - Comprovante de Endereço
6. ✅ Veja o status: **Pendente**

### 2️⃣ Teste como Administrador

1. Faça logout (click no menu de utilizador → "Sair")
2. Click em **"Login"**
3. Email: `admin@kusambwila.ao`
4. Senha: `adminpassword123`
5. Click em **"Admin"** (canto superior direito)
6. Click em **"Documentos"**
7. Veja os documentos que maria enviou
8. Click em **"Ver Detalhes"**
9. **Aprove** com notas ou **Rejeite** com motivo
10. ✅ Documento muda para **Aprovado/Rejeitado**

### 3️⃣ Verifique como Proprietário

1. Logout e faça login com maria novamente
2. Vá para **"Meus Documentos"**
3. ✅ Veja o status atualizado (**Aprovado** ou **Rejeitado**)

---

## 🎯 FUNCIONALIDADES TESTADAS

✅ Login/Registro
✅ Upload de documentos (Proprietário)
✅ Visualizar documentos (Admin)
✅ Aprovar documento (Admin)
✅ Rejeitar documento (Admin)
✅ Ver status em tempo real

---

## 📁 ESTRUTURA DE FICHEIROS

```
Kusambwila website design/
├── backend/
│   ├── server.js              ← Servidor Express
│   ├── db.js                  ← Configuração MySQL
│   ├── auth.js                ← Autenticação JWT
│   ├── setup-db.js            ← Setup automático (já rodou)
│   ├── uploads/               ← Documentos enviados
│   ├── .env                   ← Configuração (criado automaticamente)
│   └── package.json
├── src/app/
│   ├── pages/
│   │   ├── landlord-documents.tsx   ← Upload de docs
│   │   ├── login.tsx
│   │   └── ...
│   ├── admin/pages/
│   │   └── documents.tsx            ← Revisão de docs
│   ├── lib/
│   │   └── api.ts                   ← Cliente API
│   └── routes.ts
└── ...
```

---

## 🔑 CREDENCIAIS RÁPIDAS

| Email | Senha | Tipo |
|-------|-------|------|
| admin@kusambwila.ao | adminpassword123 | Admin |
| maria@test.com | pass123 | Proprietário |
| carlos@test.com | pass123 | Proprietário |
| joana@test.com | pass123 | Inquilino |

---

## 📍 URLs IMPORTANTES

| Página | URL |
|--------|-----|
| Home | http://localhost:5173 |
| Login | http://localhost:5173/login |
| Meus Documentos | http://localhost:5173/documents |
| Admin Dashboard | http://localhost:5173/admin |
| Admin Documentos | http://localhost:5173/admin/documents |

---

## 🆘 PROBLEMAS COMUNS

### ❌ "Connection refused :5000"
```bash
# Backend não está rodando
# Terminal 1: npm run dev (na pasta backend)
```

### ❌ "Cannot find module"
```bash
# Dependências não instaladas
npm install
```

### ❌ "MySQL connection error"
```bash
# MySQL não está rodando
# Windows: net start MySQL80
# Linux: sudo systemctl start mysql
```

### ❌ "Blank page / 404"
```bash
# Frontend não está rodando
# Terminal 2: npm run dev (na pasta raiz)
```

---

## 📚 DOCUMENTAÇÃO COMPLETA

Se precisar de mais detalhes, leia:

- `SETUP.md` - Guia completo de configuração
- `GETTING_STARTED.md` - Quick start detalhado
- `MYSQL_SETUP.md` - Configuração do MySQL
- `TECHNICAL_SUMMARY.md` - Documentação técnica
- `TECHNICAL_IMPLEMENTATION.md` - Implementação de documentos

---

## ✅ CHECKLIST FINAL

- [ ] Terminal 1: `node setup-db.js` ✅ (base de dados criada)
- [ ] Terminal 1: `npm run dev` ✅ (backend rodando na porta 5000)
- [ ] Terminal 2: `npm install` ✅ (dependências instaladas)
- [ ] Terminal 2: `npm run dev` ✅ (frontend rodando na porta 5173)
- [ ] Browser: http://localhost:5173 ✅ (página inicial carregada)
- [ ] Login: maria@test.com / pass123 ✅ (login funciona)
- [ ] Upload: Documentos enviados ✅ (aparecem com status "Pendente")
- [ ] Admin: admin@kusambwila.ao / adminpassword123 ✅ (pode revisar docs)
- [ ] Admin: Aprova/Rejeita documento ✅ (status atualiza)

---

## 🎉 PRONTO!

Sistema está **100% funcional!**

Comece testando agora:

1. ✅ Abra Terminal 1
2. ✅ Execute: `cd "Kusambwila website design/backend" && node setup-db.js`
3. ✅ Depois: `npm run dev`
4. ✅ Abra Terminal 2
5. ✅ Execute: `cd "Kusambwila website design" && npm install && npm run dev`
6. ✅ Abra: http://localhost:5173
7. ✅ Divirta-se! 🎉

---

**Kusambwila v1.0.0**
Gestão de Imóveis em Angola 🇦🇴

Última atualização: 2024