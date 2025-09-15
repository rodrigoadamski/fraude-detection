# 🗄️ Informações Completas do Banco de Dados

## 🔗 **Conexão Supabase**

- **URL:** `https://odzsnjvnxjxhhyvxnulm.supabase.co`
- **API Key (anon):** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kenNuanZueGp4aGh5dnhudWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDMyMzMsImV4cCI6MjA3MzUxOTIzM30.1OeWeGtiilkzbfC_jmlSTvvC8sKrqj-1yLsfBxj9ST4`
- **User:** `postgres`
- **Database Password:** `terssaSup144`

## 📋 **Estrutura das Tabelas**

### **Tabela: escritorios**
```sql
CREATE TABLE "escritorios" (
    id INTEGER PRIMARY KEY,
    nome CHARACTER VARYING NOT NULL,
    cnpj CHARACTER VARYING,
    email CHARACTER VARYING,
    created_at TIMESTAMP WITHOUT TIME ZONE,
    senha_hash TEXT
);
```

**Campos:**
- `id` (integer, NOT NULL) - Chave primária
- `nome` (character varying, NOT NULL) - Nome do escritório
- `cnpj` (character varying, nullable) - CNPJ do escritório
- `email` (character varying, nullable) - E-mail para login
- `created_at` (timestamp, nullable) - Data de criação
- `senha_hash` (text, nullable) - Senha para login

### **Tabela: clientes**
```sql
CREATE TABLE "clientes" (
    id INTEGER PRIMARY KEY,
    escritorio_id INTEGER NOT NULL,
    nome CHARACTER VARYING NOT NULL,
    telefone CHARACTER VARYING NOT NULL,
    email CHARACTER VARYING,
    created_at TIMESTAMP WITHOUT TIME ZONE
);
```

**Campos:**
- `id` (integer, NOT NULL) - Chave primária
- `escritorio_id` (integer, NOT NULL) - FK para Escritórios
- `nome` (character varying, NOT NULL) - Nome do cliente
- `telefone` (character varying, NOT NULL) - Telefone do cliente
- `email` (character varying, nullable) - E-mail do cliente
- `created_at` (timestamp, nullable) - Data de criação

## 👤 **Usuário de Teste**

- **E-mail:** `contato@alpha.com`
- **Senha:** `password123`

## 🔍 **Consultas Úteis**

### Descobrir ID do Usuário:
```sql
SELECT id, nome, email FROM "escritorios" WHERE email = 'contato@alpha.com';
```

### Ver Clientes de um Escritório:
```sql
SELECT c.*, e.nome as escritorio_nome 
FROM "clientes" c 
JOIN "escritorios" e ON c.escritorio_id = e.id 
WHERE e.email = 'contato@alpha.com';
```

### Inserir Cliente de Teste:
```sql
INSERT INTO "clientes" (nome, telefone, email, escritorio_id) 
VALUES ('Cliente Teste', '(11) 99999-9999', 'teste@cliente.com', 1);
```

## 🔐 **Políticas RLS (Opcional)**

Para maior segurança, você pode configurar Row Level Security:

```sql
-- Habilitar RLS
ALTER TABLE "clientes" ENABLE ROW LEVEL SECURITY;

-- Política para visualizar apenas clientes do próprio escritório
CREATE POLICY "escritorios veem apenas seus clientes" ON "clientes"
    FOR SELECT USING (escritorio_id = auth.uid()::integer);

-- Política para inserir clientes
CREATE POLICY "escritorios podem inserir clientes" ON "clientes"
    FOR INSERT WITH CHECK (escritorio_id = auth.uid()::integer);

-- Política para atualizar clientes
CREATE POLICY "escritorios podem atualizar seus clientes" ON "clientes"
    FOR UPDATE USING (escritorio_id = auth.uid()::integer);

-- Política para excluir clientes
CREATE POLICY "escritorios podem excluir seus clientes" ON "clientes"
    FOR DELETE USING (escritorio_id = auth.uid()::integer);
```

## ✅ **Status da Configuração**

- ✅ **Conexão:** Configurada
- ✅ **Tabela escritorios:** Existe e configurada
- ✅ **Tabela clientes:** Existe e configurada
- ✅ **Usuário de Teste:** Disponível
- ✅ **Aplicação:** Pronta para uso

## 🚀 **Próximos Passos**

1. **Teste a conexão** com `test-connection.html`
2. **Faça login** na aplicação com `contato@alpha.com` / `password123`
3. **Adicione clientes** de teste
4. **Configure RLS** se necessário para produção
