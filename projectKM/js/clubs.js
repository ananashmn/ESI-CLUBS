let userMemberships = [];

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Clubs.js loaded');
    console.log('STATIC_CLUBS available:', typeof STATIC_CLUBS !== 'undefined');
    
    try {
        await loadClubs();
        await loadUserMemberships();
    } catch (error) {
        console.error('Error loading clubs:', error);
    }
});

async function loadClubs() {
    const container = document.getElementById('clubsContainer');
    if (!container) {
        console.error('clubsContainer not found');
        return;
    }
    
    try {
        if (typeof STATIC_CLUBS === 'undefined') {
            container.innerHTML = '<p class="loading">Clubs data not loaded. Please refresh the page.</p>';
            console.error('STATIC_CLUBS is not defined');
            return;
        }
        
        const memberCounts = await getMemberCounts();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        container.innerHTML = STATIC_CLUBS.map(club => {
            // Check if user is a member (regular or bureau)
            const isMember = userMemberships.some(m => 
                m.club_id === club.id || m.club_id === club.name
            ) || (user.role === 'bureau' && user.club_id === club.id);
            
            const count = memberCounts[club.id] || 0;
            const isBureauMember = user.role === 'bureau' && user.club_id === club.id;
            
            return createClubCard(club, isMember, count, isBureauMember);
        }).join('');
        
        console.log('Clubs loaded successfully:', STATIC_CLUBS.length);
    } catch (error) {
        console.error('Error in loadClubs:', error);
        container.innerHTML = '<p class="loading">Error loading clubs. Please refresh the page.</p>';
    }
}

function createClubCard(club, isMember, memberCount, isBureauMember = false) {
    return `
        <div class="club-card ${club.id}" style="background: var(--bg-color); border-radius: 12px; padding: 1.5rem; box-shadow: var(--shadow); transition: transform 0.3s, box-shadow 0.3s;">
            <div class="club-image" style="width: 100%; height: 200px; background: linear-gradient(135deg, ${club.color}, ${club.color}dd); display: flex; align-items: center; justify-content: center; font-size: 5rem; color: white; margin: -1.5rem -1.5rem 1rem -1.5rem; border-radius: 12px 12px 0 0;">
                <span>${club.imageIcon || club.emoji || '👥'}</span>
            </div>
            ${isBureauMember ? '<div style="background: var(--accent-color); color: white; padding: 0.5rem; text-align: center; margin: -1.5rem -1.5rem 1rem -1.5rem; border-radius: 12px 12px 0 0;"><i class="fas fa-star"></i> Your Bureau Club</div>' : ''}
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--primary-color);">${club.name}</h3>
            <p style="color: var(--text-color); opacity: 0.8; margin-bottom: 1rem; line-height: 1.6;">
                ${club.description ? club.description.substring(0, 120) + '...' : 'Join this club to learn more!'}
            </p>
            <div style="margin: 1rem 0; padding: 0.75rem; background: var(--card-bg); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <small style="color: var(--text-color); opacity: 0.7;">
                    <i class="fas fa-users"></i> ${memberCount} members
                </small>
                <i class="${club.icon || 'fas fa-users'}" style="color: ${club.color}; font-size: 1.5rem;"></i>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-direction: column;">
                <button class="btn btn-outline" onclick="viewClubDetails('${club.id}')" style="width: 100%;">
                    <i class="fas fa-info-circle"></i> Learn More
                </button>
                ${isMember 
                    ? `<div class="member-badge" style="width: 100%; justify-content: center; background: var(--success-color); color: white; padding: 0.75rem; border-radius: 8px; text-align: center;">
                        <i class="fas fa-check-circle"></i> ${isBureauMember ? 'Bureau Member' : 'You are a member'}
                    </div>`
                    : `<button class="btn btn-primary join-btn" onclick="joinClub('${club.id}', '${club.name}')" id="joinBtn-${club.id}" style="width: 100%;">
                        <i class="fas fa-user-plus"></i> Join ${club.name}
                    </button>`
                }
            </div>
        </div>
    `;
}

function createClubCard(club, isMember, memberCount) {
    return `
        <div class="club-card ${club.id}" style="background: var(--bg-color); border-radius: 12px; padding: 1.5rem; box-shadow: var(--shadow); transition: transform 0.3s, box-shadow 0.3s;">
            <div class="club-image" style="width: 100%; height: 200px; background: linear-gradient(135deg, ${club.color}, ${club.color}dd); display: flex; align-items: center; justify-content: center; font-size: 5rem; color: white; margin: -1.5rem -1.5rem 1rem -1.5rem; border-radius: 12px 12px 0 0;">
                <span>${club.imageIcon || club.emoji || '👥'}</span>
            </div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--primary-color);">${club.name}</h3>
            <p style="color: var(--text-color); opacity: 0.8; margin-bottom: 1rem; line-height: 1.6;">
                ${club.description ? club.description.substring(0, 120) + '...' : 'Join this club to learn more!'}
            </p>
            <div style="margin: 1rem 0; padding: 0.75rem; background: var(--card-bg); border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                <small style="color: var(--text-color); opacity: 0.7;">
                    <i class="fas fa-users"></i> ${memberCount} members
                </small>
                <i class="${club.icon || 'fas fa-users'}" style="color: ${club.color}; font-size: 1.5rem;"></i>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-direction: column;">
                <button class="btn btn-outline" onclick="viewClubDetails('${club.id}')" style="width: 100%;">
                    <i class="fas fa-info-circle"></i> Learn More
                </button>
                ${isMember 
                    ? `<div class="member-badge" style="width: 100%; justify-content: center; background: var(--success-color); color: white; padding: 0.75rem; border-radius: 8px; text-align: center;">
                        <i class="fas fa-check-circle"></i> You are a member
                    </div>`
                    : `<button class="btn btn-primary join-btn" onclick="joinClub('${club.id}', '${club.name}')" id="joinBtn-${club.id}" style="width: 100%;">
                        <i class="fas fa-user-plus"></i> Join ${club.name}
                    </button>`
                }
            </div>
        </div>
    `;
}

