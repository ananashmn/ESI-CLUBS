// Static Data - Works without database
const STATIC_CLUBS = [
    {
        id: 'jlm',
        name: 'JLM',
        icon: 'fas fa-users-cog',
        emoji: '👥',
        description: 'JLM (Junior Leaders Morocco) is a student organization focused on leadership development, entrepreneurship, and professional growth. We organize workshops, networking events, and competitions to help students develop their leadership skills and connect with industry professionals.',
        mission: 'Empowering students to become future leaders through practical experiences and professional development opportunities.',
        fields: ['Leadership', 'Entrepreneurship', 'Professional Development', 'Networking'],
        color: '#2563eb',
        imageIcon: '👥',
        active: true
    },
    {
        id: 'code-esi',
        name: 'CODE-ESI',
        icon: 'fas fa-laptop-code',
        emoji: '💻',
        description: 'CODE-ESI is the coding and programming club at ESI. We focus on software development, competitive programming, and technical skills enhancement. Join us for coding workshops, hackathons, algorithm training sessions, and collaborative projects.',
        mission: 'Promoting coding excellence and technical innovation among ESI students through hands-on learning and competitive programming.',
        fields: ['Programming', 'Algorithms', 'Web Development', 'Mobile Development', 'Competitive Programming'],
        color: '#10b981',
        imageIcon: '💻',
        active: true
    },
    {
        id: 'artesia',
        name: 'ARTESIA',
        icon: 'fas fa-palette',
        emoji: '🎨',
        description: 'ARTESIA is the arts and creativity club at ESI. We celebrate artistic expression through various mediums including digital art, photography, music, and design. We organize exhibitions, workshops, and creative competitions.',
        mission: 'Fostering creativity and artistic expression within the ESI community through various art forms and cultural activities.',
        fields: ['Digital Art', 'Photography', 'Music', 'Graphic Design', 'Cultural Events'],
        color: '#f59e0b',
        imageIcon: '🎨',
        active: true
    },
    {
        id: 'jcmp',
        name: 'JCMP',
        icon: 'fas fa-briefcase',
        emoji: '💼',
        description: 'JCMP (Junior Consulting Morocco Program) focuses on business consulting, case studies, and strategic thinking. We prepare students for consulting careers through real-world case analysis, business simulations, and industry partnerships.',
        mission: 'Developing strategic thinking and consulting skills through practical case studies and business challenges.',
        fields: ['Business Consulting', 'Case Studies', 'Strategic Planning', 'Business Analysis'],
        color: '#8b5cf6',
        imageIcon: '💼',
        active: true
    },
    {
        id: 'esi-tv',
        name: 'ESI-TV',
        icon: 'fas fa-video',
        emoji: '📹',
        description: 'ESI-TV is the media and broadcasting club responsible for covering campus events, creating video content, and managing the university\'s media presence. We produce documentaries, event coverage, interviews, and promotional videos.',
        mission: 'Documenting and promoting ESI activities through professional video production and media coverage.',
        fields: ['Video Production', 'Media Coverage', 'Documentary', 'Event Recording', 'Broadcasting'],
        color: '#ef4444',
        imageIcon: '📹',
        active: true
    }
];

