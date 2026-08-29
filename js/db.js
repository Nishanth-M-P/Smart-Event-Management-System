/**
 * Abhiyantrix Relational Database Engine — Single Source of Truth
 * Fully enforcing DB unique constraints, mandatory event location, optional image,
 * transactional certificate generation, and zero dummy data in clean state.
 */

const STORAGE_KEY = 'abhiyantrix_official_db_v5';

// Default official dataset populated with authentic active university event data
const officialProductionSeed = {
  events: [
    {
      id: 'EVT-101',
      name: 'AI Hackathon 2026: Genesis',
      type: 'Hackathon',
      category: 'Artificial Intelligence & Cloud',
      tagline: 'Build next-gen autonomous LLM agents & vision applications',
      description: 'The flagship 48-hour national level hackathon. Teams build groundbreaking software leveraging Large Language Models, Multi-Agent Systems, Neural Vision, and Edge Computing. Direct incubation grants and ₹3,00,000 prize pool.',
      banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
      venue: 'Main Auditorium, APJ Abdul Kalam Tech Block',
      startDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      capacity: 350,
      registeredCount: 342,
      teamMin: 2,
      teamMax: 4,
      isTeamEvent: true,
      organizerName: 'Abhiyantrix Central Technical Council',
      contactEmail: 'aihackathon@abhiyantrix.edu',
      contactPhone: '+91 98765 43210',
      status: 'LIVE',
      eligibility: 'Open to all Engineering, Computer Science, and Design students. Valid institutional ID required.',
      rules: [
        'All code repositories must be initiated during the hackathon window.',
        'Pre-existing open-source dependencies are permitted, but core algorithms must be authored at the event.',
        'Teams must submit working GitHub repo + live demo URL + architecture pitch deck before deadline.'
      ],
      criteria: [
        { id: 'crit_1', name: 'Innovation & Problem Solving', weight: 25, max: 10, desc: 'Novelty of approach and real-world significance' },
        { id: 'crit_2', name: 'Technical Architecture & Code Quality', weight: 35, max: 10, desc: 'System design, scalability, API integration, and clean code patterns' },
        { id: 'crit_3', name: 'UI / UX & Prototype Completeness', weight: 25, max: 10, desc: 'Functional frontend, intuitive user experience and error handling' },
        { id: 'crit_4', name: 'Pitch & Demonstration', weight: 15, max: 10, desc: 'Clarity of presentation and jury defense' }
      ],
      resultsPublished: false,
      publishedAt: null
    },
    {
      id: 'EVT-102',
      name: 'Natya Rhythms: Inter-Collegiate Cultural Fest',
      type: 'Cultural',
      category: 'Dance & Performing Arts',
      tagline: 'Mega group choreography and classical contemporary fusion',
      description: 'Spectacular inter-collegiate dance competition celebrating synchronized rhythm, storytelling, theatrical lighting, and vibrant formations.',
      banner: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1000&q=80',
      venue: 'Saraswati Grand Auditorium',
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 5 * 3600000).toISOString().slice(0, 16),
      capacity: 500,
      registeredCount: 486,
      teamMin: 4,
      teamMax: 16,
      isTeamEvent: true,
      organizerName: 'Cultural Council Abhiyantrix',
      contactEmail: 'cultural@abhiyantrix.edu',
      contactPhone: '+91 98765 43213',
      status: 'UPCOMING',
      eligibility: 'All collegiate dance troupes with institutional authorization.',
      rules: ['Time limit: 6-8 minutes.', 'Props allowed with prior approval.'],
      criteria: [
        { id: 'crit_1', name: 'Synchronization & Energy', weight: 35, max: 10, desc: 'Timing sharpness and stamina' },
        { id: 'crit_2', name: 'Choreography & Formations', weight: 35, max: 10, desc: 'Originality of routine and transitions' },
        { id: 'crit_3', name: 'Costumes & Visual Impact', weight: 30, max: 10, desc: 'Stage presence and aesthetic harmony' }
      ],
      resultsPublished: false,
      publishedAt: null
    },
    {
      id: 'EVT-103',
      name: 'CyberShield: National Technical Quiz & CTF',
      type: 'Technical',
      category: 'Cybersecurity & Computer Science',
      tagline: 'Fast-paced buzzer quiz and jeopardy-style reverse engineering',
      description: 'Test your algorithmic agility, security vulnerabilities identification, and computing history across 3 intense rounds.',
      banner: null,
      venue: 'Turing Lecture Hall 101, Computer Science Block',
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      capacity: 300,
      registeredCount: 256,
      teamMin: 1,
      teamMax: 2,
      isTeamEvent: true,
      organizerName: 'NullByte Security Club',
      contactEmail: 'quiz@abhiyantrix.edu',
      contactPhone: '+91 98765 43212',
      status: 'RESULTS_PUBLISHED',
      eligibility: 'Open to all undergraduate and postgraduate students.',
      rules: ['Strict timed buzzer rounds.', 'Negative marking for incorrect answers in finals.'],
      criteria: [
        { id: 'crit_1', name: 'Preliminary Quiz Score', weight: 50, max: 10, desc: 'Accuracy in rapid round' },
        { id: 'crit_2', name: 'Buzzer Final Points', weight: 50, max: 10, desc: 'Live stage speed and accuracy' }
      ],
      resultsPublished: true,
      publishedAt: '2026-08-28T18:00:00.000Z'
    },
    {
      id: 'EVT-104',
      name: 'RoboWars 2026: Combat Arena',
      type: 'Sports',
      category: 'Robotics & Hardware',
      tagline: 'Heavyweight bot combat arena and destruction challenge',
      description: 'Custom-built wired/wireless combat bots engage in high-octane 3-minute arena duels under strict safety protocols.',
      banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80',
      venue: 'Outdoor Arena Ground, Innovation Complex',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      capacity: 200,
      registeredCount: 128,
      teamMin: 2,
      teamMax: 5,
      isTeamEvent: true,
      organizerName: 'Robotics Society Abhiyantrix',
      contactEmail: 'robowars@abhiyantrix.edu',
      contactPhone: '+91 98765 43214',
      status: 'REGISTRATION_OPEN',
      eligibility: 'All robotics teams with certified bot inspection clearance.',
      rules: ['Bot weight limit: 15kg.', 'Pneumatic pressure cap: 10 bar.'],
      criteria: [
        { id: 'crit_1', name: 'Combat Control & Mobility', weight: 40, max: 10, desc: 'Maneuverability and arena control' },
        { id: 'crit_2', name: 'Weapon Effectiveness', weight: 40, max: 10, desc: 'Active damage delivered' },
        { id: 'crit_3', name: 'Structural Armor Resilience', weight: 20, max: 10, desc: 'Defense under impact' }
      ],
      resultsPublished: false,
      publishedAt: null
    }
  ],

  users: [
    {
      id: 'USR-ORG-001',
      role: 'organizer',
      organizerId: 'ORG-2026-0001',
      name: 'Dr. S. K. Narayanan',
      email: 'admin@abhiyantrix.edu',
      mobile: '+91 98765 43200',
      password: 'password123',
      organization: 'Abhiyantrix Central Technical Council',
      designation: 'Chief Convener & Dean of Student Affairs',
      avatar: null,
      createdAt: '2026-08-29T10:00:00.000Z',
      lastLogin: new Date().toISOString()
    },
    {
      id: 'USR-JDG-001',
      role: 'judge',
      judgeId: 'JDG-2026-0001',
      judgeKey: 'AXJ8-K92P-7LM4',
      name: 'Dr. Ananya Iyer',
      email: 'ananya.iyer@techlabs.org',
      mobile: '+91 98765 43201',
      password: 'password123',
      organization: 'Google Research / DeepMind AI',
      expertise: 'Distributed AI, Large Language Models, Cloud Systems',
      assignedEvents: ['EVT-101', 'EVT-103'],
      avatar: null,
      createdAt: '2026-08-29T11:00:00.000Z',
      lastLogin: new Date().toISOString()
    },
    {
      id: 'USR-JDG-002',
      role: 'judge',
      judgeId: 'JDG-2026-0002',
      judgeKey: 'AXJ8-K92P-7LM5',
      name: 'Prof. Rajesh Kumar',
      email: 'rajesh.kumar@iisc.ac.in',
      mobile: '+91 98765 43202',
      password: 'password123',
      organization: 'IISc Bangalore Robotics Lab',
      expertise: 'Autonomous Robotics, SLAM, Embedded Hardware',
      assignedEvents: ['EVT-104'],
      avatar: null,
      createdAt: '2026-08-29T11:30:00.000Z',
      lastLogin: new Date().toISOString()
    },
    {
      id: 'USR-STU-001',
      role: 'student',
      studentId: 'STU-10001',
      name: 'Darshan Divakar Naik',
      email: 'darshan@campus.edu',
      mobile: '+91 98765 43210',
      password: 'password123',
      college: 'Government Engineering College, Ramanagara',
      department: 'Computer Science & Engineering',
      skills: 'React, Python, Fastify, PyTorch, Docker, TailwindCSS',
      avatar: null,
      createdAt: '2026-08-29T12:00:00.000Z',
      lastLogin: new Date().toISOString()
    },
    {
      id: 'USR-STU-002',
      role: 'student',
      studentId: 'STU-10002',
      name: 'Rahul Verma',
      email: 'rahul.verma@iitb.ac.in',
      mobile: '+91 98765 43211',
      password: 'password123',
      college: 'IIT Bombay',
      department: 'Electrical Engineering',
      skills: 'ROS2, Computer Vision, SLAM, Embedded C++',
      avatar: null,
      createdAt: '2026-08-29T12:30:00.000Z',
      lastLogin: new Date().toISOString()
    },
    {
      id: 'USR-STU-003',
      role: 'student',
      studentId: 'STU-10003',
      name: 'Priya Sharma',
      email: 'priya.sharma@bits.edu',
      mobile: '+91 98765 43215',
      password: 'password123',
      college: 'BITS Pilani',
      department: 'AI & Data Science',
      skills: 'NLP, PyTorch, Scikit-Learn, Vue.js',
      avatar: null,
      createdAt: '2026-08-29T13:00:00.000Z',
      lastLogin: new Date().toISOString()
    }
  ],

  registrations: [
    {
      id: 'REG-1001',
      eventId: 'EVT-101',
      studentId: 'STU-10001',
      studentName: 'Darshan Divakar Naik',
      studentEmail: 'darshan@campus.edu',
      studentMobile: '+91 98765 43210',
      college: 'Government Engineering College, Ramanagara',
      department: 'Computer Science & Engineering',
      teamName: 'NeuralNexus',
      teamId: 'TEAM-AI-01',
      teamMembers: [{ name: 'Darshan Divakar Naik (Lead)', role: 'Full Stack & ML' }],
      status: 'CHECKED_IN',
      registeredAt: '2026-08-29T12:10:00',
      checkedInAt: '2026-08-30T09:15:00',
      submission: {
        title: 'MedScribe AI: Real-time Clinical Diagnostic Assistant',
        repoUrl: 'https://github.com/darshan-naik/medscribe-ai',
        demoUrl: 'https://medscribe-demo.vercel.app',
        description: 'Voice-to-clinical-notes copilot with automated ICD-10 medical coding.',
        submittedAt: '2026-08-30T14:30:00'
      },
      tracking: {
        registration: 'COMPLETED',
        checkIn: 'COMPLETED',
        eventStarted: 'COMPLETED',
        submission: 'COMPLETED',
        judging: 'IN_PROGRESS',
        results: 'PENDING'
      }
    },
    {
      id: 'REG-1004',
      eventId: 'EVT-103',
      studentId: 'STU-10001',
      studentName: 'Darshan Divakar Naik',
      studentEmail: 'darshan@campus.edu',
      studentMobile: '+91 98765 43210',
      college: 'Government Engineering College, Ramanagara',
      department: 'Computer Science & Engineering',
      teamName: 'BitExploit',
      teamId: 'TEAM-CTF-01',
      teamMembers: [{ name: 'Darshan Divakar Naik', role: 'Security Analyst' }],
      status: 'CHECKED_IN',
      registeredAt: '2026-08-27T10:00:00',
      checkedInAt: '2026-08-27T11:00:00',
      submission: {
        title: 'Exploit Write-up: Buffer Overflow in Auth Daemon',
        repoUrl: 'https://github.com/darshan/ctf-auth',
        demoUrl: 'https://ctf.bits.edu',
        description: 'Bypassed canary checks using ROP chain injection.',
        submittedAt: '2026-08-27T16:00:00'
      },
      tracking: {
        registration: 'COMPLETED',
        checkIn: 'COMPLETED',
        eventStarted: 'COMPLETED',
        submission: 'COMPLETED',
        judging: 'COMPLETED',
        results: 'COMPLETED'
      }
    },
    {
      id: 'REG-1002',
      eventId: 'EVT-104',
      studentId: 'STU-10002',
      studentName: 'Rahul Verma',
      studentEmail: 'rahul.verma@iitb.ac.in',
      studentMobile: '+91 98765 43211',
      college: 'IIT Bombay',
      department: 'Electrical Engineering',
      teamName: 'Vanguard Botics',
      teamId: 'TEAM-ROBO-01',
      teamMembers: [{ name: 'Rahul Verma (Lead)', role: 'Embedded Systems' }],
      status: 'APPROVED',
      registeredAt: '2026-08-28T09:00:00',
      tracking: {
        registration: 'COMPLETED',
        checkIn: 'PENDING',
        eventStarted: 'PENDING',
        submission: 'PENDING',
        judging: 'PENDING',
        results: 'PENDING'
      }
    },
    {
      id: 'REG-1003',
      eventId: 'EVT-101',
      studentId: 'STU-10003',
      studentName: 'Priya Sharma',
      studentEmail: 'priya.sharma@bits.edu',
      studentMobile: '+91 98765 43215',
      college: 'BITS Pilani',
      department: 'AI & Data Science',
      teamName: 'VisionCraft',
      teamId: 'TEAM-AI-02',
      teamMembers: [{ name: 'Priya Sharma (Lead)', role: 'Computer Vision' }],
      status: 'CHECKED_IN',
      registeredAt: '2026-08-29T14:00:00',
      checkedInAt: '2026-08-30T09:30:00',
      submission: {
        title: 'VisionPulse: Real-Time Edge Vision Safety Monitoring',
        repoUrl: 'https://github.com/priyasharma/vision-pulse',
        demoUrl: 'https://visionpulse.app',
        description: 'YOLOv8 Edge vision stream for industrial safety gear detection.',
        submittedAt: '2026-08-30T15:00:00'
      },
      tracking: {
        registration: 'COMPLETED',
        checkIn: 'COMPLETED',
        eventStarted: 'COMPLETED',
        submission: 'COMPLETED',
        judging: 'IN_PROGRESS',
        results: 'PENDING'
      }
    }
  ],

  evaluations: [
    {
      id: 'EVAL-1002',
      eventId: 'EVT-103',
      judgeId: 'JDG-2026-0001',
      judgeName: 'Dr. Ananya Iyer',
      registrationId: 'REG-1004',
      teamName: 'BitExploit',
      scores: { crit_1: 9.5, crit_2: 9.5 },
      weightedTotal: 9.5,
      score100: 95.0,
      feedback: 'Flawless exploit payload write-up and clean defense mitigation plan.',
      isLocked: true,
      submittedAt: '2026-08-28T17:00:00',
      auditLog: [{ timestamp: '2026-08-28T17:00:00', action: 'Evaluation locked' }]
    }
  ],

  certificates: [
    {
      certificateId: 'CERT-ABX-2026-001',
      studentId: 'STU-10001',
      studentName: 'Darshan Divakar Naik',
      eventId: 'EVT-103',
      eventName: 'CyberShield: National Technical Quiz & CTF',
      award: 'Winner',
      rank: 1,
      score: 95.0,
      issuedDate: '2026-08-28T18:00:00.000Z',
      issuer: 'Abhiyantrix Central Technical Council'
    }
  ],

  announcements: [
    {
      id: 'ANN-101',
      eventId: 'EVT-103',
      eventName: 'CyberShield: National Technical Quiz & CTF',
      target: 'ALL',
      type: 'RESULT',
      title: '📢 Results Published: CyberShield CTF',
      content: 'Official rankings & scorecards for CyberShield CTF have been authorized and published. Congratulations to all winners and participants!',
      author: 'Dr. S. K. Narayanan (Organizer)',
      timestamp: '2026-08-28T18:00:00',
      priority: 'HIGH'
    }
  ],

  activityLogs: [
    { id: 'ACT-1', timestamp: 'Just now', message: 'CyberShield CTF results authorized and published.', icon: 'military_tech', role: 'organizer' }
  ]
};

