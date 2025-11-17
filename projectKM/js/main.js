document.addEventListener('DOMContentLoaded', async () => {
    await loadUpcomingEvents();
    await loadActiveClubs();
    await loadStats();
});

async function loadUpcomingEvents() {
    const container = document.getElementById('upcomingEvents');
    if (!container) return;
    
    // Get all events from localStorage and static
    const allEvents = getLocalStorageData('events') || [];
    const staticEvents = STATIC_EVENTS || [];
    const allEventsList = [...staticEvents];
    
    // Add user-created events that aren't duplicates
    allEvents.forEach(event => {
        if (!staticEvents.find(e => e.id === event.id)) {
            allEventsList.push(event);
        }
    });
    
    // Filter and sort upcoming events
    const events = allEventsList
        .filter(e => {
            if (!e.status || e.status === 'published') {
                const eventDate = new Date(e.date);
                return eventDate >= new Date();
            }
            return false;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 6);
    
    if (events.length === 0) {
        container.innerHTML = '<p class="loading">No upcoming events. Check back soon!</p>';
        return;
    }
    
    container.innerHTML = events.map(event => `
        <div class="event-card">
            <h3>${event.title}</h3>
            <p class="event-date"><i class="fas fa-calendar"></i> ${formatDate(event.date)}</p>
            <p class="event-club"><i class="fas fa-users"></i> ${event.club_name || 'General'}</p>
            <p style="margin-top: 0.5rem;">${event.description ? event.description.substring(0, 100) + '...' : 'Join us for this exciting event!'}</p>
            <a href="pages/events.html" class="btn btn-outline" style="margin-top: 1rem; display: inline-block;">View All Events</a>
        </div>
    `).join('');
}

async function loadActiveClubs() {
    const container = document.getElementById('activeClubs');
    if (!container) return;
    
    const clubs = STATIC_CLUBS ? STATIC_CLUBS.filter(c => c.active) : [];
    
    if (clubs.length === 0) {
        container.innerHTML = '<p class="loading">No active clubs</p>';
        return;
    }
    
    container.innerHTML = clubs.map(club => `
        <div class="club-card" style="text-align: center; cursor: pointer;" onclick="window.location.href='pages/clubs.html'">
            <div style="font-size: 4rem; margin-bottom: 1rem;">${club.imageIcon || club.emoji || '👥'}</div>
            <h3 style="color: var(--primary-color); margin-bottom: 0.5rem;">${club.name}</h3>
            <p style="opacity: 0.8; margin-bottom: 1rem; line-height: 1.6;">${club.description ? club.description.substring(0, 100) + '...' : 'Join this club to learn more!'}</p>
            <a href="pages/clubs.html" class="btn btn-outline">View All Clubs</a>
        </div>
    `).join('');
}

async function loadStats() {
    const statsContainer = document.getElementById('statsContainer');
    if (!statsContainer) return;
    
    const allEvents = getLocalStorageData('events') || [];
    const allResources = getLocalStorageData('resources') || [];
    const allMemberships = getLocalStorageData('club_memberships') || [];
    
    const totalEvents = (STATIC_EVENTS ? STATIC_EVENTS.length : 0) + allEvents.length;
    const totalResources = (STATIC_RESOURCES ? STATIC_RESOURCES.length : 0) + allResources.length;
    const totalMembers = allMemberships.length;
    const activeClubs = STATIC_CLUBS ? STATIC_CLUBS.filter(c => c.active).length : 0;
    
    statsContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-top: 2rem;">
            <div style="text-align: center; padding: 2rem; background: var(--card-bg); border-radius: 12px; box-shadow: var(--shadow);">
                <div style="font-size: 3rem; color: var(--primary-color); margin-bottom: 0.5rem;">
                    <i class="fas fa-calendar-alt"></i>
                </div>
                <h3 style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--primary-color);">${totalEvents}</h3>
                <p style="opacity: 0.8;">Total Events</p>
            </div>
            <div style="text-align: center; padding: 2rem; background: var(--card-bg); border-radius: 12px; box-shadow: var(--shadow);">
                <div style="font-size: 3rem; color: var(--primary-color); margin-bottom: 0.5rem;">
                    <i class="fas fa-book"></i>
                </div>
                <h3 style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--primary-color);">${totalResources}</h3>
                <p style="opacity: 0.8;">Resources</p>
            </div>
            <div style="text-align: center; padding: 2rem; background: var(--card-bg); border-radius: 12px; box-shadow: var(--shadow);">
                <div style="font-size: 3rem; color: var(--primary-color); margin-bottom: 0.5rem;">
                    <i class="fas fa-users"></i>
                </div>
                <h3 style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--primary-color);">${totalMembers}</h3>
                <p style="opacity: 0.8;">Club Members</p>
            </div>
            <div style="text-align: center; padding: 2rem; background: var(--card-bg); border-radius: 12px; box-shadow: var(--shadow);">
                <div style="font-size: 3rem; color: var(--primary-color); margin-bottom: 0.5rem;">
                    <i class="fas fa-university"></i>
                </div>
                <h3 style="font-size: 2rem; margin-bottom: 0.5rem; color: var(--primary-color);">${activeClubs}</h3>
                <p style="opacity: 0.8;">Active Clubs</p>
            </div>
        </div>
    `;
}