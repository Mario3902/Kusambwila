# 🗄️ Kusambwila - Guia de Configuração MySQL

## 📋 Pré-requisitos

- MySQL Server 8.0 ou superior instalado
- MySQL Workbench OU MySQL CLI (command line)
- Credenciais de acesso (user e password)

---

## ✅ Passo 1: Verificar se MySQL está Instalado

### Windows (CMD/PowerShell)
```bash
mysql --version
```

Se não aparecer a versão, MySQL não está instalado. Baixe em: https://dev.mysql.com/downloads/mysql/

### Linux (Terminal)
```bash
sudo mysql --version
```

### macOS (Terminal)
```bash
mysql --version
```

---

## ✅ Passo 2: Iniciar o Serviço MySQL

### Windows (Services)
1. Abra "Services" (services.msc)
2. Procure por "MySQL80" ou similar
3. Clique com botão direito → "Start"
4. Status deve ser "Running"

### Windows (CMD - Administrador)
```bash
net start MySQL80
```

### Linux
```bash
sudo systemctl start mysql
```

### macOS (Brew)
```bash
brew services start mysql
```

---

## ✅ Passo 3: Conectar ao MySQL

### Opção A: Usar MySQL CLI (Recomendado)

```bash
mysql -u root -p
```

Quando pedir password, deixe em branco (apenas pressione Enter) OU entre a password se tiver definido.

### Opção B: Usar MySQL Workbench

1. Abra MySQL Workbench
2. Clique em "Local instance MySQL80"
3. Clique "Store in Vault" (se pedir password)

---

## ✅ Passo 4: Criar a Base de Dados

Na prompt do MySQL, execute:

```sql
CREATE DATABASE IF NOT EXISTS kusambwila_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Verifique se foi criada:
```sql
SHOW DATABASES;
```

Deve aparecer `kusambwila_db` na lista.

---

## ✅ Passo 5: Selecionar a Base de Dados

```sql
USE kusambwila_db;
```

Você deve ver: `Database changed`

---

## ✅ Passo 6: Criar as Tabelas

### Opção A: Executar Script SQL Completo

Se tem o ficheiro `backend/kusambwila_full.sql`:

```bash
mysql -u root -p kusambwila_db < backend/kusambwila_full.sql
```

### Opção B: Criar Manualmente

Na prompt MySQL (após `USE kusambwila_db`), execute os comandos abaixo:

#### 1. Tabela de Utilizadores
```sql
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `firstName` VARCHAR(255) NOT NULL,
  `lastName` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50),
  `userType` ENUM('tenant', 'landlord', 'admin') NOT NULL,
  `biNumber` VARCHAR(100),
  `biDocument` VARCHAR(255),
  `propertyDocument` VARCHAR(255),
  `avatar` VARCHAR(255),
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. Tabela de Propriedades
```sql
CREATE TABLE IF NOT EXISTS `properties` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` INT NOT NULL,
  `location` VARCHAR(255) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `type` ENUM('apartment', 'house', 'villa', 'studio', 'commercial') NOT NULL,
  `bedrooms` INT DEFAULT 0,
  `bathrooms` INT DEFAULT 0,
  `area` INT,
  `featured` BOOLEAN DEFAULT FALSE,
  `landlordId` INT,
  `latitude` DOUBLE,
  `longitude` DOUBLE,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`landlordId`) REFERENCES `users`(`id`) ON DELETE SET NULL
);
```

#### 3. Tabela de Documentos (NOVA - Importante!)
```sql
CREATE TABLE IF NOT EXISTS `documents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT NOT NULL,
  `documentType` ENUM('bi', 'propertyTitle', 'addressProof') NOT NULL,
  `fileName` VARCHAR(255) NOT NULL,
  `filePath` VARCHAR(255) NOT NULL,
  `fileSize` INT,
  `mimeType` VARCHAR(100),
  `status` ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  `rejectionReason` TEXT,
  `uploadedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `verifiedAt` DATETIME,
  `verifiedBy` INT,
  `adminNotes` TEXT,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`verifiedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_userId` (`userId`),
  INDEX `idx_status` (`status`),
  INDEX `idx_uploadedAt` (`uploadedAt`)
);
```

#### 4. Tabela de Verificação de Documentos
```sql
CREATE TABLE IF NOT EXISTS `document_verifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `userId` INT UNIQUE,
  `biStatus` ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  `biVerifiedAt` DATETIME,
  `propertyTitleStatus` ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  `propertyTitleVerifiedAt` DATETIME,
  `addressProofStatus` ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  `verificationScore` INT DEFAULT 0,
  `isVerified` BOOLEAN DEFAULT FALSE,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
);
```