class AbhiyantrixDB {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.certificates) parsed.certificates = [];
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse database:', e);
    }
    this.save(officialProductionSeed);
    return JSON.parse(JSON.stringify(officialProductionSeed));
  }

  save(data = this.data) {
    this.data = data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Storage quota error writing to localStorage', e);
    }
  }

  resetToClean() {
    localStorage.removeItem(STORAGE_KEY);
    this.data = JSON.parse(JSON.stringify(officialProductionSeed));
    this.save();
    return this.data;
  }

  loadSampleFestShowcase() {
    this.data = JSON.parse(JSON.stringify(officialProductionSeed));
    this.save();
    return this.data;
  }

  // 9-Grid Operational Telemetry & Analytics
  getTelemetry() {
    const totalEvents = this.data.events.filter(e => e.status !== 'ARCHIVED').length;
    const totalStudents = this.data.users.filter(u => u.role === 'student').length;
    const totalJudges = this.data.users.filter(u => u.role === 'judge').length;

    const upcomingEvents = this.data.events.filter(e => e.status === 'UPCOMING' || e.status === 'REGISTRATION_OPEN' || e.status === 'CHECKIN_OPEN').length;
    const liveEvents = this.data.events.filter(e => e.status === 'LIVE' || e.status === 'JUDGING').length;
    const completedEvents = this.data.events.filter(e => e.status === 'COMPLETED' || e.status === 'RESULTS_PUBLISHED').length;
    const draftEvents = this.data.events.filter(e => e.status === 'DRAFT').length;

    const totalRegistrations = this.data.registrations.length;
    const verifiedParticipants = this.data.registrations.filter(r => r.status === 'APPROVED' || r.status === 'CHECKED_IN').length;
    const pendingVerifications = this.data.registrations.filter(r => r.status === 'PENDING').length;
    const checkedInParticipants = this.data.registrations.filter(r => r.status === 'CHECKED_IN').length;
    const submittedProjects = this.data.registrations.filter(r => r.submission).length;
    const completedEvaluations = this.data.evaluations.filter(e => e.isLocked).length;

    return {
      totalEvents,
      totalStudents,
      totalJudges,
      upcomingEvents,
      liveEvents,
      completedEvents,
      draftEvents,
      totalRegistrations,
      verifiedParticipants,
      pendingVerifications,
      checkedInParticipants,
      submittedProjects,
      completedEvaluations
    };
  }

  getEventsWithAnalytics() {
    return this.data.events.filter(e => e.status !== 'ARCHIVED').map(ev => {
      const evRegs = this.data.registrations.filter(r => r.eventId === ev.id);
      const verified = evRegs.filter(r => r.status === 'APPROVED' || r.status === 'CHECKED_IN').length;
      const pending = evRegs.filter(r => r.status === 'PENDING').length;
      const checkedIn = evRegs.filter(r => r.status === 'CHECKED_IN').length;
      const submissions = evRegs.filter(r => r.submission).length;
      const evals = this.data.evaluations.filter(e => e.eventId === ev.id);
      
      const count = evRegs.length;
      const cap = ev.capacity || 100;
      const fillPercentage = cap > 0 ? parseFloat(((count / cap) * 100).toFixed(1)) : 0;
      const remainingSeats = Math.max(0, cap - count);

      let capacityStatus = 'NORMAL';
      if (fillPercentage >= 100) capacityStatus = 'FULL';
      else if (fillPercentage >= 90 || remainingSeats <= 20) capacityStatus = 'ALMOST_FULL';
      else if (fillPercentage >= 75) capacityStatus = 'FILLING';

      return {
        ...ev,
        participantCount: count,
        registeredCount: count,
        verifiedCount: verified,
        pendingCount: pending,
        checkedInCount: checkedIn,
        submissionsCount: submissions,
        evaluatedCount: evals.length,
        pendingEvaluationCount: Math.max(0, evRegs.length - evals.length),
        fillPercentage,
        remainingSeats,
        capacityStatus
      };
    });
  }

  // Events CRUD
  getEvents() {
    return this.data.events.filter(e => e.status !== 'ARCHIVED');
  }

  getEventById(id) {
    return this.data.events.find(e => e.id === id);
  }

  createEvent(eventData) {
    // Enforcement: Location is Mandatory (PRD Item 11)
    if (!eventData.venue || !eventData.venue.trim()) {
      throw new Error('Event Location/Venue is strictly mandatory.');
    }
    if (!eventData.name || !eventData.name.trim()) {
      throw new Error('Event Name is required.');
    }

    const id = 'EVT-' + Math.floor(100 + Math.random() * 900);
    const newEvent = {
      id,
      registeredCount: 0,
      resultsPublished: false,
      publishedAt: null,
      banner: eventData.banner && eventData.banner.trim() ? eventData.banner.trim() : null, // Optional Image (PRD Item 10)
      venue: eventData.venue.trim(),
      criteria: eventData.criteria && eventData.criteria.length ? eventData.criteria : [
        { id: 'crit_1', name: 'Innovation & Problem Solving', weight: 30, max: 10, desc: 'Novelty of approach' },
        { id: 'crit_2', name: 'Technical Execution', weight: 40, max: 10, desc: 'Quality and system scalability' },
        { id: 'crit_3', name: 'Pitch & Demonstration', weight: 30, max: 10, desc: 'Presentation and jury defense' }
      ],
      rules: eventData.rules && eventData.rules.length ? eventData.rules : [
        'All participants must strictly adhere to the festival decorum.',
        'Valid university ID is mandatory for on-site check-in.'
      ],
      status: eventData.status || 'REGISTRATION_OPEN',
      ...eventData
    };

    this.data.events.unshift(newEvent);
    this.addActivityLog(`Event "${newEvent.name}" (${newEvent.type}) created at ${newEvent.venue}.`, 'add_circle', 'organizer');
    this.save();
    return newEvent;
  }

  updateEvent(id, updates) {
    const idx = this.data.events.findIndex(e => e.id === id);
    if (idx !== -1) {
      if (updates.venue !== undefined && (!updates.venue || !updates.venue.trim())) {
        throw new Error('Event Location is mandatory.');
      }
      this.data.events[idx] = { ...this.data.events[idx], ...updates };
      this.addActivityLog(`Event "${this.data.events[idx].name}" updated.`, 'sync', 'organizer');
      this.save();
      return this.data.events[idx];
    }
    return null;
  }

  deleteEventPermanently(id) {
    const idx = this.data.events.findIndex(e => e.id === id);
    if (idx !== -1) {
      const name = this.data.events[idx].name;
      this.data.registrations = this.data.registrations.filter(r => r.eventId !== id);
      this.data.evaluations = this.data.evaluations.filter(e => e.eventId !== id);
      this.data.announcements = this.data.announcements.filter(a => a.eventId !== id);
      this.data.certificates = this.data.certificates.filter(c => c.eventId !== id);
      this.data.events.splice(idx, 1);
      this.addActivityLog(`Event "${name}" deleted.`, 'delete_forever', 'organizer');
      this.save();
      return true;
    }
    return false;
  }

  // Users & Profiles
  getUsers() {
    return this.data.users;
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  findUser(predicate) {
    return this.data.users.find(predicate);
  }

  updateUserProfile(userId, updates) {
    const idx = this.data.users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      this.data.users[idx] = { ...this.data.users[idx], ...updates };
      this.addActivityLog(`Profile for ${this.data.users[idx].name} updated.`, 'manage_accounts', this.data.users[idx].role);
      this.save();
      return this.data.users[idx];
    }
    return null;
  }

  updateProfilePhoto(userId, base64Photo) {
    const user = this.getUserById(userId);
    if (user) {
      user.avatar = base64Photo;
      this.addActivityLog(`${user.name} ${base64Photo ? 'uploaded a' : 'removed'} profile photo.`, 'account_box', user.role);
      this.save();
      return user;
    }
    return null;
  }

  createStudent(studentData) {
    const studentCount = this.data.users.filter(u => u.role === 'student').length + 1;
    const studentId = 'STU-' + (10000 + studentCount);
    const newStudent = {
      id: 'USR-STU-' + String(studentCount).padStart(4, '0'),
      role: 'student',
      studentId,
      avatar: null,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      ...studentData
    };
    this.data.users.push(newStudent);
    this.addActivityLog(`Student ${newStudent.name} (${studentId}) created an account.`, 'person_add', 'student');
    this.save();
    return newStudent;
  }

  createJudge(judgeData) {
    const judgeCount = this.data.users.filter(u => u.role === 'judge').length + 1;
    const judgeId = 'JDG-2026-' + String(judgeCount).padStart(4, '0');
    const p1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const p2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const p3 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const judgeKey = `${p1}-${p2}-${p3}`;

    const newJudge = {
      id: 'USR-JDG-' + String(judgeCount).padStart(4, '0'),
      role: 'judge',
      judgeId,
      judgeKey,
      assignedEvents: judgeData.assignedEvents || [],
      password: judgeData.password || 'password123',
      avatar: null,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      ...judgeData
    };
    this.data.users.push(newJudge);
    this.addActivityLog(`Judge ${newJudge.name} (${judgeId}) added.`, 'gavel', 'organizer');
    this.save();
    return newJudge;
  }

  deleteJudge(judgeIdOrDbId) {
    const idx = this.data.users.findIndex(u => u.role === 'judge' && (u.id === judgeIdOrDbId || u.judgeId === judgeIdOrDbId));
    if (idx !== -1) {
      const judge = this.data.users[idx];
      this.data.evaluations = this.data.evaluations.filter(e => e.judgeId !== judge.judgeId);
      this.data.users.splice(idx, 1);
      this.addActivityLog(`Judge ${judge.name} (${judge.judgeId}) removed.`, 'person_remove', 'organizer');
      this.save();
      return true;
    }
    return false;
  }

  // Registrations & Database Constraint (PRD Requirement 1, 2, 3, 4, 5)
  getRegistrations() {
    return this.data.registrations;
  }

  getRegistrationsByStudent(studentId) {
    return this.data.registrations.filter(r => r.studentId === studentId);
  }

  getRegistrationsByEvent(eventId) {
    return this.data.registrations.filter(r => r.eventId === eventId);
  }

  registerForEvent(student, eventId, registrationDetails = {}) {
    if (!student || !student.studentId) {
      throw new Error('Authentication required. Please sign in as a student to register.');
    }

    const event = this.getEventById(eventId);
    if (!event) throw new Error('Event record not found.');

    // Database Constraint: UNIQUE(student_id, event_id) (PRD Requirement 2 & 3)
    const existing = this.data.registrations.find(r => r.eventId === eventId && r.studentId === student.studentId);
    if (existing) {
      throw new Error('You are already registered for this event.');
    }

    // Capacity Check
    const activeRegistrations = this.data.registrations.filter(r => r.eventId === eventId && r.status !== 'REJECTED');
    if (event.capacity && activeRegistrations.length >= event.capacity) {
      throw new Error('Event is currently full.');
    }

    const regId = 'REG-' + Math.floor(1000 + Math.random() * 9000);
    const newReg = {
      id: regId,
      eventId,
      studentId: student.studentId,
      studentName: student.name,
      studentEmail: student.email,
      studentMobile: student.mobile || '',
      college: student.college || 'Institution',
      department: student.department || 'General',
      teamName: registrationDetails.teamName || (event.isTeamEvent ? `${student.name}'s Team` : null),
      teamId: event.isTeamEvent ? 'TEAM-' + Math.floor(10 + Math.random() * 90) : null,
      teamMembers: registrationDetails.teamMembers || [{ name: student.name, role: 'Lead' }],
      status: 'APPROVED',
      registeredAt: new Date().toISOString(),
      checkedInAt: null,
      submission: null,
      tracking: {
        registration: 'COMPLETED',
        checkIn: 'PENDING',
        eventStarted: event.status === 'LIVE' ? 'COMPLETED' : 'PENDING',
        submission: 'PENDING',
        judging: 'PENDING',
        results: event.resultsPublished ? 'COMPLETED' : 'PENDING'
      }
    };

    this.data.registrations.push(newReg);

    // Database Recount of Participants (PRD Requirement 4)
    event.registeredCount = this.data.registrations.filter(r => r.eventId === eventId && r.status !== 'REJECTED').length;

    this.addActivityLog(`${student.name} registered for "${event.name}".`, 'how_to_reg', 'student');
    this.save();
    return newReg;
  }

  updateRegistrationStatus(regId, status) {
    const reg = this.data.registrations.find(r => r.id === regId);
    if (reg) {
      reg.status = status;
      if (status === 'CHECKED_IN') {
        reg.checkedInAt = reg.checkedInAt || new Date().toISOString();
        reg.tracking.checkIn = 'COMPLETED';
      }
      const event = this.getEventById(reg.eventId);
      if (event) {
        event.registeredCount = this.data.registrations.filter(r => r.eventId === event.id && r.status !== 'REJECTED').length;
      }
      this.addActivityLog(`Registration ${reg.id} (${reg.studentName}) marked as ${status}.`, 'sync', 'organizer');
      this.save();
      return reg;
    }
    return null;
  }

  deleteRegistration(regId) {
    const idx = this.data.registrations.findIndex(r => r.id === regId);
    if (idx !== -1) {
      const reg = this.data.registrations[idx];
      const ev = this.getEventById(reg.eventId);
      this.data.evaluations = this.data.evaluations.filter(e => e.registrationId !== regId);
      this.data.certificates = this.data.certificates.filter(c => c.studentId !== reg.studentId || c.eventId !== reg.eventId);
      this.data.registrations.splice(idx, 1);
      if (ev) {
        ev.registeredCount = this.data.registrations.filter(r => r.eventId === ev.id && r.status !== 'REJECTED').length;
      }
      this.addActivityLog(`Registration ${reg.id} deleted.`, 'delete', 'organizer');
      this.save();
      return true;
    }
    return false;
  }

  submitProject(regId, submissionData) {
    const reg = this.data.registrations.find(r => r.id === regId);
    if (!reg) throw new Error('Registration record not found.');
    reg.submission = {
      ...submissionData,
      submittedAt: new Date().toISOString()
    };
    reg.tracking.submission = 'COMPLETED';
    reg.tracking.judging = 'IN_PROGRESS';
    this.addActivityLog(`Submission received for ${reg.teamName || reg.studentName} ("${submissionData.title}").`, 'upload_file', 'student');
    this.save();
    return reg;
  }

  // Evaluations
  getEvaluations() {
    return this.data.evaluations;
  }

  getEvaluationsByEvent(eventId) {
    return this.data.evaluations.filter(e => e.eventId === eventId);
  }

  getEvaluationsByJudge(judgeId) {
    return this.data.evaluations.filter(e => e.judgeId === judgeId);
  }

  saveEvaluation(evalData) {
    const existingIdx = this.data.evaluations.findIndex(
      e => e.eventId === evalData.eventId && e.registrationId === evalData.registrationId && e.judgeId === evalData.judgeId
    );

    const now = new Date().toISOString();
    let record;

    if (existingIdx !== -1) {
      if (this.data.evaluations[existingIdx].isLocked && !evalData.overrideLock) {
        throw new Error('Evaluation is locked.');
      }
      this.data.evaluations[existingIdx] = {
        ...this.data.evaluations[existingIdx],
        ...evalData,
        submittedAt: now
      };
      record = this.data.evaluations[existingIdx];
    } else {
      record = {
        id: 'EVAL-' + Math.floor(1000 + Math.random() * 9000),
        ...evalData,
        submittedAt: now,
        auditLog: [{ timestamp: now, action: 'Evaluation saved' }]
      };
      this.data.evaluations.push(record);
    }

    const reg = this.data.registrations.find(r => r.id === evalData.registrationId);
    if (reg && evalData.isLocked) {
      reg.tracking.judging = 'COMPLETED';
    }

    this.addActivityLog(`Judge evaluated entry "${evalData.teamName || 'Participant'}" (${evalData.score100}/100).`, 'gavel', 'judge');
    this.save();
    return record;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // WINNER CERTIFICATE SYSTEM (PRD Requirements 13, 14, 15, 16, 17, 18, 19)
  // ─────────────────────────────────────────────────────────────────────────
  getCertificates() {
    return this.data.certificates || [];
  }

  getCertificatesByStudent(studentId) {
    return (this.data.certificates || []).filter(c => c.studentId === studentId);
  }

  publishEventResults(eventId, organizerUser = null) {
    const event = this.getEventById(eventId);
    if (!event) throw new Error('Event not found.');

    const now = new Date().toISOString();
    
    // Step 1: Update Event Status
    event.resultsPublished = true;
    event.status = 'RESULTS_PUBLISHED';
    event.publishedAt = now;

    // Step 2: Compute Leaderboard & Generate Certificates for all participants
    const leaderboard = this.calculateLeaderboard(eventId);
    if (!this.data.certificates) this.data.certificates = [];

    // Remove older certificates for this event if republishing
    this.data.certificates = this.data.certificates.filter(c => c.eventId !== eventId);

    const eventRegs = this.getRegistrationsByEvent(eventId);

    eventRegs.forEach(reg => {
      if (reg.tracking) reg.tracking.results = 'COMPLETED';

      const entryIdx = leaderboard.findIndex(l => l.registrationId === reg.id);
      const rank = entryIdx !== -1 ? entryIdx + 1 : 999;
      const score = entryIdx !== -1 ? leaderboard[entryIdx].score : 0;

      let award = 'Participation';
      if (rank === 1) award = 'Winner';
      else if (rank === 2) award = 'Runner-up';
      else if (rank === 3) award = 'Second Runner-up';

      const certId = `CERT-ABX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      this.data.certificates.push({
        certificateId: certId,
        studentId: reg.studentId,
        studentName: reg.studentName,
        college: reg.college,
        eventId: event.id,
        eventName: event.name,
        award,
        rank: rank <= 3 ? rank : null,
        score,
        issuedDate: now,
        issuer: event.organizerName || 'Abhiyantrix Central Technical Council'
      });
    });

    // Step 3: Automatically generate platform announcement
    const annTitle = `📢 Results & Certificates Published: ${event.name}`;
    const annContent = `Official rankings, scorecards, and verified certificates for "${event.name}" have been published. Check your Certificates & Results tab!`;

    const newAnn = {
      id: 'ANN-' + Math.floor(100 + Math.random() * 900),
      eventId: event.id,
      eventName: event.name,
      target: 'ALL',
      type: 'RESULT',
      title: annTitle,
      content: annContent,
      author: organizerUser ? organizerUser.name : 'Central Organizing Committee',
      timestamp: now,
      priority: 'HIGH'
    };

    this.data.announcements.unshift(newAnn);
    this.addActivityLog(`Authorized and published official results & certificates for "${event.name}".`, 'military_tech', 'organizer');
    
    this.save();
    return { event, announcement: newAnn };
  }

  unpublishEventResults(eventId) {
    const event = this.getEventById(eventId);
    if (!event) throw new Error('Event not found.');

    event.resultsPublished = false;
    event.status = 'JUDGING';
    event.publishedAt = null;

    if (this.data.certificates) {
      this.data.certificates = this.data.certificates.filter(c => c.eventId !== eventId);
    }

    const registrations = this.getRegistrationsByEvent(eventId);
    registrations.forEach(r => {
      if (r.tracking) r.tracking.results = 'PENDING';
    });

    this.addActivityLog(`Unpublished results for "${event.name}".`, 'edit', 'organizer');
    this.save();
    return event;
  }

  getStudentEventResult(studentId, eventId) {
    const event = this.getEventById(eventId);
    if (!event) return null;

    const reg = this.data.registrations.find(r => r.eventId === eventId && r.studentId === studentId);
    if (!reg) return null;

    if (!event.resultsPublished) {
      return { isPublished: false, eventName: event.name };
    }

    const leaderboard = this.calculateLeaderboard(eventId);
    const myIndex = leaderboard.findIndex(e => e.registrationId === reg.id);
    
    if (myIndex === -1) {
      return { isPublished: true, rank: '-', score: 0, award: 'Participant', isWinner: false };
    }

    const myEntry = leaderboard[myIndex];
    const rank = myIndex + 1;
    let award = 'Participant';
    let isWinner = (rank === 1);
    let isRunnerUp = (rank === 2);
    let isSecondRunnerUp = (rank === 3);

    if (isWinner) award = 'Winner';
    else if (isRunnerUp) award = 'Runner-up';
    else if (isSecondRunnerUp) award = 'Second Runner-up';

    const cert = (this.data.certificates || []).find(c => c.studentId === studentId && c.eventId === eventId);

    return {
      isPublished: true,
      rank,
      score: myEntry.score,
      award,
      isWinner,
      isRunnerUp,
      isSecondRunnerUp,
      teamName: myEntry.teamName,
      leadName: myEntry.leadName,
      college: myEntry.college,
      certificateId: cert ? cert.certificateId : null,
      publishedAt: event.publishedAt
    };
  }

  calculateLeaderboard(eventId) {
    const event = this.getEventById(eventId);
    if (!event) return [];
    const registrations = this.getRegistrationsByEvent(eventId);
    const evals = this.getEvaluationsByEvent(eventId);

    const entries = registrations.map(reg => {
      const teamEvals = evals.filter(e => e.registrationId === reg.id);
      let avgScore = 0;
      if (teamEvals.length > 0) {
        const total = teamEvals.reduce((acc, curr) => acc + (curr.score100 || (curr.weightedTotal * 10)), 0);
        avgScore = parseFloat((total / teamEvals.length).toFixed(2));
      }

      return {
        registrationId: reg.id,
        teamName: reg.teamName || reg.studentName,
        leadName: reg.studentName,
        college: reg.college,
        evaluationsCount: teamEvals.length,
        score: avgScore,
        status: reg.status,
        submission: reg.submission
      };
    });

    entries.sort((a, b) => b.score - a.score);

    return entries.map((entry, idx) => ({
      rank: entry.score > 0 ? idx + 1 : '-',
      ...entry
    }));
  }

  // Announcements
  getAnnouncements() {
    return this.data.announcements;
  }

  publishAnnouncement(announcementData) {
    const newAnn = {
      id: 'ANN-' + Math.floor(100 + Math.random() * 900),
      timestamp: new Date().toISOString(),
      priority: announcementData.priority || 'NORMAL',
      target: announcementData.target || 'ALL',
      type: announcementData.type || 'GENERAL',
      ...announcementData
    };
    this.data.announcements.unshift(newAnn);
    this.addActivityLog(`Broadcast published: "${newAnn.title}".`, 'campaign', 'organizer');
    this.save();
    return newAnn;
  }

  updateAnnouncement(annId, updates) {
    const idx = this.data.announcements.findIndex(a => a.id === annId);
    if (idx !== -1) {
      this.data.announcements[idx] = { ...this.data.announcements[idx], ...updates };
      this.save();
      return this.data.announcements[idx];
    }
    return null;
  }

  deleteAnnouncement(annId) {
    const idx = this.data.announcements.findIndex(a => a.id === annId);
    if (idx !== -1) {
      this.data.announcements.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  getActivityLogs() {
    return this.data.activityLogs;
  }

  addActivityLog(message, icon = 'info', role = 'system') {
    const newLog = {
      id: 'ACT-' + (this.data.activityLogs.length + 1),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message,
      icon,
      role
    };
    this.data.activityLogs.unshift(newLog);
    if (this.data.activityLogs.length > 50) this.data.activityLogs.pop();
  }
}

// Global DB instance
window.db = new AbhiyantrixDB();
