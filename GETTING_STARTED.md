# 🚀 Kusambwila - Quick Start Guide

## ⚡ Comece em 5 Minutos

### 1. Terminal 1 - Backend

```bash
cd "Kusambwila website design/backend"
npm install
npm run dev
```

Espere por: `Servidor rodando na porta 5000`

### 2. Terminal 2 - Frontend

```bash
cd "Kusambwila website design"
npm install
npm run dev
```

Clique no link: `http://localhost:5173`

---

## 🔑 Credenciais de Teste

### Administrador
- **Email:** admin@kusambwila.ao
- **Senha:** adminpassword123

### Proprietário (Landlord)
- **Email:** maria@test.com
- **Senha:** pass123

### Inquilino (Tenant)
- **Email:** joana@test.com
- **Senha:** pass123

---

## 📄 Testar Sistema de Documentos

### Como Proprietário:

1. ✅ Login com maria@test.com / pass123
2. ✅ Clique em "Meus Documentos" (no menu de utilizador)
3. ✅ Upload de 3 tipos de documentos:
   - Bilhete de Identidade (PDF/JPG/PNG até 10MB)
   - Título de Propriedade
   - Comprovante de Endereço
4. ✅ Veja o status: Pendente → Aprovado/Rejeitado

### Como Administrador:

1. ✅ Login com admin@kusambwila.ao / adminpassword123
2. ✅ Vá para "Admin" (canto superior)
3. ✅ Clique em "Documentos"
4. ✅ Veja todos os documentos por status:
   - **Pendentes** - Precisa revisão
   - **Aprovados** - Já validados
   - **Rejeitados** - Devolvidos ao proprietário
5. ✅ Clique "Ver Detalhes" para revisar
6. ✅ Aprove com notas ou rejeite com motivo

---

## 🎯 Funcionalidades Implementadas

### ✨ Backend (Node.js + Express)

- ✅ **Autenticação JWT** - Login seguro
- ✅ **Upload de Ficheiros** - Multer configurado
- ✅ **Validação** - Tipo e tamanho de arquivo
- ✅ **Gestão de Documentos** - CRUD completo
- ✅ **Revisão por Admin** - Aprovação/Rejeição
- ✅ **Permissões** - Roles (Admin, Landlord, Tenant)
- ✅ **Banco de Dados** - MySQL com 11+ tabelas

### 🎨 Frontend (React + Vite + TypeScript)

- ✅ **Página de Upload** - Interface intuitiva
- ✅ **Dashboard de Admin** - Gestão de documentos
- ✅ **Autenticação** - Context API + LocalStorage
- ✅ **Componentes UI** - Tailwind + Radix UI
- ✅ **Tipos TypeScript** - Type-safe

### 🗄️ Banco de Dados (MySQL)

Nova tabela: `documents`
```sql
- id: ID único
- userId: Proprietário
- documentType: 'bi', 'propertyTitle', 'addressProof'
- fileName: Nome do arquivo
- filePath: Caminho armazenado
- status: 'pending', 'verified', 'rejected'
- rejectionReason: Por que foi rejeitado
- uploadedAt: Data de upload
- verifiedAt: Data de verificação
- verifiedBy: Admin que verificou
- adminNotes: Notas do admin
```

---

## 📚 API Endpoints

### Documentos (Proprietário)

```
POST /api/documents/upload
- Body: multipart/form-data com 'file' e 'documentType'
- Auth: Bearer token
- Response: { id, fileName, status, uploadedAt }

GET /api/documents
- Auth: Bearer token
- Response: Array de documentos do utilizador
```

### Documentos (Admin)

```
GET /api/admin/documents?status=pending
- Parâmetros: status (pending, verified, rejected)
- Auth: Bearer token + Admin role
- Response: Array de documentos

GET /api/admin/documents/:id
- Auth: Bearer token + Admin role
- Response: Detalhes completos do documento

PUT /api/admin/documents/:id/approve
- Body: { adminNotes: string }
- Auth: Bearer token + Admin role
- Response: { message: 'Documento aprovado com sucesso' }

PUT /api/admin/documents/:id/reject
- Body: { rejectionReason: string }
- Auth: Bearer token + Admin role
- Response: { message: 'Documento rejeitado com sucesso' }
```