async function getMemberCounts() {
    try {
        const memberships = getLocalStorageData('club_memberships') || [];
        const counts = {};
        
        memberships.forEach(m => {
            counts[m.club_id] = (counts[m.club_id] || 0) + 1;
        });
        
        return counts;
    } catch (error) {
        console.error('Error getting member counts:', error);
        return {};
    }
}

async function viewClubDetails(clubId) {
    if (typeof STATIC_CLUBS === 'undefined') {
        showNotification('Clubs data not loaded', 'error');
        return;
    }
    
    const club = STATIC_CLUBS.find(c => c.id === clubId);
    if (!club) return;
    
    const modal = document.getElementById('clubModal');
    const detailDiv = document.getElementById('clubDetail');
    if (!modal || !detailDiv) return;
    
    const isMember = userMemberships.some(m => m.club_id === clubId || m.club_id === club.name);
    
    detailDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="font-size: 5rem; margin-bottom: 1rem;">${club.imageIcon || club.emoji || '👥'}</div>
            <h2 style="color: ${club.color}; margin-bottom: 0.5rem;">${club.name}</h2>
            <i class="${club.icon || 'fas fa-users'}" style="color: ${club.color}; font-size: 2rem;"></i>
        </div>
        <div style="margin-bottom: 1.5rem;">
            <h3 style="margin-bottom: 0.5rem; color: var(--primary-color);">Description</h3>
            <p style="line-height: 1.8;">${club.description}</p>
        </div>
        <div style="margin-bottom: 1.5rem;">
            <h3 style="margin-bottom: 0.5rem; color: var(--primary-color);">Mission</h3>
            <p style="line-height: 1.8;">${club.mission}</p>
        </div>
        <div style="margin-bottom: 1.5rem;">
            <h3 style="margin-bottom: 0.5rem; color: var(--primary-color);">Fields of Interest</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${club.fields.map(field => `
                    <span style="background: ${club.color}20; color: ${club.color}; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">
                        ${field}
                    </span>
                `).join('')}
            </div>
        </div>
        <div style="margin-top: 2rem; display: flex; gap: 1rem; padding-top: 1rem; border-top: 2px solid var(--border-color);">
            ${isMember 
                ? `<button class="btn btn-primary" disabled style="flex: 1;">
                    <i class="fas fa-check"></i> You are a member
                </button>`
                : `<button class="btn btn-primary" onclick="joinClub('${club.id}', '${club.name}'); closeClubModal();" style="flex: 1;">
                    <i class="fas fa-user-plus"></i> Join ${club.name}
                </button>`
            }
            <a href="events.html?club=${club.id}" class="btn btn-outline" style="flex: 1; text-align: center;">
                <i class="fas fa-calendar"></i> View Events
            </a>
        </div>
    `;
    
    modal.style.display = 'block';
    
    // Scroll modal to top when opened
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.scrollTop = 0;
    }
}

function closeClubModal() {
    const modal = document.getElementById('clubModal');
    if (modal) modal.style.display = 'none';
}

async function joinClub(clubId, clubName) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
        showNotification('Please login to join a club', 'error');
        if (typeof showLogin === 'function') showLogin();
        return;
    }
    
    const isMember = userMemberships.some(m => m.club_id === clubId || m.club_id === clubName);
    if (isMember) {
        showNotification('You are already a member of this club', 'error');
        return;
    }
    
    try {
        const memberships = getLocalStorageData('club_memberships') || [];
        const newMembership = {
            id: Date.now().toString(),
            user_id: user.id,
            club_id: clubId,
            club_name: clubName,
            joined_at: new Date().toISOString()
        };
        
        memberships.push(newMembership);
        setLocalStorageData('club_memberships', memberships);
        
        showNotification(`Successfully joined ${clubName}! 🎉 Check your profile to see your memberships.`, 'success');
        await loadUserMemberships();
        await loadClubs();
        
        // Refresh profile if on profile page
        if (window.location.pathname.includes('profile.html')) {
            setTimeout(() => location.reload(), 1000);
        }
    } catch (error) {
        console.error('Error joining club:', error);
        showNotification('Error joining club', 'error');
    }
}

async function loadUserMemberships() {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) {
            userMemberships = [];
            return;
        }
        
        const memberships = getLocalStorageData('club_memberships') || [];
        userMemberships = memberships.filter(m => m.user_id === user.id);
    } catch (error) {
        console.error('Error loading memberships:', error);
        userMemberships = [];
    }
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('clubModal');
    if (e.target === modal && modal) {
        closeClubModal();
    }
});