---

## ✅ Passo 7: Inserir Dados de Teste

```sql
INSERT INTO `users` (`id`, `firstName`, `lastName`, `email`, `password`, `phone`, `userType`, `biNumber`) VALUES
(1, 'Admin', 'Kusambwila', 'admin@kusambwila.ao', '$2b$12$77vAxeIZdD46NzgKl0WmZ.OadU23vsJxHTgs9lML0eoWNAf4B.QWu', '+244900000000', 'admin', NULL),
(2, 'Maria', 'Costa', 'maria@test.com', '$2b$12$dExC6ccQIY0gURpCJEDsAOS5hnCNXcO4Avtw0V6/z5OzJ1Nm9oeJu', '+244923456001', 'landlord', '005412345LA048'),
(3, 'Carlos', 'Pereira', 'carlos@test.com', '$2b$12$oyhuo.OM1HHq8RfcSfVAg.TKzxMUIaMmbfDXf2qAzvKFRsUEQmrwK', '+244923456002', 'landlord', '005412346LA048'),
(4, 'Joana', 'Silva', 'joana@test.com', '$2b$12$NtB7qVdhHXfatZL6nS/hHuYOIbmtzC.8fex0JOBslZ8KOQQ6XCiOa', '+244923456003', 'tenant', NULL);

INSERT INTO `document_verifications` (`id`, `userId`, `biStatus`, `propertyTitleStatus`, `addressProofStatus`, `verificationScore`, `isVerified`) VALUES
(1, 1, 'verified', 'verified', 'verified', 100, 1),
(2, 2, 'pending', 'pending', 'pending', 0, 0),
(3, 3, 'pending', 'pending', 'pending', 0, 0),
(4, 4, 'pending', 'pending', 'pending', 0, 0);
```

**Notas sobre as passwords:**
- admin@kusambwila.ao: `adminpassword123`
- maria@test.com: `pass123`
- carlos@test.com: `pass123`
- joana@test.com: `pass123`

---

## ✅ Passo 8: Verificar as Tabelas

Na prompt MySQL, execute:

```sql
SHOW TABLES;
```

Deve aparecer algo como:
```
+---------------------------+
| Tables_in_kusambwila_db   |
+---------------------------+
| amenities                 |
| document_verifications    |
| documents                 |  ← NOVA TABELA
| messages                  |
| payments                  |
| price_history             |
| properties                |
| property_amenities        |
| property_financials       |
| property_images           |
| users                     |
+---------------------------+
```

---

## ✅ Passo 9: Verificar Estrutura da Tabela de Documentos

```sql
DESCRIBE documents;
```

Você deve ver todas as colunas:
```
+------------------+-------------------------------------------------+------+-----+---------+----------------+
| Field            | Type                                            | Null | Key | Default | Extra          |
+------------------+-------------------------------------------------+------+-----+---------+----------------+
| id               | int                                             | NO   | PRI | NULL    | auto_increment |
| userId           | int                                             | NO   | MUL | NULL    |                |
| documentType     | enum('bi','propertyTitle','addressProof')       | NO   |     | NULL    |                |
| fileName         | varchar(255)                                    | NO   |     | NULL    |                |
| filePath         | varchar(255)                                    | NO   |     | NULL    |                |
| fileSize         | int                                             | YES  |     | NULL    |                |
| mimeType         | varchar(100)                                    | YES  |     | NULL    |                |
| status           | enum('pending','verified','rejected')           | NO   |     | pending |                |
| rejectionReason  | text                                            | YES  |     | NULL    |                |
| uploadedAt       | timestamp                                       | NO   |     | CURRENT | _TIMESTAMP     |
| verifiedAt       | datetime                                        | YES  |     | NULL    |                |
| verifiedBy       | int                                             | YES  | MUL | NULL    |                |
| adminNotes       | text                                            | YES  |     | NULL    |                |
| createdAt        | timestamp                                       | NO   |     | CURRENT | _TIMESTAMP     |
| updatedAt        | timestamp                                       | NO   |     | CURRENT | _TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |
+------------------+-------------------------------------------------+------+-----+---------+----------------+
```

---

