# 🚀 Instruções Rápidas - Sistema de Gestão de Clientes

## ✅ **Aplicação Pronta para Uso!**

Sua aplicação está completamente configurada e conectada ao Supabase.

## 🔑 **Credenciais de Login**

- **E-mail:** `contato@alpha.com`
- **Senha:** `password123`

## 📋 **Como Usar**

### 1. **Testar a Conexão**
1. Abra `test-connection.html` no navegador
2. Clique em "Verificar Usuário" para confirmar que o usuário existe
3. Clique em "Testar Conexão" para verificar a conectividade

### 2. **Usar a Aplicação**
1. Abra `index.html` no navegador
2. Faça login com as credenciais acima
3. Explore as funcionalidades:
   - **Painel:** Visualize estatísticas
   - **Clientes:** Veja lista de clientes
   - **Adicionar Cliente:** Cadastre novos clientes

## 🗄️ **Configuração do Banco**

### ✅ Tabelas Já Existem:
- **escritorios:** ✅ Criada
- **clientes:** ✅ Criada

Ambas as tabelas já estão configuradas corretamente no seu banco!

### Descobrir ID do Usuário:
```sql
SELECT id FROM "escritorios" WHERE email = 'contato@alpha.com';
```

### Inserir Clientes de Teste (substitua X pelo ID encontrado):
```sql
INSERT INTO "clientes" (nome, telefone, email, escritorio_id) 
VALUES 
    ('João Silva', '(11) 99999-1234', 'joao@email.com', X),
    ('Maria Santos', '(11) 88888-5678', 'maria@email.com', X);
```

## 🔧 **Arquivos Principais**

- **`index.html`** - Aplicação principal
- **`test-connection.html`** - Teste de conexão
- **`config.js`** - Configurações do Supabase
- **`supabase-script.js`** - Lógica da aplicação
- **`SETUP_SUPABASE.md`** - Guia completo de configuração

## ⚠️ **Solução de Problemas**

### Erro de Login:
- Verifique se o e-mail está correto: `contato@alpha.com`
- Verifique se a senha está correta: `password123`

### Erro ao Carregar Clientes:
- Verifique se a tabela `Clientes` foi criada
- Confirme se o `escritorio_id` está correto

### Erro de Conexão:
- Verifique se as credenciais do Supabase estão corretas
- Teste a conexão com `test-connection.html`

## 🎯 **Próximos Passos**

1. **Teste a aplicação** com o usuário existente
2. **Crie a tabela Clientes** se necessário
3. **Configure RLS** para segurança (opcional)
4. **Personalize** conforme suas necessidades

---

**🎉 Sua aplicação está pronta para uso!**