const STATIC_EVENTS = [
    {
        id: '1',
        title: 'medDAYS 2025',
        description: 'Annual medical technology and health informatics event featuring workshops, conferences, and networking opportunities. Join us for a day of innovation and learning in medical technology. This event brings together students, professionals, and industry leaders.',
        date: '2025-11-29T09:00:00',
        club_name: 'General',
        club_id: null,
        type: 'conference',
        location: 'ESI Main Auditorium',
        status: 'published'
    },
    {
        id: '2',
        title: 'CODE-ESI Hackathon',
        description: '24-hour coding competition open to all students. Build innovative solutions and compete for prizes. Teams of up to 4 members can participate. Food and drinks provided.',
        date: '2025-12-15T10:00:00',
        club_name: 'CODE-ESI',
        club_id: 'code-esi',
        type: 'competition',
        location: 'ESI Computer Labs',
        status: 'published'
    },
    {
        id: '3',
        title: 'JLM Leadership Workshop',
        description: 'Learn essential leadership skills and network with industry professionals. Topics include team management, communication, strategic thinking, and conflict resolution.',
        date: '2025-11-10T14:00:00',
        club_name: 'JLM',
        club_id: 'jlm',
        type: 'workshop',
        location: 'ESI Conference Room',
        status: 'published'
    },
    {
        id: '4',
        title: 'ARTESIA Digital Art Exhibition',
        description: 'Showcase of student digital art projects and creative works. Open to all students and visitors. Vote for your favorite artwork!',
        date: '2025-12-05T16:00:00',
        club_name: 'ARTESIA',
        club_id: 'artesia',
        type: 'social',
        location: 'ESI Gallery',
        status: 'published'
    },
    {
        id: '5',
        title: 'JCMP Case Study Competition',
        description: 'Business case study competition. Analyze real-world business problems and present your solutions to industry judges. Great opportunity to showcase your analytical skills.',
        date: '2025-11-20T09:00:00',
        club_name: 'JCMP',
        club_id: 'jcmp',
        type: 'competition',
        location: 'ESI Business Hall',
        status: 'published'
    },
    {
        id: '6',
        title: 'ESI-TV Documentary Screening',
        description: 'Screening of student-produced documentaries followed by Q&A with the creators. Explore different perspectives and storytelling techniques.',
        date: '2025-12-10T18:00:00',
        club_name: 'ESI-TV',
        club_id: 'esi-tv',
        type: 'social',
        location: 'ESI Media Center',
        status: 'published'
    },
    {
        id: '7',
        title: 'Web Development Bootcamp',
        description: 'Intensive 3-day bootcamp covering HTML, CSS, JavaScript, and React. Perfect for beginners and intermediate developers.',
        date: '2025-11-25T09:00:00',
        club_name: 'CODE-ESI',
        club_id: 'code-esi',
        type: 'workshop',
        location: 'ESI Lab 3',
        status: 'published'
    },
    {
        id: '8',
        title: 'Entrepreneurship Panel Discussion',
        description: 'Panel discussion with successful entrepreneurs sharing their journey, challenges, and advice for aspiring business owners.',
        date: '2025-12-01T15:00:00',
        club_name: 'JLM',
        club_id: 'jlm',
        type: 'workshop',
        location: 'ESI Conference Hall',
        status: 'published'
    }
];

const STATIC_RESOURCES = [
    {
        id: '1',
        title: 'JavaScript Complete Guide',
        description: 'Comprehensive JavaScript tutorial covering ES6+, async/await, and modern JavaScript patterns.',
        type: 'video',
        club_id: 'code-esi',
        difficulty: 'beginner',
        file_url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
        resource_type: 'youtube'
    },
    {
        id: '2',
        title: 'React Hooks Cheat Sheet',
        description: 'Quick reference guide for React Hooks including useState, useEffect, and custom hooks.',
        type: 'cheat_sheet',
        club_id: 'code-esi',
        difficulty: 'intermediate',
        file_url: 'https://react.dev/reference/react',
        resource_type: 'link'
    },
    {
        id: '3',
        title: 'Web Development PDF Guide',
        description: 'Complete guide to web development from HTML basics to advanced JavaScript concepts.',
        type: 'lesson',
        club_id: 'code-esi',
        difficulty: 'beginner',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        resource_type: 'pdf'
    },
    {
        id: '4',
        title: 'Leadership Principles Video',
        description: 'Learn core principles of effective leadership and team management from industry experts.',
        type: 'lecture',
        club_id: 'jlm',
        difficulty: 'intermediate',
        file_url: 'https://www.youtube.com/watch?v=8S0FDjFBj8o',
        resource_type: 'youtube'
    },
    {
        id: '5',
        title: 'Python Programming Tutorial',
        description: 'Complete Python programming course for beginners. Learn Python from scratch.',
        type: 'video',
        club_id: 'code-esi',
        difficulty: 'beginner',
        file_url: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
        resource_type: 'youtube'
    },
    {
        id: '6',
        title: 'Business Case Study Template',
        description: 'Template and guide for analyzing business cases and presenting solutions.',
        type: 'lesson',
        club_id: 'jcmp',
        difficulty: 'advanced',
        file_url: 'https://hbr.org/resources/images/article_assets/2019/11/Nov19_14_sb10067980dd-001.jpg',
        resource_type: 'link'
    },
    {
        id: '7',
        title: 'Digital Art Techniques',
        description: 'Learn digital art techniques including Photoshop, Illustrator, and digital painting.',
        type: 'video',
        club_id: 'artesia',
        difficulty: 'intermediate',
        file_url: 'https://www.youtube.com/watch?v=0VqTwnAuHws',
        resource_type: 'youtube'
    },
    {
        id: '8',
        title: 'Video Editing Basics',
        description: 'Introduction to video editing with Adobe Premiere Pro and Final Cut Pro.',
        type: 'lecture',
        club_id: 'esi-tv',
        difficulty: 'beginner',
        file_url: 'https://www.youtube.com/watch?v=AEa1q_9vK_0',
        resource_type: 'youtube'
    },
    {
        id: '9',
        title: 'Data Structures & Algorithms',
        description: 'Comprehensive guide to data structures and algorithms with code examples.',
        type: 'lesson',
        club_id: 'code-esi',
        difficulty: 'advanced',
        file_url: 'https://www.geeksforgeeks.org/data-structures/',
        resource_type: 'link'
    },
    {
        id: '10',
        title: 'CSS Grid & Flexbox Tutorial',
        description: 'Master CSS Grid and Flexbox for modern web layouts. Includes practical examples.',
        type: 'video',
        club_id: 'code-esi',
        difficulty: 'intermediate',
        file_url: 'https://www.youtube.com/watch?v=9zBsdzdE4sM',
        resource_type: 'youtube'
    }
];

