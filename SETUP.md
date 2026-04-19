# 🏠 Kusambwila - Sistema de Gestão de Imóveis

Sistema completo de gestão de propriedades com verificação de documentos para Angola.

## ✨ Funcionalidades

- 🔐 Autenticação segura com JWT
- 🏘️ Gestão de propriedades para proprietários
- 👤 Perfis de utilizadores (Proprietário, Inquilino, Administrador)
- 📄 **Sistema de Upload e Verificação de Documentos**
  - Proprietários fazem upload de documentos (BI, Título de Propriedade, Comprovante de Endereço)
  - Administradores visualizam e revisar documentos
  - Aprovação/Rejeição com notas personalizadas
- 💰 Gestão financeira de propriedades
- 📊 Painel de controlo para administradores
- 💬 Sistema de mensagens entre utilizadores

## 🚀 Configuração Rápida

### Pré-requisitos

- Node.js 18+
- MySQL 8.0+
- npm ou yarn

### 1. Instalar Dependências

#### Backend

```bash
cd "Kusambwila website design/backend"
npm install
```

#### Frontend

```bash
cd "Kusambwila website design"
npm install
```

### 2. Configurar Banco de Dados MySQL

**Opção A: Usar a aplicação (Automático)**
- A aplicação cria as tabelas automaticamente na primeira execução

**Opção B: Script SQL (Manual)**
```bash
mysql -u root -p < backend/kusambwila_full.sql
```

### 3. Variáveis de Ambiente Backend

Edite/crie `backend/.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_password
DB_NAME=kusambwila_db
PORT=5000
JWT_SECRET=kusambwila_jwt_secret_key_2024
NODE_ENV=development
```

### 4. Iniciar a Aplicação

#### Terminal 1: Backend
```bash
cd "Kusambwila website design/backend"
npm run dev
```
Servidor rodará em `http://localhost:5000`

#### Terminal 2: Frontend
```bash
cd "Kusambwila website design"
npm run dev
```
Aplicação rodará em `http://localhost:5173`

## 📋 Dados de Teste

### Credenciais Padrão

| Email | Senha | Tipo |
|-------|-------|------|
| admin@kusambwila.ao | adminpassword123 | Admin |
| maria@test.com | pass123 | Proprietário |
| carlos@test.com | pass123 | Proprietário |
| joana@test.com | pass123 | Inquilino |

## 📄 Sistema de Documentos

### Para Proprietários

1. Faça login como proprietário
2. Vá para "Meus Documentos" no menu
3. Upload dos seguintes documentos:
   - 🪧 Bilhete de Identidade
   - 🏠 Título de Propriedade
   - 📬 Comprovante de Endereço
4. Acompanhe o status (Pendente/Aprovado/Rejeitado)

### Para Administradores

1. Faça login como administrador
2. Vá para Admin → Documentos
3. Veja documentos pendentes, aprovados e rejeitados
4. Clique em "Ver Detalhes" para revisar
5. Aprove ou rejeite com motivo/notas

## 🛣️ Rotas Principais

### Frontend
- `/` - Página Inicial
- `/login` - Login
- `/register` - Registro
- `/search` - Pesquisar Propriedades
- `/publish` - Publicar Propriedade
- `/documents` - Meus Documentos (Proprietário)
- `/dashboard` - Dashboard
- `/profile` - Perfil do Utilizador
- `/admin` - Painel Admin
- `/admin/documents` - Revisão de Documentos (Admin)

### API Backend
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/profile` - Perfil do utilizador
- `POST /api/documents/upload` - Upload de documento
- `GET /api/documents` - Meus documentos
- `GET /api/admin/documents` - Documentos pendentes (Admin)
- `GET /api/admin/documents/:id` - Detalhes do documento
- `PUT /api/admin/documents/:id/approve` - Aprovar documento
- `PUT /api/admin/documents/:id/reject` - Rejeitar documento
- `GET /api/properties` - Listar propriedades
- `POST /api/properties/publish` - Publicar propriedade

## 📁 Estrutura do Projeto

```
Kusambwila website design/
├── backend/
│   ├── server.js           # Servidor Express
│   ├── db.js               # Configuração MySQL
│   ├── auth.js             # Lógica de autenticação
│   ├── uploads/            # Pasta de documentos
│   ├── package.json
│   └── .env
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── landlord-documents.tsx    # Upload de docs
│   │   │   ├── ...outros.tsx
│   │   ├── admin/
│   │   │   ├── pages/
│   │   │   │   ├── documents.tsx         # Revisão de docs
│   │   │   │   ├── ...outros.tsx
│   │   │   ├── components/
│   │   ├── components/
│   │   ├── lib/
│   │   │   ├── api.ts                    # Cliente API
│   │   ├── contexts/
│   │   └── routes.ts
│   ├── main.tsx
│   └── styles/
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## 🔧 Troubleshooting

### Erro: "Connection Refused" na porta 5000
- Verifique se o backend está rodando
- Certifique-se de que a porta 5000 está disponível

### Erro: "Cannot find module 'multer'"
```bash
cd backend
npm install multer
```

### Erro de conexão MySQL
- Verifique as credenciais em `.env`
- Assegure-se de que o MySQL está rodando
- Verifique o nome da base de dados

### Arquivos de upload não salvam
- Verifique permissões da pasta `backend/uploads/`
- Certifique-se de que o caminho existe

## 📝 Notas de Desenvolvimento

- Documentos são salvos em `backend/uploads/`
- Máximo 10MB por arquivo
- Tipos permitidos: PDF, JPEG, PNG
- Tokens JWT expiram em 7 dias
- Senhas são hasheadas com bcrypt (12 rounds)

## 🔒 Segurança

- ✅ Autenticação JWT com token-based
- ✅ Hashing de senhas com bcrypt
- ✅ CORS configurado
- ✅ Validação de tipos de arquivo
- ✅ Limite de tamanho de arquivo
- ✅ Roles/Permissões (Admin, Proprietário, Inquilino)

## 🤝 Suporte

Para problemas ou dúvidas, verifique:
1. Terminal de erros (console do navegador)
2. Logs do servidor (terminal do backend)
3. Status do MySQL

---

**Kusambwila** - Gestão de Imóveis em Angola 🇦🇴