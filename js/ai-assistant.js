/**
 * Abhiyantrix AI Intelligence & Smart Recommendation Engine
 * Provides intelligent skill-matching recommendations, smart operational insights,
 * and an interactive natural language Event Copilot assistant.
 */

window.SmartEngine = {
  // Calculate intelligent match score between student and event
  calculateEventMatch(student, event) {
    if (!student || !event) return { score: 75, reason: 'General Interest' };

    let score = 60;
    const reasons = [];

    const studentSkills = (student.skills || '').toLowerCase().split(/[\s,]+/);
    const studentDept = (student.department || '').toLowerCase();
    const eventName = (event.name || '').toLowerCase();
    const eventCat = (event.category || '').toLowerCase();
    const eventDesc = (event.description || '').toLowerCase();
    const eventType = (event.type || '').toLowerCase();

    // Match skills against event title & description
    let skillHits = 0;
    studentSkills.forEach(skill => {
      if (skill.length > 2) {
        if (eventName.includes(skill) || eventCat.includes(skill) || eventDesc.includes(skill)) {
          skillHits++;
          score += 12;
        }
      }
    });

    if (skillHits > 0) {
      reasons.push(`Matches your skills in ${student.skills}`);
    }

    // Match department
    if (studentDept.includes('computer') || studentDept.includes('cse') || studentDept.includes('it') || studentDept.includes('information')) {
      if (eventType === 'hackathon' || eventType === 'coding' || eventType === 'technical') {
        score += 15;
        reasons.push('High affinity for your Department stream');
      }
    } else if (studentDept.includes('mechanical') || studentDept.includes('robotics') || studentDept.includes('electrical')) {
      if (eventType === 'robotics' || eventType === 'technical') {
        score += 18;
        reasons.push('Direct match with your Engineering specialization');
      }
    } else if (studentDept.includes('design') || studentDept.includes('arts')) {
      if (eventType === 'cultural' || eventType === 'workshop') {
        score += 20;
        reasons.push('Recommended for creative & design track');
      }
    }

    // Popularity bonus
    if (event.participantCount > 100 || (event.registeredCount || 0) > 100) {
      score += 5;
    }

    const finalScore = Math.min(99, Math.max(65, score));
    const reasonText = reasons.length > 0 ? reasons.join(' • ') : `Popular in ${event.category || event.type}`;

    return { score: finalScore, reason: reasonText };
  },

  // Generate real-time Smart Insights for Dashboard
  generateSmartInsights() {
    const events = window.db.getEventsWithAnalytics();
    const telemetry = window.db.getTelemetry();
    const insights = [];

    if (events.length > 0) {
      const topEvent = [...events].sort((a, b) => b.participantCount - a.participantCount)[0];
      if (topEvent && topEvent.participantCount > 0) {
        insights.push({
          icon: 'local_fire_department',
          color: 'text-amber-500',
          badge: 'Trending #1',
          text: `<strong>${topEvent.name}</strong> leads participation with <strong>${topEvent.participantCount}</strong> registrations (${topEvent.fillPercentage}% capacity).`
        });
      }

      const alertEvent = events.find(e => e.capacityStatus === 'ALMOST_FULL' || e.capacityStatus === 'FULL');
      if (alertEvent) {
        insights.push({
          icon: 'warning',
          color: 'text-rose-500',
          badge: 'Capacity Alert',
          text: `<strong>${alertEvent.name}</strong> is almost full! Only <strong>${alertEvent.remainingSeats}</strong> seats remaining.`
        });
      }

      if (telemetry.totalRegistrations > 0) {
        const checkInRate = Math.round((telemetry.checkedInParticipants / telemetry.totalRegistrations) * 100);
        insights.push({
          icon: 'how_to_reg',
          color: 'text-emerald-500',
          badge: 'Attendance Rate',
          text: `<strong>${checkInRate}%</strong> overall attendee verification & check-in velocity across all venue halls.`
        });
      }

      const upcoming = events.filter(e => e.status === 'UPCOMING' || e.status === 'REGISTRATION_OPEN');
      if (upcoming.length > 0) {
        insights.push({
          icon: 'auto_awesome',
          color: 'text-indigo-500',
          badge: 'Smart Discovery',
          text: `<strong>${upcoming.length} upcoming events</strong> currently open for multi-disciplinary team registrations.`
        });
      }
    } else {
      insights.push({
        icon: 'info',
        color: 'text-primary',
        badge: 'Platform Ready',
        text: 'Abhiyantrix AI engine is ready. Create events to see real-time insights.'
      });
    }

    return insights;
  },

  // AI Assistant Chat Query Handler
  askAssistant(query) {
    const q = query.toLowerCase().trim();
    const events = window.db.getEventsWithAnalytics();
    const telemetry = window.db.getTelemetry();
    const user = window.auth.getCurrentUser();

    if (!q) return 'How can I assist you with events, venues, schedule, or registrations today?';

    // Query: events this week / happening
    if (q.includes('event') && (q.includes('this week') || q.includes('upcoming') || q.includes('happening') || q.includes('available') || q.includes('what'))) {
      if (events.length === 0) return 'There are currently no events created in the database. Organizers can create events using the "+ Create New Event" wizard.';
      const eventList = events.slice(0, 4).map(e => `• **${e.name}** (${e.category}) - ${e.status} at *${e.venue}*`).join('\n');
      return `Here are the top events currently active on Abhiyantrix:\n\n${eventList}\n\nYou can click **"Details"** on any event card to view full tracks, schedule, and rules!`;
    }

    // Query: recommendation / for me / match
    if (q.includes('recommend') || q.includes('best for me') || q.includes('match') || q.includes('interest')) {
      if (!user || user.role !== 'student') {
        return 'For personalized AI recommendations, sign in as a student or check the Student Portal where your skills and department are automatically matched!';
      }
      const ranked = events.map(e => ({ event: e, match: this.calculateEventMatch(user, e) })).sort((a, b) => b.match.score - a.match.score);
      if (ranked.length === 0) return 'No events available to match yet.';
      const top = ranked[0];
      return `🤖 **Top AI Recommendation for ${user.name}:**\n\n**${top.event.name}** (${top.match.score}% Match!)\n*Why:* ${top.match.reason}.\nVenue: ${top.event.venue}.\n\nClick **"Register"** on the event card to secure your digital pass!`;
    }

    // Query: how to register / registration
    if (q.includes('register') || q.includes('how to register') || q.includes('pass') || q.includes('ticket')) {
      return '📝 **How to Register & Get Your Pass:**\n1. Go to **Discover Events** in the Student Portal.\n2. Click **"Register"** on your preferred event.\n3. If it is a team event, enter your team name.\n4. Instantly receive your **Digital QR Pass** and Participant ID!';
    }

    // Query: check in / qr
    if (q.includes('check in') || q.includes('qr') || q.includes('attendance') || q.includes('scanner')) {
      return '🎟️ **QR Check-in Flow:**\n• **Students**: Open **"My Event Pass"** to view your high-resolution QR badge.\n• **Organizers**: Click **"QR Check-In"** in the top bar or Verification Desk to scan or enter the Participant ID for instant on-site check-in!';
    }

    // Query: technology / coding / hackathon
    if (q.includes('tech') || q.includes('coding') || q.includes('hackathon') || q.includes('ai')) {
      const techEvents = events.filter(e => e.type === 'Hackathon' || e.type === 'Coding' || e.type === 'Technical' || e.category.toLowerCase().includes('ai'));
      if (techEvents.length === 0) return 'No technology-specific events found right now. Check back soon or create one from the Organizer Desk!';
      const list = techEvents.map(e => `• **${e.name}** (${e.category}) - ${e.status}`).join('\n');
      return `💻 **Technology & Hackathon Events:**\n\n${list}\n\nAll tech tracks feature GitHub repo submission desks and weighted jury scoring!`;
    }

    // Query: venue / location / where
    if (q.includes('venue') || q.includes('where') || q.includes('location')) {
      const venueList = events.slice(0, 3).map(e => `• **${e.name}**: ${e.venue}`).join('\n');
      return `📍 **Event Venues:**\n\n${venueList || 'Venues are listed on each event card.'}`;
    }

    // Fallback response
    return `I can help you with anything across Abhiyantrix! Try asking:\n• *"What events are happening this week?"*\n• *"Which events are best for me?"*\n• *"Show technology events"*\n• *"How does QR check-in work?"*`;
  }
};
