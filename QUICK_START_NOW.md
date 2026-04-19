# 🚀 KUSAMBWILA - QUICK START NOW

## ⚡ COMECE EM 5 MINUTOS

### PASSO 1: Terminal 1 - Setup Completo

```bash
cd "Kusambwila website design/backend"
node setup-db.js
node seed-complete.js
npm run dev
```

**Esperado:**
```
✅ BASE DE DADOS CONFIGURADA COM SUCESSO!
✅ BANCO DE DADOS POPULADO COM SUCESSO!
Servidor rodando na porta 5000
```

---

### PASSO 2: Terminal 2 - Frontend

```bash
cd "Kusambwila website design"
npm install
npm run dev
```

**Esperado:**
```
➜  Local:   http://localhost:5173/
```

---

### PASSO 3: Abra no Navegador

```
http://localhost:5173
```

---

## 🔑 LOGIN IMEDIATO

### Admin
- Email: `admin@kusambwila.ao`
- Senha: `adminpassword123`

### Proprietário 1 (7 propriedades)
- Email: `maria@test.com`
- Senha: `pass123`

### Proprietário 2 (6 propriedades)
- Email: `carlos@test.com`
- Senha: `pass123`

### Inquilino
- Email: `joana@test.com`
- Senha: `pass123`

---

## 📍 13 PROPRIEDADES POR REGIÃO

### Cacuaco (Maria) - 3 imóveis
- Casa T3 Moderna - 180.000 Kz
- Apartamento T2 - 95.000 Kz
- Vila Luxuosa - 450.000 Kz

### Benfica (Carlos) - 3 imóveis
- Moradia T4 - 280.000 Kz
- Apartamento Premium - 220.000 Kz
- Studio Moderno - 85.000 Kz

### Talatona (Maria) - 2 imóveis
- Casa T3 - 200.000 Kz
- Apartamento T2 com Varanda - 120.000 Kz

### Kilamba (Carlos) - 3 imóveis
- Vila Espaçosa - 380.000 Kz
- Apartamento T3 - 140.000 Kz
- Studio Acessível - 75.000 Kz

### Maca (Maria) - 2 imóveis
- Casa Comercial - 320.000 Kz
- Moradia T2 - 110.000 Kz

---

## ✅ FUNCIONALIDADES

### Proprietários
- ✅ Login
- ✅ Ver suas propriedades (7 ou 6)
- ✅ Upload de documentos
- ✅ Ver status dos documentos

### Administrador
- ✅ Login
- ✅ Ver todas as 13 propriedades
- ✅ Revisar documentos
- ✅ Aprovar/Rejeitar documentos

### Públicos
- ✅ Ver todas as propriedades
- ✅ Filtrar por região
- ✅ Ver detalhes e imagens

---

## 🧪 TESTE RÁPIDO

1. **Login como maria@test.com / pass123**
   - Veja 7 propriedades
   - Vá para "Meus Documentos"
   - Faça upload de um documento

2. **Login como admin@kusambwila.ao / adminpassword123**
   - Vá para Admin → Documentos
   - Veja documentos pendentes
   - Aprove ou rejeite

3. **Logout e veja propriedades públicas**
   - Pesquise por região
   - Veja 13 propriedades
   - Clique em detalhes

---

## 📊 BANCO DE DADOS

- Base de dados: `kusambwila_db`
- Tabelas: 11
- Utilizadores: 4
- Propriedades: 13
- Imagens: 30+
- Regiões: 5
- Proprietários: 2

---

## 🆘 PROBLEMAS?

### MySQL não está rodando
```bash
# Windows
net start MySQL80

# Linux
sudo systemctl start mysql

# Mac
brew services start mysql
```

### Porta 5000 em uso
```bash
# Windows
taskkill /PID [PID] /F

# Linux/Mac
kill -9 $(lsof -t -i :5000)
```

### Dependências faltam
```bash
cd backend
npm install
npm run dev

# Outro terminal
cd ..
npm install
npm run dev
```

---

## 📂 FICHEIROS IMPORTANTES

- `backend/setup-db.js` - Cria tabelas
- `backend/seed-complete.js` - Popula com 13 propriedades
- `src/app/pages/landlord-documents.tsx` - Upload de docs
- `src/app/admin/pages/documents.tsx` - Revisão de docs

---

## 🎯 STATUS

✅ Banco de dados pronto
✅ 13 propriedades por região
✅ 2 proprietários com múltiplos imóveis
✅ Sistema de upload de documentos
✅ Admin pode revisar tudo
✅ Pronto para produção

---

## 🚀 COMECE AGORA!

```bash
# Terminal 1
cd "Kusambwila website design/backend"
node setup-db.js && node seed-complete.js && npm run dev

# Terminal 2
cd "Kusambwila website design"
npm install && npm run dev
```

**Abra: http://localhost:5173**

---

**Kusambwila v1.0.0 - Sistema Completo! 🇦🇴**