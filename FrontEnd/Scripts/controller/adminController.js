// Admin Controller - Handles all admin panel logic and utilities
import { authManager } from '../utils/auth.js';

// Export functions needed by admininner.js
export { setupGlobalFunctions, setupEventListeners, loadInitialData };

// Expose functions to global scope for inline event handlers
function setupGlobalFunctions() {
    // Functions for tools
    window.openAddToolModal = openAddToolModal;
    window.editTool = editTool;
    window.deleteTool = deleteTool;
    
    // Functions for users
    window.openAddUserModal = openAddUserModal;
    window.editUser = editUser;
    window.deleteUser = deleteUser;
    
    // Utility functions
    window.closeModal = closeModal;
    
    console.log('Global functions setup completed');
}

function setupEventListeners() {
    // Tab switching - use correct class name
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Form submissions - check if elements exist
    const toolForm = document.getElementById('tool-form');
    const userForm = document.getElementById('user-form');
    
    if (toolForm) {
        toolForm.addEventListener('submit', handleToolSubmit);
    }
    
    if (userForm) {
        userForm.addEventListener('submit', handleUserSubmit);
    }

    // Modal close on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// TAB MANAGEMENT
function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const activeTab = document.getElementById(`${tabName}-tab`);
    if (activeTab) {
        activeTab.classList.add('active');
    }

    // Load data for the active tab
    if (tabName === 'tools') {
        loadTools();
    } else if (tabName === 'users') {
        loadUsers();
    }
}
// load all initial data with retries for critical elements
async function loadInitialData(retryCount = 0) {
    console.log(`Loading initial data... (attempt ${retryCount + 1})`);
    
    // Check for critical elements
    const toolsTableBody = document.getElementById('tools-table-body');
    const usersTableBody = document.getElementById('users-table-body');
    const toolCategorySelect = document.getElementById('tool-category');
    const toolForm = document.getElementById('tool-form');
    const userForm = document.getElementById('user-form');
    
    console.log('Critical elements check:', {
        toolsTableBody: !!toolsTableBody,
        usersTableBody: !!usersTableBody,
        toolCategorySelect: !!toolCategorySelect,
        toolForm: !!toolForm,
        userForm: !!userForm
    });
    
    // Debug: log which elements are missing
    if (!toolsTableBody) console.log('Missing: tools-table-body');
    if (!usersTableBody) console.log('Missing: users-table-body');
    if (!toolCategorySelect) console.log('Missing: tool-category');
    if (!toolForm) console.log('Missing: tool-form');
    if (!userForm) console.log('Missing: user-form');
    
    if (!toolsTableBody || !usersTableBody) {
        if (retryCount < 5) {
            console.error(`Critical table elements missing, retrying in 500ms... (attempt ${retryCount + 1}/5)`);
            setTimeout(() => loadInitialData(retryCount + 1), 500);
            return;
        } else {
            console.error('Max retries reached. Critical elements still missing. Continuing anyway...');
            // Continue without the missing elements
        }
    }
    
    // Warn if forms are missing but continue
    if (!toolForm || !userForm) {
        console.warn('Form elements not yet available, will be checked during setup');
    }
    
    try {
        // Check token validity before loading data
        const tokenValid = await checkTokenValidity();
        if (!tokenValid) {
            return; // stop if token is invalid
        }
        
        await loadCategories();
        await loadUsersForSelect();
        await loadRoles();
        await loadPlatforms();
        await loadOperatingSystems();
        await loadTools();
        await loadUsers();
        console.log('All initial data loaded successfully');
    } catch (error) {
        console.error('Error loading initial data:', error);
    }
}
// load tools into the tools table
async function loadTools() {
    try {
        const response = await fetch('http://localhost:3001/api/tools');
        const data = await response.json();
        const tools = data.tools || data; // Handle both formats
        
        // fetch users to map IDs to names
        const usersResponse = await fetch('http://localhost:3001/api/users');
        const usersData = await usersResponse.json();
        const users = usersData.users || usersData;
        
        // create a map of user IDs to usernames
        const userMap = {};
        users.forEach(user => {
            const userId = user.id || user.ID_User;
            const userName = user.username || user.Name;
            userMap[userId] = userName;
        });
        
        const tbody = document.getElementById('tools-table-body');
        if (!tbody) {
            console.error('Element tools-table-body not found');
            return;
        }
        
        tbody.innerHTML = '';

        tools.forEach(tool => {
            const row = document.createElement('tr');
            const creatorName = tool.ID_User ? (userMap[tool.ID_User] || `User ${tool.ID_User}`) : 'N/A';
            
            row.innerHTML = `
                <td>${tool.ID_Tools || tool.ID_Tool}</td>
                <td>${tool.Name_Tools || tool.Name}</td>
                <td>${(tool.Description_Tools || tool.Description || '').substring(0, 50)}...</td>
                <td>${tool.Name_Category || tool.category_name || 'N/A'}</td>
                <td>${creatorName}</td>
                <td class="actions">
                    <button class="btn-edit" onclick="editTool(${tool.ID_Tools || tool.ID_Tool}, '${(tool.Name_Tools || tool.Name || '').replace(/'/g, "\\'")}', '${(tool.Description_Tools || tool.Description || '').replace(/'/g, "\\'")}', '${(tool.Link_Tools || tool.Link || '').replace(/'/g, "\\'")}', '${(tool.ImageTools || tool.Image || '').replace(/'/g, "\\'")}', ${tool.ID_Category || 'null'}, ${tool.ID_User || 'null'})">Edit</button>
                    <button class="btn-delete" onclick="deleteTool(${tool.ID_Tools || tool.ID_Tool}, '${(tool.Name_Tools || tool.Name || '').replace(/'/g, "\\'")}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        showNotification(`${tools.length} tools loaded successfully`, 'success');
    } catch (error) {
        console.error('Error loading tools:', error);
        
        // load test tools if server is unavailable
        loadMockTools();
        showNotification('Server unavailable - Test data loaded', 'info');
    }
}
// load mock tools into the tools table
function loadMockTools() {
    const mockTools = [
        { ID_Tool: 1, Name: 'Figma', Description: 'Collaborative design tool for creating user interfaces', category_name: 'Design', user_name: 'John Doe' },
        { ID_Tool: 2, Name: 'VS Code', Description: 'Modern and extensible code editor with many features', category_name: 'Developpement', user_name: 'Jane Smith' },
        { ID_Tool: 3, Name: 'Notion', Description: 'All-in-one workspace for notes, projects, and collaboration', category_name: 'Productivity', user_name: 'Bob Wilson' }
    ];
    
    const tbody = document.getElementById('tools-table-body');
    if (!tbody) {
        console.error('Element tools-table-body not found');
        return;
    }
    
    tbody.innerHTML = '';

    mockTools.forEach(tool => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tool.ID_Tool}</td>
            <td>${tool.Name}</td>
            <td>${tool.Description.substring(0, 50)}...</td>
            <td>${tool.category_name || 'N/A'}</td>
            <td>${tool.user_name || 'N/A'}</td>
            <td class="actions">
                <button class="btn-edit" onclick="alert('Server required for modification')">Modifier</button>
                <button class="btn-delete" onclick="alert('Server required for deleting')">Supprimer</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
// load users into the users table
async function loadUsers() {
    try {
        const response = await fetch('http://localhost:3001/api/users');
        const data = await response.json();
        const users = data.users || data; // Handle both formats
        
        const tbody = document.getElementById('users-table-body');
        if (!tbody) {
            console.error('Element users-table-body not found');
            return;
        }
        
        tbody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            const registerDate = new Date(user.registeredAt || user.Register_date).toLocaleDateString('fr-FR');
            const userId = user.id || user.ID_User;
            const userName = user.username || user.Name;
            const userEmail = user.email || user.Email;
            const userRole = user.roleId || user.ID_Role;
            
            // Map role IDs to role names
            let roleName = 'Member';
            if (userRole === 1) roleName = 'Guest';
            else if (userRole === 3) roleName = 'Admin';
            else if (userRole === 4) roleName = 'Moderator';
            
            row.innerHTML = `
                <td>${userId}</td>
                <td>${userName}</td>
                <td>${userEmail}</td>
                <td>${roleName}</td>
                <td>${registerDate}</td>
                <td class="actions">
                    <button class="btn-edit" onclick="editUser(${userId})">Edit</button>
                    <button class="btn-delete" onclick="deleteUser(${userId}, '${userName.replace(/'/g, "\\'")}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        showNotification(`${users.length} users loaded successfully`, 'success');
    } catch (error) {
        console.error('Error loading users:', error);
        
        // load test users if server is unavailable
        loadMockUsers();
        showNotification('Server unavailable - Test data loaded', 'info');
    }
}
// load mock users into the users table
function loadMockUsers() {
    const mockUsers = [
        { id: 1, username: 'GuestBot', email: 'guest@example.com', roleId: 1, registeredAt: '2024-01-01' },
        { id: 6, username: 'AdminMaster', email: 'admin@toolhub.dev', roleId: 3, registeredAt: '2023-12-25' },
        { id: 8, username: 'Deleted_User', email: 'Deleted@mail.com', roleId: 3, registeredAt: '2025-10-03' }
    ];
    
    const tbody = document.getElementById('users-table-body');
    if (!tbody) {
        console.error('Element users-table-body not found');
        return;
    }
    
    tbody.innerHTML = '';

    mockUsers.forEach(user => {
        const row = document.createElement('tr');
        const registerDate = new Date(user.registeredAt).toLocaleDateString('fr-FR');
        
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.roleId === 3 ? 'Admin' : user.roleId === 1 ? 'Guest' : 'Utilisateur'}</td>
            <td>${registerDate}</td>
            <td class="actions">
                <button class="btn-edit" onclick="alert('Server required for modification')">Modifier</button>
                <button class="btn-delete" onclick="alert('Server required for deleting')">Supprimer</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
// load categories into the select dropdown
async function loadCategories() {
    try {
        const response = await fetch('http://localhost:3001/api/category');
        if (response.ok) {
            const data = await response.json();
            const categories = data.categories || data;
            
            console.log('Categories loaded from API:', categories);
            
            const select = document.getElementById('tool-category');
            if (select) {
                select.innerHTML = '<option value="">Select a category</option>';
                
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.ID_Category || category.id;
                    option.textContent = category.Name_Category || category.name;
                    select.appendChild(option);
                });
                
                console.log(`${categories.length} categories loaded successfully`);
            }
        } else {
            throw new Error('API categories not available');
        }
    } catch (error) {
        console.log('Route /api/category not available, loading test categories');
        loadMockCategories();
    }
}
// load mock categories into the select dropdown
function loadMockCategories() {
    const mockCategories = [
        { ID_Category: 1, Name_Category: 'Design' },
        { ID_Category: 2, Name_Category: 'Developpement' },
        { ID_Category: 3, Name_Category: 'Productivity' },
        { ID_Category: 4, Name_Category: 'Marketing' },
        { ID_Category: 5, Name_Category: 'Communication' },
        { ID_Category: 6, Name_Category: 'Analysis' },
        { ID_Category: 7, Name_Category: 'Security' },
        { ID_Category: 8, Name_Category: 'Education' }
    ];
    
    const select = document.getElementById('tool-category');
    if (select) {
        select.innerHTML = '<option value="">SÃ©lectionner une catÃ©gorie</option>';
        
        mockCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.ID_Category;
            option.textContent = category.Name_Category;
            select.appendChild(option);
        });
        
        console.log(`${mockCategories.length} mock categories loaded`);
    }
}
// load users into the select dropdown
async function loadUsersForSelect() {
    try {
        const response = await fetch('http://localhost:3001/api/users');
        const data = await response.json();
        const users = data.users || data; // Handle both formats
        
        const select = document.getElementById('tool-user');
        if (!select) {
            console.error('Element tool-user not found');
            return;
        }
        
        select.innerHTML = '<option value="">SÃ©lectionner un utilisateur</option>';
        
        users.forEach(user => {
            const option = document.createElement('option');
            const userId = user.id || user.ID_User;
            const userName = user.username || user.Name;
            const userEmail = user.email || user.Email;
            option.value = userId;
            option.textContent = `${userName} (${userEmail})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading users:', error);
        
        // Load test users for the select dropdown
        loadMockUsersForSelect();
    }
}
// load mock users into the select dropdown
function loadMockUsersForSelect() {
    const mockUsers = [
        { id: 1, username: 'GuestBot', email: 'guest@example.com' },
        { id: 6, username: 'AdminMaster', email: 'admin@toolhub.dev' },
        { id: 8, username: 'Deleted_User', email: 'Deleted@mail.com' }
    ];
    
    const select = document.getElementById('tool-user');
    if (select) {
        select.innerHTML = '<option value="">Select an user</option>';
        
        mockUsers.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = `${user.username} (${user.email})`;
            select.appendChild(option);
        });
    }
}

// Tool Management Functions
function openAddToolModal() {
    document.getElementById('tool-modal-title').textContent = 'Add Tool';
    document.getElementById('tool-form').reset();
    document.getElementById('tool-id').value = '';
    
    // Pre-select the current admin user for new tools
    const currentUser = authManager.getCurrentUser();
    if (currentUser) {
        document.getElementById('tool-user').value = currentUser.id || currentUser.ID_User;
    }
    
    document.getElementById('tool-modal').style.display = 'block';
}
// edit tool with fallback values
async function editTool(toolId, fallbackName = '', fallbackDescription = '', fallbackLink = '', fallbackImage = '', fallbackCategory = null, fallbackUser = null) {
    try {
        console.log('Fetching tool data for ID:', toolId);
        const response = await fetch(`http://localhost:3001/api/tools/${toolId}`);
        
        if (!response.ok) {
            console.warn(`API call failed, using fallback data for tool ${toolId}`);
            // Use fallback data if the API fails
            document.getElementById('tool-modal-title').textContent = 'Edit Tool (limited data)';
            document.getElementById('tool-id').value = toolId;
            document.getElementById('tool-name').value = fallbackName;
            document.getElementById('tool-description').value = fallbackDescription;
            document.getElementById('tool-link').value = fallbackLink;
            document.getElementById('tool-image').value = fallbackImage;
            document.getElementById('tool-category').value = fallbackCategory || '';
            document.getElementById('tool-user').value = fallbackUser || '';
            
            // Reset the checkboxes
            const osCheckboxes = document.querySelectorAll('#tool-os-checkboxes input[type="checkbox"]');
            osCheckboxes.forEach(checkbox => checkbox.checked = false);
            
            const platformCheckboxes = document.querySelectorAll('#tool-platform-checkboxes input[type="checkbox"]');
            platformCheckboxes.forEach(checkbox => checkbox.checked = false);
            
            document.getElementById('tool-modal').style.display = 'block';
            showNotification('DonnÃ©es partielles chargÃ©es - Certaines informations peuvent manquer', 'warning');
            return;
        }
        
        const tool = await response.json();
        console.log('Tool data received:', tool);
        console.log('Tool owner ID:', tool.ID_User);
        console.log('Tool category ID:', tool.ID_Category);
        console.log('Tool OS:', tool.Name_OS);
        console.log('Tool Platform:', tool.Platform_Name);
        console.log('Current user:', authManager.getCurrentUser());
        
        document.getElementById('tool-modal-title').textContent = 'Edit Tool';
        document.getElementById('tool-id').value = tool.ID_Tools || tool.ID_Tool || toolId;
        document.getElementById('tool-name').value = tool.Name_Tools || tool.Name || '';
        document.getElementById('tool-description').value = tool.Description_Tools || tool.Description || '';
        document.getElementById('tool-link').value = tool.Link_Tools || tool.Link || '';
        document.getElementById('tool-image').value = tool.ImageTools || tool.Image || '';
        document.getElementById('tool-category').value = tool.ID_Category || '';
        document.getElementById('tool-user').value = tool.ID_User || '';
        
        // Manage OS (checkboxes)
        const osCheckboxes = document.querySelectorAll('#tool-os-checkboxes input[type="checkbox"]');
        const toolOS = (tool.Name_OS || '').split(',').map(os => os.trim()).filter(os => os);
        osCheckboxes.forEach(checkbox => {
            checkbox.checked = toolOS.includes(checkbox.value);
        });
        
        // Manage platforms (checkboxes)
        const platformCheckboxes = document.querySelectorAll('#tool-platform-checkboxes input[type="checkbox"]');
        const toolPlatforms = (tool.Platform_Name || '').split(',').map(platform => platform.trim()).filter(platform => platform);
        platformCheckboxes.forEach(checkbox => {
            checkbox.checked = toolPlatforms.includes(checkbox.value);
        });
        
        document.getElementById('tool-modal').style.display = 'block';
    } catch (error) {
        console.error('Error loading tool:', error);
        showNotification(`Network error: ${error.message}`, 'error');
    }
};
// show delete confirmation modal
function deleteTool(toolId, toolName) {
    const deleteModal = document.getElementById('delete-modal');
    deleteModal.classList.add('delete-modal');
    document.getElementById('delete-message').textContent = `Are you sure you want to delete the tool "${toolName}"?`;
    document.getElementById('confirm-delete').onclick = () => confirmDeleteTool(toolId, toolName);
    deleteModal.style.display = 'block';
};
// confirm deletion with admin ID
async function confirmDeleteTool(toolId, toolName) {
    try {
        // Use the ID of the current admin (who has deletion rights)
        const currentUser = authManager.getCurrentUser();
        const adminUserId = currentUser.id || currentUser.ID_User;
        
        console.log('Suppression en tant qu\'admin avec ID_User:', adminUserId);
        
        const response = await fetch(`http://localhost:3001/api/tools/${toolId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authManager.getAuthHeader()
            },
            body: JSON.stringify({ ID_User: adminUserId }) // use admin ID for deletion
        });

        if (response.ok) {
            showNotification('Tool deleted successfully', 'success');
            loadTools();
            closeModal('delete-modal');
        } else {
            const error = await response.json();
            showNotification(error.message || 'Error during deletion', 'error');
        }
    } catch (error) {
        console.error('Error during deletion:', error);
        showNotification('Error during deletion', 'error');
    }
}
// handle tool form submission
async function handleToolSubmit(e) {
    e.preventDefault();
    
    const toolId = document.getElementById('tool-id').value;
    const currentUser = authManager.getCurrentUser();
    const selectedUserId = parseInt(document.getElementById('tool-user').value);
    
    const toolData = {
        Name_Tools: document.getElementById('tool-name').value,
        Description_Tools: document.getElementById('tool-description').value,
        Link_Tools: document.getElementById('tool-link').value,
        ImageTools: document.getElementById('tool-image').value,
        Image_Alt: `${document.getElementById('tool-name').value} icon`,
        ID_Category: parseInt(document.getElementById('tool-category').value),
        ID_User: currentUser.id || currentUser.ID_User, // admin making the change
        Name_OS: getSelectedCheckboxValues('#tool-os-checkboxes'),
        Platform_Name: getSelectedCheckboxValues('#tool-platform-checkboxes')
    };

    // for both creation and modification, ensure a user is selected
    if (toolId) {
        // for modification, set New_ID_User to the selected user
        toolData.New_ID_User = selectedUserId;
        console.log('Modification - Nouveau propriÃ©taire:', selectedUserId);
    } else {
        // for creation, set the owner to the selected user
        toolData.ID_User = selectedUserId;
        console.log('CrÃ©ation - PropriÃ©taire initial:', selectedUserId);
    }

    // keep track of who is making the change
    // admin can change the owner of the tool

    try {
        const url = toolId ? `http://localhost:3001/api/tools/${toolId}` : 'http://localhost:3001/api/tools';
        const method = toolId ? 'PATCH' : 'POST';
        
        console.log('Sending request:', { method, url, data: toolData });
        console.log('Request body:', JSON.stringify(toolData, null, 2));
        console.log('Selected user ID:', selectedUserId);
        console.log('Current admin ID:', currentUser.id || currentUser.ID_User);
        
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // for admin routes, always include auth header
        const authHeader = authManager.getAuthHeader();
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }
        
        console.log('Request headers:', headers);
        
        const response = await fetch(url, {
            method,
            headers,
            body: JSON.stringify(toolData)
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        if (response.ok) {
            const responseData = await response.json();
            console.log('Success response:', responseData);
            showNotification(toolId ? 'Tool updated successfully' : 'Tool created successfully', 'success');
            loadTools();
            closeModal('tool-modal');
        } else {
            console.error('Response status:', response.status, response.statusText);
            try {
                const error = await response.json();
                console.error('Error details:', error);
                showNotification(`Error ${response.status}: ${error.message || response.statusText}`, 'error');
            } catch (parseError) {
                console.error('Could not parse error response:', parseError);
                const responseText = await response.text();
                console.error('Raw response:', responseText);
                showNotification(`Error ${response.status}: ${response.statusText}`, 'error');
            }
        }
    } catch (error) {
        console.error('Error during save:', error);
        showNotification('Error during save', 'error');
    }
}

// User Management Functions
function openAddUserModal() {
    document.getElementById('user-modal-title').textContent = 'Add User';
    document.getElementById('user-form').reset();
    document.getElementById('user-id').value = '';
    document.getElementById('user-modal').style.display = 'block';
};
// fonction for editing a user
async function editUser(userId) {
    try {
        const authHeader = authManager.getAuthHeader();
        console.log('Edit user - Auth header:', authHeader);
        console.log('Edit user - User ID:', userId);
        
        const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
            headers: {
                'Authorization': authHeader
            }
        });
        
        console.log('Edit user - Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Edit user - Error response:', errorText);
            
            // redirect to login if token is invalid or expired
            if (response.status === 401) {
                const errorData = JSON.parse(errorText);
                if (errorData.error === 'invalid token') {
                    showNotification('Session expired. Please log in again.', 'error');
                    setTimeout(() => {
                        window.location.href = '/login.html';
                    }, 2000);
                    return;
                }
            }
            
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const user = await response.json();
        
        document.getElementById('user-modal-title').textContent = 'Edit User';
        const actualUserId = user.id || user.ID_User;
        const userName = user.username || user.Name;
        const userEmail = user.email || user.Email;
        const userRole = user.roleId || user.ID_Role;
        
        document.getElementById('user-id').value = actualUserId;
        document.getElementById('user-name').value = userName;
        document.getElementById('user-email').value = userEmail;
        document.getElementById('user-password').value = '';
        document.getElementById('user-role').value = userRole;
        
        document.getElementById('user-modal').style.display = 'block';
    } catch (error) {
        console.error('Error loading user:', error);
        showNotification('Error loading user', 'error');
    }
};
// prompt user deletion
function deleteUser(userId, userName) {
    document.getElementById('delete-message').textContent = `Are you sure you want to delete the user "${userName}"?`;
    document.getElementById('confirm-delete').onclick = () => confirmDeleteUser(userId);
    document.getElementById('delete-modal').style.display = 'block';
};
// confirm user deletion
async function confirmDeleteUser(userId) {
    try {
        const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authManager.getAuthHeader()
            }
        });

        if (response.ok) {
            showNotification('User deleted successfully', 'success');
            loadUsers();
            closeModal('delete-modal');
        } else {
            const error = await response.json();
            showNotification(error.message || 'Error during deletion', 'error');
        }
    } catch (error) {
        console.error('Error during deletion:', error);
        showNotification('Error during deletion', 'error');
    }
}
// handle user form submission
async function handleUserSubmit(e) {
    e.preventDefault();
    
    const userId = document.getElementById('user-id').value;
    const userData = {
        username: document.getElementById('user-name').value,
        email: document.getElementById('user-email').value,
        roleId: parseInt(document.getElementById('user-role').value) || 2
    };

    // Only include password if it's provided
    const password = document.getElementById('user-password').value;
    if (password) {
        userData.password = password;
    }

    try {
        const url = userId ? `http://localhost:3001/api/users/${userId}` : 'http://localhost:3001/api/users/create';
        const method = userId ? 'PATCH' : 'POST';
        
        console.log('User submit - URL:', url);
        console.log('User submit - Method:', method);
        console.log('User submit - Data:', userData);
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authManager.getAuthHeader()
            },
            body: JSON.stringify(userData)
        });

        console.log('User submit - Response status:', response.status);
        
        if (response.ok) {
            showNotification(userId ? 'User updated successfully' : 'User created successfully', 'success');
            loadUsers();
            loadUsersForSelect(); // Refresh the users dropdown
            closeModal('user-modal');
        } else {
            const errorText = await response.text();
            console.error('User submit - Error response:', errorText);
            try {
                const error = JSON.parse(errorText);
                showNotification(error.error || error.message || 'Error during save', 'error');
            } catch (e) {
                showNotification('Error during save: ' + errorText, 'error');
            }
        }
    } catch (error) {
        console.error('Error during save:', error);
        showNotification('Error during save', 'error');
    }
}

