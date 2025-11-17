let isRegisterMode = false;

// Make showLogin available globally
window.showLogin = function() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        isRegisterMode = false;
        updateAuthForm();
    } else {
        // If modal doesn't exist on this page, redirect to home
        window.location.href = '../index.html';
    }
};

function closeModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function toggleAuthMode(e) {
    e.preventDefault();
    isRegisterMode = !isRegisterMode;
    updateAuthForm();
}

function updateAuthForm() {
    const submitBtn = document.getElementById('authSubmit');
    const switchText = document.getElementById('authSwitchText');
    const switchLink = document.getElementById('authSwitchLink');
    const roleGroup = document.getElementById('roleGroup');
    const clubGroup = document.getElementById('clubGroup');
    
    if (isRegisterMode) {
        if (submitBtn) submitBtn.textContent = 'Register';
        if (switchText) switchText.textContent = 'Already have an account?';
        if (switchLink) switchLink.textContent = 'Login';
        if (roleGroup) roleGroup.style.display = 'block';
    } else {
        if (submitBtn) submitBtn.textContent = 'Login';
        if (switchText) switchText.textContent = "Don't have an account?";
        if (switchLink) switchLink.textContent = 'Register';
        if (roleGroup) roleGroup.style.display = 'none';
        if (clubGroup) clubGroup.style.display = 'none';
    }
}

// Show club selection when bureau role is selected
function onRoleChange() {
    const roleSelect = document.getElementById('role');
    const clubGroup = document.getElementById('clubGroup');
    
    if (roleSelect && clubGroup) {
        if (roleSelect.value === 'bureau') {
            clubGroup.style.display = 'block';
        } else {
            clubGroup.style.display = 'none';
        }
    }
}

// Make onRoleChange available globally
window.onRoleChange = onRoleChange;

document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', handleAuth);
    }
    
    const roleSelect = document.getElementById('role');
    if (roleSelect) {
        roleSelect.addEventListener('change', onRoleChange);
    }
    
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('loginModal');
        if (e.target === modal) {
            closeModal();
        }
    });
    
    checkAuthStatus();
});

async function handleAuth(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role')?.value || 'student';
    const club = document.getElementById('bureauClub')?.value || null;
    
    if (!isValidEmail(email)) {
        showNotification('Only @esi.ac.ma emails are allowed', 'error');
        return;
    }
    
    // Validate bureau member club selection
    if (isRegisterMode && role === 'bureau' && !club) {
        showNotification('Please select a club for bureau membership', 'error');
        return;
    }
    
    const users = getLocalStorageData('users') || [];
    
    if (isRegisterMode) {
        const exists = users.find(u => u.email === email);
        if (exists) {
            showNotification('User already exists', 'error');
            return;
        }
        
        const clubName = role === 'bureau' && club 
            ? document.getElementById('bureauClub').selectedOptions[0]?.text 
            : null;
        
        const newUser = {
            id: Date.now().toString(),
            email: email,
            password: password,
            role: role,
            club_id: role === 'bureau' ? club : null,
            club_name: clubName,
            name: email.split('@')[0], // Use email prefix as name
            created_at: new Date().toISOString()
        };
        
        users.push(newUser);
        setLocalStorageData('users', users);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        // AUTO-JOIN: If bureau member selected a club, automatically add them as a member
        if (role === 'bureau' && club && clubName) {
            const memberships = getLocalStorageData('club_memberships') || [];
            
            // Check if already a member
            const existingMembership = memberships.find(
                m => m.user_id === newUser.id && (m.club_id === club || m.club_name === clubName)
            );
            
            if (!existingMembership) {
                const newMembership = {
                    id: Date.now().toString() + '_auto',
                    user_id: newUser.id,
                    club_id: club,
                    club_name: clubName,
                    joined_at: new Date().toISOString(),
                    is_bureau: true // Mark as bureau membership
                };
                
                memberships.push(newMembership);
                setLocalStorageData('club_memberships', memberships);
                
                console.log('Auto-joined bureau member to club:', clubName);
            }
        }
        
        showNotification('Registration successful! You are now a member of ' + (clubName || 'the platform') + '.', 'success');
        closeModal();
        updateNavbar();
        
        // Small delay to show notification, then reload
        setTimeout(() => {
            location.reload();
        }, 1500);
    } else {
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            showNotification('Invalid email or password', 'error');
            return;
        }
        
        localStorage.setItem('user', JSON.stringify(user));
        showNotification('Login successful!', 'success');
        closeModal();
        updateNavbar();
        
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
}

function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
        updateNavbar();
    }
}

function updateNavbar() {
    const authNav = document.getElementById('authNav');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (user.id && authNav) {
        // Check if we're on index.html or in pages folder
        const profilePath = window.location.pathname.includes('pages/') 
            ? 'profile.html' 
            : 'pages/profile.html';
        
        authNav.innerHTML = `
            <a href="${profilePath}">
                <i class="fas fa-user"></i> Profile
            </a>
            <a href="#" onclick="handleLogout()" style="margin-left: 1rem;">Logout</a>
        `;
    }
}

function handleLogout() {
    localStorage.removeItem('user');
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// Make handleLogout available globally
window.handleLogout = handleLogout;
