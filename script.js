// Global variables
let currentUser = null;
let clients = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadClients();
    setupEventListeners();
    updateStats();
});

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
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (in a real app, this would be server-side)
    if (username === 'admin' && password === 'password123') {
        currentUser = { username, role: 'admin' };
        showPage('dashboard');
        showSuccessMessage('Login realizado com sucesso! Bem-vindo ao seu painel.');
    } else {
        alert('Credenciais inválidas. Por favor, use:\nUsuário: admin\nSenha: password123');
    }
}

function handleLogout() {
    currentUser = null;
    showPage('login');
    document.getElementById('loginForm').reset();
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

// Client Management Functions
function loadClients() {
    const savedClients = localStorage.getItem('lawFirmClients');
    if (savedClients) {
        clients = JSON.parse(savedClients);
    } else {
        // Add some sample clients
        clients = [
            {
                id: 1,
                name: 'João Silva',
                phone: '(11) 99999-1234',
                email: 'joao.silva@email.com',
                notes: 'Cliente de direito empresarial',
                dateAdded: new Date('2024-01-15').toISOString()
            },
            {
                id: 2,
                name: 'Maria Santos',
                phone: '(11) 88888-5678',
                email: 'maria.santos@email.com',
                notes: 'Caso de direito de família',
                dateAdded: new Date('2024-01-20').toISOString()
            },
            {
                id: 3,
                name: 'Miguel Costa',
                phone: '(11) 77777-9012',
                email: 'miguel.costa@email.com',
                notes: 'Transação imobiliária',
                dateAdded: new Date('2024-02-01').toISOString()
            }
        ];
        saveClients();
    }
    displayClients();
}

function saveClients() {
    localStorage.setItem('lawFirmClients', JSON.stringify(clients));
}

function handleAddClient(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newClient = {
        id: Date.now(), // Simple ID generation
        name: formData.get('clientName'),
        phone: formData.get('clientPhone'),
        email: formData.get('clientEmail') || '',
        notes: formData.get('clientNotes') || '',
        dateAdded: new Date().toISOString()
    };
    
    clients.push(newClient);
    saveClients();
    displayClients();
    updateStats();
    
    // Reset form and show success message
    e.target.reset();
    showSuccessMessage(`Cliente "${newClient.name}" foi adicionado com sucesso!`);
    
    // Navigate back to clients list
    showPage('clients');
    updateActiveNav(document.querySelector('[data-page="clients"]'));
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
            <td>${client.name}</td>
            <td>${client.phone}</td>
            <td>${formatDate(client.dateAdded)}</td>
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

function deleteClient(clientId) {
    if (confirm('Tem certeza de que deseja excluir este cliente?')) {
        clients = clients.filter(client => client.id !== clientId);
        saveClients();
        displayClients();
        updateStats();
        showSuccessMessage('Cliente excluído com sucesso!');
    }
}

function filterClients() {
    const searchTerm = document.getElementById('clientSearch').value.toLowerCase();
    const filteredClients = clients.filter(client => 
        client.name.toLowerCase().includes(searchTerm) ||
        client.phone.includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm)
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
            <td>${client.name}</td>
            <td>${client.phone}</td>
            <td>${formatDate(client.dateAdded)}</td>
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

function showSuccessMessage(message) {
    // Remove any existing success messages
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
    mainContent.insertBefore(successDiv, mainContent.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 5000);
}

// Phone number formatting (Brazilian format)
document.getElementById('clientPhone').addEventListener('input', function(e) {
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

// Auto-save form data (optional feature)
function autoSaveForm() {
    const form = document.getElementById('addClientForm');
    const formData = {
        name: form.clientName.value,
        phone: form.clientPhone.value,
        email: form.clientEmail.value,
        notes: form.clientNotes.value
    };
    localStorage.setItem('draftClientForm', JSON.stringify(formData));
}

function loadDraftForm() {
    const draft = localStorage.getItem('draftClientForm');
    if (draft) {
        const formData = JSON.parse(draft);
        const form = document.getElementById('addClientForm');
        form.clientName.value = formData.name || '';
        form.clientPhone.value = formData.phone || '';
        form.clientEmail.value = formData.email || '';
        form.clientNotes.value = formData.notes || '';
    }
}

// Add auto-save listeners
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addClientForm');
    if (form) {
        form.addEventListener('input', autoSaveForm);
        loadDraftForm();
    }
});

// Clear draft when form is submitted
document.getElementById('addClientForm').addEventListener('submit', function() {
    localStorage.removeItem('draftClientForm');
});