// close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}
// show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Load platforms from API or use default platforms
async function loadPlatforms() {
    try {
        const response = await fetch('http://localhost:3001/api/platforms');
        if (response.ok) {
            const data = await response.json();
            const platforms = data.platforms || data;
            
            const container = document.getElementById('tool-platform-checkboxes');
            if (container) {
                container.innerHTML = '';
                
                // default platforms if API returns empty
                const defaultPlatforms = ['Desktop', 'Mobile', 'Web'];
                const platformsToUse = platforms.length > 0 ? platforms.map(p => p.Platform_Name || p.name) : defaultPlatforms;
                
                platformsToUse.forEach(platform => {
                    const checkboxWrapper = document.createElement('div');
                    checkboxWrapper.className = 'checkbox-item';
                    checkboxWrapper.innerHTML = `
                        <input type="checkbox" id="platform-${platform}" value="${platform}">
                        <label for="platform-${platform}">${platform}</label>
                    `;
                    container.appendChild(checkboxWrapper);
                });
            }
        } else {
            throw new Error('API platforms not available');
        }
    } catch (error) {
        console.log('Route /api/platforms not available, loading default platforms');
        loadDefaultPlatforms();
    }
}
// load default platforms
function loadDefaultPlatforms() {
    const defaultPlatforms = ['Desktop', 'Mobile', 'Web'];
    const container = document.getElementById('tool-platform-checkboxes');
    if (container) {
        container.innerHTML = '';
        
        defaultPlatforms.forEach(platform => {
            const checkboxWrapper = document.createElement('div');
            checkboxWrapper.className = 'checkbox-item';
            checkboxWrapper.innerHTML = `
                <input type="checkbox" id="platform-${platform}" value="${platform}">
                <label for="platform-${platform}">${platform}</label>
            `;
            container.appendChild(checkboxWrapper);
        });
    }
}
// Load OS from API
async function loadOperatingSystems() {
    try {
        // try to fetch from API 
        // or use default OS if API not available
        loadDefaultOperatingSystems();
    } catch (error) {
        console.log('Loading default OS');
        loadDefaultOperatingSystems();
    }
}
// load default OS
function loadDefaultOperatingSystems() {
    const defaultOS = ['Windows', 'MacOS', 'Linux', 'Android', 'iOS'];
    const container = document.getElementById('tool-os-checkboxes');
    if (container) {
        container.innerHTML = '';
        
        defaultOS.forEach(os => {
            const checkboxWrapper = document.createElement('div');
            checkboxWrapper.className = 'checkbox-item';
            checkboxWrapper.innerHTML = `
                <input type="checkbox" id="os-${os}" value="${os}">
                <label for="os-${os}">${os}</label>
            `;
            container.appendChild(checkboxWrapper);
        });
    }
}

