const DEFAULT_FAQS = [
    {
        question: "How do I join a club?",
        answer: "To join a club, simply navigate to the Clubs page, browse available clubs, and click the 'Join Club' button on any club you're interested in. You must be logged in with your @esi.ac.ma email to join.",
        category: "membership"
    },
    {
        question: "What is the difference between a Student and a Club Bureau Member?",
        answer: "Students have basic access to view events, resources, and participate in discussions. Club Bureau Members have administrative access to create events, upload resources, moderate chat, and manage FAQ entries.",
        category: "platform"
    },
    {
        question: "Can I join multiple clubs?",
        answer: "Yes! You can join as many clubs as you want. Each club membership gives you access to that club's exclusive content and events.",
        category: "membership"
    },
    {
        question: "How do I register for an event?",
        answer: "Browse the Events page, find an event you're interested in, and click on it to view details. If registration is available, you'll see a 'Register' button on the event details page.",
        category: "events"
    },
    {
        question: "What kind of resources are available?",
        answer: "The platform offers various educational resources including lessons (PDFs, slides, articles), lecture recordings, cheat sheets for programming languages and tools, and other learning materials organized by club and topic.",
        category: "resources"
    },
    {
        question: "How do I access club-specific content?",
        answer: "Once you join a club, you'll have access to that club's exclusive resources, events, and chat channels. Navigate to the Resources or Events page and filter by your club to see club-specific content.",
        category: "clubs"
    },
    {
        question: "Can I download resources?",
        answer: "Yes, most resources are available for download. Click on any resource to view its details, and you'll find a download button if the resource is downloadable.",
        category: "resources"
    },
    {
        question: "How do I become a Club Bureau Member?",
        answer: "Club Bureau Members are typically appointed by the club administration. If you're a current bureau member, you can register with the 'Club Bureau Member' role during account creation.",
        category: "membership"
    },
    {
        question: "What is medDAYS?",
        answer: "medDAYS is a major annual event organized at ESI, typically featuring medical technology, health informatics, and related topics. It includes workshops, conferences, and networking opportunities.",
        category: "events"
    },
    {
        question: "How do I report inappropriate content in chat?",
        answer: "If you encounter inappropriate content, you can report it to Club Bureau Members who have moderation tools. Bureau members can remove messages and manage chat channels.",
        category: "platform"
    }
];

document.addEventListener('DOMContentLoaded', async () => {
    await loadFAQs();
    await checkBureauAccess();
    
    const searchInput = document.getElementById('faqSearch');
    if (searchInput) {
        searchInput.addEventListener('input', filterFAQs);
    }
    
    const form = document.getElementById('addFAQForm');
    if (form) {
        form.addEventListener('submit', handleAddFAQ);
    }
});

async function loadFAQs() {
    const container = document.getElementById('faqContainer');
    const client = initSupabase();
    
    try {
        const { data, error } = await client
            .from('faq')
            .select('*')
            .order('category', { ascending: true });
        
        if (error) throw error;
        
        const faqs = data && data.length > 0 ? data : DEFAULT_FAQS;
        displayFAQs(faqs);
    } catch (error) {
        // Fallback to default FAQs
        displayFAQs(DEFAULT_FAQS);
        console.error('Error loading FAQs:', error);
    }
}

function displayFAQs(faqs) {
    const container = document.getElementById('faqContainer');
    
    // Group by category
    const grouped = faqs.reduce((acc, faq) => {
        const cat = faq.category || 'general';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(faq);
        return acc;
    }, {});
    
    container.innerHTML = Object.entries(grouped).map(([category, items]) => `
        <div class="faq-category">
            <h2 style="color: var(--primary-color); margin-bottom: 1rem; text-transform: capitalize;">
                ${category}
            </h2>
            <div class="faq-items">
                ${items.map((faq, index) => `
                    <div class="faq-item">
                        <div class="faq-question" onclick="toggleFAQ(${index}, '${category}')">
                            <span>${faq.question}</span>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div class="faq-answer" id="faq-${category}-${index}">
                            <p>${faq.answer}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function toggleFAQ(index, category) {
    const answer = document.getElementById(`faq-${category}-${index}`);
    const question = answer.previousElementSibling;
    const icon = question.querySelector('i');
    
    answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
    icon.style.transform = answer.style.display === 'block' ? 'rotate(180deg)' : 'rotate(0deg)';
}

function filterFAQs() {
    const searchTerm = document.getElementById('faqSearch').value.toLowerCase();
    const items = document.querySelectorAll('.faq-item');
    
    items.forEach(item => {
        const question = item.querySelector('.faq-question span').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
        
        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

async function checkBureauAccess() {
    const client = initSupabase();
    const { data: { session } } = await client.auth.getSession();
    
    if (session) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.user_metadata?.role === 'bureau') {
            document.getElementById('bureauActions').style.display = 'block';
        }
    }
}

function showAddFAQ() {
    document.getElementById('addFAQModal').style.display = 'block';
}

function closeAddFAQ() {
    document.getElementById('addFAQModal').style.display = 'none';
}

async function handleAddFAQ(e) {
    e.preventDefault();
    
    const client = initSupabase();
    const { data: { session } } = await client.auth.getSession();
    
    if (!session) {
        showNotification('You must be logged in', 'error');
        return;
    }
    
    const faqData = {
        question: document.getElementById('faqQuestion').value,
        answer: document.getElementById('faqAnswer').value,
        category: document.getElementById('faqCategory').value,
        created_by: session.user.id
    };
    
    try {
        const { error } = await client.from('faq').insert([faqData]);
        
        if (error) throw error;
        
        showNotification('FAQ added successfully', 'success');
        closeAddFAQ();
        document.getElementById('addFAQForm').reset();
        await loadFAQs();
    } catch (error) {
        showNotification('Error adding FAQ: ' + error.message, 'error');
        console.error(error);
    }
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('addFAQModal');
    if (e.target === modal) {
        closeAddFAQ();
    }
});