---

## 🗂️ Ficheiros Principais Criados/Modificados

### Backend
- `backend/server.js` - Endpoints de documentos adicionados
- `backend/db.js` - Tabela `documents` adicionada
- `backend/package.json` - Multer instalado

### Frontend
- `src/app/pages/landlord-documents.tsx` - Upload de docs (NOVO)
- `src/app/admin/pages/documents.tsx` - Revisão de docs (NOVO)
- `src/app/lib/api.ts` - Endpoints de documentos adicionados
- `src/app/routes.ts` - Rotas de documentos adicionadas

### Documentação
- `SETUP.md` - Guia completo de configuração
- `GETTING_STARTED.md` - Este ficheiro

---

## 🔍 Verificar se Está a Funcionar

### Teste 1: Backend rodando
```bash
curl http://localhost:5000/api/properties
# Deve retornar JSON com propriedades
```

### Teste 2: Frontend carregando
```
Abra: http://localhost:5173
Deve ver página inicial com propriedades
```

### Teste 3: Login funcionando
```
Email: maria@test.com
Senha: pass123
Deve redirecionar para dashboard
```

### Teste 4: Upload de documento
```
1. Login como maria@test.com
2. Vá para /documents
3. Selecione um ficheiro
4. Deve aparecer na lista com status "Pendente"
```

### Teste 5: Admin revisando
```
1. Login como admin@kusambwila.ao
2. Vá para /admin/documents
3. Deve ver o documento enviado por maria
4. Clique "Ver Detalhes"
5. Clique "Aprovar" ou "Rejeitar"
```

---

## 🛠️ Troubleshooting Rápido

| Erro | Solução |
|------|---------|
| `Connection refused :5000` | Backend não está rodando - abra Terminal 1 |
| `Cannot find module 'multer'` | `cd backend && npm install multer` |
| `MySQL connection error` | Verifique `.env` - DB_HOST, DB_USER, DB_PASSWORD |
| `Blank page no frontend` | Abra console (F12) - verifique erros |
| `Upload não funciona` | Verifique permissões de `backend/uploads/` |

---

## 📁 Pasta de Uploads

Localização: `backend/uploads/`

Ficheiros são salvos com nomes únicos:
- `documentType-1704067200000-abc123xyz.pdf`

URL de acesso: `http://localhost:5000/uploads/nome-do-arquivo`

---

## 🔐 Segurança Implementada

✅ JWT tokens (7 dias expiration)
✅ Bcrypt password hashing (12 rounds)
✅ CORS configurado
✅ Validação de tipos MIME
✅ Limite de tamanho (10MB)
✅ Role-based access control
✅ SQL prepared statements

---

## 📖 Próximos Passos (Opcional)

1. **Envio de Email** - Notificar proprietário quando documento é aprovado/rejeitado
2. **Armazenamento em Cloud** - AWS S3 ou Google Cloud Storage
3. **OCR de Documentos** - Extrair dados automaticamente
4. **Assinatura Digital** - Validação de documentos com assinatura
5. **Histórico de Versões** - Rastrear todas as versões de documentos
6. **Relatórios** - Dashboard de estatísticas de verificações

---

## 📞 Suporte

Se encontrar problemas:

1. **Verifique logs do terminal** - Mensagens de erro claras
2. **Abra DevTools (F12)** - Console do navegador
3. **Verifique base de dados** - MySQL Workbench ou Navicat
4. **Reinicie ambos os servidores** - Às vezes resolve problemas estranhos

---

## ✅ Checklist Final

- [ ] Backend instalado (`npm install` na pasta backend)
- [ ] Frontend instalado (`npm install` na pasta root)
- [ ] Backend rodando na porta 5000
- [ ] Frontend rodando na porta 5173
- [ ] Banco de dados MySQL criado
- [ ] `.env` configurado no backend
- [ ] Pasta `backend/uploads/` criada
- [ ] Login funcionando
- [ ] Upload de documentos funcionando
- [ ] Admin consegue revisar documentos

---

**Parabéns! 🎉 Sistema está pronto para usar!**

Kusambwila - Gestão de Imóveis em Angola 🇦🇴