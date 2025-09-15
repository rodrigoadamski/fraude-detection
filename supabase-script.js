// Global variables
let currentUser = null;
let clients = [];
let supabaseClient;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeSupabase();
    checkExistingSession();
    setupEventListeners();
});

// Inicializar Supabase
function initializeSupabase() {
    if (typeof SUPABASE_CONFIG === 'undefined') {
        console.error('Configuração do Supabase não encontrada. Certifique-se de que config.js está carregado.');
        showErrorMessage('Erro de configuração. Verifique as credenciais do Supabase.');
        return;
    }
    
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    console.log('Supabase inicializado com sucesso');
}

// Verificar sessão existente
function checkExistingSession() {
    const savedSession = localStorage.getItem(APP_CONFIG.AUTH.SESSION_KEY);
    if (savedSession) {
        currentUser = JSON.parse(savedSession);
        showPage('dashboard');
        loadClients();
        updateOfficeName();
    }
}

// Event Listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Navigation buttons
    document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
        btn.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            showPage(page);
            updateActiveNav(this);
        });
    });
    
    // Add client form
    document.getElementById('addClientForm').addEventListener('submit', handleAddClient);
    
    // Client search
    document.getElementById('clientSearch').addEventListener('input', filterClients);
}

// Authentication Functions
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Show loading
    document.getElementById('loadingMessage').style.display = 'block';
    
    try {
        // Buscar escritório na tabela Escritórios usando email
        const { data: escritorio, error } = await supabaseClient
            .from(APP_CONFIG.TABLES.ESCRITORIOS)
            .select('*')
            .eq('email', email)
            .single();
        
        if (error || !escritorio) {
            throw new Error('E-mail não encontrado');
        }
        
        // Verificar senha (assumindo que você está usando hash simples ou texto plano)
        // Se você estiver usando bcrypt ou outro hash, precisará ajustar esta parte
        if (escritorio.senha_hash !== password) {
            throw new Error('Senha incorreta');
        }
        
        // Login bem-sucedido
        currentUser = {
            id: escritorio.id,
            email: escritorio.email,
            nome: escritorio.nome,
            cnpj: escritorio.cnpj
        };
        
        // Salvar sessão
        localStorage.setItem(APP_CONFIG.AUTH.SESSION_KEY, JSON.stringify(currentUser));
        
        // Limpar formulário e mostrar dashboard
        document.getElementById('loginForm').reset();
        showPage('dashboard');
        loadClients();
        updateOfficeName();
        showSuccessMessage(`Bem-vindo, ${currentUser.nome}!`);
        
    } catch (error) {
        console.error('Erro no login:', error);
        showErrorMessage(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
        document.getElementById('loadingMessage').style.display = 'none';
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem(APP_CONFIG.AUTH.SESSION_KEY);
    showPage('login');
    document.getElementById('loginForm').reset();
    clients = [];
    updateStats();
}

// Client Management Functions with Supabase
async function loadClients() {
    if (!currentUser) return;
    
    try {
        // Assumindo que a tabela Clientes tem uma coluna escritorio_id
        const { data: clientsData, error } = await supabaseClient
            .from(APP_CONFIG.TABLES.CLIENTES)
            .select('*')
            .eq('escritorio_id', currentUser.id)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        clients = clientsData || [];
        displayClients();
        updateStats();
        
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        showErrorMessage('Erro ao carregar clientes. Tente novamente.');
    }
}

async function handleAddClient(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showErrorMessage('Usuário não autenticado');
        return;
    }
    
    const formData = new FormData(e.target);
    const newClient = {
        nome: formData.get('clientName'),
        telefone: formData.get('clientPhone'),
        email: formData.get('clientEmail') || null,
        escritorio_id: currentUser.id
    };
    
    try {
        const { data, error } = await supabaseClient
            .from(APP_CONFIG.TABLES.CLIENTES)
            .insert([newClient])
            .select();
        
        if (error) throw error;
        
        // Reset form and show success message
        e.target.reset();
        showSuccessMessage(`Cliente "${newClient.nome}" foi adicionado com sucesso!`);
        
        // Reload clients and navigate back
        await loadClients();
        showPage('clients');
        updateActiveNav(document.querySelector('[data-page="clients"]'));
        
    } catch (error) {
        console.error('Erro ao adicionar cliente:', error);
        showErrorMessage('Erro ao adicionar cliente. Tente novamente.');
    }
}

async function deleteClient(clientId) {
    if (!confirm('Tem certeza de que deseja excluir este cliente?')) {
        return;
    }
    
    try {
        const { error } = await supabaseClient
            .from(APP_CONFIG.TABLES.CLIENTES)
            .delete()
            .eq('id', clientId);
        
        if (error) throw error;
        
        showSuccessMessage('Cliente excluído com sucesso!');
        await loadClients();
        
    } catch (error) {
        console.error('Erro ao excluir cliente:', error);
        showErrorMessage('Erro ao excluir cliente. Tente novamente.');
    }
}

function displayClients() {
    const tbody = document.getElementById('clientsTableBody');
    tbody.innerHTML = '';
    
    if (clients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    <i class="fas fa-users"></i>
                    <h3>Nenhum cliente encontrado</h3>
                    <p>Adicione seu primeiro cliente para começar</p>
                </td>
            </tr>
        `;
        return;
    }
    
    clients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.nome}</td>
            <td>${client.telefone}</td>
            <td>${formatDate(client.created_at)}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteClient(${client.id})">
                    <i class="fas fa-trash"></i>
                    Excluir
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterClients() {
    const searchTerm = document.getElementById('clientSearch').value.toLowerCase();
    const filteredClients = clients.filter(client => 
        client.nome.toLowerCase().includes(searchTerm) ||
        client.telefone.includes(searchTerm) ||
        (client.email && client.email.toLowerCase().includes(searchTerm))
    );
    
    const tbody = document.getElementById('clientsTableBody');
    tbody.innerHTML = '';
    
    if (filteredClients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>Nenhum cliente encontrado</h3>
                    <p>Tente ajustar seus termos de busca</p>
                </td>
            </tr>
        `;
        return;
    }
    
    filteredClients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.nome}</td>
            <td>${client.telefone}</td>
            <td>${formatDate(client.created_at)}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteClient(${client.id})">
                    <i class="fas fa-trash"></i>
                    Excluir
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function updateStats() {
    document.getElementById('totalClients').textContent = clients.length;
}

function updateOfficeName() {
    const officeNameElement = document.getElementById('officeName');
    if (officeNameElement && currentUser && currentUser.nome) {
        officeNameElement.textContent = currentUser.nome;
    }
}

function showSuccessMessage(message) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    // Insert at the top of the main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(successDiv, mainContent.firstChild);
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}

function showErrorMessage(message) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.error-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
    `;
    
    // Insert at the top of the main content or login card
    const mainContent = document.querySelector('.main-content') || document.querySelector('.login-card');
    if (mainContent) {
        mainContent.insertBefore(errorDiv, mainContent.firstChild);
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Page Navigation
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the requested page
    if (pageName === 'login') {
        document.getElementById('loginPage').classList.add('active');
    } else {
        document.getElementById('dashboardPage').classList.add('active');
        
        // Show the appropriate content section
        const contentSection = document.getElementById(pageName + 'Content');
        if (contentSection) {
            contentSection.classList.add('active');
        }
    }
}

function updateActiveNav(activeBtn) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    activeBtn.classList.add('active');
}

// Phone number formatting (Brazilian format)
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('clientPhone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 7) {
                value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            }
            e.target.value = value;
        });
    }
});
