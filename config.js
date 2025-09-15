// Configuração do Supabase - CREDENCIAIS REAIS
const SUPABASE_CONFIG = {
    url: 'https://odzsnjvnxjxhhyvxnulm.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kenNuanZueGp4aGh5dnhudWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NDMyMzMsImV4cCI6MjA3MzUxOTIzM30.1OeWeGtiilkzbfC_jmlSTvvC8sKrqj-1yLsfBxj9ST4'
};

// Configurações da aplicação
const APP_CONFIG = {
    // Nomes das tabelas no Supabase
    TABLES: {
        ESCRITORIOS: 'escritorios', // nome exato da tabela no banco
        CLIENTES: 'clientes' // nome exato da tabela no banco
    },
    
    // Configurações de autenticação
    AUTH: {
        SESSION_KEY: 'law_firm_session',
        USER_KEY: 'current_user'
    }
};