## ✅ Passo 10: Configurar .env do Backend

Edite `backend/.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=kusambwila_db
PORT=5000
JWT_SECRET=kusambwila_jwt_secret_key_2024
NODE_ENV=development
```

**Notas:**
- Se tem password MySQL, coloque em `DB_PASSWORD`
- Se não tem password, deixe vazio (como está acima)
- Se está em servidor remoto, altere `DB_HOST` para o IP/hostname

---

## ✅ Passo 11: Testar Conexão (Opcional)

Na prompt MySQL, execute uma query de teste:

```sql
SELECT COUNT(*) as user_count FROM users;
```

Deve retornar: `4` (4 utilizadores de teste)

```sql
SELECT * FROM documents;
```

Deve retornar: (vazio, pois ainda não há documentos enviados)

---

## 🔍 Verificação Final

### Checklist:

- [ ] MySQL está instalado e rodando
- [ ] Base de dados `kusambwila_db` criada
- [ ] 11 tabelas criadas (incluindo `documents`)
- [ ] Utilizadores de teste inseridos (4 registos)
- [ ] `.env` do backend configurado
- [ ] Conexão ao MySQL testada
- [ ] Pasta `backend/uploads/` criada (para documentos)

---

## 🆘 Troubleshooting

### Erro: "Access denied for user 'root'@'localhost'"

**Solução:**
```bash
# Tentar sem password
mysql -u root

# Ou com password
mysql -u root -p
# Digitar a password quando pedir
```

### Erro: "Can't connect to MySQL server"

**Solução:**
1. Verifique se MySQL está rodando
2. Se Windows: `net start MySQL80`
3. Se Linux: `sudo systemctl start mysql`
4. Verifique a porta (padrão: 3306)

### Erro: "Unknown database 'kusambwila_db'"

**Solução:**
```sql
CREATE DATABASE kusambwila_db;
USE kusambwila_db;
-- Depois execute o script SQL
```

### Erro: "Table 'documents' doesn't exist"

**Solução:**
```sql
USE kusambwila_db;
-- Execute o CREATE TABLE documents novamente
-- (está no Passo 6.3 acima)
```

### Erro: "Foreign key constraint fails"

**Solução:**
1. Certifique-se de que `users` table existe primeiro
2. Execute as tabelas nesta ordem:
   1. users
   2. document_verifications
   3. documents

---

## 📊 Exemplo de Query de Teste

Após inserir dados, teste com:

```sql
-- Ver todos os utilizadores
SELECT * FROM users;

-- Ver utilizadores e seus documentos pendentes
SELECT u.firstName, u.lastName, COUNT(d.id) as pending_docs
FROM users u
LEFT JOIN documents d ON u.id = d.userId AND d.status = 'pending'
WHERE u.userType = 'landlord'
GROUP BY u.id;

-- Ver documento específico
SELECT d.*, u.firstName, u.lastName, u.email
FROM documents d
JOIN users u ON d.userId = u.id
WHERE d.id = 1;
```

---

## 🎯 Próximos Passos

Após configurar MySQL:

1. Inicie o backend: `npm run dev` (na pasta backend)
2. Backend criará/verificará as tabelas automaticamente
3. Inicie o frontend: `npm run dev`
4. Teste o login e upload de documentos

---

## 📚 Referência Rápida - Comandos Úteis

```bash
# Conectar ao MySQL
mysql -u root -p

# Conectar a uma base específica
mysql -u root -p kusambwila_db

# Executar script SQL
mysql -u root -p < backend/kusambwila_full.sql

# Executar query diretamente
mysql -u root -p -e "SHOW DATABASES;"

# Exportar base de dados
mysqldump -u root -p kusambwila_db > backup.sql

# Importar backup
mysql -u root -p kusambwila_db < backup.sql
```

---

## 🔒 Segurança (Para Produção)

```sql
-- Criar utilizador com permissões limitadas (NÃO root)
CREATE USER 'kusambwila_user'@'localhost' IDENTIFIED BY 'strong_password_here';

-- Dar permissões
GRANT ALL PRIVILEGES ON kusambwila_db.* TO 'kusambwila_user'@'localhost';
FLUSH PRIVILEGES;

-- Usar no .env:
-- DB_USER=kusambwila_user
-- DB_PASSWORD=strong_password_here
```

---

**MySQL Setup Completo! ✅**

Kusambwila - Gestão de Imóveis em Angola 🇦🇴