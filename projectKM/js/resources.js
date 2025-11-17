document.addEventListener('DOMContentLoaded', async () => {
    await loadResources();
    checkBureauAccess();
    
    const form = document.getElementById('addResourceForm');
    if (form) {
        form.addEventListener('submit', handleAddResource);
    }
});

async function loadResources() {
    const container = document.getElementById('resourcesContainer');
    if (!container) return;
    
    const allResources = getLocalStorageData('resources') || [];
    const staticResources = STATIC_RESOURCES;
    
    // Merge static and user-created resources
    const allResourcesList = [...staticResources];
    allResources.forEach(resource => {
        if (!staticResources.find(r => r.id === resource.id)) {
            allResourcesList.push(resource);
        }
    });
    
    if (allResourcesList.length === 0) {
        container.innerHTML = '<p class="loading">No resources available yet</p>';
        return;
    }
    
    container.innerHTML = allResourcesList.map(resource => createResourceCard(resource)).join('');
}

function createResourceCard(resource) {
    const typeIcons = {
        lesson: 'fas fa-book',
        lecture: 'fas fa-video',
        cheat_sheet: 'fas fa-file-alt',
        video: 'fas fa-video'
    };
    
    const difficultyColors = {
        beginner: '#10b981',
        intermediate: '#f59e0b',
        advanced: '#ef4444'
    };
    
    const getResourceButton = () => {
        if (!resource.file_url) return '';
        
        if (resource.resource_type === 'youtube' || resource.file_url.includes('youtube.com') || resource.file_url.includes('youtu.be')) {
            const videoId = extractYouTubeId(resource.file_url);
            return `
                <a href="${resource.file_url}" target="_blank" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">
                    <i class="fab fa-youtube"></i> Watch on YouTube
                </a>
            `;
        } else if (resource.resource_type === 'pdf' || resource.file_url.includes('.pdf')) {
            return `
                <a href="${resource.file_url}" target="_blank" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">
                    <i class="fas fa-file-pdf"></i> View PDF
                </a>
            `;
        } else {
            return `
                <a href="${resource.file_url}" target="_blank" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">
                    <i class="fas fa-external-link-alt"></i> Open Resource
                </a>
            `;
        }
    };
    
    return `
        <div class="resource-card" style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; box-shadow: var(--shadow);">
            <div style="display: flex; align-items: start; gap: 1rem; margin-bottom: 1rem;">
                <i class="${typeIcons[resource.type] || 'fas fa-file'}" style="font-size: 2rem; color: var(--primary-color);"></i>
                <div style="flex: 1;">
                    <h3 style="margin-bottom: 0.5rem; color: var(--primary-color);">${resource.title}</h3>
                    <p style="color: var(--text-color); opacity: 0.8; margin-bottom: 0.5rem;">${resource.description || ''}</p>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
                        ${resource.club_id ? `<span style="background: var(--primary-color)20; color: var(--primary-color); padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem;">${resource.club_id.toUpperCase()}</span>` : ''}
                        <span style="background: ${difficultyColors[resource.difficulty] || '#6b7280'}20; color: ${difficultyColors[resource.difficulty] || '#6b7280'}; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; text-transform: capitalize;">${resource.difficulty || 'N/A'}</span>
                        <span style="background: var(--bg-color); color: var(--text-color); padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; text-transform: capitalize;">${resource.type.replace('_', ' ')}</span>
                    </div>
                </div>
            </div>
            ${getResourceButton()}
        </div>
    `;
}

function extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function checkBureauAccess() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const bureauActions = document.getElementById('bureauActions');
    
    if (bureauActions && user.role === 'bureau') {
        bureauActions.style.display = 'block';
    }
}

function showAddResource() {
    document.getElementById('addResourceModal').style.display = 'block';
}

function closeAddResource() {
    document.getElementById('addResourceModal').style.display = 'none';
    const form = document.getElementById('addResourceForm');
    if (form) form.reset();
}

async function handleAddResource(e) {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
        showNotification('Please login to add resources', 'error');
        return;
    }
    
    if (user.role !== 'bureau') {
        showNotification('Only Club Bureau Members can add resources', 'error');
        return;
    }
    
    const fileUrl = document.getElementById('resourceFileUrl').value;
    let resourceType = 'link';
    
    if (fileUrl.includes('youtube.com') || fileUrl.includes('youtu.be')) {
        resourceType = 'youtube';
    } else if (fileUrl.includes('.pdf')) {
        resourceType = 'pdf';
    }
    
    const resourceData = {
        id: Date.now().toString(),
        title: document.getElementById('resourceTitle').value,
        description: document.getElementById('resourceDescription').value,
        type: document.getElementById('resourceType').value,
        club_id: document.getElementById('resourceClub').value || null,
        difficulty: document.getElementById('resourceDifficulty').value,
        file_url: fileUrl,
        resource_type: resourceType,
        created_by: user.id,
        created_at: new Date().toISOString()
    };
    
    const allResources = getLocalStorageData('resources') || [];
    allResources.push(resourceData);
    setLocalStorageData('resources', allResources);
    
    showNotification('Resource added successfully!', 'success');
    closeAddResource();
    await loadResources();
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('addResourceModal');
    if (e.target === modal && modal) {
        closeAddResource();
    }
});