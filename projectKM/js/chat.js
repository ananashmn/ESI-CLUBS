let currentChannel = 'general';

const CHANNEL_DESCRIPTIONS = {
    'general': 'General discussion for all ESI students',
    'code-esi': 'CODE-ESI club discussions and coding topics',
    'jlm': 'JLM club - Leadership and entrepreneurship',
    'artesia': 'ARTESIA club - Arts and creativity',
    'jcmp': 'JCMP club - Business consulting discussions',
    'esi-tv': 'ESI-TV club - Media and broadcasting'
};

document.addEventListener('DOMContentLoaded', async () => {
    await checkAuthForChat();
    if (document.getElementById('chatContainer').style.display !== 'none') {
        await loadMessages();
    }
});

async function checkAuthForChat() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (user.id) {
        document.getElementById('chatContainer').style.display = 'grid';
        document.getElementById('loginPrompt').style.display = 'none';
    } else {
        document.getElementById('chatContainer').style.display = 'none';
        document.getElementById('loginPrompt').style.display = 'block';
    }
}

function switchChannel(channel) {
    currentChannel = channel;
    
    // Update active channel
    document.querySelectorAll('.channel-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeItem = document.querySelector(`[data-channel="${channel}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
    
    // Update header
    document.getElementById('currentChannelName').textContent = 
        channel.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    document.getElementById('channelDescription').textContent = 
        CHANNEL_DESCRIPTIONS[channel] || 'Discussion channel';
    
    loadMessages();
}

async function loadMessages() {
    const container = document.getElementById('chatMessages');
    const allMessages = getLocalStorageData('chat_messages') || [];
    
    const messages = allMessages
        .filter(msg => msg.channel === currentChannel)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    
    if (messages.length === 0) {
        container.innerHTML = '<p style="text-align: center; opacity: 0.7; padding: 2rem;">No messages yet. Start the conversation!</p>';
        return;
    }
    
    container.innerHTML = messages.map(msg => createMessageElement(msg)).join('');
    scrollToBottom();
}

function createMessageElement(msg) {
    const time = new Date(msg.created_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const userEmail = msg.user_email || 'Anonymous';
    const displayName = userEmail.split('@')[0];
    
    return `
        <div class="message">
            <div class="message-header">
                <span class="message-author">${escapeHtml(displayName)}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-content">${escapeHtml(msg.message)}</div>
        </div>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!user.id) {
        showNotification('Please login to send messages', 'error');
        if (typeof showLogin === 'function') showLogin();
        return;
    }
    
    const allMessages = getLocalStorageData('chat_messages') || [];
    const newMessage = {
        id: Date.now().toString(),
        channel: currentChannel,
        user_id: user.id,
        user_email: user.email,
        message: message,
        created_at: new Date().toISOString()
    };
    
    allMessages.push(newMessage);
    setLocalStorageData('chat_messages', allMessages);
    
    input.value = '';
    await loadMessages();
}

function scrollToBottom() {
    const container = document.getElementById('chatMessages');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}