# 🏠 Kusambwila - Guia Completo de População de Dados

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de Dados](#estrutura-de-dados)
3. [Passo 1: Setup Inicial](#passo-1-setup-inicial)
4. [Passo 2: Popular com Propriedades](#passo-2-popular-com-propriedades)
5. [Verificar Dados](#verificar-dados)
6. [Operações de Sucesso](#operações-de-sucesso)

---

## 🎯 Visão Geral

Este guia mostra como popular o banco de dados com:
- ✅ **2 Proprietários** (Maria Costa, Carlos Pereira)
- ✅ **13 Propriedades** distribuídas por 5 regiões
- ✅ **Múltiplas Imagens** por propriedade
- ✅ **Dados Financeiros** para cada propriedade
- ✅ **Organização por Região**: Cacuaco, Benfica, Talatona, Kilamba, Maca

---

## 📊 Estrutura de Dados

### Proprietários

| Nome | Email | Senha | Propriedades |
|------|-------|-------|--------------|
| Maria Costa | maria@test.com | pass123 | Cacuaco (3), Talatona (2), Maca (2) |
| Carlos Pereira | carlos@test.com | pass123 | Benfica (3), Kilamba (3) |

### Regiões e Propriedades

#### 🏘️ Cacuaco (Maria Costa) - 3 propriedades
1. Casa T3 Moderna - 180.000 Kz
2. Apartamento T2 - 95.000 Kz
3. Vila Luxuosa - 450.000 Kz

#### 🏖️ Benfica (Carlos Pereira) - 3 propriedades
1. Moradia T4 - 280.000 Kz
2. Apartamento Premium - 220.000 Kz
3. Studio Moderno - 85.000 Kz

#### 🌴 Talatona (Maria Costa) - 2 propriedades
1. Casa T3 - 200.000 Kz
2. Apartamento T2 com Varanda - 120.000 Kz

#### 🏗️ Kilamba (Carlos Pereira) - 3 propriedades
1. Vila Espaçosa - 380.000 Kz
2. Apartamento T3 - 140.000 Kz
3. Studio Acessível - 75.000 Kz

#### 🏢 Maca (Maria Costa) - 2 propriedades
1. Casa Comercial - 320.000 Kz
2. Moradia T2 - 110.000 Kz

---

## 🚀 Passo 1: Setup Inicial

### Execute uma única vez:

```bash
cd "Kusambwila website design/backend"
node setup-db.js
```

**Esperado:**
```
✅ Conectado ao MySQL
✅ Base de dados criada
✅ Todas as 11 tabelas criadas
✅ DATABASE SETUP COMPLETO COM SUCESSO!
```

Isto cria:
- Base de dados `kusambwila_db`
- Todas as tabelas (users, properties, documents, etc)
- 4 utilizadores de teste (Admin, Maria, Carlos, Joana)
- 3 propriedades de exemplo (podem ser sobrescritas)

---

## 📍 Passo 2: Popular com Propriedades

### Execute para adicionar as 13 propriedades por região:

```bash
node backend/seed-complete.js
```

**Isto vai:**
- ✅ Adicionar 13 propriedades
- ✅ Adicionar ~30+ imagens
- ✅ Calcular dados financeiros automaticamente
- ✅ Mostrar estatísticas detalhadas

**Esperado:**
```
🚀 Iniciando população completa do banco de dados...

✅ Conectado ao banco de dados

📊 Propriedades existentes: 3

📋 Inserindo propriedades...

  ✅ Casa T3 Moderna em Cacuaco (Cacuaco) - 180.000 Kz
  ✅ Apartamento T2 em Cacuaco (Cacuaco) - 95.000 Kz
  ✅ Vila Luxuosa em Cacuaco (Cacuaco) - 450.000 Kz
  [... mais propriedades ...]

✅ 13 propriedades inseridas com sucesso!
✅ 32 imagens inseridas!

📊 Estatísticas por Região:

  Cacuaco:
    • Propriedades: 3
    • Preço médio: 241.666 Kz
    • Preço máximo: 450.000 Kz
    • Preço mínimo: 95.000 Kz

  Benfica:
    • Propriedades: 3
    • Preço médio: 195.000 Kz
    ...

👥 Estatísticas por Proprietário:

  Maria Costa:
    • Propriedades: 7
    • Preço médio: 203.571 Kz
    • Receita mensal total: 1.535.000 Kz

  Carlos Pereira:
    • Propriedades: 6
    • Preço médio: 230.000 Kz
    • Receita mensal total: 1.275.000 Kz

🏠 Estatísticas por Tipo de Propriedade:

  house: 4 propriedade(s) | Preço médio: 172.500 Kz
  apartment: 5 propriedade(s) | Preço médio: 143.000 Kz
  villa: 2 propriedade(s) | Preço médio: 415.000 Kz
  studio: 2 propriedade(s) | Preço médio: 80.000 Kz
  commercial: 1 propriedade(s) | Preço médio: 320.000 Kz

════════════════════════════════════════════════════════
✅ BANCO DE DADOS POPULADO COM SUCESSO!
════════════════════════════════════════════════════════

📊 Resumo Final:
  • Total de propriedades: 16
  • Total de imagens: 32
  • Receita mensal total: 2.810.000 Kz
  • Regiões: 5 (Cacuaco, Benfica, Talatona, Kilamba, Maca)
  • Proprietários: 2 (Maria Costa, Carlos Pereira)

🌍 Distribuição por Região:
  • Cacuaco: 3 propriedades (Maria)
  • Benfica: 3 propriedades (Carlos)
  • Talatona: 2 propriedades (Maria)
  • Kilamba: 3 propriedades (Carlos)
  • Maca: 2 propriedades (Maria)

════════════════════════════════════════════════════════
```

---

## 🔍 Verificar Dados

### Terminal 1: Rodar Backend

```bash
cd "Kusambwila website design/backend"
npm run dev
```

### Terminal 2: Rodar Frontend

```bash
cd "Kusambwila website design"
npm run dev
```

### Browser: Abrir Aplicação

```
http://localhost:5173
```

---

## ✅ Operações de Sucesso

### 1️⃣ Ver Todas as Propriedades

1. Abra `http://localhost:5173`
2. Clique em "Pesquisar" ou "Propriedades"
3. **Deve aparecer 16 propriedades** (3 iniciais + 13 novas)

### 2️⃣ Filtrar por Região

1. Clique em "Filtro" ou "Pesquisar por Região"
2. Selecione uma região:
   - Cacuaco: 3 propriedades
   - Benfica: 3 propriedades
   - Talatona: 2 propriedades
   - Kilamba: 3 propriedades
   - Maca: 2 propriedades

### 3️⃣ Ver Propriedade Específica

1. Clique em qualquer propriedade
2. **Deve ver:**
   - ✅ Título e descrição completa
   - ✅ Preço em Kwanzas
   - ✅ Localização e distrito
   - ✅ Número de quartos e casas de banho
   - ✅ Área em m²
   - ✅ Galeria de imagens
   - ✅ Nome do proprietário

### 4️⃣ Verificar como Proprietário

```
Login: maria@test.com / pass123
```

1. Faça login
2. Vá para "Meu Dashboard" ou "Minhas Propriedades"
3. **Deve ver 7 propriedades de Maria:**
   - 3 em Cacuaco
   - 2 em Talatona
   - 2 em Maca

```
Login: carlos@test.com / pass123
```

1. Faça login
2. Vá para "Minhas Propriedades"
3. **Deve ver 6 propriedades de Carlos:**
   - 3 em Benfica
   - 3 em Kilamba

### 5️⃣ Admin Visualizar Dados

```
Login: admin@kusambwila.ao / adminpassword123
```

1. Faça login
2. Vá para "Admin" → "Propriedades"
3. **Deve ver todas as 16 propriedades**
4. Pode ver estatísticas:
   - Total de proprietários: 2
   - Total de propriedades: 16
   - Total de regiões: 5

### 6️⃣ Upload de Documento (Proprietário)

```
Login: maria@test.com / pass123
```

1. Vá para "Meus Documentos"
2. Faça upload de um documento
3. **Documento deve aparecer com status "Pendente"**

### 7️⃣ Revisar Documento (Admin)

```
Login: admin@kusambwila.ao / adminpassword123
```

1. Vá para "Admin" → "Documentos"
2. **Deve ver documentos pendentes**
3. Clique "Ver Detalhes"
4. Aprove ou Rejeite
5. **Status deve atualizar em tempo real**

---

## 🗄️ Consultas MySQL Úteis

### Ver todas as propriedades

```sql
USE kusambwila_db;
SELECT COUNT(*) as total FROM properties;
```

**Esperado:** `16`

### Ver propriedades por região

```sql
SELECT district, COUNT(*) as count FROM properties GROUP BY district;
```

**Esperado:**
```
Cacuaco     3
Benfica     3
Talatona    2
Kilamba     3
Maca        2
```

### Ver propriedades de um proprietário

```sql
SELECT p.title, p.price, p.district 
FROM properties p 
JOIN users u ON p.landlordId = u.id 
WHERE u.email = 'maria@test.com';
```

**Esperado:** 7 propriedades de Maria

### Ver receita total

```sql
SELECT SUM(monthlyRevenue) as total FROM property_financials;
```

**Esperado:** ~2.810.000 Kz

### Ver imagens por propriedade

```sql
SELECT COUNT(*) as total FROM property_images;
```

**Esperado:** ~32+ imagens

---

## 🔄 Operações Adicionais

### Adicionar Mais Propriedades

Se quiser adicionar mais propriedades manualmente:

```sql
INSERT INTO properties 
(title, description, price, location, district, type, bedrooms, bathrooms, area, featured, landlordId) 
VALUES 
('Nova Casa em Cacuaco', 'Descrição...', 250000, 'Rua X', 'Cacuaco', 'house', 3, 2, 180, 1, 2);
```

### Limpar Todas as Propriedades

⚠️ **Cuidado - Isto apaga tudo!**

```sql
DELETE FROM properties;
DELETE FROM property_images;
DELETE FROM property_financials;
```

### Reset Completo

```bash
cd "Kusambwila website design/backend"
node setup-db.js
node seed-complete.js
```

---

## 📞 Troubleshooting

### Erro: "Database connection failed"

```bash
# Verifique se MySQL está rodando
net start MySQL80  # Windows
sudo systemctl start mysql  # Linux

# Ou configure .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=kusambwila_db
```

### Erro: "Table already exists"

Isto é normal - o script usa `CREATE TABLE IF NOT EXISTS`. Apenas ignora e continua.

### Propriedades não aparecem no frontend

1. Verifique se backend está rodando: `http://localhost:5000/api/properties`
2. Verifique console do navegador (F12) para erros
3. Certifique-se de que `npm run dev` está rodando no frontend

### Imagens não carregam

As imagens usam URLs externas do Unsplash. Se não carregarem:
- Verifique conexão de internet
- URLs são válidas em `https://images.unsplash.com/`

---

## ✨ Resultado Final

Após executar todos os passos:

```
✅ Base de dados criada e inicializada
✅ 4 utilizadores de teste cadastrados
✅ 16 propriedades distribuídas por 5 regiões
✅ ~32+ imagens para as propriedades
✅ Dados financeiros calculados automaticamente
✅ Sistema pronto para testar completo
✅ Proprietários podem fazer upload de documentos
✅ Admin pode revisar e gerenciar tudo
```

---

## 🎉 Está Tudo Pronto!

### Resumo dos Comandos

```bash
# 1️⃣ Setup inicial (uma única vez)
cd "Kusambwila website design/backend"
node setup-db.js

# 2️⃣ Popular com propriedades
node seed-complete.js

# 3️⃣ Terminal 1 - Backend
npm run dev

# 4️⃣ Terminal 2 - Frontend
cd ..
npm run dev

# 5️⃣ Browser
http://localhost:5173
```

**Kusambwila v1.0.0 - Sistema Completo e Funcional! 🇦🇴**
