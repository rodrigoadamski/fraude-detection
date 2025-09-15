# 🚀 Configuração do Supabase - Sistema de Gestão de Clientes

## 📋 Estrutura das Tabelas Necessárias

### 1. **Tabela: escritorios** (já existe)
Sua tabela já tem a estrutura correta:
- `id` (integer, primary key)
- `nome` (character varying, NOT NULL)
- `cnpj` (character varying, nullable)
- `email` (character varying, nullable)
- `created_at` (timestamp)
- `senha_hash` (text, nullable)

### 2. **Tabela: clientes** (já existe)
Sua tabela já tem a estrutura correta:
- `id` (integer, primary key)
- `escritorio_id` (integer, NOT NULL, foreign key)
- `nome` (character varying, NOT NULL)
- `telefone` (character varying, NOT NULL)
- `email` (character varying, nullable)
- `created_at` (timestamp, nullable)

## 🔐 Configuração de Segurança (RLS)

### 1. **Habilitar RLS na tabela clientes**
```sql
ALTER TABLE "clientes" ENABLE ROW LEVEL SECURITY;
```

### 2. **Política para escritórios acessarem apenas seus clientes**
```sql
CREATE POLICY "escritorios podem ver apenas seus clientes" ON "clientes"
    FOR ALL USING (escritorio_id = auth.uid()::integer);
```

### 3. **Política para inserção de clientes**
```sql
CREATE POLICY "escritorios podem inserir clientes" ON "clientes"
    FOR INSERT WITH CHECK (escritorio_id = auth.uid()::integer);
```

### 4. **Política para atualização de clientes**
```sql
CREATE POLICY "escritorios podem atualizar seus clientes" ON "clientes"
    FOR UPDATE USING (escritorio_id = auth.uid()::integer);
```

### 5. **Política para exclusão de clientes**
```sql
CREATE POLICY "escritorios podem excluir seus clientes" ON "clientes"
    FOR DELETE USING (escritorio_id = auth.uid()::integer);
```

## 🧪 Dados de Teste

### 1. **Usuário Existente**
Já existe um usuário cadastrado no banco:
- **E-mail:** `contato@alpha.com`
- **Senha:** `password123`

Este usuário pode ser usado para testar a aplicação.

### 2. **Inserir alguns Clientes de Teste**
Primeiro, você precisa descobrir o ID do usuário `contato@alpha.com`:

```sql
SELECT id FROM "escritorios" WHERE email = 'contato@alpha.com';
```

Depois, use esse ID para inserir clientes de teste (substitua `X` pelo ID encontrado):

```sql
INSERT INTO "clientes" (nome, telefone, email, escritorio_id) 
VALUES 
    ('João Silva', '(11) 99999-1234', 'joao@email.com', X),
    ('Maria Santos', '(11) 88888-5678', 'maria@email.com', X),
    ('Miguel Costa', '(11) 77777-9012', 'miguel@email.com', X);
```

## 🚀 Como Testar

1. **Abra o arquivo `index.html`** no seu navegador
2. **Faça login** com:
   - E-mail: `contato@alpha.com`
   - Senha: `password123`
3. **Teste as funcionalidades**:
   - Visualizar clientes existentes
   - Adicionar novos clientes
   - Buscar clientes
   - Excluir clientes

## ⚠️ Importante

- **Senhas**: O sistema atual usa senhas em texto plano para simplificar. Em produção, implemente hash de senhas.
- **RLS**: As políticas RLS garantem que cada escritório veja apenas seus próprios clientes.
- **API Key**: Suas credenciais já estão configuradas nos arquivos.

## 🔧 Solução de Problemas

### Erro: "E-mail não encontrado"
- Verifique se o e-mail existe na tabela `Escritórios`
- Confirme se o campo `email` não está vazio

### Erro: "Senha incorreta"
- Verifique se a senha no campo `senha_hash` está correta
- Lembre-se que está usando texto plano (não hash)

### Erro: "Erro ao carregar clientes"
- Verifique se a tabela `Clientes` foi criada
- Confirme se as políticas RLS estão configuradas
- Verifique se o `escritorio_id` está correto

### Erro: "Erro ao adicionar cliente"
- Verifique se a tabela `Clientes` existe
- Confirme se o `escritorio_id` está sendo passado corretamente
- Verifique as políticas de inserção

## 📞 Suporte

Se encontrar problemas:
1. Verifique o console do navegador (F12)
2. Confirme se todas as tabelas e políticas foram criadas
3. Teste com os dados de exemplo fornecidos