// Load roles from API or use default mock roles
async function loadRoles() {
    try {
        const response = await fetch('http://localhost:3001/api/roles');
        if (response.ok) {
            const data = await response.json();
            const roles = data.roles || data;
            
            console.log('Roles loaded from API:', roles);
            
            const select = document.getElementById('user-role');
            if (select) {
                select.innerHTML = '<option value="">Select a roles</option>';
                
                roles.forEach(role => {
                    const option = document.createElement('option');
                    option.value = role.ID_Role || role.id;
                    option.textContent = role.Name_Role || role.name;
                    select.appendChild(option);
                });
                
                console.log(`${roles.length} roles loaded successfully`);
            }
        } else {
            throw new Error('API roles not available');
        }
    } catch (error) {
        console.log('Routes /api/roles Not available, loading default roles');
        loadMockRoles();
    }
}
// default mock roles
function loadMockRoles() {
    const mockRoles = [
        { ID_Role: 1, Name_Role: 'Visitor' },
        { ID_Role: 2, Name_Role: 'Member' },
        { ID_Role: 3, Name_Role: 'Admin' },
        { ID_Role: 4, Name_Role: 'Moderator' }
    ];
    
    const select = document.getElementById('user-role');
    if (select) {
        select.innerHTML = '<option value="">Select a roles</option>';
        
        mockRoles.forEach(role => {
            const option = document.createElement('option');
            option.value = role.ID_Role;
            option.textContent = role.Name_Role;
            select.appendChild(option);
        });
        
        console.log(`${mockRoles.length} mock roles loaded`);
    }
}

// Helper to get selected checkbox values as comma-separated string
function getSelectedCheckboxValues(containerSelector) {
    const checkboxes = document.querySelectorAll(`${containerSelector} input[type="checkbox"]:checked`);
    return Array.from(checkboxes).map(checkbox => checkbox.value).join(', ');
}

// check if token is valid, otherwise redirect to login
async function checkTokenValidity() {
    try {
        const response = await fetch('http://localhost:3001/api/users/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authManager.getAuthHeader()
            }
        });
        
        if (!response.ok) {
            console.log('Invalid token, redirecting to login...');
            showNotification('Session expired. Redirecting to login page...', 'error');
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 2000);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Error verifying token:', error);
        return false;
    }
}
