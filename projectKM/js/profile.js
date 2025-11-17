document.addEventListener('DOMContentLoaded', async () => {
    await loadProfile();
});

async function loadProfile() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
        document.getElementById('loginPrompt').style.display = 'block';
        document.getElementById('profileContent').style.display = 'none';
        return;
    }
    
    document.getElementById('loginPrompt').style.display = 'none';
    document.getElementById('profileContent').style.display = 'block';
    
    // Set profile information
    const name = user.name || user.email.split('@')[0];
    const email = user.email || 'N/A';
    const role = user.role || 'student';
    const clubName = user.club_name || null;
    const clubId = user.club_id || null;
    
    document.getElementById('profileName').textContent = name;
    document.getElementById('profileEmail').textContent = email;
    document.getElementById('profileEmailDisplay').textContent = email;
    document.getElementById('profileRole').textContent = role === 'bureau' ? 'Club Bureau Member' : 'Student';
    document.getElementById('memberSince').textContent = user.created_at 
        ? formatDate(user.created_at) 
        : 'Recently';
    
    // Set avatar initial
    const avatar = document.getElementById('profileAvatar');
    if (avatar) {
        avatar.innerHTML = `<span style="font-size: 3rem;">${name.charAt(0).toUpperCase()}</span>`;
    }
    
    // Show bureau club if applicable
    if (role === 'bureau' && clubName) {
        document.getElementById('bureauClubRow').style.display = 'flex';
        document.getElementById('bureauClubName').textContent = clubName;
        document.getElementById('bureauActions').style.display = 'block';
    }
    
    // Load user's club memberships (including bureau club)
    await loadMyClubs(user.id, clubId, clubName);
}

async function loadMyClubs(userId, bureauClubId, bureauClubName) {
    const memberships = getLocalStorageData('club_memberships') || [];
    let myMemberships = memberships.filter(m => m.user_id === userId);
    
    // If user is a bureau member with a club, ensure they're shown as a member
    if (bureauClubId && bureauClubName) {
        const hasBureauClub = myMemberships.some(
            m => (m.club_id === bureauClubId || m.club_name === bureauClubName)
        );
        
        if (!hasBureauClub) {
            // Add bureau club membership if not already there
            const newMembership = {
                id: Date.now().toString() + '_bureau',
                user_id: userId,
                club_id: bureauClubId,
                club_name: bureauClubName,
                joined_at: new Date().toISOString(),
                is_bureau: true
            };
            
            myMemberships.push(newMembership);
            
            // Save to localStorage
            const allMemberships = getLocalStorageData('club_memberships') || [];
            allMemberships.push(newMembership);
            setLocalStorageData('club_memberships', allMemberships);
        }
    }
    
    const clubsContainer = document.getElementById('myClubs');
    
    if (myMemberships.length === 0) {
        clubsContainer.innerHTML = '<p style="opacity: 0.7; text-align: center; padding: 2rem;">You haven\'t joined any clubs yet.</p>';
        return;
    }
    
    // Get club details from static data
    const clubDetails = myMemberships.map(membership => {
        const club = STATIC_CLUBS.find(c => c.id === membership.club_id || c.name === membership.club_name);
        return {
            ...membership,
            club: club
        };
    });
    
    clubsContainer.innerHTML = clubDetails.map(item => {
        const club = item.club || { name: item.club_name, color: '#3b82f6', imageIcon: '👥' };
        const isBureau = item.is_bureau || false;
        
        return `
            <div style="background: var(--bg-color); padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; display: flex; align-items: center; gap: 1rem; box-shadow: var(--shadow);">
                <div style="font-size: 3rem;">${club.imageIcon || '👥'}</div>
                <div style="flex: 1;">
                    <h3 style="color: var(--primary-color); margin-bottom: 0.25rem;">
                        ${club.name || item.club_name}
                        ${isBureau ? '<span style="font-size: 0.8rem; color: var(--accent-color); margin-left: 0.5rem;">(Bureau)</span>' : ''}
                    </h3>
                    <p style="opacity: 0.7; font-size: 0.9rem;">Member since ${formatDate(item.joined_at)}</p>
                </div>
                <span class="club-badge" style="background: ${club.color}20; color: ${club.color};">
                    <i class="fas fa-check-circle"></i> ${isBureau ? 'Bureau Member' : 'Member'}
                </span>
            </div>
        `;
    }).join('');
}