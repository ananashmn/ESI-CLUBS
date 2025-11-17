document.addEventListener('DOMContentLoaded', async () => {
    await loadEvents();
    checkBureauAccess();
    
    const form = document.getElementById('createEventForm');
    if (form) {
        form.addEventListener('submit', handleCreateEvent);
    }
});

async function loadEvents() {
    const container = document.getElementById('eventsContainer');
    if (!container) return;
    
    const allEvents = getLocalStorageData('events') || [];
    const staticEvents = STATIC_EVENTS;
    
    // Merge static and user-created events
    const allEventsList = [...staticEvents];
    allEvents.forEach(event => {
        if (!staticEvents.find(e => e.id === event.id)) {
            allEventsList.push(event);
        }
    });
    
    const events = allEventsList
        .filter(e => e.status === 'published')
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (events.length === 0) {
        container.innerHTML = '<p class="loading">No events found</p>';
        return;
    }
    
    container.innerHTML = events.map(event => `
        <div class="event-card">
            <h3>${event.title}</h3>
            <p class="event-date"><i class="fas fa-calendar"></i> ${formatDate(event.date)}</p>
            <p class="event-club"><i class="fas fa-users"></i> ${event.club_name || 'General'}</p>
            <p style="margin-top: 0.5rem;">${event.description}</p>
            ${event.location ? `<p style="margin-top: 0.5rem; opacity: 0.7;"><i class="fas fa-map-marker-alt"></i> ${event.location}</p>` : ''}
            <div style="margin-top: 1rem;">
                <span style="background: var(--primary-color)20; color: var(--primary-color); padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; text-transform: capitalize;">
                    ${event.type}
                </span>
            </div>
        </div>
    `).join('');
}

function checkBureauAccess() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const bureauActions = document.getElementById('bureauActions');
    
    if (bureauActions && user.role === 'bureau') {
        bureauActions.style.display = 'block';
    }
}

function showCreateEvent() {
    document.getElementById('createEventModal').style.display = 'block';
}

function closeCreateEvent() {
    document.getElementById('createEventModal').style.display = 'none';
    const form = document.getElementById('createEventForm');
    if (form) form.reset();
}

async function handleCreateEvent(e) {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
        showNotification('Please login to create events', 'error');
        return;
    }
    
    if (user.role !== 'bureau') {
        showNotification('Only Club Bureau Members can create events', 'error');
        return;
    }
    
    const eventData = {
        id: Date.now().toString(),
        title: document.getElementById('eventTitle').value,
        description: document.getElementById('eventDescription').value,
        date: document.getElementById('eventDate').value,
        club_id: document.getElementById('eventClub').value || null,
        club_name: document.getElementById('eventClub').selectedOptions[0]?.text || 'General',
        type: document.getElementById('eventType').value,
        location: document.getElementById('eventLocation').value || '',
        status: 'published',
        created_by: user.id,
        created_at: new Date().toISOString()
    };
    
    const allEvents = getLocalStorageData('events') || [];
    allEvents.push(eventData);
    setLocalStorageData('events', allEvents);
    
    showNotification('Event created successfully!', 'success');
    closeCreateEvent();
    await loadEvents();
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('createEventModal');
    if (e.target === modal && modal) {
        closeCreateEvent();
    }
});