const STATIC_FAQS = [
    {
        id: '1',
        question: "How do I join a club?",
        answer: "To join a club, simply navigate to the Clubs page, browse available clubs, and click the 'Join Club' button on any club you're interested in. You must be logged in with your @esi.ac.ma email to join.",
        category: "membership"
    },
    {
        id: '2',
        question: "What is the difference between a Student and a Club Bureau Member?",
        answer: "Students have basic access to view events, resources, and participate in discussions. Club Bureau Members have administrative access to create events, upload resources, moderate chat, and manage FAQ entries.",
        category: "platform"
    },
    {
        id: '3',
        question: "Can I join multiple clubs?",
        answer: "Yes! You can join as many clubs as you want. Each club membership gives you access to that club's exclusive content and events.",
        category: "membership"
    },
    {
        id: '4',
        question: "What is medDAYS?",
        answer: "medDAYS is a major annual event organized at ESI, typically held in November. It features medical technology, health informatics, and related topics. The event includes workshops, conferences, networking opportunities, and presentations from industry professionals.",
        category: "events"
    },
    {
        id: '5',
        question: "How do I register for an event?",
        answer: "Browse the Events page, find an event you're interested in, and click on it to view details. If registration is available, you'll see a 'Register' button on the event details page.",
        category: "events"
    },
    {
        id: '6',
        question: "What kind of resources are available?",
        answer: "The platform offers various educational resources including lessons (PDFs, slides, articles), lecture recordings, cheat sheets for programming languages and tools, YouTube videos, and other learning materials organized by club and topic.",
        category: "resources"
    },
    {
        id: '7',
        question: "How do I access club-specific content?",
        answer: "Once you join a club, you'll have access to that club's exclusive resources, events, and chat channels. Navigate to the Resources or Events page and filter by your club to see club-specific content.",
        category: "clubs"
    },
    {
        id: '8',
        question: "Can I download resources?",
        answer: "Yes, most resources are available for download or viewing. Click on any resource to view its details, and you'll find a download/view button. Resources can be YouTube videos, PDFs, or links to external content.",
        category: "resources"
    },
    {
        id: '9',
        question: "How do I become a Club Bureau Member?",
        answer: "Club Bureau Members are typically appointed by the club administration. If you're a current bureau member, you can register with the 'Club Bureau Member' role during account creation.",
        category: "membership"
    },
    {
        id: '10',
        question: "How do I report inappropriate content in chat?",
        answer: "If you encounter inappropriate content, you can report it to Club Bureau Members who have moderation tools. Bureau members can remove messages and manage chat channels.",
        category: "platform"
    },
    {
        id: '11',
        question: "How do I create a discussion topic in chat?",
        answer: "Click the '+' button next to 'Channels' in the chat sidebar. Enter a topic name, optional description, and optionally link it to a club. Once created, the topic will appear in the Topics section.",
        category: "platform"
    },
    {
        id: '12',
        question: "What happens when I join a club?",
        answer: "When you join a club, you become a member and gain access to club-specific resources, events, and chat channels. You'll also receive notifications about club activities.",
        category: "membership"
    }
];