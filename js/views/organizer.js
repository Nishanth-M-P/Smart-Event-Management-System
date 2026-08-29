/**
 * Abhiyantrix Organizer Master Command Center & Operations Dashboard
 * Full real-time operational view matching all 21 PRD requirements:
 * 9-grid analytics, deep participant profiles, event grouping, sorting, capacity alerts,
 * single-event operational hubs, QR check-in, jury provisioning, and result publishing.
 */

window.OrganizerView = {
  currentTab: 'dashboard', // 'dashboard', 'events', 'participants', 'judges', 'tracking', 'announcements', 'results', 'analytics', 'profile', 'settings', 'event-detail'
  
  // Active Event Hub (when inspecting a single event)
  activeEventId: null,
  activeEventSubTab: 'overview', // 'overview', 'participants', 'judges', 'attendance', 'submissions', 'evaluations', 'announcements', 'tracking', 'results'

  // Participants View state
  participantSubTab: 'all', // 'all', 'grouped', 'pending', 'verified', 'attendance'
  participantFilter: {
    eventId: 'ALL',
    status: 'ALL',
    submissionStatus: 'ALL',
    evaluationStatus: 'ALL',
    search: '',
    sortBy: 'name-asc' // 'name-asc', 'name-desc', 'date-desc', 'date-asc', 'status', 'id-asc'
  },

  // Events View state
  eventStatusFilter: 'ALL', // 'ALL', 'DRAFT', 'REGISTRATION_OPEN', 'UPCOMING', 'LIVE', 'COMPLETED', 'ARCHIVED'
  eventSortBy: 'most-participants', // 'most-participants', 'least-participants', 'upcoming', 'live', 'completed', 'highest-cap', 'lowest-cap', 'name-asc', 'name-desc', 'start-date'

  render() {
    const org = window.auth.getCurrentUser();
    if (!org || org.role !== 'organizer') {
      return `<div class="p-8 text-center">Unauthorized. Please login with Organizer credentials.</div>`;
    }

    const telemetry = window.db.getTelemetry();
    const eventsWithAnalytics = window.db.getEventsWithAnalytics();
    const allRegistrations = window.db.getRegistrations();
    const judges = window.db.getUsers().filter(u => u.role === 'judge');
    const activityLogs = window.db.getActivityLogs();

    return `
      <div class="bg-background text-on-background font-body-md flex h-screen overflow-hidden antialiased">
        
        <!-- SideNavBar (Desktop) -->
        <nav class="bg-surface-container h-screen w-64 fixed left-0 top-0 border-r border-outline-variant shadow-md flex flex-col py-5 px-4 gap-3 overflow-y-auto hidden md:flex z-40">
          
          <!-- Logo & Platform Branding -->
          <div class="mb-2 px-2 cursor-pointer flex items-center gap-2.5" onclick="OrganizerView.switchTab('dashboard')">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center shadow">
              <span class="material-symbols-outlined filled text-xl">admin_panel_settings</span>
            </div>
            <div>
              <h1 class="text-lg font-extrabold text-primary tracking-tight leading-none">Abhiyantrix</h1>
              <p class="text-[10px] font-bold text-secondary uppercase tracking-wider mt-0.5">Command Center</p>
            </div>
          </div>

          <!-- Organizer Identity Card -->
          <div class="p-3 rounded-xl bg-surface border border-outline-variant flex items-center gap-3 cursor-pointer hover:border-primary transition-colors shadow-sm" onclick="OrganizerView.switchTab('profile')">
            ${AuthService.renderAvatar(org, 'w-9 h-9', 'text-lg')}
            <div class="overflow-hidden">
              <div class="font-bold text-xs text-on-surface truncate">${org.name}</div>
              <div class="text-[10px] font-mono text-primary font-bold">${org.organizerId || 'ORG-2026-0001'}</div>
            </div>
          </div>

          <!-- Quick Action: Create Event -->
          <button onclick="OrganizerView.showCreateEventModal()" class="w-full bg-gradient-to-r from-primary to-secondary text-white py-2.5 px-3 rounded-xl text-xs font-bold shadow hover:opacity-95 transition-all flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-base">add_circle</span>
            <span>Create New Event</span>
          </button>

          <!-- Navigation Links (20-Point Complete Operating Architecture) -->
          <div class="flex flex-col gap-1 flex-1 text-xs font-bold overflow-y-auto">
            
            <button onclick="OrganizerView.switchTab('dashboard')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${this.currentTab === 'dashboard' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <span class="material-symbols-outlined text-base ${this.currentTab === 'dashboard' ? 'filled' : ''}">dashboard</span>
              <span>Dashboard</span>
            </button>

            <button onclick="OrganizerView.switchTab('events')" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left ${this.currentTab === 'events' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-base ${this.currentTab === 'events' ? 'filled' : ''}">event</span>
                <span>Events Manager</span>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] ${this.currentTab === 'events' ? 'bg-white/20 text-white' : 'bg-surface-variant text-on-surface-variant'}">${telemetry.totalEvents}</span>
            </button>

            <button onclick="OrganizerView.switchTab('participants')" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left ${this.currentTab === 'participants' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-base ${this.currentTab === 'participants' ? 'filled' : ''}">group</span>
                <span>Participants</span>
              </div>
              ${telemetry.pendingVerifications > 0 ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#d97706] text-white animate-pulse">${telemetry.pendingVerifications}</span>` : `<span class="px-2 py-0.5 rounded-full text-[10px] ${this.currentTab === 'participants' ? 'bg-white/20 text-white' : 'bg-surface-variant text-on-surface-variant'}">${telemetry.totalRegistrations}</span>`}
            </button>

            <button onclick="OrganizerView.switchTab('judges')" class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left ${this.currentTab === 'judges' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-base ${this.currentTab === 'judges' ? 'filled' : ''}">gavel</span>
                <span>Judges & Jury</span>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] ${this.currentTab === 'judges' ? 'bg-white/20 text-white' : 'bg-surface-variant text-on-surface-variant'}">${telemetry.totalJudges}</span>
            </button>

            <button onclick="OrganizerView.switchTab('tracking')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${this.currentTab === 'tracking' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <span class="material-symbols-outlined text-base ${this.currentTab === 'tracking' ? 'filled' : ''}">analytics</span>
              <span>Live Tracking</span>
            </button>

            <button onclick="OrganizerView.switchTab('announcements')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${this.currentTab === 'announcements' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <span class="material-symbols-outlined text-base ${this.currentTab === 'announcements' ? 'filled' : ''}">campaign</span>
              <span>Announcements</span>
            </button>

            <button onclick="OrganizerView.switchTab('results')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${this.currentTab === 'results' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <span class="material-symbols-outlined text-base ${this.currentTab === 'results' ? 'filled' : ''}">publish</span>
              <span>Results & Publish</span>
            </button>

            <button onclick="OrganizerView.switchTab('analytics')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${this.currentTab === 'analytics' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <span class="material-symbols-outlined text-base ${this.currentTab === 'analytics' ? 'filled' : ''}">insights</span>
              <span>Deep Analytics</span>
            </button>

            <div class="my-1.5 border-t border-outline-variant"></div>

            <button onclick="OrganizerView.switchTab('profile')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${this.currentTab === 'profile' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <span class="material-symbols-outlined text-base ${this.currentTab === 'profile' ? 'filled' : ''}">person</span>
              <span>My Profile</span>
            </button>

            <button onclick="OrganizerView.switchTab('settings')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${this.currentTab === 'settings' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <span class="material-symbols-outlined text-base ${this.currentTab === 'settings' ? 'filled' : ''}">settings</span>
              <span>Settings & Security</span>
            </button>
          </div>

          <!-- Sign Out -->
          <div class="mt-auto pt-2 border-t border-outline-variant">
            <button onclick="App.logout()" class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-error hover:bg-error-container transition-colors">
              <span class="material-symbols-outlined text-base">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </nav>

        <!-- Main Workspace Canvas -->
        <main class="flex-1 flex flex-col md:ml-64 h-screen overflow-hidden bg-background">
          
          <!-- Top Global Header -->
          <header class="bg-surface/95 backdrop-blur-sm border-b border-outline-variant shadow-sm px-6 h-16 flex items-center justify-between sticky top-0 z-30 flex-shrink-0">
            <div class="flex items-center gap-3">
              <h2 class="text-base sm:text-lg font-extrabold text-primary flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">admin_panel_settings</span>
                <span>${this.getHeaderTitle()}</span>
              </h2>
            </div>

            <div class="flex items-center gap-3">
              <!-- Live QR Scanner Quick Action -->
              <button onclick="OrganizerView.showQRScannerModal()" class="px-3 py-1.5 rounded-lg bg-secondary-container text-on-secondary-container font-bold text-xs hover:bg-secondary hover:text-white transition-all flex items-center gap-1.5 shadow-sm">
                <span class="material-symbols-outlined text-base">qr_code_scanner</span>
                <span class="hidden sm:inline">QR Check-In</span>
              </button>

              <button onclick="OrganizerView.switchTab('announcements')" class="p-2 text-on-surface-variant hover:text-primary transition-colors" title="Announcements">
                <span class="material-symbols-outlined">campaign</span>
              </button>

              <button onclick="OrganizerView.switchTab('participants'); OrganizerView.setParticipantStatusFilter('PENDING');" class="p-2 text-on-surface-variant hover:text-primary transition-colors relative" title="Pending Verifications">
                <span class="material-symbols-outlined">notifications</span>
                ${telemetry.pendingVerifications > 0 ? `<span class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#d97706] rounded-full ring-2 ring-surface animate-ping"></span><span class="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#d97706] rounded-full ring-2 ring-surface"></span>` : ''}
              </button>
              
              <!-- Organizer User Badge (Header) -->
              <div class="flex items-center gap-2 pl-3 border-l border-outline-variant cursor-pointer" onclick="OrganizerView.switchTab('profile')">
                ${AuthService.renderAvatar(org, 'w-8 h-8', 'text-base')}
                <div class="hidden sm:block text-left">
                  <div class="text-xs font-bold text-on-surface leading-tight">${org.name}</div>
                  <div class="text-[10px] text-on-surface-variant leading-tight">Organizer</div>
                </div>
              </div>
            </div>
          </header>

          <!-- Scrollable Viewport -->
          <div class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div class="max-w-[1440px] mx-auto flex flex-col gap-6">
              
              <!-- DYNAMIC ACTIVE VIEW ROUTER -->
              ${this.renderActiveTabContent(eventsWithAnalytics, allRegistrations, judges, activityLogs, org, telemetry)}

            </div>
          </div>
        </main>
      </div>
    `;
  },

  getHeaderTitle() {
    switch (this.currentTab) {
      case 'dashboard': return 'Organizer Operations Dashboard';
      case 'events': return 'Event Management Desk';
      case 'participants': return 'Overall Participant Management';
      case 'judges': return 'Jury Panels & Key Provisioning';
      case 'tracking': return 'Live Event Operations Matrix';
      case 'announcements': return 'Broadcast & Operational Center';
      case 'results': return 'Results Authorization & Leaderboard';
      case 'analytics': return 'Deep Operational Analytics';
      case 'profile': return 'My Profile & Credentials';
      case 'settings': return 'Account Settings & Security';
      case 'event-detail': return 'Single Event Operational Hub';
      default: return 'Organizer Command Center';
    }
  },

  renderActiveTabContent(events, registrations, judges, activityLogs, org, telemetry) {
    if (this.currentTab === 'dashboard') {
      return this.renderDashboardTab(events, registrations, activityLogs, telemetry);
    } else if (this.currentTab === 'events') {
      return this.renderEventsManagerTab(events);
    } else if (this.currentTab === 'participants') {
      return this.renderParticipantsTab(events, registrations);
    } else if (this.currentTab === 'judges') {
      return this.renderJudgesManagementTab(events, judges);
    } else if (this.currentTab === 'tracking') {
      return this.renderTrackingMatrixTab(events, registrations);
    } else if (this.currentTab === 'announcements') {
      return this.renderAnnouncementsTab(events);
    } else if (this.currentTab === 'results') {
      return this.renderResultsTab(events);
    } else if (this.currentTab === 'analytics') {
      return this.renderDeepAnalyticsTab(events, registrations, judges, telemetry);
    } else if (this.currentTab === 'profile') {
      return this.renderProfileTab(org);
    } else if (this.currentTab === 'settings') {
      return this.renderSettingsTab(org);
    } else if (this.currentTab === 'event-detail') {
      return this.renderSingleEventHub(this.activeEventId);
    }
    return '';
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 1. ORGANIZER OVERALL DASHBOARD (PRD Section 1, 8, 9, 10, 11, 15, 16, 18, 19)
  // ─────────────────────────────────────────────────────────────────────────
  renderDashboardTab(events, registrations, activityLogs, telemetry) {
    // Capacity alert events (>90% full or <=20 seats left)
    const alertEvents = events.filter(e => e.capacityStatus === 'ALMOST_FULL' || e.capacityStatus === 'FULL');

    // Popular events sorted by participants
    const popularEvents = [...events].sort((a, b) => b.participantCount - a.participantCount);

    // Upcoming events sorted by start date
    const upcomingEvents = events
      .filter(e => e.status === 'UPCOMING' || e.status === 'REGISTRATION_OPEN')
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    return `
      <section class="animate-fade-in flex flex-col gap-6">
        
        <!-- SECTION 1: 9-GRID MAIN STATISTICAL OVERVIEW (PRD Section 1 & 16) -->
        <div class="bg-surface rounded-2xl border border-outline-variant shadow-sm p-5 flex flex-col gap-4">
          <div class="flex justify-between items-center pb-2 border-b border-outline-variant/60">
            <div>
              <h3 class="text-sm font-extrabold uppercase tracking-wider text-primary flex items-center gap-2">
                <span class="material-symbols-outlined text-base">monitoring</span>
                <span>Executive Operations Dashboard</span>
              </h3>
              <p class="text-xs text-on-surface-variant">Real-time telemetry retrieved dynamically from active database records.</p>
            </div>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
              <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              Live Sync
            </span>
          </div>

          <!-- 9-Grid Layout -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <!-- Row 1: High Level Totals -->
            <div onclick="OrganizerView.switchTab('events')" class="p-4 rounded-xl bg-surface-container border border-outline-variant/80 hover:border-primary transition-all cursor-pointer group shadow-sm">
              <div class="flex justify-between items-start">
                <span class="text-xs font-bold text-on-surface-variant uppercase">Total Events</span>
                <span class="material-symbols-outlined text-primary text-lg group-hover:scale-110 transition-transform">event</span>
              </div>
              <div class="text-3xl font-extrabold text-primary mt-2">${telemetry.totalEvents}</div>
              <div class="text-[10px] text-on-surface-variant mt-1">Click to view all events →</div>
            </div>

            <div onclick="OrganizerView.switchTab('participants'); OrganizerView.participantSubTab='all';" class="p-4 rounded-xl bg-surface-container border border-outline-variant/80 hover:border-secondary transition-all cursor-pointer group shadow-sm">
              <div class="flex justify-between items-start">
                <span class="text-xs font-bold text-on-surface-variant uppercase">Total Students</span>
                <span class="material-symbols-outlined text-secondary text-lg group-hover:scale-110 transition-transform">school</span>
              </div>
              <div class="text-3xl font-extrabold text-secondary mt-2">${telemetry.totalStudents}</div>
              <div class="text-[10px] text-on-surface-variant mt-1">Click to view student roster →</div>
            </div>

            <div onclick="OrganizerView.switchTab('judges')" class="p-4 rounded-xl bg-surface-container border border-outline-variant/80 hover:border-tertiary transition-all cursor-pointer group shadow-sm">
              <div class="flex justify-between items-start">
                <span class="text-xs font-bold text-on-surface-variant uppercase">Total Judges</span>
                <span class="material-symbols-outlined text-tertiary text-lg group-hover:scale-110 transition-transform">gavel</span>
              </div>
              <div class="text-3xl font-extrabold text-tertiary mt-2">${telemetry.totalJudges}</div>
              <div class="text-[10px] text-on-surface-variant mt-1">Click to manage jury keys →</div>
            </div>

            <!-- Row 2: Lifecycle State Machine -->
            <div onclick="OrganizerView.switchTab('events'); OrganizerView.eventStatusFilter='UPCOMING';" class="p-4 rounded-xl bg-surface-container border border-outline-variant/80 hover:border-primary transition-all cursor-pointer group shadow-sm">
              <div class="flex justify-between items-start">
                <span class="text-xs font-bold text-on-surface-variant uppercase">Upcoming Events</span>
                <span class="material-symbols-outlined text-primary text-lg">calendar_month</span>
              </div>
              <div class="text-3xl font-extrabold text-primary mt-2">${telemetry.upcomingEvents}</div>
              <div class="text-[10px] text-on-surface-variant mt-1">Filtered by upcoming state →</div>
            </div>

            <div onclick="OrganizerView.switchTab('events'); OrganizerView.eventStatusFilter='LIVE';" class="p-4 rounded-xl bg-surface-container border border-outline-variant/80 hover:border-[#166534] transition-all cursor-pointer group shadow-sm">
              <div class="flex justify-between items-start">
                <span class="text-xs font-bold text-on-surface-variant uppercase">Live Events</span>
                <span class="material-symbols-outlined text-[#166534] text-lg animate-pulse">radio_button_checked</span>
              </div>
              <div class="text-3xl font-extrabold text-[#166534] mt-2">${telemetry.liveEvents}</div>
              <div class="text-[10px] text-on-surface-variant mt-1">Filtered by live state →</div>
            </div>

            <div onclick="OrganizerView.switchTab('events'); OrganizerView.eventStatusFilter='COMPLETED';" class="p-4 rounded-xl bg-surface-container border border-outline-variant/80 hover:border-tertiary transition-all cursor-pointer group shadow-sm">
              <div class="flex justify-between items-start">
                <span class="text-xs font-bold text-on-surface-variant uppercase">Completed Events</span>
                <span class="material-symbols-outlined text-tertiary text-lg">task_alt</span>
              </div>
              <div class="text-3xl font-extrabold text-tertiary mt-2">${telemetry.completedEvents}</div>
              <div class="text-[10px] text-on-surface-variant mt-1">Filtered by completed state →</div>
            </div>

            <!-- Row 3: Registration & Verification Pipeline -->
            <div onclick="OrganizerView.switchTab('participants'); OrganizerView.participantSubTab='all';" class="p-4 rounded-xl bg-surface-container border border-outline-variant/80 hover:border-primary transition-all cursor-pointer group shadow-sm">
              <div class="flex justify-between items-start">
                <span class="text-xs font-bold text-on-surface-variant uppercase">Total Registrations</span>
                <span class="material-symbols-outlined text-primary text-lg">how_to_reg</span>
              </div>
              <div class="text-3xl font-extrabold text-primary mt-2">${telemetry.totalRegistrations}</div>
              <div class="text-[10px] text-on-surface-variant mt-1">All registration records →</div>
            </div>

            <div onclick="OrganizerView.switchTab('participants'); OrganizerView.participantSubTab='verified';" class="p-4 rounded-xl bg-surface-container border border-outline-variant/80 hover:border-[#166534] transition-all cursor-pointer group shadow-sm">
              <div class="flex justify-between items-start">
                <span class="text-xs font-bold text-on-surface-variant uppercase">Verified Participants</span>
                <span class="material-symbols-outlined text-[#166534] text-lg">verified</span>
              </div>
              <div class="text-3xl font-extrabold text-[#166534] mt-2">${telemetry.verifiedParticipants}</div>
              <div class="text-[10px] text-on-surface-variant mt-1">Approved & Checked-in candidates →</div>
            </div>

            <div onclick="OrganizerView.switchTab('participants'); OrganizerView.participantSubTab='pending';" class="p-4 rounded-xl bg-surface-container border border-outline-variant/80 hover:border-[#d97706] transition-all cursor-pointer group shadow-sm">
              <div class="flex justify-between items-start">
                <span class="text-xs font-bold text-on-surface-variant uppercase">Pending Verification</span>
                <span class="material-symbols-outlined text-[#d97706] text-lg">pending_actions</span>
              </div>
              <div class="text-3xl font-extrabold text-[#d97706] mt-2">${telemetry.pendingVerifications}</div>
              <div class="text-[10px] text-on-surface-variant mt-1">Requires organizer action →</div>
            </div>

          </div>
        </div>

        <!-- SECTION 19: CAPACITY ALERTS (PRD Section 19) -->
        ${alertEvents.length > 0 ? `
          <div class="p-4 rounded-2xl bg-[#fef2f2] border border-[#fecaca] shadow-sm animate-fade-in">
            <div class="flex items-center gap-2 text-error font-extrabold text-xs uppercase tracking-wider mb-2">
              <span class="material-symbols-outlined text-base filled">warning</span>
              <span>⚠️ Critical Event Capacity Alerts</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${alertEvents.map(ev => `
                <div class="p-3 bg-white rounded-xl border border-[#fca5a5] flex justify-between items-center shadow-sm">
                  <div>
                    <h4 class="text-xs font-extrabold text-on-surface">${ev.name}</h4>
                    <span class="text-[11px] font-bold text-error">${ev.participantCount} / ${ev.capacity} participants (${ev.fillPercentage}% capacity) • Only ${ev.remainingSeats} seats remaining!</span>
                  </div>
                  <button onclick="OrganizerView.openEventDetail('${ev.id}')" class="px-3 py-1.5 bg-error text-white text-[11px] font-bold rounded-lg hover:opacity-90">
                    Inspect Event
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- SECTION 8, 10, 11: POPULARITY RANKING, UPCOMING PRIORITIZATION & COMPLETION OVERVIEW -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <!-- POPULARITY RANKING (PRD Section 8 & 18) -->
          <div class="bg-surface rounded-2xl border border-outline-variant shadow-sm p-5 flex flex-col">
            <div class="flex justify-between items-center mb-3 pb-2 border-b border-outline-variant">
              <h4 class="text-xs font-extrabold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span class="material-symbols-outlined text-base">leaderboard</span>
                <span>Event Popularity (Most Participants)</span>
              </h4>
            </div>

            ${popularEvents.length === 0 ? `
              <div class="p-8 text-center text-xs text-on-surface-variant">No events created yet.</div>
            ` : `
              <div class="flex flex-col gap-2.5 flex-grow">
                ${popularEvents.slice(0, 5).map((ev, idx) => `
                  <div onclick="OrganizerView.filterParticipantsByEvent('${ev.id}')" class="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/60 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold w-6 text-center">${idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx+1}`}</span>
                      <div>
                        <div class="text-xs font-bold text-on-surface hover:text-primary">${ev.name}</div>
                        <div class="text-[10px] text-on-surface-variant">${ev.category || ev.type}</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-xs font-extrabold text-primary">${ev.participantCount}</div>
                      <div class="text-[10px] text-on-surface-variant">Participants</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- UPCOMING EVENT PRIORITIZATION (PRD Section 10) -->
          <div class="bg-surface rounded-2xl border border-outline-variant shadow-sm p-5 flex flex-col">
            <div class="flex justify-between items-center mb-3 pb-2 border-b border-outline-variant">
              <h4 class="text-xs font-extrabold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                <span class="material-symbols-outlined text-base">schedule</span>
                <span>Upcoming Events Prioritization</span>
              </h4>
            </div>

            ${upcomingEvents.length === 0 ? `
              <div class="p-8 text-center text-xs text-on-surface-variant">No upcoming events scheduled.</div>
            ` : `
              <div class="flex flex-col gap-2.5 flex-grow">
                ${upcomingEvents.slice(0, 4).map((ev, idx) => {
                  const diffMs = new Date(ev.startDate) - new Date();
                  const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
                  return `
                    <div onclick="OrganizerView.openEventDetail('${ev.id}')" class="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/60 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-[11px]">${idx+1}</div>
                        <div>
                          <div class="text-xs font-bold text-on-surface hover:text-secondary">${ev.name}</div>
                          <div class="text-[10px] text-secondary font-bold">Starts in ${diffDays} day${diffDays === 1 ? '' : 's'}</div>
                        </div>
                      </div>
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-surface-variant text-on-surface-variant">
                        ${ev.participantCount} Reg.
                      </span>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>

          <!-- EVENT STATUS COMPLETION BREAKDOWN (PRD Section 11) -->
          <div class="bg-surface rounded-2xl border border-outline-variant shadow-sm p-5 flex flex-col">
            <div class="flex justify-between items-center mb-3 pb-2 border-b border-outline-variant">
              <h4 class="text-xs font-extrabold text-tertiary uppercase tracking-wider flex items-center gap-1.5">
                <span class="material-symbols-outlined text-base">donut_large</span>
                <span>Event Status Completion</span>
              </h4>
            </div>

            <div class="flex flex-col gap-3 justify-center flex-grow text-xs font-bold">
              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-on-surface-variant">Completed</span>
                  <span class="text-tertiary">${telemetry.completedEvents}</span>
                </div>
                <div class="h-2 rounded-full bg-surface-container-high overflow-hidden">
                  <div class="h-full bg-tertiary rounded-full" style="width: ${telemetry.totalEvents > 0 ? (telemetry.completedEvents / telemetry.totalEvents) * 100 : 0}%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-on-surface-variant">Live</span>
                  <span class="text-[#166534]">${telemetry.liveEvents}</span>
                </div>
                <div class="h-2 rounded-full bg-surface-container-high overflow-hidden">
                  <div class="h-full bg-[#166534] rounded-full" style="width: ${telemetry.totalEvents > 0 ? (telemetry.liveEvents / telemetry.totalEvents) * 100 : 0}%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-on-surface-variant">Upcoming</span>
                  <span class="text-primary">${telemetry.upcomingEvents}</span>
                </div>
                <div class="h-2 rounded-full bg-surface-container-high overflow-hidden">
                  <div class="h-full bg-primary rounded-full" style="width: ${telemetry.totalEvents > 0 ? (telemetry.upcomingEvents / telemetry.totalEvents) * 100 : 0}%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between mb-1">
                  <span class="text-on-surface-variant">Draft</span>
                  <span class="text-on-surface-variant">${telemetry.draftEvents}</span>
                </div>
                <div class="h-2 rounded-full bg-surface-container-high overflow-hidden">
                  <div class="h-full bg-outline rounded-full" style="width: ${telemetry.totalEvents > 0 ? (telemetry.draftEvents / telemetry.totalEvents) * 100 : 0}%"></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- SECTION 5: EVENT OVERVIEW ANALYTICS TABLE (PRD Section 5 & 9) -->
        <div class="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
          <div class="p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 bg-surface-container-lowest">
            <div>
              <h3 class="text-sm font-extrabold text-primary flex items-center gap-2">
                <span class="material-symbols-outlined text-base">table_chart</span>
                <span>Event Analytics & Capacity Overview</span>
              </h3>
              <p class="text-xs text-on-surface-variant">Click any row to open the complete Event Management Hub.</p>
            </div>
            <button onclick="OrganizerView.switchTab('events')" class="text-xs font-bold text-primary hover:underline">
              View All Events & Controls →
            </button>
          </div>

          <div class="overflow-x-auto">
            ${events.length === 0 ? `
              <div class="p-12 text-center text-xs text-on-surface-variant">No events created yet.</div>
            ` : `
              <table class="w-full text-left text-xs">
                <thead class="bg-surface-container text-on-surface-variant border-b border-outline-variant font-bold uppercase">
                  <tr>
                    <th class="p-3.5">Event Name</th>
                    <th class="p-3.5">Type</th>
                    <th class="p-3.5">Status</th>
                    <th class="p-3.5">Participants</th>
                    <th class="p-3.5">Capacity</th>
                    <th class="p-3.5">Registration Progress</th>
                    <th class="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-outline-variant">
                  ${events.map(ev => `
                    <tr onclick="OrganizerView.openEventDetail('${ev.id}')" class="hover:bg-surface-container-low transition-colors cursor-pointer">
                      <td class="p-3.5 font-bold text-primary">${ev.name}</td>
                      <td class="p-3.5 text-on-surface-variant font-medium">${ev.type}</td>
                      <td class="p-3.5">
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${ev.status === 'LIVE' ? 'bg-[#dcfce7] text-[#166534]' : ev.status === 'COMPLETED' ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-surface-variant text-on-surface-variant'}">
                          ${ev.status}
                        </span>
                      </td>
                      <td class="p-3.5 font-extrabold text-on-surface">${ev.participantCount}</td>
                      <td class="p-3.5 text-on-surface-variant font-medium">${ev.capacity}</td>
                      <td class="p-3.5">
                        <div class="flex items-center gap-2">
                          <div class="w-28 h-2 rounded-full bg-surface-container-high overflow-hidden">
                            <div class="h-full rounded-full ${ev.fillPercentage >= 90 ? 'bg-error' : ev.fillPercentage >= 75 ? 'bg-[#d97706]' : 'bg-secondary'}" style="width: ${Math.min(100, ev.fillPercentage)}%"></div>
                          </div>
                          <span class="text-[11px] font-bold ${ev.fillPercentage >= 90 ? 'text-error' : 'text-on-surface-variant'}">${ev.fillPercentage}%</span>
                        </div>
                      </td>
                      <td class="p-3.5 text-right">
                        <button onclick="event.stopPropagation(); OrganizerView.openEventDetail('${ev.id}')" class="px-3 py-1 bg-primary-container text-on-primary-container font-bold rounded-lg text-xs hover:bg-primary hover:text-white transition-colors">
                          Manage Hub
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>
        </div>

      </section>
    `;
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 2. OVERALL PARTICIPANT MANAGEMENT (PRD Section 2, 3, 4, 14, 15)
  // ─────────────────────────────────────────────────────────────────────────
  renderParticipantsTab(events, registrations) {
    // Apply filters
    let filtered = [...registrations];

    if (this.participantFilter.eventId !== 'ALL') {
      filtered = filtered.filter(r => r.eventId === this.participantFilter.eventId);
    }

    if (this.participantSubTab === 'verified') {
      filtered = filtered.filter(r => r.status === 'APPROVED' || r.status === 'CHECKED_IN');
    } else if (this.participantSubTab === 'pending') {
      filtered = filtered.filter(r => r.status === 'PENDING');
    } else if (this.participantSubTab === 'attendance') {
      filtered = filtered.filter(r => r.status === 'CHECKED_IN');
    } else if (this.participantFilter.status !== 'ALL') {
      filtered = filtered.filter(r => r.status === this.participantFilter.status);
    }

    if (this.participantFilter.submissionStatus === 'SUBMITTED') {
      filtered = filtered.filter(r => !!r.submission);
    } else if (this.participantFilter.submissionStatus === 'PENDING') {
      filtered = filtered.filter(r => !r.submission);
    }

    if (this.participantFilter.search) {
      const q = this.participantFilter.search.toLowerCase();
      filtered = filtered.filter(r => 
        r.studentName.toLowerCase().includes(q) ||
        r.studentEmail.toLowerCase().includes(q) ||
        r.studentId.toLowerCase().includes(q) ||
        (r.college && r.college.toLowerCase().includes(q)) ||
        (r.teamName && r.teamName.toLowerCase().includes(q))
      );
    }

    // Apply Sorting
    filtered.sort((a, b) => {
      switch (this.participantFilter.sortBy) {
        case 'name-asc': return a.studentName.localeCompare(b.studentName);
        case 'name-desc': return b.studentName.localeCompare(a.studentName);
        case 'date-desc': return new Date(b.registeredAt) - new Date(a.registeredAt);
        case 'date-asc': return new Date(a.registeredAt) - new Date(b.registeredAt);
        case 'id-asc': return a.studentId.localeCompare(b.studentId);
        case 'status': return a.status.localeCompare(b.status);
        default: return 0;
      }
    });

    return `
      <section class="animate-fade-in flex flex-col gap-6">
        
        <!-- Header & Sub-Tab Navigation -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 class="text-xl font-extrabold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary text-2xl">group</span>
              <span>All Participants Management</span>
            </h3>
            <p class="text-xs text-on-surface-variant">Total Registered Candidates: <strong>${registrations.length}</strong> across all events.</p>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="OrganizerView.showQRScannerModal()" class="px-3.5 py-2 rounded-xl bg-secondary text-on-secondary font-bold text-xs hover:opacity-90 flex items-center gap-1.5 shadow">
              <span class="material-symbols-outlined text-base">qr_code_scanner</span>
              <span>QR Check-In Desk</span>
            </button>
            <button onclick="OrganizerView.exportParticipantsCSV()" class="px-3.5 py-2 rounded-xl border border-primary text-primary font-bold text-xs hover:bg-surface-variant flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base">download</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <!-- Sub Tabs (PRD Section 4 & 20) -->
        <div class="flex flex-wrap border-b border-outline-variant gap-2 bg-surface-container-low p-1.5 rounded-2xl">
          <button onclick="OrganizerView.setParticipantSubTab('all')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${this.participantSubTab === 'all' ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}">
            All Participants (${registrations.length})
          </button>
          <button onclick="OrganizerView.setParticipantSubTab('grouped')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${this.participantSubTab === 'grouped' ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}">
            Group by Event (${events.length})
          </button>
          <button onclick="OrganizerView.setParticipantSubTab('verified')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${this.participantSubTab === 'verified' ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}">
            Verified (${registrations.filter(r => r.status === 'APPROVED' || r.status === 'CHECKED_IN').length})
          </button>
          <button onclick="OrganizerView.setParticipantSubTab('pending')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${this.participantSubTab === 'pending' ? 'bg-surface text-[#d97706] shadow-sm' : 'text-on-surface-variant hover:text-primary'}">
            Pending (${registrations.filter(r => r.status === 'PENDING').length})
          </button>
          <button onclick="OrganizerView.setParticipantSubTab('attendance')" class="px-4 py-2 rounded-xl text-xs font-bold transition-all ${this.participantSubTab === 'attendance' ? 'bg-surface text-secondary shadow-sm' : 'text-on-surface-variant hover:text-primary'}">
            Attendance / Checked-In (${registrations.filter(r => r.status === 'CHECKED_IN').length})
          </button>
        </div>

        ${this.participantSubTab === 'grouped' ? this.renderGroupedParticipantsView(events, registrations) : `
          <!-- Search & Filter Controls Toolbar -->
          <div class="bg-surface rounded-2xl p-4 border border-outline-variant shadow-sm flex flex-wrap gap-3 items-center justify-between">
            <div class="flex flex-wrap gap-3 items-center text-xs font-bold">
              
              <!-- Filter Event -->
              <div class="flex items-center gap-1.5">
                <span class="text-on-surface-variant uppercase text-[11px]">Event:</span>
                <select onchange="OrganizerView.setParticipantEventFilter(this.value)" class="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface text-xs font-bold focus:outline-none">
                  <option value="ALL">All Events</option>
                  ${events.map(e => `<option value="${e.id}" ${this.participantFilter.eventId === e.id ? 'selected' : ''}>${e.name}</option>`).join('')}
                </select>
              </div>

              <!-- Filter Status -->
              <div class="flex items-center gap-1.5">
                <span class="text-on-surface-variant uppercase text-[11px]">Status:</span>
                <select onchange="OrganizerView.setParticipantStatusFilter(this.value)" class="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface text-xs font-bold focus:outline-none">
                  <option value="ALL" ${this.participantFilter.status === 'ALL' ? 'selected' : ''}>All Statuses</option>
                  <option value="APPROVED" ${this.participantFilter.status === 'APPROVED' ? 'selected' : ''}>Approved</option>
                  <option value="CHECKED_IN" ${this.participantFilter.status === 'CHECKED_IN' ? 'selected' : ''}>Checked-In</option>
                  <option value="PENDING" ${this.participantFilter.status === 'PENDING' ? 'selected' : ''}>Pending</option>
                  <option value="REJECTED" ${this.participantFilter.status === 'REJECTED' ? 'selected' : ''}>Rejected</option>
                </select>
              </div>

              <!-- Sort By (PRD Section 14) -->
              <div class="flex items-center gap-1.5">
                <span class="text-on-surface-variant uppercase text-[11px]">Sort By:</span>
                <select onchange="OrganizerView.setParticipantSort(this.value)" class="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface text-xs font-bold focus:outline-none">
                  <option value="name-asc" ${this.participantFilter.sortBy === 'name-asc' ? 'selected' : ''}>Name A–Z</option>
                  <option value="name-desc" ${this.participantFilter.sortBy === 'name-desc' ? 'selected' : ''}>Name Z–A</option>
                  <option value="date-desc" ${this.participantFilter.sortBy === 'date-desc' ? 'selected' : ''}>Registration Date (Newest)</option>
                  <option value="date-asc" ${this.participantFilter.sortBy === 'date-asc' ? 'selected' : ''}>Registration Date (Oldest)</option>
                  <option value="id-asc" ${this.participantFilter.sortBy === 'id-asc' ? 'selected' : ''}>Student ID</option>
                  <option value="status" ${this.participantFilter.sortBy === 'status' ? 'selected' : ''}>Status</option>
                </select>
              </div>

            </div>

            <!-- Search Input -->
            <div class="relative min-w-[240px]">
              <span class="material-symbols-outlined absolute left-3 top-2 text-outline text-base">search</span>
              <input type="text" placeholder="Search name, ID, team..." value="${this.participantFilter.search}" oninput="OrganizerView.setParticipantSearch(this.value)" class="w-full pl-8 pr-3 py-1.5 text-xs border border-outline-variant rounded-lg bg-surface focus:outline-none" />
            </div>
          </div>

          <!-- All Participants Table (PRD Section 2) -->
          <div class="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
            ${filtered.length === 0 ? `
              <div class="p-12 text-center text-xs text-on-surface-variant">
                <span class="material-symbols-outlined text-4xl text-outline mb-2">person_search</span>
                <p class="text-sm font-bold text-on-surface">No participant records matching filter</p>
              </div>
            ` : `
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead class="bg-surface-container text-on-surface-variant border-b border-outline-variant font-bold uppercase">
                    <tr>
                      <th class="p-3.5">Name & Student ID</th>
                      <th class="p-3.5">Event</th>
                      <th class="p-3.5">College & Dept</th>
                      <th class="p-3.5">Status</th>
                      <th class="p-3.5">Submission</th>
                      <th class="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-outline-variant">
                    ${filtered.map(reg => {
                      const ev = window.db.getEventById(reg.eventId);
                      return `
                        <tr onclick="OrganizerView.showParticipantProfileModal('${reg.id}')" class="hover:bg-surface-container-low transition-colors cursor-pointer">
                          <td class="p-3.5">
                            <div class="font-bold text-primary text-sm">${reg.studentName}</div>
                            <div class="text-[11px] font-mono text-on-surface-variant">${reg.studentId} • ${reg.id}</div>
                            ${reg.teamName ? `<div class="text-[10px] text-secondary font-bold mt-0.5">Team: ${reg.teamName}</div>` : ''}
                          </td>
                          <td class="p-3.5 font-bold text-on-surface">
                            ${ev ? ev.name : reg.eventId}
                          </td>
                          <td class="p-3.5 text-on-surface-variant">
                            <div>${reg.college}</div>
                            <div class="text-[10px]">${reg.department || 'General'}</div>
                          </td>
                          <td class="p-3.5">
                            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${reg.status === 'APPROVED' ? 'bg-[#dcfce7] text-[#166534]' : reg.status === 'CHECKED_IN' ? 'bg-secondary text-on-secondary' : reg.status === 'PENDING' ? 'bg-[#fef3c7] text-[#92400e]' : 'bg-error-container text-on-error-container'}">
                              ${reg.status === 'APPROVED' ? 'Verified' : reg.status}
                            </span>
                          </td>
                          <td class="p-3.5">
                            ${reg.submission ? `
                              <span class="px-2 py-0.5 rounded bg-primary-container text-primary font-bold text-[10px]">
                                Submitted
                              </span>
                            ` : `<span class="text-[10px] text-on-surface-variant">Pending</span>`}
                          </td>
                          <td class="p-3.5 text-right" onclick="event.stopPropagation()">
                            <div class="flex items-center justify-end gap-1">
                              ${reg.status === 'PENDING' ? `
                                <button onclick="OrganizerView.updateRegStatus('${reg.id}', 'APPROVED')" class="px-2.5 py-1 bg-secondary text-on-secondary font-bold rounded text-[11px]">Approve</button>
                                <button onclick="OrganizerView.updateRegStatus('${reg.id}', 'REJECTED')" class="px-2 py-1 bg-surface-variant text-error font-bold rounded text-[11px]">Reject</button>
                              ` : reg.status === 'APPROVED' ? `
                                <button onclick="OrganizerView.updateRegStatus('${reg.id}', 'CHECKED_IN')" class="px-2.5 py-1 bg-primary text-on-primary font-bold rounded text-[11px]">Check-In</button>
                              ` : ''}
                              <button onclick="OrganizerView.showParticipantProfileModal('${reg.id}')" class="p-1.5 rounded-lg border border-outline-variant hover:text-primary" title="View Full Profile">
                                <span class="material-symbols-outlined text-base">visibility</span>
                              </button>
                              <button onclick="OrganizerView.handleDeleteRegistration('${reg.id}')" class="p-1.5 rounded-lg border border-outline-variant hover:text-error" title="Delete Record">
                                <span class="material-symbols-outlined text-base">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            `}
          </div>
        `}

      </section>
    `;
  },

  // GROUP PARTICIPANTS BY EVENT (PRD Section 4)
  renderGroupedParticipantsView(events, registrations) {
    return `
      <div class="flex flex-col gap-4 animate-fade-in">
        ${events.length === 0 ? `
          <div class="p-8 text-center text-xs text-on-surface-variant">No events available.</div>
        ` : events.map(ev => {
          const evRegs = registrations.filter(r => r.eventId === ev.id);
          const verified = evRegs.filter(r => r.status === 'APPROVED' || r.status === 'CHECKED_IN').length;
          const pending = evRegs.filter(r => r.status === 'PENDING').length;
          const checkedIn = evRegs.filter(r => r.status === 'CHECKED_IN').length;
          const evals = window.db.getEvaluationsByEvent(ev.id);

          return `
            <div class="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm flex flex-col gap-3">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-outline-variant">
                <div>
                  <h4 class="text-base font-extrabold text-primary flex items-center gap-2">
                    <span class="material-symbols-outlined text-base">event</span>
                    <span>${ev.name}</span>
                  </h4>
                  <span class="text-xs font-bold text-secondary">${evRegs.length} Total Participants Registered</span>
                </div>

                <button onclick="OrganizerView.openEventDetail('${ev.id}')" class="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:opacity-90">
                  Open Event Hub
                </button>
              </div>

              <!-- Tree Hierarchy Breakdown (PRD Section 4) -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div class="p-3 bg-surface-container rounded-xl border border-outline-variant/60">
                  <div class="text-[10px] uppercase font-bold text-on-surface-variant">├── Verified</div>
                  <div class="text-lg font-extrabold text-[#166534]">${verified}</div>
                </div>
                <div class="p-3 bg-surface-container rounded-xl border border-outline-variant/60">
                  <div class="text-[10px] uppercase font-bold text-on-surface-variant">├── Pending</div>
                  <div class="text-lg font-extrabold text-[#d97706]">${pending}</div>
                </div>
                <div class="p-3 bg-surface-container rounded-xl border border-outline-variant/60">
                  <div class="text-[10px] uppercase font-bold text-on-surface-variant">├── Checked-In</div>
                  <div class="text-lg font-extrabold text-secondary">${checkedIn}</div>
                </div>
                <div class="p-3 bg-surface-container rounded-xl border border-outline-variant/60">
                  <div class="text-[10px] uppercase font-bold text-on-surface-variant">└── Evaluated</div>
                  <div class="text-lg font-extrabold text-tertiary">${evals.length}</div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 3. EVENTS MANAGER (PRD Section 5, 6, 7)
  // ─────────────────────────────────────────────────────────────────────────
  renderEventsManagerTab(events) {
    // Filter events
    let filtered = [...events];
    if (this.eventStatusFilter !== 'ALL') {
      filtered = filtered.filter(e => e.status === this.eventStatusFilter);
    }

    // Sort events (PRD Section 6 & Event Sorting)
    filtered.sort((a, b) => {
      switch (this.eventSortBy) {
        case 'most-participants': return b.participantCount - a.participantCount;
        case 'least-participants': return a.participantCount - b.participantCount;
        case 'upcoming': return new Date(a.startDate) - new Date(b.startDate);
        case 'live': return (b.status === 'LIVE' ? 1 : 0) - (a.status === 'LIVE' ? 1 : 0);
        case 'completed': return (b.status === 'COMPLETED' || b.status === 'RESULTS_PUBLISHED' ? 1 : 0) - (a.status === 'COMPLETED' || a.status === 'RESULTS_PUBLISHED' ? 1 : 0);
        case 'closing-soon': return new Date(a.endDate) - new Date(b.endDate);
        case 'start-date': return new Date(a.startDate) - new Date(b.startDate);
        case 'end-date': return new Date(a.endDate) - new Date(b.endDate);
        case 'recent': return (b.id || '').localeCompare(a.id || '');
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'highest-cap': return b.capacity - a.capacity;
        case 'lowest-cap': return a.capacity - b.capacity;
        default: return 0;
      }
    });

    const statusCounts = {
      ALL: events.length,
      DRAFT: events.filter(e => e.status === 'DRAFT').length,
      REGISTRATION_OPEN: events.filter(e => e.status === 'REGISTRATION_OPEN').length,
      UPCOMING: events.filter(e => e.status === 'UPCOMING').length,
      LIVE: events.filter(e => e.status === 'LIVE').length,
      COMPLETED: events.filter(e => e.status === 'COMPLETED' || e.status === 'RESULTS' || e.status === 'RESULTS_PUBLISHED').length
    };

    return `
      <section class="animate-fade-in flex flex-col gap-6">
        
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 class="text-xl font-extrabold text-primary">Event Management Desk</h3>
            <p class="text-xs text-on-surface-variant">Lifecycle controls, criteria weights, capacity progress, and single-event hubs.</p>
          </div>

          <button onclick="OrganizerView.showCreateEventModal()" class="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow hover:opacity-95 flex items-center gap-2">
            <span class="material-symbols-outlined text-base">add_circle</span>
            <span>Create New Event</span>
          </button>
        </div>

        <!-- Status Quick Filters (PRD Section 7) -->
        <div class="flex flex-wrap gap-2 items-center bg-surface-container-low p-2 rounded-2xl border border-outline-variant/60">
          ${[
            { id: 'ALL', label: 'All Events' },
            { id: 'DRAFT', label: 'Draft' },
            { id: 'REGISTRATION_OPEN', label: 'Registration Open' },
            { id: 'UPCOMING', label: 'Upcoming' },
            { id: 'LIVE', label: 'Live' },
            { id: 'COMPLETED', label: 'Completed' }
          ].map(tab => `
            <button onclick="OrganizerView.setEventStatusFilter('${tab.id}')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${this.eventStatusFilter === tab.id ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface text-on-surface-variant hover:text-primary'}">
              ${tab.label} (${statusCounts[tab.id] || 0})
            </button>
          `).join('')}
        </div>

        <!-- Sorting Toolbar (PRD Section 6 & Event Sorting) -->
        <div class="bg-surface rounded-2xl p-4 border border-outline-variant shadow-sm flex flex-wrap justify-between items-center gap-3">
          <div class="flex items-center gap-2 text-xs font-bold">
            <span class="text-on-surface-variant uppercase text-[11px]">Sort Events:</span>
            <select onchange="OrganizerView.setEventSort(this.value)" class="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface text-xs font-bold focus:outline-none">
              <option value="most-participants" ${this.eventSortBy === 'most-participants' ? 'selected' : ''}>Most Participants</option>
              <option value="least-participants" ${this.eventSortBy === 'least-participants' ? 'selected' : ''}>Least Participants</option>
              <option value="upcoming" ${this.eventSortBy === 'upcoming' ? 'selected' : ''}>Upcoming Events</option>
              <option value="live" ${this.eventSortBy === 'live' ? 'selected' : ''}>Live Events First</option>
              <option value="completed" ${this.eventSortBy === 'completed' ? 'selected' : ''}>Completed Events</option>
              <option value="closing-soon" ${this.eventSortBy === 'closing-soon' ? 'selected' : ''}>Registration Closing Soon</option>
              <option value="start-date" ${this.eventSortBy === 'start-date' ? 'selected' : ''}>Start Date</option>
              <option value="end-date" ${this.eventSortBy === 'end-date' ? 'selected' : ''}>End Date</option>
              <option value="recent" ${this.eventSortBy === 'recent' ? 'selected' : ''}>Recently Created</option>
              <option value="name-asc" ${this.eventSortBy === 'name-asc' ? 'selected' : ''}>Name A–Z</option>
              <option value="name-desc" ${this.eventSortBy === 'name-desc' ? 'selected' : ''}>Name Z–A</option>
              <option value="highest-cap" ${this.eventSortBy === 'highest-cap' ? 'selected' : ''}>Highest Capacity</option>
              <option value="lowest-cap" ${this.eventSortBy === 'lowest-cap' ? 'selected' : ''}>Lowest Capacity</option>
            </select>
          </div>
        </div>

        <!-- Events Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${filtered.map(ev => `
            <div onclick="OrganizerView.openEventDetail('${ev.id}')" class="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col group">
              <div class="flex justify-between items-start mb-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-primary-container text-on-primary-container">${ev.category || ev.type}</span>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${ev.status === 'LIVE' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-surface-variant text-on-surface-variant'}">${ev.status}</span>
              </div>

              <h4 class="text-base font-extrabold text-on-surface group-hover:text-primary transition-colors mb-1">${ev.name}</h4>
              <p class="text-xs text-on-surface-variant line-clamp-2 mb-4">${ev.description}</p>

              <div class="mt-auto">
                <div class="flex justify-between text-xs font-bold mb-1">
                  <span class="text-on-surface-variant">Capacity</span>
                  <span class="${ev.fillPercentage >= 90 ? 'text-error' : 'text-primary'}">${ev.participantCount} / ${ev.capacity} (${ev.fillPercentage}%)</span>
                </div>
                <div class="h-2 bg-surface-container-high rounded-full overflow-hidden mb-4">
                  <div class="h-full rounded-full ${ev.fillPercentage >= 90 ? 'bg-error' : 'bg-secondary'}" style="width: ${Math.min(100, ev.fillPercentage)}%"></div>
                </div>

                <div class="flex justify-between items-center text-xs font-bold pt-3 border-t border-outline-variant">
                  <span class="text-on-surface-variant truncate max-w-[140px]">📍 ${ev.venue}</span>
                  <span class="text-primary group-hover:underline">Open Hub →</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

      </section>
    `;
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 4. SINGLE EVENT OPERATIONAL HUB (PRD Section 12 & 13)
  // ─────────────────────────────────────────────────────────────────────────
  openEventDetail(eventId) {
    this.activeEventId = eventId;
    this.activeEventSubTab = 'overview';
    this.currentTab = 'event-detail';
    App.render();
  },

  renderSingleEventHub(eventId) {
    const event = window.db.getEventById(eventId);
    if (!event) return `<div class="p-8 text-center">Event not found.</div>`;

    const registrations = window.db.getRegistrationsByEvent(eventId);
    const evals = window.db.getEvaluationsByEvent(eventId);
    const judges = window.db.getUsers().filter(u => u.role === 'judge' && (u.assignedEvents || []).includes(eventId));

    const verified = registrations.filter(r => r.status === 'APPROVED' || r.status === 'CHECKED_IN').length;
    const checkedIn = registrations.filter(r => r.status === 'CHECKED_IN').length;
    const submissions = registrations.filter(r => r.submission).length;
    const evaluated = evals.length;
    const pendingEval = Math.max(0, registrations.length - evaluated);

    return `
      <section class="animate-fade-in flex flex-col gap-6">
        
        <!-- Hub Header -->
        <div class="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <button onclick="OrganizerView.switchTab('events')" class="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">arrow_back</span> Back to Events
              </button>
              <span class="text-on-surface-variant">•</span>
              <span class="text-xs font-mono font-bold text-on-surface-variant">${event.id}</span>
            </div>
            <h2 class="text-2xl font-extrabold text-primary">${event.name}</h2>
            <p class="text-xs text-on-surface-variant mt-0.5">
              📍 ${event.venue} • 📅 ${new Date(event.startDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>

          <div class="flex items-center gap-3">
            <select onchange="OrganizerView.handleStatusChange('${event.id}', this.value)" class="px-3 py-2 rounded-xl text-xs font-bold border border-outline-variant bg-surface focus:outline-none">
              ${['DRAFT', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'UPCOMING', 'LIVE', 'JUDGING', 'RESULTS', 'COMPLETED'].map(st => `
                <option value="${st}" ${event.status === st ? 'selected' : ''}>${st.replace('_', ' ')}</option>
              `).join('')}
            </select>
            <button onclick="OrganizerView.showEditEventModal('${event.id}')" class="px-4 py-2 bg-surface border border-outline-variant text-xs font-bold rounded-xl hover:border-primary">
              Edit Settings
            </button>
          </div>
        </div>

        <!-- 10-Tab Navigation (PRD Section 13) -->
        <div class="flex flex-wrap border-b border-outline-variant gap-1.5 bg-surface-container-low p-1.5 rounded-2xl">
          ${[
            { id: 'overview', label: 'Overview' },
            { id: 'participants', label: `Participants (${registrations.length})` },
            { id: 'judges', label: `Judges (${judges.length})` },
            { id: 'attendance', label: `Attendance (${checkedIn})` },
            { id: 'submissions', label: `Submissions (${submissions})` },
            { id: 'evaluations', label: `Evaluations (${evaluated})` },
            { id: 'results', label: 'Results & Leaderboard' }
          ].map(tab => `
            <button onclick="OrganizerView.activeEventSubTab='${tab.id}'; App.render();" class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${this.activeEventSubTab === tab.id ? 'bg-surface text-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'}">
              ${tab.label}
            </button>
          `).join('')}
        </div>

        <!-- Single Event Overview Tab (PRD Section 12) -->
        ${this.activeEventSubTab === 'overview' ? `
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div class="p-4 bg-surface rounded-xl border border-outline-variant">
              <div class="text-[10px] uppercase font-bold text-on-surface-variant">Participants</div>
              <div class="text-2xl font-extrabold text-primary mt-1">${registrations.length} / ${event.capacity}</div>
            </div>
            <div class="p-4 bg-surface rounded-xl border border-outline-variant">
              <div class="text-[10px] uppercase font-bold text-on-surface-variant">Verified</div>
              <div class="text-2xl font-extrabold text-[#166534] mt-1">${verified}</div>
            </div>
            <div class="p-4 bg-surface rounded-xl border border-outline-variant">
              <div class="text-[10px] uppercase font-bold text-on-surface-variant">Checked In</div>
              <div class="text-2xl font-extrabold text-secondary mt-1">${checkedIn}</div>
            </div>
            <div class="p-4 bg-surface rounded-xl border border-outline-variant">
              <div class="text-[10px] uppercase font-bold text-on-surface-variant">Submissions</div>
              <div class="text-2xl font-extrabold text-primary mt-1">${submissions}</div>
            </div>
            <div class="p-4 bg-surface rounded-xl border border-outline-variant">
              <div class="text-[10px] uppercase font-bold text-on-surface-variant">Evaluated</div>
              <div class="text-2xl font-extrabold text-tertiary mt-1">${evaluated}</div>
            </div>
            <div class="p-4 bg-surface rounded-xl border border-outline-variant">
              <div class="text-[10px] uppercase font-bold text-on-surface-variant">Pending Eval</div>
              <div class="text-2xl font-extrabold text-[#d97706] mt-1">${pendingEval}</div>
            </div>
          </div>
        ` : ''}

        ${this.activeEventSubTab === 'participants' ? `
          <div class="bg-surface rounded-2xl border border-outline-variant p-4">
            <h4 class="font-bold text-sm text-primary mb-3">Registered Participants (${registrations.length})</h4>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-surface-container font-bold uppercase">
                  <tr>
                    <th class="p-3">Participant</th>
                    <th class="p-3">College</th>
                    <th class="p-3">Status</th>
                    <th class="p-3">Submission</th>
                    <th class="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-outline-variant">
                  ${registrations.map(r => `
                    <tr>
                      <td class="p-3 font-bold text-primary">${r.studentName} (${r.studentId})</td>
                      <td class="p-3 text-on-surface-variant">${r.college}</td>
                      <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-container text-on-secondary-container">${r.status}</span></td>
                      <td class="p-3 font-bold">${r.submission ? r.submission.title : 'None'}</td>
                      <td class="p-3 text-right">
                        <button onclick="OrganizerView.showParticipantProfileModal('${r.id}')" class="text-primary hover:underline font-bold">Profile</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        ` : ''}

        ${this.activeEventSubTab === 'judges' ? `
          <div class="bg-surface rounded-2xl border border-outline-variant p-4">
            <h4 class="font-bold text-sm text-tertiary mb-3">Assigned Jury Panel (${judges.length})</h4>
            <div class="flex flex-col gap-2">
              ${judges.map(j => `
                <div class="p-3 bg-surface-container rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <div class="font-bold">${j.name} (${j.judgeId})</div>
                    <div class="text-[11px] text-on-surface-variant">${j.organization} • ${j.expertise}</div>
                  </div>
                  <div class="font-mono font-bold text-primary">Key: ${j.judgeKey}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${this.activeEventSubTab === 'results' ? `
          <div class="bg-surface rounded-2xl border border-outline-variant p-6">
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-base font-bold text-primary">Leaderboard Standings</h4>
              <button onclick="OrganizerView.togglePublishResults('${event.id}')" class="px-4 py-2 rounded-lg font-bold text-xs ${event.resultsPublished ? 'bg-surface-variant text-error' : 'bg-primary text-on-primary shadow'}">
                ${event.resultsPublished ? 'Unpublish Results' : 'Authorize & Publish Leaderboard'}
              </button>
            </div>
            ${this.renderLeaderboardTable(event.id)}
          </div>
        ` : ''}

      </section>
    `;
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PARTICIPANT PROFILE MODAL (PRD Section 3)
  // ─────────────────────────────────────────────────────────────────────────
  showParticipantProfileModal(regId) {
    const reg = window.db.getRegistrations().find(r => r.id === regId);
    if (!reg) return;
    const event = window.db.getEventById(reg.eventId);
    const evals = window.db.getEvaluations().filter(e => e.registrationId === reg.id);
    const studentHistory = window.db.getRegistrationsByStudent(reg.studentId);

    const modalHtml = `
      <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in" id="prof-modal" onclick="if(event.target.id==='prof-modal') this.remove()">
        <div class="bg-surface rounded-2xl max-w-2xl w-full border border-outline-variant p-6 md:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto flex flex-col gap-6">
          
          <div class="flex justify-between items-start pb-4 border-b border-outline-variant">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xl">
                <span class="material-symbols-outlined">person</span>
              </div>
              <div>
                <h3 class="text-xl font-extrabold text-on-surface">${reg.studentName}</h3>
                <span class="text-xs font-mono font-bold text-primary">${reg.studentId} • ${reg.id}</span>
              </div>
            </div>
            <button onclick="document.getElementById('prof-modal').remove()" class="p-1 rounded-full"><span class="material-symbols-outlined">close</span></button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div class="p-3 bg-surface-container rounded-xl border border-outline-variant/60">
              <span class="text-[10px] font-bold text-on-surface-variant uppercase">Email</span>
              <div class="font-bold text-on-surface truncate">${reg.studentEmail}</div>
            </div>
            <div class="p-3 bg-surface-container rounded-xl border border-outline-variant/60">
              <span class="text-[10px] font-bold text-on-surface-variant uppercase">Mobile</span>
              <div class="font-bold text-on-surface">${reg.studentMobile || 'N/A'}</div>
            </div>
            <div class="p-3 bg-surface-container rounded-xl border border-outline-variant/60">
              <span class="text-[10px] font-bold text-on-surface-variant uppercase">Institution</span>
              <div class="font-bold text-on-surface truncate">${reg.college}</div>
            </div>
            <div class="p-3 bg-surface-container rounded-xl border border-outline-variant/60">
              <span class="text-[10px] font-bold text-on-surface-variant uppercase">Department</span>
              <div class="font-bold text-on-surface">${reg.department || 'CSE'}</div>
            </div>
            <div class="p-3 bg-surface-container rounded-xl border border-outline-variant/60">
              <span class="text-[10px] font-bold text-on-surface-variant uppercase">Year</span>
              <div class="font-bold text-on-surface">${reg.year || '3rd Year'}</div>
            </div>
            <div class="p-3 bg-surface-container rounded-xl border border-outline-variant/60">
              <span class="text-[10px] font-bold text-on-surface-variant uppercase">Status</span>
              <div class="font-extrabold text-secondary">${reg.status}</div>
            </div>
          </div>

          <!-- Team Information -->
          ${reg.teamName ? `
            <div class="p-4 rounded-xl bg-secondary-container/30 border border-secondary/40 text-xs">
              <span class="text-[10px] font-extrabold uppercase text-secondary">Team Information</span>
              <div class="text-sm font-bold text-on-surface mt-0.5">${reg.teamName} (${reg.teamId || 'TEAM'})</div>
              <div class="text-[11px] text-on-surface-variant mt-1">Lead: ${reg.studentName}</div>
            </div>
          ` : ''}

          <!-- Deliverable Submission -->
          <div class="p-4 rounded-xl bg-surface-container border border-outline-variant text-xs">
            <span class="text-[10px] font-extrabold uppercase text-primary">Project Submission</span>
            ${reg.submission ? `
              <div class="font-bold text-sm text-on-surface mt-1">${reg.submission.title}</div>
              <p class="text-on-surface-variant mt-1">${reg.submission.description || ''}</p>
              <div class="flex gap-2 mt-2">
                ${reg.submission.repoUrl ? `<a href="${reg.submission.repoUrl}" target="_blank" class="px-3 py-1 bg-surface border border-outline rounded text-primary font-bold text-xs">Repo ↗</a>` : ''}
                ${reg.submission.demoUrl ? `<a href="${reg.submission.demoUrl}" target="_blank" class="px-3 py-1 bg-surface border border-outline rounded text-secondary font-bold text-xs">Demo ↗</a>` : ''}
              </div>
            ` : `<p class="text-on-surface-variant mt-1">No project deliverable submitted yet.</p>`}
          </div>

          <!-- Evaluation Scores -->
          <div class="p-4 rounded-xl bg-surface-container border border-outline-variant text-xs">
            <span class="text-[10px] font-extrabold uppercase text-tertiary">Jury Evaluation Record</span>
            ${evals.length > 0 ? evals.map(e => `
              <div class="mt-2 pt-2 border-t border-outline-variant/60">
                <div class="flex justify-between font-bold">
                  <span>Judge: ${e.judgeName}</span>
                  <span class="text-tertiary font-extrabold">${e.score100} / 100</span>
                </div>
                <p class="text-on-surface-variant mt-1 italic">"${e.feedback || 'No comments'}"</p>
              </div>
            `).join('') : `<p class="text-on-surface-variant mt-1">Pending jury evaluation.</p>`}
          </div>

          <!-- Complete Student Event History (PRD Section 3) -->
          <div>
            <h4 class="text-xs font-extrabold text-on-surface uppercase mb-2">Participant Event History (${studentHistory.length} Registered Events)</h4>
            <div class="flex flex-col gap-1.5 text-xs">
              ${studentHistory.map(h => {
                const ev = window.db.getEventById(h.eventId);
                return `
                  <div class="p-2.5 bg-surface-container rounded-lg flex justify-between items-center">
                    <div>
                      <span class="font-bold text-primary">${ev ? ev.name : h.eventId}</span>
                      <span class="text-[10px] text-on-surface-variant ml-2">${new Date(h.registeredAt).toLocaleDateString()}</span>
                    </div>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-variant">${h.status}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <div class="flex justify-end pt-2 border-t border-outline-variant">
            <button onclick="document.getElementById('prof-modal').remove()" class="px-5 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl shadow">
              Close Profile
            </button>
          </div>

        </div>
      </div>
    `;

    const el = document.createElement('div');
    el.innerHTML = modalHtml;
    document.body.appendChild(el.firstElementChild);
  },

  // ─────────────────────────────────────────────────────────────────────────
  // JUDGES & KEY PROVISIONING (PRD Section 20)
  // ─────────────────────────────────────────────────────────────────────────
  renderJudgesManagementTab(events, judges) {
    return `
      <section class="animate-fade-in flex flex-col gap-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 class="text-xl font-extrabold text-primary">Jury Panel & Secret Key Provisioning</h3>
            <p class="text-xs text-on-surface-variant">Generate unique Judge IDs and secret keys, assign competition tracks, and manage jury permissions.</p>
          </div>

          <button onclick="OrganizerView.showAddJudgeModal()" class="px-4 py-2.5 rounded-xl bg-tertiary text-on-tertiary text-xs font-bold shadow hover:opacity-90 flex items-center gap-2">
            <span class="material-symbols-outlined text-base">person_add</span>
            <span>Add New Judge</span>
          </button>
        </div>

        <div class="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
          ${judges.length === 0 ? `
            <div class="p-12 text-center text-xs text-on-surface-variant">No judges added yet.</div>
          ` : `
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead class="bg-surface-container text-on-surface-variant border-b border-outline-variant font-bold uppercase">
                  <tr>
                    <th class="p-4">Judge Name & Org</th>
                    <th class="p-4">Unique Judge ID</th>
                    <th class="p-4">Secure Secret Key</th>
                    <th class="p-4">Domain Expertise</th>
                    <th class="p-4">Assigned Events</th>
                    <th class="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-outline-variant">
                  ${judges.map(j => `
                    <tr class="hover:bg-surface-container-low transition-colors">
                      <td class="p-4">
                        <div class="flex items-center gap-2">
                          ${AuthService.renderAvatar(j, 'w-7 h-7', 'text-sm')}
                          <div>
                            <div class="font-bold text-primary">${j.name}</div>
                            <div class="text-[11px] text-on-surface-variant">${j.organization} • ${j.email}</div>
                          </div>
                        </div>
                      </td>
                      <td class="p-4 font-mono font-bold text-tertiary">${j.judgeId}</td>
                      <td class="p-4">
                        <div class="flex items-center gap-2 font-mono font-bold text-primary">
                          <span>${j.judgeKey}</span>
                          <button onclick="navigator.clipboard.writeText('${j.judgeKey}'); App.toast('Copied Judge Key!', 'info');" class="p-1 rounded hover:bg-surface-variant" title="Copy Key">
                            <span class="material-symbols-outlined text-xs">content_copy</span>
                          </button>
                        </div>
                      </td>
                      <td class="p-4 text-on-surface-variant">${j.expertise || 'General'}</td>
                      <td class="p-4">
                        <div class="flex flex-wrap gap-1">
                          ${(j.assignedEvents || []).map(id => {
                            const ev = window.db.getEventById(id);
                            return `<span class="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-bold text-[10px]">${ev ? ev.name : id}</span>`;
                          }).join('')}
                        </div>
                      </td>
                      <td class="p-4 text-right">
                        <div class="flex items-center justify-end gap-1.5">
                          <button onclick="OrganizerView.showAssignJudgeModal('${j.id}')" class="px-3 py-1.5 rounded-lg border border-primary text-primary font-bold text-xs hover:bg-surface-variant">Assign Panels</button>
                          <button onclick="OrganizerView.handleDeleteJudge('${j.id}')" class="p-1.5 rounded-lg border border-outline-variant hover:text-error" title="Remove Judge"><span class="material-symbols-outlined text-base">delete</span></button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </section>
    `;
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LIVE TRACKING MATRIX & DEEP ANALYTICS
  // ─────────────────────────────────────────────────────────────────────────
  renderTrackingMatrixTab(events, registrations) {
    return `
      <section class="animate-fade-in flex flex-col gap-6">
        <div>
          <h3 class="text-xl font-extrabold text-primary">Real-Time Event Tracking Matrix</h3>
          <p class="text-xs text-on-surface-variant">Live telemetry tracking registration capacity, check-in attendance, and jury evaluation completion.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${events.map(ev => {
            const evRegs = registrations.filter(r => r.eventId === ev.id);
            const checkedInCount = evRegs.filter(r => r.status === 'CHECKED_IN').length;
            const evals = window.db.getEvaluationsByEvent(ev.id);

            const fillPercent = ev.capacity > 0 ? (ev.registeredCount / ev.capacity) * 100 : 0;
            const checkInPercent = ev.registeredCount > 0 ? (checkedInCount / ev.registeredCount) * 100 : 0;
            const evalPercent = evRegs.length > 0 ? (evals.length / evRegs.length) * 100 : 0;

            return `
              <div class="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col gap-4">
                <div class="flex justify-between items-start">
                  <div>
                    <span class="text-[10px] font-extrabold uppercase bg-primary-container text-on-primary-container px-2 py-0.5 rounded">${ev.category}</span>
                    <h4 class="text-lg font-bold text-on-surface mt-1">${ev.name}</h4>
                  </div>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold ${ev.status === 'LIVE' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-surface-variant text-on-surface-variant'}">${ev.status}</span>
                </div>

                <div class="flex flex-col gap-3 text-xs">
                  <div>
                    <div class="flex justify-between font-bold mb-1">
                      <span class="text-on-surface-variant">Capacity Fill</span>
                      <span class="text-primary">${ev.registeredCount} / ${ev.capacity}</span>
                    </div>
                    <div class="h-2 rounded-full bg-surface-container-high overflow-hidden">
                      <div class="h-full bg-primary rounded-full" style="width: ${fillPercent}%"></div>
                    </div>
                  </div>

                  <div>
                    <div class="flex justify-between font-bold mb-1">
                      <span class="text-on-surface-variant">On-Site Check-Ins</span>
                      <span class="text-secondary">${checkedInCount} / ${ev.registeredCount}</span>
                    </div>
                    <div class="h-2 rounded-full bg-surface-container-high overflow-hidden">
                      <div class="h-full bg-secondary rounded-full" style="width: ${checkInPercent}%"></div>
                    </div>
                  </div>

                  <div>
                    <div class="flex justify-between font-bold mb-1">
                      <span class="text-on-surface-variant">Jury Evaluations Completed</span>
                      <span class="text-tertiary">${evals.length} / ${evRegs.length}</span>
                    </div>
                    <div class="h-2 rounded-full bg-surface-container-high overflow-hidden">
                      <div class="h-full bg-tertiary rounded-full" style="width: ${evalPercent}%"></div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;
  },

  renderDeepAnalyticsTab(events, registrations, judges, telemetry) {
    return `
      <section class="animate-fade-in flex flex-col gap-6">
        <div>
          <h3 class="text-xl font-extrabold text-primary">Institutional Operational Analytics</h3>
          <p class="text-xs text-on-surface-variant">Cross-event conversions, check-in percentages, and judging completion rates.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-5 bg-surface rounded-2xl border border-outline-variant shadow-sm">
            <span class="text-xs font-bold text-on-surface-variant uppercase">Check-In Conversion</span>
            <div class="text-2xl font-extrabold text-secondary mt-1">
              ${telemetry.totalRegistrations > 0 ? Math.round((telemetry.checkedInParticipants / telemetry.totalRegistrations) * 100) : 0}%
            </div>
            <p class="text-[11px] text-on-surface-variant mt-1">${telemetry.checkedInParticipants} checked-in out of ${telemetry.totalRegistrations}</p>
          </div>

          <div class="p-5 bg-surface rounded-2xl border border-outline-variant shadow-sm">
            <span class="text-xs font-bold text-on-surface-variant uppercase">Deliverables Rate</span>
            <div class="text-2xl font-extrabold text-primary mt-1">
              ${telemetry.totalRegistrations > 0 ? Math.round((telemetry.submittedProjects / telemetry.totalRegistrations) * 100) : 0}%
            </div>
            <p class="text-[11px] text-on-surface-variant mt-1">${telemetry.submittedProjects} project repositories submitted</p>
          </div>

          <div class="p-5 bg-surface rounded-2xl border border-outline-variant shadow-sm">
            <span class="text-xs font-bold text-on-surface-variant uppercase">Evaluation Completion</span>
            <div class="text-2xl font-extrabold text-tertiary mt-1">
              ${telemetry.totalRegistrations > 0 ? Math.round((telemetry.completedEvaluations / telemetry.totalRegistrations) * 100) : 0}%
            </div>
            <p class="text-[11px] text-on-surface-variant mt-1">${telemetry.completedEvaluations} locked scorecards</p>
          </div>

          <div class="p-5 bg-surface rounded-2xl border border-outline-variant shadow-sm">
            <span class="text-xs font-bold text-on-surface-variant uppercase">Approval Rate</span>
            <div class="text-2xl font-extrabold text-[#166534] mt-1">
              ${telemetry.totalRegistrations > 0 ? Math.round((telemetry.verifiedParticipants / telemetry.totalRegistrations) * 100) : 0}%
            </div>
            <p class="text-[11px] text-on-surface-variant mt-1">${telemetry.verifiedParticipants} verified candidates</p>
          </div>
        </div>
      </section>
    `;
  },

  // ─────────────────────────────────────────────────────────────────────────
  // ANNOUNCEMENTS TAB
  // ─────────────────────────────────────────────────────────────────────────
  renderAnnouncementsTab(events) {
    const announcements = window.db.getAnnouncements();

    return `
      <section class="animate-fade-in max-w-4xl mx-auto flex flex-col gap-6">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-xl font-extrabold text-primary">Broadcast & Operational Announcements</h3>
            <p class="text-xs text-on-surface-variant">Publish instant bulletins to students and judge panels.</p>
          </div>

          <button onclick="OrganizerView.showCreateAnnouncementModal()" class="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold shadow hover:opacity-95 flex items-center gap-2">
            <span class="material-symbols-outlined text-base">campaign</span>
            <span>New Announcement</span>
          </button>
        </div>

        ${announcements.length === 0 ? `
          <div class="p-12 text-center bg-surface rounded-2xl border border-outline-variant text-xs text-on-surface-variant">No announcements published yet.</div>
        ` : `
          <div class="flex flex-col gap-4">
            ${announcements.map(ann => `
              <div class="p-5 rounded-2xl bg-surface border border-outline-variant shadow-sm flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0">
                  <span class="material-symbols-outlined text-xl">campaign</span>
                </div>
                <div class="flex-grow">
                  <div class="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <div>
                      <h4 class="text-sm font-bold text-on-surface">${ann.title}</h4>
                      <span class="text-[11px] text-on-surface-variant">${new Date(ann.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>

                    <div class="flex items-center gap-1">
                      <button onclick="OrganizerView.showEditAnnouncementModal('${ann.id}')" class="p-1.5 rounded-lg border border-outline-variant hover:text-primary" title="Edit Announcement"><span class="material-symbols-outlined text-base">edit</span></button>
                      <button onclick="OrganizerView.handleDeleteAnnouncement('${ann.id}')" class="p-1.5 rounded-lg border border-outline-variant hover:text-error" title="Delete Announcement"><span class="material-symbols-outlined text-base">delete</span></button>
                    </div>
                  </div>

                  <p class="text-xs text-on-surface-variant leading-relaxed mb-3">${ann.content}</p>
                  <div class="flex items-center gap-2 text-xs font-bold">
                    <span class="px-2 py-0.5 rounded bg-surface-container text-primary">${ann.eventName || 'Global'}</span>
                    <span class="px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant">Target: ${ann.target}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </section>
    `;
  },

  // ─────────────────────────────────────────────────────────────────────────
  // RESULTS & LEADERBOARD TAB
  // ─────────────────────────────────────────────────────────────────────────
  renderResultsTab(events) {
    return `
      <section class="animate-fade-in flex flex-col gap-6 max-w-5xl mx-auto">
        <div>
          <h3 class="text-xl font-extrabold text-primary">Evaluations & Results Authorization</h3>
          <p class="text-xs text-on-surface-variant">Review weighted rankings from judges before publishing to the student portal.</p>
        </div>

        <div class="flex flex-col gap-6">
          ${events.map(ev => `
            <div class="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col gap-4">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-outline-variant">
                <div>
                  <span class="text-[10px] font-extrabold uppercase bg-primary-container text-on-primary-container px-2 py-0.5 rounded">${ev.category}</span>
                  <h4 class="text-lg font-bold text-on-surface mt-1">${ev.name}</h4>
                </div>

                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold ${ev.resultsPublished ? 'text-secondary' : 'text-on-surface-variant'}">
                    ${ev.resultsPublished ? 'RESULTS PUBLISHED ✅' : 'DRAFT (PRIVATE)'}
                  </span>
                  <button onclick="OrganizerView.togglePublishResults('${ev.id}')" class="px-4 py-2 rounded-lg font-bold text-xs ${ev.resultsPublished ? 'bg-surface-variant text-error' : 'bg-primary text-on-primary shadow'}">
                    ${ev.resultsPublished ? 'Unpublish Results' : 'Authorize & Publish Leaderboard'}
                  </button>
                </div>
              </div>

              ${this.renderLeaderboardTable(ev.id)}
            </div>
          `).join('')}
        </div>
      </section>
    `;
  },

  renderLeaderboardTable(eventId) {
    const leaderboard = window.db.calculateLeaderboard(eventId);
    if (leaderboard.length === 0) {
      return `<div class="p-6 text-center text-xs text-on-surface-variant">No participants registered for this event yet.</div>`;
    }

    return `
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-surface-container text-on-surface-variant font-bold uppercase">
            <tr>
              <th class="p-3 w-16 text-center">Rank</th>
              <th class="p-3">Team / Candidate</th>
              <th class="p-3">Institution</th>
              <th class="p-3">Evaluations</th>
              <th class="p-3 text-right">Weighted Score</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant">
            ${leaderboard.map((entry, idx) => `
              <tr class="${idx < 3 ? 'bg-surface-container-lowest font-semibold' : ''}">
                <td class="p-3 font-bold text-base text-center">${entry.score > 0 ? (idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx+1}`) : '-'}</td>
                <td class="p-3 font-bold text-primary">${entry.teamName}</td>
                <td class="p-3 text-on-surface-variant">${entry.college}</td>
                <td class="p-3">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${entry.evaluationsCount > 0 ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-variant text-on-surface-variant'}">
                    ${entry.evaluationsCount} Recorded
                  </span>
                </td>
                <td class="p-3 font-extrabold text-sm text-right text-primary">${entry.score > 0 ? `${entry.score} / 100` : 'Pending'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ─────────────────────────────────────────────────────────────────────────
  // PROFILE & SETTINGS TAB
  // ─────────────────────────────────────────────────────────────────────────
  renderProfileTab(org) {
    return `
      <section class="animate-fade-in max-w-3xl mx-auto flex flex-col gap-6">
        <div>
          <h3 class="text-xl font-extrabold text-primary">Organizer Profile & Credentials</h3>
          <p class="text-xs text-on-surface-variant">Manage institutional administrator identity and credentials.</p>
        </div>

        <div class="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div class="flex flex-col items-center gap-2">
            ${AuthService.renderAvatar(org, 'w-24 h-24', 'text-4xl')}
            <div class="flex gap-2">
              <label class="px-3 py-1 bg-surface-container border border-outline-variant rounded-lg text-xs font-bold text-primary hover:bg-surface-variant cursor-pointer">
                <span>Upload</span>
                <input type="file" accept="image/png, image/jpeg, image/webp" class="hidden" onchange="OrganizerView.handlePhotoUpload(event)" />
              </label>
              ${org.avatar ? `<button onclick="OrganizerView.handleRemovePhoto()" class="px-3 py-1 bg-surface-variant text-error rounded-lg text-xs font-bold">Remove</button>` : ''}
            </div>
          </div>

          <div class="flex-grow text-center sm:text-left">
            <h2 class="text-2xl font-extrabold text-on-surface mb-1">${org.name}</h2>
            <p class="text-xs text-on-surface-variant mb-3">${org.organization || 'Institutional Board'} • ${org.email}</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div class="p-2.5 rounded-lg bg-surface-container border border-outline-variant">
                <div class="text-[10px] uppercase font-bold text-on-surface-variant">Organizer ID</div>
                <div class="font-mono font-bold text-primary">${org.organizerId || 'ORG-2026-0001'}</div>
              </div>
              <div class="p-2.5 rounded-lg bg-surface-container border border-outline-variant">
                <div class="text-[10px] uppercase font-bold text-on-surface-variant">Created</div>
                <div class="font-bold text-on-surface">${new Date(org.createdAt).toLocaleDateString()}</div>
              </div>
              <div class="p-2.5 rounded-lg bg-surface-container border border-outline-variant">
                <div class="text-[10px] uppercase font-bold text-on-surface-variant">Last Login</div>
                <div class="font-bold text-on-surface truncate">${org.lastLogin ? new Date(org.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm">
          <h4 class="text-sm font-extrabold text-primary uppercase tracking-wider mb-4">Edit Profile Details</h4>
          <form onsubmit="OrganizerView.handleProfileUpdate(event)" class="flex flex-col gap-4 text-xs">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <label class="font-bold text-on-surface-variant">Full Name</label>
                <input id="prof-name" class="px-3 py-2 border border-outline-variant rounded-lg bg-surface text-xs focus:outline-none focus:border-primary" value="${org.name}" required />
              </div>
              <div class="flex flex-col gap-1">
                <label class="font-bold text-on-surface-variant">Organization</label>
                <input id="prof-org" class="px-3 py-2 border border-outline-variant rounded-lg bg-surface text-xs focus:outline-none focus:border-primary" value="${org.organization || ''}" required />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <label class="font-bold text-on-surface-variant">Email</label>
                <input id="prof-email" type="email" class="px-3 py-2 border border-outline-variant rounded-lg bg-surface text-xs" value="${org.email}" required />
              </div>
              <div class="flex flex-col gap-1">
                <label class="font-bold text-on-surface-variant">Mobile</label>
                <input id="prof-mobile" class="px-3 py-2 border border-outline-variant rounded-lg bg-surface text-xs" value="${org.mobile || ''}" required />
              </div>
            </div>
            <div class="flex justify-end pt-2">
              <button type="submit" class="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow">Save Changes</button>
            </div>
          </form>
        </div>
      </section>
    `;
  },

  renderSettingsTab(org) {
    return `
      <section class="animate-fade-in max-w-3xl mx-auto flex flex-col gap-6">
        <div>
          <h3 class="text-xl font-extrabold text-primary">Account Settings & Security</h3>
          <p class="text-xs text-on-surface-variant">Update password, configure access security, and manage datasets.</p>
        </div>

        <div class="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm">
          <h4 class="text-sm font-extrabold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-base">lock</span> Change Password
          </h4>
          <form onsubmit="OrganizerView.handleChangePassword(event)" class="flex flex-col gap-3 text-xs max-w-md">
            <div class="flex flex-col gap-1">
              <label class="font-bold text-on-surface-variant">Current Password</label>
              <input id="pwd-curr" type="password" class="px-3 py-2 border rounded-lg bg-surface" placeholder="••••••••" required />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-bold text-on-surface-variant">New Password</label>
              <input id="pwd-new" type="password" class="px-3 py-2 border rounded-lg bg-surface" placeholder="••••••••" required />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-bold text-on-surface-variant">Confirm New Password</label>
              <input id="pwd-conf" type="password" class="px-3 py-2 border rounded-lg bg-surface" placeholder="••••••••" required />
            </div>
            <div class="pt-2">
              <button type="submit" class="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow">Update Password</button>
            </div>
          </form>
        </div>
      </section>
    `;
  },

  // ─────────────────────────────────────────────────────────────────────────
  // STATE SWITCHERS & FILTERS
  // ─────────────────────────────────────────────────────────────────────────
  switchTab(tab) {
    this.currentTab = tab;
    App.render();
  },

  setParticipantSubTab(subTab) {
    this.participantSubTab = subTab;
    App.render();
  },

  setParticipantEventFilter(val) {
    this.participantFilter.eventId = val;
    App.render();
  },

  filterParticipantsByEvent(eventId) {
    this.participantFilter.eventId = eventId;
    this.participantSubTab = 'all';
    this.currentTab = 'participants';
    App.render();
  },

  setParticipantStatusFilter(val) {
    this.participantFilter.status = val;
    App.render();
  },

  setParticipantSort(val) {
    this.participantFilter.sortBy = val;
    App.render();
  },

  setParticipantSearch(val) {
    this.participantFilter.search = val;
    App.render();
  },

  setEventStatusFilter(val) {
    this.eventStatusFilter = val;
    App.render();
  },

  setEventSort(val) {
    this.eventSortBy = val;
    App.render();
  },

  updateRegStatus(regId, status) {
    window.db.updateRegistrationStatus(regId, status);
    App.toast(`Registration marked as ${status}`, 'success');
    App.render();
  },

  handleDeleteRegistration(regId) {
    if (confirm(`Delete registration record "${regId}"?`)) {
      window.db.deleteRegistration(regId);
      App.toast(`Registration ${regId} deleted.`, 'info');
      App.render();
    }
  },

  handleDeleteJudge(judgeId) {
    const judge = window.db.getUserById(judgeId) || window.db.findUser(u => u.judgeId === judgeId);
    const name = judge ? judge.name : judgeId;
    if (confirm(`Remove judge "${name}"?`)) {
      window.db.deleteJudge(judgeId);
      App.toast(`Judge ${name} removed.`, 'info');
      App.render();
    }
  },

  handleStatusChange(eventId, newStatus) {
    window.db.updateEvent(eventId, { status: newStatus });
    App.toast(`Event status changed to ${newStatus}`, 'success');
    App.render();
  },

  togglePublishResults(eventId) {
    const ev = window.db.getEventById(eventId);
    if (!ev) return;

    if (ev.resultsPublished) {
      if (confirm(`Unpublish results for "${ev.name}" and return to evaluation draft state?`)) {
        window.db.unpublishEventResults(eventId);
        App.toast(`Leaderboard for "${ev.name}" unpublished.`, 'info');
        App.render();
      }
      return;
    }

    // Show Confirmation Modal (PRD Section 8)
    const regs = window.db.getRegistrationsByEvent(eventId);
    const evals = window.db.getEvaluationsByEvent(eventId);

    const modalHtml = `
      <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" id="pub-confirm-modal" onclick="if(event.target.id==='pub-confirm-modal') this.remove()">
        <div class="bg-surface rounded-2xl max-w-md w-full border border-outline-variant p-6 shadow-2xl relative text-center">
          <div class="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mx-auto mb-3">
            <span class="material-symbols-outlined text-2xl">publish</span>
          </div>

          <h3 class="text-lg font-extrabold text-primary mb-1">Publish Event Results?</h3>
          <p class="text-xs text-on-surface-variant mb-4">You are about to authorize official leaderboard standings and publish winners publicly.</p>

          <div class="p-3 bg-surface-container rounded-xl text-xs flex flex-col gap-1.5 text-left mb-4 border border-outline-variant/60">
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Event:</span>
              <strong class="text-on-surface">${ev.name}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Total Participants:</span>
              <strong class="text-primary">${regs.length}</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-on-surface-variant">Evaluated by Jury:</span>
              <strong class="text-tertiary">${evals.length} / ${regs.length}</strong>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 text-[11px] text-left mb-5 flex items-start gap-2">
            <span class="material-symbols-outlined text-base flex-shrink-0 text-amber-600">info</span>
            <span>⚠️ <strong>Public Action</strong>: Official ranks and certificates will become immediately visible on student dashboards, and a platform announcement will be automatically broadcasted.</span>
          </div>

          <div class="flex justify-end gap-2">
            <button onclick="document.getElementById('pub-confirm-modal').remove()" class="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-surface-variant">Cancel</button>
            <button onclick="OrganizerView.executePublishResults('${ev.id}')" class="px-5 py-2 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs rounded-xl shadow hover:opacity-95 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">check_circle</span>
              <span>Authorize & Publish Results</span>
            </button>
          </div>
        </div>
      </div>
    `;

    const el = document.createElement('div');
    el.innerHTML = modalHtml;
    document.body.appendChild(el.firstElementChild);
  },

  executePublishResults(eventId) {
    const org = window.auth.getCurrentUser();
    const { event, announcement } = window.db.publishEventResults(eventId, org);
    
    const modal = document.getElementById('pub-confirm-modal');
    if (modal) modal.remove();

    App.toast(`🏆 Official results published & broadcast announcement created for "${event.name}"!`, 'success');
    App.render();
  },

  exportParticipantsCSV() {
    const regs = window.db.getRegistrations();
    if (regs.length === 0) {
      App.toast('No participants to export.', 'info');
      return;
    }
    let csv = "Registration ID,Event ID,Student Name,Student ID,Email,Mobile,College,Department,Team Name,Status,Registered At\n";
    regs.forEach(r => {
      csv += `"${r.id}","${r.eventId}","${r.studentName}","${r.studentId}","${r.studentEmail}","${r.studentMobile || ''}","${r.college}","${r.department || ''}","${r.teamName || 'N/A'}","${r.status}","${r.registeredAt}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `abhiyantrix_participants_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
    App.toast('Exported participants CSV file.', 'success');
  },

  handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      App.toast('Please upload JPG, PNG, or WebP image.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const org = window.auth.getCurrentUser();
      window.db.updateProfilePhoto(org.id, e.target.result);
      App.toast('Profile photo updated!', 'success');
      App.render();
    };
    reader.readAsDataURL(file);
  },

  handleRemovePhoto() {
    if (confirm('Remove profile photo?')) {
      const org = window.auth.getCurrentUser();
      window.db.updateProfilePhoto(org.id, null);
      App.toast('Profile photo removed.', 'info');
      App.render();
    }
  },

  handleProfileUpdate(e) {
    e.preventDefault();
    try {
      const org = window.auth.getCurrentUser();
      const name = document.getElementById('prof-name').value;
      const organization = document.getElementById('prof-org').value;
      const email = document.getElementById('prof-email').value;
      const mobile = document.getElementById('prof-mobile').value;

      window.auth.updateAccount(org.id, { name, organization, email, mobile });
      App.toast('Profile changes saved!', 'success');
      App.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  handleChangePassword(e) {
    e.preventDefault();
    try {
      const org = window.auth.getCurrentUser();
      const current = document.getElementById('pwd-curr').value;
      const newPwd = document.getElementById('pwd-new').value;
      const confPwd = document.getElementById('pwd-conf').value;

      window.auth.changePassword(org.id, current, newPwd, confPwd);
      App.toast('Password updated successfully!', 'success');
      document.getElementById('pwd-curr').value = '';
      document.getElementById('pwd-new').value = '';
      document.getElementById('pwd-conf').value = '';
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  showQRScannerModal() {
    const modalHtml = `
      <div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" id="qr-scan-modal" onclick="if(event.target.id==='qr-scan-modal') this.remove()">
        <div class="bg-surface rounded-2xl max-w-md w-full border border-outline-variant p-6 shadow-2xl relative text-center">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">qr_code_scanner</span>
              On-Site QR Verification Desk
            </h3>
            <button onclick="document.getElementById('qr-scan-modal').remove()"><span class="material-symbols-outlined">close</span></button>
          </div>

          <div class="relative w-44 h-44 mx-auto bg-black rounded-2xl border-4 border-secondary overflow-hidden flex items-center justify-center mb-4 shadow-inner">
            <div class="absolute inset-x-0 top-0 h-1 bg-[#86f2e4] animate-bounce shadow-lg"></div>
            <span class="material-symbols-outlined text-white text-6xl opacity-40">qr_code_2</span>
            <div class="absolute bottom-2 inset-x-0 text-[10px] text-white/80 font-mono">Simulated Camera Active</div>
          </div>

          <p class="text-xs text-on-surface-variant mb-4">
            Scan attendee digital badge or enter Registration ID / Student ID:
          </p>

          <form onsubmit="OrganizerView.handleManualQRCheckIn(event)" class="flex gap-2 mb-4">
            <input id="qr-input" type="text" placeholder="e.g. REG-1001 or STU-10001" class="flex-1 px-3 py-2 text-xs border border-outline-variant rounded-lg font-mono uppercase bg-surface" required autofocus />
            <button type="submit" class="px-4 py-2 bg-secondary text-on-secondary font-bold text-xs rounded-lg shadow hover:opacity-95">
              Verify
            </button>
          </form>

          <div id="qr-scan-result" class="hidden p-3 rounded-xl text-xs font-bold transition-all"></div>
        </div>
      </div>
    `;
    const el = document.createElement('div');
    el.innerHTML = modalHtml;
    document.body.appendChild(el.firstElementChild);
  },

  handleManualQRCheckIn(e) {
    e.preventDefault();
    const query = document.getElementById('qr-input').value.trim().toUpperCase();
    const resBox = document.getElementById('qr-scan-result');

    const reg = window.db.getRegistrations().find(r => 
      r.id.toUpperCase() === query || 
      (r.studentId && r.studentId.toUpperCase() === query)
    );

    if (!reg) {
      resBox.className = 'p-3 rounded-xl text-xs font-bold bg-error-container text-on-error-container block animate-fade-in';
      resBox.innerHTML = `❌ No registration found for "${query}"`;
      return;
    }

    window.db.updateRegistrationStatus(reg.id, 'CHECKED_IN');
    resBox.className = 'p-3 rounded-xl text-xs font-bold bg-[#dcfce7] text-[#166534] block animate-fade-in';
    resBox.innerHTML = `
      <div class="flex items-center justify-center gap-1.5 text-sm mb-1">
        <span class="material-symbols-outlined text-base">check_circle</span>
        <span>Check-In Successful!</span>
      </div>
      <div>${reg.studentName} (${reg.studentId})</div>
      <div class="text-[11px] font-normal mt-0.5">${reg.college} • Event: ${reg.eventId}</div>
    `;

    App.toast(`Verified & Checked in ${reg.studentName}!`, 'success');
  },

  showCreateEventModal() {
    const modalHtml = `
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in" id="create-event-modal" onclick="if(event.target.id==='create-event-modal') this.remove()">
        <div class="bg-surface rounded-2xl max-w-2xl w-full border border-outline-variant p-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">add_circle</span> Create New Event
            </h3>
            <button onclick="document.getElementById('create-event-modal').remove()" class="p-1 rounded-full"><span class="material-symbols-outlined">close</span></button>
          </div>

          <form onsubmit="OrganizerView.handleCreateEventSubmit(event)" class="flex flex-col gap-4 text-xs">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <label class="font-bold">Event Name</label>
                <input id="evt-name" class="px-3 py-2 border rounded-lg bg-surface text-xs" placeholder="e.g. AI Hackathon 2026" required />
              </div>
              <div class="flex flex-col gap-1">
                <label class="font-bold">Type</label>
                <select id="evt-type" class="px-3 py-2 border rounded-lg bg-surface text-xs font-bold">
                  <option value="Coding">Coding</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Robotics">Robotics</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Conference">Conference</option>
                </select>
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-bold">Category / Track</label>
              <input id="evt-cat" class="px-3 py-2 border rounded-lg bg-surface text-xs" placeholder="e.g. Artificial Intelligence & Cloud" required />
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-bold">Description</label>
              <textarea id="evt-desc" rows="3" class="px-3 py-2 border rounded-lg bg-surface text-xs" placeholder="Detailed event overview, track problem statements..." required></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <label class="font-bold text-on-surface">Location / Venue <span class="text-error font-extrabold">* (Mandatory)</span></label>
                <input id="evt-venue" class="px-3 py-2 border border-outline-variant focus:border-primary rounded-lg bg-surface text-xs" placeholder="e.g. Main Auditorium, APJ Abdul Kalam Block" required />
              </div>
              <div class="flex flex-col gap-1">
                <label class="font-bold">Maximum Capacity</label>
                <input id="evt-capacity" type="number" class="px-3 py-2 border rounded-lg bg-surface text-xs" value="100" required />
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-bold text-on-surface-variant">Event Banner Image URL <span class="text-[10px] text-on-surface-variant font-normal">(Optional)</span></label>
              <input id="evt-banner" type="url" class="px-3 py-2 border border-outline-variant rounded-lg bg-surface text-xs" placeholder="https://images.unsplash.com/... (Leave blank for clean icon layout)" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <label class="font-bold">Start Date & Time</label>
                <input id="evt-start" type="datetime-local" class="px-3 py-2 border rounded-lg bg-surface text-xs" required />
              </div>
              <div class="flex flex-col gap-1">
                <label class="font-bold">End Date & Time</label>
                <input id="evt-end" type="datetime-local" class="px-3 py-2 border rounded-lg bg-surface text-xs" required />
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-outline-variant">
              <button type="button" onclick="document.getElementById('create-event-modal').remove()" class="px-4 py-2 border rounded-lg text-xs font-bold hover:bg-surface-variant">Cancel</button>
              <button type="submit" class="px-6 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow hover:opacity-95">Create & Publish Event</button>
            </div>
          </form>
        </div>
      </div>
    `;
    const el = document.createElement('div');
    el.innerHTML = modalHtml;
    document.body.appendChild(el.firstElementChild);

    const now = new Date();
    const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const startElem = document.getElementById('evt-start');
    const endElem = document.getElementById('evt-end');
    if (startElem) startElem.value = now.toISOString().slice(0, 16);
    if (endElem) endElem.value = future.toISOString().slice(0, 16);
  },

  handleCreateEventSubmit(e) {
    e.preventDefault();
    try {
      const name = document.getElementById('evt-name').value;
      const type = document.getElementById('evt-type').value;
      const category = document.getElementById('evt-cat').value;
      const description = document.getElementById('evt-desc').value;
      const venue = document.getElementById('evt-venue').value;
      const banner = document.getElementById('evt-banner').value;
      const capacity = parseInt(document.getElementById('evt-capacity').value) || 100;
      const startDate = document.getElementById('evt-start').value;
      const endDate = document.getElementById('evt-end').value;

      if (!venue || !venue.trim()) {
        throw new Error('Event Location is strictly required.');
      }

      window.db.createEvent({
        name,
        type,
        category,
        description,
        venue: venue.trim(),
        banner: banner && banner.trim() ? banner.trim() : null,
        capacity,
        startDate,
        endDate,
        isTeamEvent: type === 'Hackathon' || type === 'Robotics' || type === 'Cultural',
        teamMin: 1,
        teamMax: 4
      });

      const modal = document.getElementById('create-event-modal');
      if (modal) modal.remove();
      App.toast(`Event "${name}" created!`, 'success');
      App.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  showEditEventModal(eventId) {
    const ev = window.db.getEventById(eventId);
    if (!ev) return;

    const modalHtml = `
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" id="edit-event-modal" onclick="if(event.target.id==='edit-event-modal') this.remove()">
        <div class="bg-surface rounded-2xl max-w-lg w-full border border-outline-variant p-6 shadow-2xl relative">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-primary">Edit: ${ev.name}</h3>
            <button onclick="document.getElementById('edit-event-modal').remove()"><span class="material-symbols-outlined">close</span></button>
          </div>

          <form onsubmit="OrganizerView.handleEditEventSubmit(event, '${ev.id}')" class="flex flex-col gap-3 text-xs">
            <div class="flex flex-col gap-1">
              <label class="font-bold">Event Name</label>
              <input id="edit-name" class="px-3 py-2 border rounded-lg bg-surface" value="${ev.name}" required />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-bold">Venue</label>
              <input id="edit-venue" class="px-3 py-2 border rounded-lg bg-surface" value="${ev.venue}" required />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-bold">Capacity</label>
              <input id="edit-cap" type="number" class="px-3 py-2 border rounded-lg bg-surface" value="${ev.capacity}" required />
            </div>
            <div class="flex justify-end gap-2 mt-3">
              <button type="button" onclick="document.getElementById('edit-event-modal').remove()" class="px-4 py-2 border rounded-lg">Cancel</button>
              <button type="submit" class="px-5 py-2 bg-primary text-on-primary font-bold rounded-lg">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    `;
    const el = document.createElement('div');
    el.innerHTML = modalHtml;
    document.body.appendChild(el.firstElementChild);
  },

  handleEditEventSubmit(e, eventId) {
    e.preventDefault();
    try {
      const name = document.getElementById('edit-name').value;
      const venue = document.getElementById('edit-venue').value;
      const capacity = parseInt(document.getElementById('edit-cap').value);

      window.db.updateEvent(eventId, { name, venue, capacity });
      const modal = document.getElementById('edit-event-modal');
      if (modal) modal.remove();
      App.toast('Event saved', 'success');
      App.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  showAddJudgeModal() {
    const events = window.db.getEvents();

    const modalHtml = `
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" id="add-judge-modal" onclick="if(event.target.id==='add-judge-modal') this.remove()">
        <div class="bg-surface rounded-2xl max-w-lg w-full border border-outline-variant p-6 shadow-2xl relative">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-tertiary flex items-center gap-2">
              <span class="material-symbols-outlined">person_add</span> Add Judge Account
            </h3>
            <button onclick="document.getElementById('add-judge-modal').remove()"><span class="material-symbols-outlined">close</span></button>
          </div>

          <form onsubmit="OrganizerView.handleAddJudgeSubmit(event)" class="flex flex-col gap-3 text-xs">
            <div class="flex flex-col gap-1">
              <label class="font-bold">Judge Full Name</label>
              <input id="new-jdg-name" class="px-3 py-2 border rounded-lg bg-surface" placeholder="e.g. Dr. Rajeshwari" required />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-bold">Email Address</label>
              <input id="new-jdg-email" type="email" class="px-3 py-2 border rounded-lg bg-surface" placeholder="judge@org.edu" required />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-bold">Organization</label>
              <input id="new-jdg-org" class="px-3 py-2 border rounded-lg bg-surface" placeholder="Google / Microsoft Research" required />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-bold">Domain Expertise</label>
              <input id="new-jdg-exp" class="px-3 py-2 border rounded-lg bg-surface" placeholder="AI, Mechatronics, Design" required />
            </div>
            ${events.length > 0 ? `
              <div class="flex flex-col gap-1">
                <label class="font-bold">Assign Event Track</label>
                <select id="new-jdg-evt" class="px-3 py-2 border rounded-lg bg-surface font-bold">
                  <option value="">None (Assign later)</option>
                  ${events.map(e => `<option value="${e.id}">${e.name}</option>`).join('')}
                </select>
              </div>
            ` : ''}
            <div class="flex justify-end gap-2 mt-3">
              <button type="button" onclick="document.getElementById('add-judge-modal').remove()" class="px-4 py-2 border rounded-lg">Cancel</button>
              <button type="submit" class="px-6 py-2 bg-tertiary text-on-tertiary font-bold rounded-lg shadow">Generate Judge ID & Key</button>
            </div>
          </form>
        </div>
      </div>
    `;
    const el = document.createElement('div');
    el.innerHTML = modalHtml;
    document.body.appendChild(el.firstElementChild);
  },

  handleAddJudgeSubmit(e) {
    e.preventDefault();
    try {
      const name = document.getElementById('new-jdg-name').value;
      const email = document.getElementById('new-jdg-email').value;
      const organization = document.getElementById('new-jdg-org').value;
      const expertise = document.getElementById('new-jdg-exp').value;
      const evtSelect = document.getElementById('new-jdg-evt');
      const assignedEvents = evtSelect && evtSelect.value ? [evtSelect.value] : [];

      const judge = window.db.createJudge({ name, email, organization, expertise, assignedEvents });
      const modal = document.getElementById('add-judge-modal');
      if (modal) modal.remove();

      alert(`Judge Provisioned!\n\nJudge ID: ${judge.judgeId}\nSecret Key: ${judge.judgeKey}`);
      App.toast(`Judge ${judge.name} added!`, 'success');
      App.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  showAssignJudgeModal(judgeDbId) {
    const judge = window.db.getUserById(judgeDbId);
    if (!judge) return;
    const events = window.db.getEvents();

    const modalHtml = `
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" id="assign-modal" onclick="if(event.target.id==='assign-modal') this.remove()">
        <div class="bg-surface rounded-2xl max-w-md w-full border border-outline-variant p-6 shadow-2xl relative">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-base font-bold text-primary">Assign Panels: ${judge.name}</h3>
            <button onclick="document.getElementById('assign-modal').remove()"><span class="material-symbols-outlined">close</span></button>
          </div>
          <div class="flex flex-col gap-2 mb-4 text-xs">
            ${events.map(e => `
              <label class="flex items-center gap-2 p-2 rounded-lg bg-surface-container border border-outline-variant cursor-pointer">
                <input type="checkbox" class="judge-evt-chk" value="${e.id}" ${(judge.assignedEvents || []).includes(e.id) ? 'checked' : ''} />
                <span class="font-bold">${e.name}</span>
              </label>
            `).join('')}
          </div>
          <div class="flex justify-end gap-2">
            <button onclick="document.getElementById('assign-modal').remove()" class="px-4 py-2 border rounded-lg text-xs">Cancel</button>
            <button onclick="OrganizerView.saveJudgeAssignments('${judge.id}')" class="px-5 py-2 bg-primary text-on-primary font-bold text-xs rounded-lg shadow">Save Assignments</button>
          </div>
        </div>
      </div>
    `;
    const el = document.createElement('div');
    el.innerHTML = modalHtml;
    document.body.appendChild(el.firstElementChild);
  },

  saveJudgeAssignments(judgeDbId) {
    const chks = document.querySelectorAll('.judge-evt-chk:checked');
    const assignedEvents = Array.from(chks).map(c => c.value);
    const judge = window.db.getUserById(judgeDbId);
    if (judge) {
      judge.assignedEvents = assignedEvents;
      window.db.save();
      const modal = document.getElementById('assign-modal');
      if (modal) modal.remove();
      App.toast('Assignments updated', 'success');
      App.render();
    }
  },

  showCreateAnnouncementModal() {
    const events = window.db.getEvents();
    const modalHtml = `
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" id="ann-modal" onclick="if(event.target.id==='ann-modal') this.remove()">
        <div class="bg-surface rounded-2xl max-w-lg w-full border border-outline-variant p-6 shadow-2xl relative">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-primary flex items-center gap-2"><span class="material-symbols-outlined">campaign</span> Broadcast Bulletin</h3>
            <button onclick="document.getElementById('ann-modal').remove()"><span class="material-symbols-outlined">close</span></button>
          </div>
          <form onsubmit="OrganizerView.handleAnnouncementSubmit(event)" class="flex flex-col gap-3 text-xs">
            <div class="flex flex-col gap-1">
              <label class="font-bold">Target Audience</label>
              <select id="ann-target" class="px-3 py-2 border rounded-lg bg-surface">
                <option value="ALL">All Users & Attendees</option>
                <option value="REGISTERED">Registered Event Participants</option>
                <option value="JUDGES">Judge Panels Only</option>
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-bold">Associated Event</label>
              <select id="ann-evt" class="px-3 py-2 border rounded-lg bg-surface">
                <option value="GLOBAL">Platform Wide (General)</option>
                ${events.map(e => `<option value="${e.id}">${e.name}</option>`).join('')}
              </select>
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-bold">Title</label>
              <input id="ann-title" class="px-3 py-2 border rounded-lg bg-surface" placeholder="e.g. Schedule Update" required />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-bold">Content</label>
              <textarea id="ann-content" rows="3" class="px-3 py-2 border rounded-lg bg-surface" required></textarea>
            </div>
            <div class="flex justify-end gap-2 mt-3">
              <button type="button" onclick="document.getElementById('ann-modal').remove()" class="px-4 py-2 border rounded-lg">Cancel</button>
              <button type="submit" class="px-6 py-2 bg-primary text-on-primary font-bold rounded-lg shadow">Broadcast Live</button>
            </div>
          </form>
        </div>
      </div>
    `;
    const el = document.createElement('div');
    el.innerHTML = modalHtml;
    document.body.appendChild(el.firstElementChild);
  },

  handleAnnouncementSubmit(e) {
    e.preventDefault();
    try {
      const org = window.auth.getCurrentUser();
      const target = document.getElementById('ann-target').value;
      const eventId = document.getElementById('ann-evt').value;
      const title = document.getElementById('ann-title').value;
      const content = document.getElementById('ann-content').value;
      const event = eventId !== 'GLOBAL' ? window.db.getEventById(eventId) : null;

      window.db.publishAnnouncement({
        eventId,
        eventName: event ? event.name : 'Platform Wide',
        target,
        title,
        content,
        author: org.name,
        priority: 'HIGH'
      });

      const modal = document.getElementById('ann-modal');
      if (modal) modal.remove();
      App.toast('Announcement broadcasted!', 'success');
      App.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  showEditAnnouncementModal(annId) {
    const ann = window.db.getAnnouncements().find(a => a.id === annId);
    if (!ann) return;
    const events = window.db.getEvents();

    const modalHtml = `
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" id="edit-ann-modal" onclick="if(event.target.id==='edit-ann-modal') this.remove()">
        <div class="bg-surface rounded-2xl max-w-lg w-full border border-outline-variant p-6 shadow-2xl relative">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold text-primary">Edit Announcement</h3>
            <button onclick="document.getElementById('edit-ann-modal').remove()"><span class="material-symbols-outlined">close</span></button>
          </div>
          <form onsubmit="OrganizerView.handleEditAnnouncementSubmit(event, '${ann.id}')" class="flex flex-col gap-3 text-xs">
            <div class="flex flex-col gap-1">
              <label class="font-bold">Title</label>
              <input id="edit-ann-title" class="px-3 py-2 border rounded-lg bg-surface" value="${ann.title}" required />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-bold">Content</label>
              <textarea id="edit-ann-content" rows="3" class="px-3 py-2 border rounded-lg bg-surface" required>${ann.content}</textarea>
            </div>
            <div class="flex justify-end gap-2 mt-3">
              <button type="button" onclick="document.getElementById('edit-ann-modal').remove()" class="px-4 py-2 border rounded-lg">Cancel</button>
              <button type="submit" class="px-6 py-2 bg-primary text-on-primary font-bold rounded-lg shadow">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    `;
    const el = document.createElement('div');
    el.innerHTML = modalHtml;
    document.body.appendChild(el.firstElementChild);
  },

  handleEditAnnouncementSubmit(e, annId) {
    e.preventDefault();
    try {
      const title = document.getElementById('edit-ann-title').value;
      const content = document.getElementById('edit-ann-content').value;
      window.db.updateAnnouncement(annId, { title, content });
      const modal = document.getElementById('edit-ann-modal');
      if (modal) modal.remove();
      App.toast('Announcement updated!', 'success');
      App.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  handleDeleteAnnouncement(annId) {
    if (confirm(`Delete announcement?`)) {
      window.db.deleteAnnouncement(annId);
      App.toast('Announcement deleted.', 'info');
      App.render();
    }
  }
};
