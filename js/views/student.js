/**
 * Student Dashboard & Portal View
 * Real-world implementation with zero dummy data, standard User Icons,
 * profile photo upload/removal, live capacity counters, and event tracking.
 */

window.StudentView = {
  currentTab: 'events',
  categoryFilter: 'ALL',
  searchQuery: '',

  render() {
    const user = window.auth.getCurrentUser();
    if (!user || user.role !== 'student') {
      return `<div class="p-8 text-center">Unauthorized. Please login as a student.</div>`;
    }

    const allEvents = window.db.getEvents();
    const myRegistrations = window.db.getRegistrationsByStudent(user.studentId);
    const certificates = window.db.getCertificatesByStudent(user.studentId);
    const announcements = window.db.getAnnouncements();

    return `
      <div class="bg-background text-on-background flex min-h-screen antialiased">
        
        <!-- SideNavBar (Desktop) -->
        <nav class="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 py-lg px-md gap-md overflow-y-auto bg-surface-container border-r border-outline-variant shadow-sm z-40">
          <div class="mb-6 px-2 flex items-center gap-2 cursor-pointer" onclick="App.navigate('landing')">
            <span class="material-symbols-outlined filled text-3xl text-primary">hub</span>
            <div>
              <h1 class="text-xl font-extrabold text-primary tracking-tight">Abhiyantrix</h1>
              <p class="text-xs font-semibold text-on-surface-variant">Student Portal</p>
            </div>
          </div>

          <!-- Student Profile Compact Widget -->
          <div class="p-3 rounded-xl bg-surface border border-outline-variant flex items-center gap-3 mb-2 cursor-pointer hover:border-primary transition-colors" onclick="StudentView.switchTab('profile')">
            ${AuthService.renderAvatar(user, 'w-10 h-10', 'text-xl')}
            <div class="overflow-hidden">
              <div class="font-bold text-sm text-on-surface truncate">${user.name}</div>
              <div class="text-xs font-mono text-primary font-semibold">${user.studentId || 'STU-0000'}</div>
            </div>
          </div>

          <!-- Navigation Links -->
          <div class="flex flex-col gap-1.5 flex-grow text-sm font-semibold">
            <button onclick="StudentView.switchTab('events')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${this.currentTab === 'events' ? 'bg-primary-container text-on-primary-container border-l-4 border-secondary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <span class="material-symbols-outlined ${this.currentTab === 'events' ? 'filled text-secondary' : ''}">explore</span>
              <span>Discover Events</span>
            </button>

            <button onclick="StudentView.switchTab('registrations')" class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left ${this.currentTab === 'registrations' ? 'bg-primary-container text-on-primary-container border-l-4 border-secondary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined ${this.currentTab === 'registrations' ? 'filled text-secondary' : ''}">how_to_reg</span>
                <span>My Registrations</span>
              </div>
              <span class="text-xs font-bold px-2 py-0.5 rounded-full ${myRegistrations.length > 0 ? 'bg-secondary text-on-secondary' : 'bg-surface-variant text-on-surface-variant'}">${myRegistrations.length}</span>
            </button>

            <button onclick="StudentView.switchTab('certificates')" class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left ${this.currentTab === 'certificates' ? 'bg-primary-container text-on-primary-container border-l-4 border-secondary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined ${this.currentTab === 'certificates' ? 'filled text-secondary' : ''}">workspace_premium</span>
                <span>My Certificates</span>
              </div>
              <span class="text-xs font-bold px-2 py-0.5 rounded-full ${certificates.length > 0 ? 'bg-amber-500 text-white' : 'bg-surface-variant text-on-surface-variant'}">${certificates.length}</span>
            </button>

            <button onclick="StudentView.switchTab('leaderboard')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${this.currentTab === 'leaderboard' ? 'bg-primary-container text-on-primary-container border-l-4 border-secondary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <span class="material-symbols-outlined ${this.currentTab === 'leaderboard' ? 'filled text-secondary' : ''}">trophy</span>
              <span>Results & Leaderboard</span>
            </button>

            <button onclick="StudentView.switchTab('notifications')" class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-left ${this.currentTab === 'notifications' ? 'bg-primary-container text-on-primary-container border-l-4 border-secondary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined ${this.currentTab === 'notifications' ? 'filled text-secondary' : ''}">notifications</span>
                <span>Announcements</span>
              </div>
              <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-primary text-on-primary">${announcements.length}</span>
            </button>

            <button onclick="StudentView.switchTab('profile')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${this.currentTab === 'profile' ? 'bg-primary-container text-on-primary-container border-l-4 border-secondary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <span class="material-symbols-outlined ${this.currentTab === 'profile' ? 'filled text-secondary' : ''}">person</span>
              <span>My Profile</span>
            </button>
          </div>

          <!-- Bottom Actions -->
          <div class="mt-auto pt-4 border-t border-outline-variant flex flex-col gap-2">
            <button onclick="App.logout()" class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-error hover:bg-error-container hover:text-on-error-container transition-colors">
              <span class="material-symbols-outlined text-base">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </nav>

        <!-- Main Content Canvas -->
        <main class="flex-grow md:ml-64 w-full p-4 md:p-8 lg:p-10 overflow-x-hidden min-h-screen flex flex-col">
          
          <!-- Header -->
          <header class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h1 class="text-3xl lg:text-4xl font-extrabold text-primary">Welcome, ${user.name.split(' ')[0]} 👋</h1>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary-container text-on-secondary-container">Student</span>
              </div>
              <p class="text-base text-on-surface-variant">${user.college || 'Institution'} • ${user.department || 'Department'}</p>
            </div>

            <div class="flex items-center gap-3">
              <button onclick="StudentView.showIdCardModal()" class="px-4 py-2.5 rounded-lg border border-primary text-primary hover:bg-surface-variant transition-colors font-semibold text-sm flex items-center gap-2">
                <span class="material-symbols-outlined text-lg">badge</span>
                <span>My Event Pass</span>
              </button>
              <button onclick="StudentView.switchTab('events')" class="px-4 py-2.5 rounded-lg bg-primary text-on-primary hover:bg-surface-tint font-semibold text-sm flex items-center gap-2 shadow-sm transition-all">
                <span class="material-symbols-outlined text-lg">search</span>
                <span>Browse Events</span>
              </button>
            </div>
          </header>

          <!-- Dynamic Bento Telemetry Stats Cards -->
          <section class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div class="bg-surface rounded-xl border border-outline-variant p-4 md:p-5 shadow-sm">
              <div class="flex justify-between items-start mb-2">
                <span class="material-symbols-outlined text-primary text-2xl">calendar_month</span>
                <span class="text-2xl font-extrabold text-primary">${allEvents.length}</span>
              </div>
              <h3 class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Available Events</h3>
            </div>

            <div class="bg-surface rounded-xl border border-outline-variant p-4 md:p-5 shadow-sm">
              <div class="flex justify-between items-start mb-2">
                <span class="material-symbols-outlined text-secondary text-2xl">how_to_reg</span>
                <span class="text-2xl font-extrabold text-secondary">${myRegistrations.length}</span>
              </div>
              <h3 class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">My Registrations</h3>
            </div>

            <div class="bg-surface rounded-xl border border-outline-variant p-4 md:p-5 shadow-sm">
              <div class="flex justify-between items-start mb-2">
                <span class="material-symbols-outlined text-amber-500 text-2xl">workspace_premium</span>
                <span class="text-2xl font-extrabold text-amber-600">${certificates.length}</span>
              </div>
              <h3 class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">My Certificates</h3>
            </div>

            <div class="bg-surface rounded-xl border border-outline-variant p-4 md:p-5 shadow-sm">
              <div class="flex justify-between items-start mb-2">
                <span class="material-symbols-outlined text-primary text-2xl">notifications_active</span>
                <span class="text-2xl font-extrabold text-primary">${announcements.length}</span>
              </div>
              <h3 class="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Announcements</h3>
            </div>
          </section>

          <!-- TAB CONTENT CONTAINER -->
          <div class="flex-grow">
            ${this.renderActiveTabContent(allEvents, myRegistrations, announcements, user)}
          </div>

        </main>
      </div>
    `;
  },

  renderActiveTabContent(allEvents, myRegistrations, announcements, user) {
    if (this.currentTab === 'events') {
      return this.renderEventsTab(allEvents, myRegistrations, user);
    } else if (this.currentTab === 'registrations') {
      return this.renderMyRegistrationsTab(myRegistrations, user);
    } else if (this.currentTab === 'certificates') {
      return this.renderCertificatesTab(user);
    } else if (this.currentTab === 'leaderboard') {
      return this.renderLeaderboardTab(allEvents, user);
    } else if (this.currentTab === 'notifications') {
      return this.renderNotificationsTab(announcements, user);
    } else if (this.currentTab === 'profile') {
      return this.renderProfileTab(user);
    }
    return '';
  },

  // LEADERBOARD TAB
  renderLeaderboardTab(events) {
    const publishedEvents = events.filter(e => e.resultsPublished);

    return `
      <section class="animate-fade-in flex flex-col gap-6 max-w-4xl mx-auto">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary text-2xl">trophy</span>
              Official Results & Leaderboard
            </h2>
            <p class="text-xs text-on-surface-variant">Validated rankings and scores certified by the Jury Panels.</p>
          </div>
        </div>

        ${publishedEvents.length === 0 ? `
          <div class="p-12 text-center bg-surface rounded-2xl border border-outline-variant shadow-sm">
            <span class="material-symbols-outlined text-4xl text-outline mb-2">military_tech</span>
            <h3 class="text-sm font-bold text-on-surface">No official results published yet</h3>
            <p class="text-xs text-on-surface-variant mt-1">Evaluations are currently underway. The organizer will authorize and publish standings once jury scoring concludes.</p>
          </div>
        ` : `
          <div class="flex flex-col gap-6">
            ${publishedEvents.map(ev => {
              const leaderboard = window.db.calculateLeaderboard(ev.id);
              return `
                <div class="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col gap-4">
                  <div class="flex justify-between items-center pb-3 border-b border-outline-variant">
                    <div>
                      <span class="text-[10px] font-extrabold uppercase bg-primary-container text-on-primary-container px-2 py-0.5 rounded">${ev.category}</span>
                      <h3 class="text-lg font-bold text-on-surface mt-1">${ev.name}</h3>
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#dcfce7] text-[#166534]">
                      OFFICIAL RESULTS
                    </span>
                  </div>

                  <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                      <thead class="bg-surface-container text-on-surface-variant font-bold uppercase">
                        <tr>
                          <th class="p-3 w-16 text-center">Rank</th>
                          <th class="p-3">Team / Candidate</th>
                          <th class="p-3">Institution</th>
                          <th class="p-3 text-right">Final Score</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-outline-variant">
                        ${leaderboard.map((entry, idx) => `
                          <tr class="${idx < 3 ? 'bg-surface-container-lowest font-semibold' : ''}">
                            <td class="p-3 font-bold text-base text-center">${idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx+1}`}</td>
                            <td class="p-3">
                              <div class="font-bold text-primary">${entry.teamName}</div>
                              <div class="text-[11px] text-on-surface-variant">Lead: ${entry.leadName}</div>
                            </td>
                            <td class="p-3 text-on-surface-variant">${entry.college}</td>
                            <td class="p-3 text-right font-extrabold text-sm text-primary">${entry.score > 0 ? `${entry.score} / 100` : 'Pending'}</td>
                          </tr>
                        `).join('')}
                      </tbody>
                    </table>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </section>
    `;
  },

  // DEDICATED MY CERTIFICATES TAB (PRD Requirements 13, 15, 16, 17, 18)
  renderCertificatesTab(user) {
    const certificates = window.db.getCertificatesByStudent(user.studentId);

    return `
      <section class="animate-fade-in flex flex-col gap-6 max-w-4xl mx-auto">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-amber-500 text-2xl">workspace_premium</span>
              <span>My Verified Certificates</span>
            </h2>
            <p class="text-xs text-on-surface-variant">Official verified credentials, winner distinctions, and participation certificates.</p>
          </div>
          <span class="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">${certificates.length} Issued</span>
        </div>

        ${certificates.length === 0 ? `
          <div class="p-12 text-center bg-surface rounded-2xl border border-outline-variant shadow-sm">
            <span class="material-symbols-outlined text-5xl text-outline mb-2">military_tech</span>
            <h3 class="text-base font-bold text-on-surface">No Certificates Available Yet</h3>
            <p class="text-xs text-on-surface-variant mt-1">Official certificates are automatically generated and linked to your profile when event organizers publish validated jury results.</p>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${certificates.map(cert => {
              const isWinner = cert.award === 'Winner';
              const isRunnerUp = cert.award === 'Runner-up';
              const isSecondRunnerUp = cert.award === 'Second Runner-up';

              let medalBadge = '🎓 Participation';
              let badgeBg = 'bg-surface-container text-on-surface';
              let borderClass = 'border-outline-variant';

              if (isWinner) {
                medalBadge = '🥇 Winner (Rank #1)';
                badgeBg = 'bg-amber-500 text-white';
                borderClass = 'border-amber-400 bg-amber-500/5 shadow-md';
              } else if (isRunnerUp) {
                medalBadge = '🥈 Runner-up (Rank #2)';
                badgeBg = 'bg-slate-500 text-white';
                borderClass = 'border-slate-400 bg-slate-500/5 shadow-md';
              } else if (isSecondRunnerUp) {
                medalBadge = '🥉 2nd Runner-up (Rank #3)';
                badgeBg = 'bg-amber-700 text-white';
                borderClass = 'border-amber-700 bg-amber-700/5 shadow-md';
              }

              return `
                <div class="p-5 rounded-2xl bg-surface border ${borderClass} shadow-sm flex flex-col justify-between gap-4">
                  <div>
                    <div class="flex justify-between items-start mb-2">
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${badgeBg}">
                        ${medalBadge}
                      </span>
                      <span class="text-[10px] font-mono text-on-surface-variant">${cert.certificateId}</span>
                    </div>

                    <h3 class="text-base font-extrabold text-on-surface mt-1">${cert.eventName}</h3>
                    <p class="text-xs text-on-surface-variant mt-0.5">Awarded to <strong>${cert.studentName}</strong> (${cert.college})</p>
                    <div class="text-[11px] text-on-surface-variant mt-2">
                      📅 Issued: ${new Date(cert.issuedDate).toLocaleDateString()} ${cert.score ? `• Score: <strong class="text-primary">${cert.score}/100</strong>` : ''}
                    </div>
                  </div>

                  <div class="flex items-center gap-2 pt-3 border-t border-outline-variant/60">
                    <button onclick="StudentView.showDirectCertificateModal('${cert.certificateId}')" class="flex-1 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow hover:opacity-95 flex items-center justify-center gap-1.5">
                      <span class="material-symbols-outlined text-sm">visibility</span>
                      <span>View Certificate</span>
                    </button>
                    <button onclick="StudentView.downloadCertificatePdf('${cert.certificateId}')" class="px-4 py-2 rounded-xl border border-primary text-primary font-bold text-xs hover:bg-surface-variant flex items-center justify-center gap-1.5">
                      <span class="material-symbols-outlined text-sm">download</span>
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </section>
    `;
  },

  // 1. DISCOVER EVENTS TAB
  renderEventsTab(events, myRegistrations) {
    let filtered = events;
    if (this.categoryFilter !== 'ALL') {
      filtered = filtered.filter(e => e.type.toUpperCase() === this.categoryFilter.toUpperCase());
    }
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(q) || 
        (e.category && e.category.toLowerCase().includes(q)) || 
        (e.venue && e.venue.toLowerCase().includes(q))
      );
    }

    const registeredEventIds = myRegistrations.map(r => r.eventId);
    const user = window.auth.getCurrentUser();
    const smartInsights = window.SmartEngine.generateSmartInsights();

    // Priority 2: Smart Recommendations (Calculated dynamically)
    const recommendedEvents = events.map(e => ({
      event: e,
      match: window.SmartEngine.calculateEventMatch(user, e)
    })).sort((a, b) => b.match.score - a.match.score);

    return `
      <section class="animate-fade-in flex flex-col gap-6">
        
        <!-- Priority 6: Smart Insights Banner ("Wow Factor") -->
        <div class="p-4 rounded-2xl bg-gradient-to-r from-primary/5 via-tertiary/5 to-secondary/5 border border-primary/20 shadow-sm flex flex-col gap-2">
          <div class="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-primary">
            <span class="material-symbols-outlined text-base filled text-secondary">auto_awesome</span>
            <span>Live Smart Insights</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            ${smartInsights.map(ins => `
              <div class="p-2.5 bg-surface/80 rounded-xl border border-outline-variant/60 flex items-start gap-2 backdrop-blur-sm">
                <span class="material-symbols-outlined text-base ${ins.color} flex-shrink-0 mt-0.5">${ins.icon}</span>
                <div>
                  <span class="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-surface-container font-mono">${ins.badge}</span>
                  <p class="text-[11px] text-on-surface leading-tight mt-1">${ins.text}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Priority 2: AI Smart Recommendations Carousel -->
        ${recommendedEvents.length > 0 && user ? `
          <div class="bg-surface rounded-2xl p-5 border border-outline-variant shadow-sm flex flex-col gap-3">
            <div class="flex justify-between items-center pb-2 border-b border-outline-variant/60">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-gradient-to-tr from-secondary to-teal-500 text-white flex items-center justify-center font-bold">
                  <span class="material-symbols-outlined text-base">psychology</span>
                </div>
                <div>
                  <h3 class="text-sm font-extrabold text-on-surface">Recommended For You</h3>
                  <p class="text-[11px] text-on-surface-variant">Matched with your skills in <strong>${user.skills || 'Engineering'}</strong> & department stream</p>
                </div>
              </div>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-secondary-container text-on-secondary-container">
                AI Match Active
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              ${recommendedEvents.slice(0, 2).map(item => `
                <div class="p-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all border border-outline-variant flex justify-between items-center gap-3">
                  <div class="overflow-hidden">
                    <div class="flex items-center gap-1.5 mb-0.5">
                      <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-secondary text-white font-mono">
                        ${item.match.score}% Match
                      </span>
                      <span class="text-[10px] text-on-surface-variant truncate">${item.event.category}</span>
                    </div>
                    <h4 class="text-xs font-bold text-on-surface truncate">${item.event.name}</h4>
                    <p class="text-[10px] text-on-surface-variant truncate mt-0.5">💡 ${item.match.reason}</p>
                  </div>
                  <button onclick="StudentView.showEventDetailsModal('${item.event.id}')" class="px-3 py-1.5 rounded-lg bg-primary text-white font-bold text-xs hover:opacity-95 whitespace-nowrap shadow-sm">
                    View
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Controls Bar -->
        <div class="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-surface p-4 rounded-xl border border-outline-variant shadow-sm">
          <div class="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            ${['ALL', 'Coding', 'Hackathon', 'Technical', 'Cultural', 'Robotics', 'Workshop', 'Conference'].map(cat => `
              <button onclick="StudentView.setCategory('${cat}')" class="px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${this.categoryFilter === cat ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'}">
                ${cat === 'ALL' ? 'All Events' : cat}
              </button>
            `).join('')}
          </div>

          <div class="relative min-w-[240px]">
            <span class="material-symbols-outlined absolute left-3 top-2.5 text-outline text-lg">search</span>
            <input type="text" placeholder="Search events..." value="${this.searchQuery}" oninput="StudentView.handleSearch(this.value)" class="w-full pl-9 pr-3 py-2 text-xs border border-outline-variant rounded-lg bg-surface focus:outline-none focus:border-primary" />
          </div>
        </div>

        <!-- Events Grid (Pure DB Data) -->
        ${filtered.length === 0 ? `
          <div class="p-12 text-center bg-surface rounded-2xl border border-outline-variant">
            <span class="material-symbols-outlined text-5xl text-outline mb-2">event_busy</span>
            <h3 class="text-base font-bold text-on-surface">No events available yet</h3>
            <p class="text-xs text-on-surface-variant mt-1">Check back later for upcoming events published by the organizers.</p>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${filtered.map(event => {
              const isRegistered = registeredEventIds.includes(event.id);
              const capacityPercent = event.capacity > 0 ? Math.min(100, Math.round((event.registeredCount / event.capacity) * 100)) : 0;
              const isFull = event.registeredCount >= event.capacity;
              const dateObj = new Date(event.startDate);
              const monthStr = dateObj.toLocaleString('default', { month: 'short' }).toUpperCase();
              const dayStr = dateObj.getDate();

              let statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#dcfce7] text-[#166534]">REGISTRATION OPEN</span>`;
              if (event.status === 'LIVE') {
                statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#fee2e2] text-[#991b1b]">LIVE NOW</span>`;
              } else if (isFull || event.status === 'REGISTRATION_CLOSED') {
                statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-surface-variant text-on-surface-variant">CLOSED / FULL</span>`;
              }

              return `
                <article class="bg-surface rounded-xl border border-outline-variant shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-all group">
                  <div class="relative h-40 w-full bg-surface-container-high overflow-hidden flex items-center justify-center">
                    ${event.banner ? `<img src="${event.banner}" class="w-full h-full object-cover" alt="${event.name}" />` : `<span class="material-symbols-outlined text-5xl text-outline">event</span>`}
                    
                    <div class="absolute bottom-3 left-3 bg-surface/95 backdrop-blur text-on-surface font-semibold text-xs px-3 py-1.5 rounded-lg shadow flex flex-col items-center leading-tight">
                      <span class="text-primary font-extrabold text-[11px]">${monthStr}</span>
                      <span class="text-base font-extrabold">${dayStr}</span>
                    </div>

                    <div class="absolute top-3 left-3">
                      ${statusBadge}
                    </div>

                    ${user ? `
                      <div class="absolute top-3 right-3 bg-surface/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold text-secondary border border-secondary/30 shadow-sm flex items-center gap-1">
                        <span class="material-symbols-outlined text-xs">psychology</span>
                        <span>${window.SmartEngine.calculateEventMatch(user, event).score}%</span>
                      </div>
                    ` : ''}
                  </div>

                  <div class="p-5 flex flex-col flex-grow">
                    <div class="flex items-center justify-between mb-1 text-xs text-on-surface-variant">
                      <span class="font-semibold text-primary">${event.category || event.type}</span>
                      <span>${event.isTeamEvent ? `Team (${event.teamMin}-${event.teamMax})` : 'Individual'}</span>
                    </div>

                    <h3 class="text-lg font-bold text-on-surface leading-tight mb-2 group-hover:text-primary transition-colors">
                      ${event.name}
                    </h3>

                    <p class="text-xs text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">
                      ${event.description}
                    </p>

                    <div class="flex items-center gap-2 text-xs text-on-surface-variant mb-4">
                      <span class="material-symbols-outlined text-sm text-secondary">location_on</span>
                      <span class="truncate">${event.venue}</span>
                    </div>

                    <div class="mt-auto mb-4">
                      <div class="flex justify-between text-xs font-semibold mb-1">
                        <span class="text-on-surface-variant">Seats Registered</span>
                        <span class="${isFull ? 'text-error' : 'text-primary'}">${event.registeredCount} / ${event.capacity} (${capacityPercent}%)</span>
                      </div>
                      <div class="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                        <div class="h-full rounded-full transition-all duration-500 ${capacityPercent > 90 ? 'bg-error' : 'bg-secondary'}" style="width: ${capacityPercent}%"></div>
                      </div>
                    </div>

                    <div class="flex gap-2">
                      <button onclick="StudentView.showEventDetailsModal('${event.id}')" class="flex-1 py-2 rounded-lg border border-primary text-primary hover:bg-surface-variant font-semibold text-xs transition-colors">
                        Details
                      </button>

                      ${isRegistered ? `
                        <button onclick="StudentView.switchTab('registrations')" class="flex-1 py-2 rounded-lg bg-secondary text-on-secondary font-semibold text-xs flex items-center justify-center gap-1 shadow-sm">
                          <span class="material-symbols-outlined text-sm">check_circle</span>
                          <span>Registered</span>
                        </button>
                      ` : isFull || event.status === 'REGISTRATION_CLOSED' ? `
                        <button disabled class="flex-1 py-2 rounded-lg bg-surface-container-high text-outline font-semibold text-xs cursor-not-allowed">
                          Closed
                        </button>
                      ` : `
                        <button onclick="StudentView.showRegistrationModal('${event.id}')" class="flex-1 py-2 rounded-lg bg-primary text-on-primary hover:bg-surface-tint font-semibold text-xs shadow-sm flex items-center justify-center gap-1">
                          <span>Register</span>
                          <span class="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                      `}
                    </div>
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        `}
      </section>
    `;
  },

  // 2. MY REGISTRATIONS TAB
  renderMyRegistrationsTab(myRegistrations) {
    const user = window.auth.getCurrentUser();
    if (myRegistrations.length === 0) {
      return `
        <div class="animate-fade-in p-12 text-center bg-surface rounded-2xl border border-outline-variant shadow-sm max-w-xl mx-auto">
          <div class="w-16 h-16 rounded-full bg-primary-container text-on-primary flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-3xl">how_to_reg</span>
          </div>
          <h3 class="text-xl font-bold text-primary mb-2">No Event Registrations Yet</h3>
          <p class="text-sm text-on-surface-variant mb-6">Explore the events catalogue and register to generate your digital event badge.</p>
          <button onclick="StudentView.switchTab('events')" class="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-semibold text-sm shadow hover:opacity-90 transition-opacity">
            Discover Events
          </button>
        </div>
      `;
    }

    return `
      <section class="animate-fade-in flex flex-col gap-6">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-bold text-primary">My Registered Events</h2>
            <p class="text-xs text-on-surface-variant">Live tracking pipeline and digital event badges.</p>
          </div>
        </div>

        <div class="flex flex-col gap-6">
          ${myRegistrations.map(reg => {
            const event = window.db.getEventById(reg.eventId);
            if (!event) return '';

            const tracking = reg.tracking || {
              registration: 'COMPLETED',
              checkIn: 'PENDING',
              eventStarted: 'PENDING',
              submission: 'PENDING',
              judging: 'PENDING',
              results: 'PENDING'
            };

            const steps = [
              { key: 'registration', label: 'Registration', icon: 'how_to_reg' },
              { key: 'checkIn', label: 'Check-in', icon: 'pin_drop' },
              { key: 'eventStarted', label: 'Event Active', icon: 'flag' },
              { key: 'submission', label: 'Submission', icon: 'upload_file' },
              { key: 'judging', label: 'Evaluation', icon: 'gavel' },
              { key: 'results', label: 'Results', icon: 'trophy' }
            ];

            return `
              <div class="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col gap-6">
                <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-outline-variant">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-primary-container text-on-primary-container uppercase">${event.type}</span>
                      <span class="text-xs font-mono font-bold text-secondary">Reg ID: ${reg.id}</span>
                    </div>
                    <h3 class="text-xl font-bold text-on-surface">${event.name}</h3>
                    <p class="text-xs text-on-surface-variant mt-0.5">
                      ${reg.teamName ? `Team: <strong class="text-primary">${reg.teamName}</strong> • ` : ''} 
                      📍 ${event.venue} • 📅 ${new Date(event.startDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div class="flex flex-wrap gap-2 items-center">
                    <button onclick="StudentView.showPassModal('${reg.id}')" class="px-3.5 py-2 rounded-lg border border-outline text-on-surface bg-surface hover:bg-surface-variant font-semibold text-xs flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-base text-primary">qr_code_scanner</span>
                      <span>Digital Pass</span>
                    </button>

                    ${reg.status === 'CHECKED_IN' || event.status === 'RESULTS' || event.status === 'COMPLETED' ? `
                      <button onclick="StudentView.showCertificateModal('${reg.id}')" class="px-3.5 py-2 rounded-lg bg-gradient-to-r from-secondary to-teal-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-95">
                        <span class="material-symbols-outlined text-base">workspace_premium</span>
                        <span>Certificate</span>
                      </button>
                    ` : ''}

                    ${event.type === 'Hackathon' || event.type === 'Coding' || event.type === 'Technical' ? `
                      <button onclick="StudentView.showSubmissionModal('${reg.id}')" class="px-3.5 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs flex items-center gap-1.5 shadow-sm hover:bg-surface-tint">
                        <span class="material-symbols-outlined text-base">cloud_upload</span>
                        <span>${reg.submission ? 'Update Submission' : 'Submit Project'}</span>
                      </button>
                    ` : ''}
                  </div>
                </div>

                <!-- REAL-TIME TRACKING PIPELINE -->
                <div>
                  <div class="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-base text-secondary">timeline</span>
                    <span>Live Event Progress</span>
                  </div>

                  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    ${steps.map((step) => {
                      const state = tracking[step.key] || 'PENDING';
                      let cardClass = 'bg-surface-container border-outline-variant opacity-75';
                      let iconClass = 'text-on-surface-variant';
                      let statusText = 'Pending';
                      let badgeColor = 'bg-surface-variant text-on-surface-variant';

                      if (state === 'COMPLETED') {
                        cardClass = 'bg-secondary-container/30 border-secondary shadow-sm';
                        iconClass = 'text-secondary filled';
                        statusText = 'Done';
                        badgeColor = 'bg-secondary text-on-secondary';
                      } else if (state === 'IN_PROGRESS') {
                        cardClass = 'bg-primary-container/30 border-primary shadow-sm';
                        iconClass = 'text-primary animate-pulse';
                        statusText = 'Active';
                        badgeColor = 'bg-primary text-on-primary';
                      }

                      return `
                        <div class="p-3 rounded-xl border flex flex-col items-center text-center transition-all ${cardClass}">
                          <div class="w-8 h-8 rounded-full flex items-center justify-center mb-1.5">
                            <span class="material-symbols-outlined text-xl ${iconClass}">${step.icon}</span>
                          </div>
                          <div class="text-xs font-bold text-on-surface">${step.label}</div>
                          <span class="mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${badgeColor}">${statusText}</span>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>

                <!-- PERSONALIZED WINNER & RESULT STANDING BANNER (PRD Requirements 13, 14, 15, 17) -->
                ${(() => {
                  const studentResult = window.db.getStudentEventResult(user.studentId, event.id);
                  if (!studentResult || !studentResult.isPublished) {
                    return `
                      <div class="p-3.5 rounded-xl bg-surface-container border border-outline-variant/60 flex items-center justify-between text-xs">
                        <div class="flex items-center gap-2 text-on-surface-variant">
                          <span class="material-symbols-outlined text-base">lock</span>
                          <span>Results Status: <strong>Results Pending Jury Authorization</strong> (Evaluation in progress)</span>
                        </div>
                        <span class="text-[10px] font-mono text-outline">Private Draft</span>
                      </div>
                    `;
                  }

                  if (studentResult.isWinner) {
                    return `
                      <div class="p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-400/20 to-amber-600/20 border-2 border-amber-400 text-on-surface shadow-md animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div class="flex items-center gap-3.5">
                          <div class="w-12 h-12 rounded-full bg-amber-400 text-white flex items-center justify-center text-2xl shadow">🏆</div>
                          <div>
                            <div class="text-[10px] font-extrabold uppercase text-amber-700 tracking-wider">OFFICIAL RESULT</div>
                            <h4 class="text-lg font-extrabold text-amber-800">CONGRATULATIONS! You are the Winner!</h4>
                            <p class="text-xs text-on-surface mt-0.5">Rank: <strong class="text-amber-800 font-mono text-sm">#1</strong> • Final Score: <strong class="text-amber-800 font-mono text-sm">${studentResult.score} / 100</strong> • Award: <strong class="px-2 py-0.5 bg-amber-500 text-white rounded text-[10px] font-extrabold">Winner 🥇</strong></p>
                          </div>
                        </div>
                        <button onclick="StudentView.switchTab('leaderboard')" class="px-4 py-2 bg-amber-500 text-white rounded-xl font-bold text-xs shadow hover:bg-amber-600 whitespace-nowrap">
                          View Full Standings ↗
                        </button>
                      </div>
                    `;
                  } else if (studentResult.isRunnerUp) {
                    return `
                      <div class="p-5 rounded-2xl bg-gradient-to-r from-slate-300/30 to-slate-400/20 border-2 border-slate-400 text-on-surface shadow-md animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div class="flex items-center gap-3.5">
                          <div class="w-12 h-12 rounded-full bg-slate-400 text-white flex items-center justify-center text-2xl shadow">🥈</div>
                          <div>
                            <div class="text-[10px] font-extrabold uppercase text-slate-700 tracking-wider">OFFICIAL RESULT</div>
                            <h4 class="text-lg font-extrabold text-slate-800">Congratulations! You secured Rank #2.</h4>
                            <p class="text-xs text-on-surface mt-0.5">Rank: <strong class="text-slate-800 font-mono text-sm">#2</strong> • Final Score: <strong class="text-slate-800 font-mono text-sm">${studentResult.score} / 100</strong> • Award: <strong class="px-2 py-0.5 bg-slate-500 text-white rounded text-[10px] font-extrabold">Runner-up 🥈</strong></p>
                          </div>
                        </div>
                        <button onclick="StudentView.switchTab('leaderboard')" class="px-4 py-2 bg-slate-600 text-white rounded-xl font-bold text-xs shadow hover:bg-slate-700 whitespace-nowrap">
                          View Full Standings ↗
                        </button>
                      </div>
                    `;
                  } else if (studentResult.isSecondRunnerUp) {
                    return `
                      <div class="p-5 rounded-2xl bg-gradient-to-r from-amber-700/20 to-amber-800/10 border-2 border-amber-700 text-on-surface shadow-md animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div class="flex items-center gap-3.5">
                          <div class="w-12 h-12 rounded-full bg-amber-700 text-white flex items-center justify-center text-2xl shadow">🥉</div>
                          <div>
                            <div class="text-[10px] font-extrabold uppercase text-amber-900 tracking-wider">OFFICIAL RESULT</div>
                            <h4 class="text-lg font-extrabold text-amber-950">Congratulations! You secured Rank #3.</h4>
                            <p class="text-xs text-on-surface mt-0.5">Rank: <strong class="text-amber-950 font-mono text-sm">#3</strong> • Final Score: <strong class="text-amber-950 font-mono text-sm">${studentResult.score} / 100</strong> • Award: <strong class="px-2 py-0.5 bg-amber-700 text-white rounded text-[10px] font-extrabold">Second Runner-up 🥉</strong></p>
                          </div>
                        </div>
                        <button onclick="StudentView.switchTab('leaderboard')" class="px-4 py-2 bg-amber-700 text-white rounded-xl font-bold text-xs shadow hover:bg-amber-800 whitespace-nowrap">
                          View Full Standings ↗
                        </button>
                      </div>
                    `;
                  } else {
                    return `
                      <div class="p-4 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-between text-xs animate-fade-in">
                        <div class="flex items-center gap-3">
                          <span class="text-xl">📊</span>
                          <div>
                            <span class="font-bold text-on-surface">Official Results Published</span>
                            <div class="text-on-surface-variant mt-0.5">Your Rank: <strong class="text-primary font-mono">#${studentResult.rank}</strong> • Final Score: <strong class="text-primary font-mono">${studentResult.score} / 100</strong> • Thank you for participating!</div>
                          </div>
                        </div>
                        <button onclick="StudentView.switchTab('leaderboard')" class="px-3.5 py-1.5 bg-primary-container text-on-primary-container font-bold rounded-lg hover:bg-primary hover:text-white transition-colors">
                          Standings
                        </button>
                      </div>
                    `;
                  }
                })()}
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;
  },

  // 3. NOTIFICATIONS TAB
  renderNotificationsTab(announcements) {
    return `
      <section class="animate-fade-in max-w-4xl mx-auto flex flex-col gap-4">
        <div class="flex justify-between items-center mb-2">
          <div>
            <h2 class="text-xl font-bold text-primary flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary">notifications</span>
              <span>Announcements & Broadcasts</span>
            </h2>
            <p class="text-xs text-on-surface-variant">Live event bulletins, schedule changes, and official result releases.</p>
          </div>
          <span class="px-3 py-1 bg-primary text-on-primary text-xs font-semibold rounded-full">${announcements.length} Messages</span>
        </div>

        ${announcements.length === 0 ? `
          <div class="p-12 text-center bg-surface rounded-2xl border border-outline-variant text-on-surface-variant">
            <span class="material-symbols-outlined text-4xl text-outline mb-2">notifications_off</span>
            <p class="text-sm font-bold text-on-surface">No announcements yet</p>
          </div>
        ` : `
          <div class="flex flex-col gap-4">
            ${announcements.map(ann => `
              <div class="p-5 rounded-2xl bg-surface border ${ann.type === 'RESULT' ? 'border-amber-400 bg-amber-500/5 shadow-md' : 'border-outline-variant shadow-sm'} flex items-start gap-4 transition-all">
                <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${ann.type === 'RESULT' ? 'bg-amber-400 text-white' : 'bg-primary-container text-on-primary-container'}">
                  <span class="material-symbols-outlined text-xl">${ann.type === 'RESULT' ? 'military_tech' : 'campaign'}</span>
                </div>
                <div class="flex-grow">
                  <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div class="flex items-center gap-2">
                      <h4 class="text-sm font-extrabold ${ann.type === 'RESULT' ? 'text-amber-900' : 'text-on-surface'}">${ann.title}</h4>
                      ${ann.type === 'RESULT' ? `<span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500 text-white uppercase">Official Result</span>` : ''}
                    </div>
                    <span class="text-[11px] text-on-surface-variant">${new Date(ann.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                  <p class="text-xs text-on-surface-variant leading-relaxed mb-3">${ann.content}</p>
                  
                  <div class="flex items-center justify-between">
                    <span class="px-2.5 py-0.5 rounded-lg bg-surface-container border border-outline-variant/60 text-[10px] font-bold text-primary">${ann.eventName || 'Global'}</span>
                    
                    ${ann.type === 'RESULT' ? `
                      <button onclick="StudentView.switchTab('leaderboard')" class="px-3.5 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold shadow hover:bg-amber-600 flex items-center gap-1">
                        <span>🏆 View Results</span>
                      </button>
                    ` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </section>
    `;
  },

  // 4. PROFILE TAB WITH REAL PHOTO UPLOAD
  renderProfileTab(user) {
    return `
      <section class="animate-fade-in max-w-3xl mx-auto flex flex-col gap-6">
        <div class="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div class="flex flex-col items-center gap-2">
            ${AuthService.renderAvatar(user, 'w-24 h-24', 'text-4xl')}
            
            <div class="flex gap-2">
              <label class="px-3 py-1 bg-surface-container border border-outline-variant rounded-lg text-xs font-bold text-primary hover:bg-surface-variant cursor-pointer">
                <span>Upload</span>
                <input type="file" accept="image/png, image/jpeg, image/webp" class="hidden" onchange="StudentView.handlePhotoUpload(event)" />
              </label>

              ${user.avatar ? `
                <button onclick="StudentView.handleRemovePhoto()" class="px-3 py-1 bg-surface-variant text-error rounded-lg text-xs font-bold hover:bg-error-container" title="Remove custom photo">
                  Remove
                </button>
              ` : ''}
            </div>
          </div>

          <div class="flex-grow text-center sm:text-left">
            <h2 class="text-2xl font-bold text-on-surface mb-1">${user.name}</h2>
            <p class="text-xs text-on-surface-variant mb-3">${user.college || 'Institution'} • ${user.email}</p>
            
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="p-2.5 rounded-lg bg-surface-container border border-outline-variant">
                <div class="text-[10px] uppercase font-bold text-on-surface-variant">Student ID</div>
                <div class="font-mono font-bold text-primary">${user.studentId}</div>
              </div>
              <div class="p-2.5 rounded-lg bg-surface-container border border-outline-variant">
                <div class="text-[10px] uppercase font-bold text-on-surface-variant">Department</div>
                <div class="font-bold text-on-surface truncate">${user.department || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm">
          <h4 class="text-sm font-bold text-primary uppercase tracking-wider mb-4">Edit Profile Information</h4>
          
          <form onsubmit="StudentView.handleProfileUpdate(event)" class="flex flex-col gap-4 text-xs">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <label class="font-bold text-on-surface-variant">Full Name</label>
                <input id="stu-prof-name" class="px-3 py-2 border border-outline-variant rounded-lg bg-surface text-xs" value="${user.name}" required />
              </div>
              <div class="flex flex-col gap-1">
                <label class="font-bold text-on-surface-variant">Institution / College</label>
                <input id="stu-prof-college" class="px-3 py-2 border border-outline-variant rounded-lg bg-surface text-xs" value="${user.college || ''}" required />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <label class="font-bold text-on-surface-variant">Department / Course</label>
                <input id="stu-prof-dept" class="px-3 py-2 border border-outline-variant rounded-lg bg-surface text-xs" value="${user.department || ''}" required />
              </div>
              <div class="flex flex-col gap-1">
                <label class="font-bold text-on-surface-variant">Skills & Technical Interests</label>
                <input id="stu-prof-skills" class="px-3 py-2 border border-outline-variant rounded-lg bg-surface text-xs" value="${user.skills || ''}" placeholder="e.g. React, Python, UI Design" />
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <button type="submit" class="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-bold text-xs shadow hover:bg-surface-tint">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </section>
    `;
  },

  switchTab(tab) {
    this.currentTab = tab;
    App.render();
  },

  setCategory(cat) {
    this.categoryFilter = cat;
    App.render();
  },

  handleSearch(val) {
    this.searchQuery = val;
    App.render();
  },

  handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      App.toast('Please upload a valid image (JPG, PNG, or WebP).', 'error');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      App.toast('Image size must be less than 3MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      const user = window.auth.getCurrentUser();
      window.db.updateProfilePhoto(user.id, base64);
      App.toast('Profile photo updated!', 'success');
      App.render();
    };
    reader.readAsDataURL(file);
  },

  handleRemovePhoto() {
    if (confirm('Remove profile photo? Standard user icon will be used.')) {
      const user = window.auth.getCurrentUser();
      window.db.updateProfilePhoto(user.id, null);
      App.toast('Profile photo removed.', 'info');
      App.render();
    }
  },

  handleProfileUpdate(e) {
    e.preventDefault();
    try {
      const user = window.auth.getCurrentUser();
      const name = document.getElementById('stu-prof-name').value;
      const college = document.getElementById('stu-prof-college').value;
      const department = document.getElementById('stu-prof-dept').value;
      const skills = document.getElementById('stu-prof-skills').value;

      window.auth.updateAccount(user.id, {
        name,
        college,
        department,
        skills
      });

      App.toast('Profile updated!', 'success');
      App.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  showEventDetailsModal(eventId) {
    const event = window.db.getEventById(eventId);
    if (!event) return;

    const user = window.auth.getCurrentUser();
    const myRegistrations = window.db.getRegistrationsByStudent(user.studentId);
    const isRegistered = myRegistrations.some(r => r.eventId === eventId);
    const isFull = event.registeredCount >= event.capacity;

    const modalHtml = `
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in" id="event-detail-modal" onclick="if(event.target.id==='event-detail-modal') this.remove()">
        <div class="bg-surface rounded-2xl max-w-2xl w-full border border-outline-variant p-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-4">
            <div>
              <span class="text-[10px] font-bold text-primary uppercase">${event.category || event.type}</span>
              <h2 class="text-xl font-extrabold text-on-surface">${event.name}</h2>
            </div>
            <button onclick="document.getElementById('event-detail-modal').remove()" class="p-1 rounded-full"><span class="material-symbols-outlined">close</span></button>
          </div>

          <p class="text-xs text-on-surface-variant leading-relaxed mb-4">${event.description}</p>

          <div class="grid grid-cols-2 gap-3 mb-4 text-xs">
            <div class="p-3 bg-surface-container rounded-xl border border-outline-variant">
              <span class="text-[10px] uppercase font-bold text-on-surface-variant">Dates</span>
              <div class="font-bold text-primary mt-0.5">${new Date(event.startDate).toLocaleDateString()} - ${new Date(event.endDate).toLocaleDateString()}</div>
            </div>
            <div class="p-3 bg-surface-container rounded-xl border border-outline-variant">
              <span class="text-[10px] uppercase font-bold text-on-surface-variant">Venue</span>
              <div class="font-bold text-primary mt-0.5 truncate">${event.venue}</div>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-outline-variant">
            <button onclick="document.getElementById('event-detail-modal').remove()" class="px-4 py-2 border rounded-lg text-xs font-bold">Close</button>
            ${isRegistered ? `
              <span class="px-4 py-2 text-xs font-bold text-secondary flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">check_circle</span> Registered
              </span>
            ` : isFull ? `
              <span class="px-4 py-2 text-xs font-bold text-error">Event Full</span>
            ` : `
              <button onclick="document.getElementById('event-detail-modal').remove(); StudentView.showRegistrationModal('${event.id}')" class="px-5 py-2 bg-primary text-on-primary font-bold text-xs rounded-lg shadow">
                Register Now
              </button>
            `}
          </div>
        </div>
      </div>
    `;

    const el = document.createElement('div');
    el.innerHTML = modalHtml;
    document.body.appendChild(el.firstElementChild);
  },

  showRegistrationModal(eventId) {
    const event = window.db.getEventById(eventId);
    if (!event) return;
    const user = window.auth.getCurrentUser();

    const modalHtml = `
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" id="reg-wizard-modal" onclick="if(event.target.id==='reg-wizard-modal') this.remove()">
        <div class="bg-surface rounded-2xl max-w-lg w-full border border-outline-variant p-6 shadow-2xl relative">
          <div class="flex justify-between items-center mb-4">
            <div>
              <span class="text-xs font-bold text-secondary uppercase">Registration</span>
              <h3 class="text-xl font-bold text-primary">${event.name}</h3>
            </div>
            <button onclick="document.getElementById('reg-wizard-modal').remove()" class="p-1 rounded-full"><span class="material-symbols-outlined">close</span></button>
          </div>

          <form onsubmit="StudentView.handleRegistrationSubmit(event, '${event.id}')" class="flex flex-col gap-3 text-xs">
            <div class="p-3 bg-surface-container rounded-xl border border-outline-variant">
              <div><strong>Participant:</strong> ${user.name} (${user.studentId})</div>
              <div><strong>Institution:</strong> ${user.college}</div>
            </div>

            ${event.isTeamEvent ? `
              <div class="flex flex-col gap-1">
                <label class="font-bold">Team Name</label>
                <input id="reg-team-name" class="px-3 py-2 border rounded-lg bg-surface text-xs" placeholder="e.g. Team Vanguard" required />
              </div>
            ` : ''}

            <div class="flex justify-end gap-2 mt-3">
              <button type="button" onclick="document.getElementById('reg-wizard-modal').remove()" class="px-4 py-2 border rounded-lg">Cancel</button>
              <button type="submit" class="px-6 py-2 bg-primary text-on-primary font-bold rounded-lg shadow">Confirm Registration</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const el = document.createElement('div');
    el.innerHTML = modalHtml;
    document.body.appendChild(el.firstElementChild);
  },

  handleRegistrationSubmit(e, eventId) {
    e.preventDefault();
    try {
      const user = window.auth.getCurrentUser();
      const teamNameInput = document.getElementById('reg-team-name');
      const teamName = teamNameInput ? teamNameInput.value : null;

      const reg = window.db.registerForEvent(user, eventId, { teamName });
      const modal = document.getElementById('reg-wizard-modal');
      if (modal) modal.remove();

      App.toast(`Registered successfully! Reg ID: ${reg.id}`, 'success');
      this.currentTab = 'registrations';
      App.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  showSubmissionModal(regId) {
    const reg = window.db.getRegistrations().find(r => r.id === regId);
    if (!reg) return;
    const event = window.db.getEventById(reg.eventId);
    const prev = reg.submission || {};

    const modalHtml = `
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" id="submission-modal" onclick="if(event.target.id==='submission-modal') this.remove()">
        <div class="bg-surface rounded-2xl max-w-lg w-full border border-outline-variant p-6 shadow-2xl relative">
          <div class="flex justify-between items-center mb-4">
            <div>
              <span class="text-xs font-bold text-primary uppercase">Project Submission</span>
              <h3 class="text-xl font-bold text-on-surface">${event ? event.name : 'Event'}</h3>
            </div>
            <button onclick="document.getElementById('submission-modal').remove()" class="p-1 rounded-full"><span class="material-symbols-outlined">close</span></button>
          </div>

          <form onsubmit="StudentView.handleSubmissionSubmit(event, '${reg.id}')" class="flex flex-col gap-3 text-xs">
            <div class="flex flex-col gap-1">
              <label class="font-bold">Project Title</label>
              <input id="sub-title" class="px-3 py-2 border rounded-lg bg-surface text-xs" placeholder="e.g. AI Diagnostic Assistant" value="${prev.title || ''}" required />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-bold">Source Code / Repository URL</label>
              <input id="sub-repo" type="url" class="px-3 py-2 border rounded-lg bg-surface text-xs" placeholder="https://github.com/..." value="${prev.repoUrl || ''}" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-bold">Live Demo / Pitch Video URL</label>
              <input id="sub-demo" type="url" class="px-3 py-2 border rounded-lg bg-surface text-xs" placeholder="https://..." value="${prev.demoUrl || ''}" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-bold">Brief Description</label>
              <textarea id="sub-desc" rows="3" class="px-3 py-2 border rounded-lg bg-surface text-xs">${prev.description || ''}</textarea>
            </div>
            <div class="flex justify-end gap-2 mt-3">
              <button type="button" onclick="document.getElementById('submission-modal').remove()" class="px-4 py-2 border rounded-lg">Cancel</button>
              <button type="submit" class="px-6 py-2 bg-primary text-on-primary font-bold rounded-lg shadow">Submit Deliverable</button>
            </div>
          </form>
        </div>
      </div>
    `;

    const el = document.createElement('div');
    el.innerHTML = modalHtml;
    document.body.appendChild(el.firstElementChild);
  },

  handleSubmissionSubmit(e, regId) {
    e.preventDefault();
    try {
      const title = document.getElementById('sub-title').value;
      const repoUrl = document.getElementById('sub-repo').value;
      const demoUrl = document.getElementById('sub-demo').value;
      const description = document.getElementById('sub-desc').value;

      window.db.submitProject(regId, { title, repoUrl, demoUrl, description });
      const modal = document.getElementById('submission-modal');
      if (modal) modal.remove();

      App.toast('Project submitted for jury review!', 'success');
      App.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  showPassModal(regId) {
    const reg = window.db.getRegistrations().find(r => r.id === regId);
    if (!reg) return;
    const event = window.db.getEventById(reg.eventId);
    const user = window.auth.getCurrentUser();

    const modalHtml = `
      <div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" id="pass-modal" onclick="if(event.target.id==='pass-modal') this.remove()">
        <div class="bg-surface rounded-2xl max-w-sm w-full border border-outline-variant overflow-hidden shadow-2xl relative">
          <div class="event-badge-card p-6 text-center">
            <div class="text-xs font-extrabold uppercase mb-1">Official Event Pass</div>
            <h3 class="text-xl font-extrabold text-white">${event.name}</h3>
            <p class="text-xs text-white/80 mt-1">${event.venue}</p>
          </div>

          <div class="p-6 flex flex-col items-center text-center">
            <div class="p-4 bg-white rounded-2xl border-2 border-primary/20 shadow-md mb-4 flex flex-col items-center">
              <svg class="w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill="white"/>
                <rect x="10" y="10" width="30" height="30" fill="#00288e"/>
                <rect x="15" y="15" width="20" height="20" fill="white"/>
                <rect x="20" y="20" width="10" height="10" fill="#00288e"/>
                <rect x="60" y="10" width="30" height="30" fill="#00288e"/>
                <rect x="65" y="15" width="20" height="20" fill="white"/>
                <rect x="70" y="20" width="10" height="10" fill="#00288e"/>
                <rect x="10" y="60" width="30" height="30" fill="#00288e"/>
                <rect x="15" y="65" width="20" height="20" fill="white"/>
                <rect x="20" y="70" width="10" height="10" fill="#00288e"/>
                <rect x="50" y="50" width="10" height="10" fill="#006a61"/>
              </svg>
              <span class="text-[10px] font-mono font-bold text-primary mt-2">${reg.id} • ${user.studentId}</span>
            </div>

            <div class="font-extrabold text-base text-on-surface">${user.name}</div>
            <div class="text-xs text-on-surface-variant">${user.college}</div>
            ${reg.teamName ? `<div class="mt-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-bold text-xs">Team: ${reg.teamName}</div>` : ''}

            <div class="mt-4 pt-4 border-t border-outline-variant w-full flex justify-between text-xs font-semibold">
              <span class="text-on-surface-variant">Check-In:</span>
              <span class="${reg.status === 'CHECKED_IN' ? 'text-secondary font-bold' : 'text-primary'}">${reg.status}</span>
            </div>
          </div>

          <div class="p-4 bg-surface-container border-t border-outline-variant flex justify-between gap-2">
            <button onclick="window.print()" class="flex-1 py-2 rounded-lg bg-surface border border-outline text-xs font-bold text-primary">
              Print
            </button>
            <button onclick="document.getElementById('pass-modal').remove()" class="flex-1 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold">
              Done
            </button>
          </div>
        </div>
      </div>
    `;

    const el = document.createElement('div');
    el.innerHTML = modalHtml;
    document.body.appendChild(el.firstElementChild);
  },

  showIdCardModal() {
    const user = window.auth.getCurrentUser();
    const myRegistrations = window.db.getRegistrationsByStudent(user.studentId);
    if (myRegistrations.length > 0) {
      this.showPassModal(myRegistrations[0].id);
    } else {
      App.toast('Register for an event to generate your event badge.', 'info');
    }
  },

  showCertificateModal(regId) {
    const reg = window.db.getRegistrations().find(r => r.id === regId);
    if (!reg) return;
    const event = window.db.getEventById(reg.eventId);
    const user = window.auth.getCurrentUser();
    const certId = `CERT-ABX-${reg.id.replace('REG-', '')}-${Math.floor(100 + Math.random() * 900)}`;

    const modalHtml = `
      <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in" id="cert-modal" onclick="if(event.target.id==='cert-modal') this.remove()">
        <div class="bg-surface rounded-2xl max-w-2xl w-full border-4 border-double border-primary/40 shadow-2xl relative my-8 p-6 md:p-10 text-center flex flex-col items-center bg-gradient-to-b from-white via-surface to-surface-container-lowest">
          
          <div class="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center mb-3 shadow-lg">
            <span class="material-symbols-outlined filled text-3xl">workspace_premium</span>
          </div>

          <div class="text-[10px] uppercase font-mono tracking-widest text-secondary font-extrabold mb-1">
            Abhiyantrix Central Technical Council
          </div>

          <h2 class="text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-tight mb-2">
            Certificate of Participation
          </h2>

          <p class="text-xs text-on-surface-variant italic mb-6">
            This is proudly presented in recognition of commendable participation and technical excellence.
          </p>

          <div class="text-2xl font-extrabold text-on-surface border-b-2 border-primary/20 pb-2 mb-2 px-8">
            ${user.name}
          </div>

          <div class="text-xs text-on-surface-variant font-semibold mb-6">
            Representing <strong>${user.college || reg.college}</strong>
          </div>

          <p class="text-xs text-on-surface max-w-lg leading-relaxed mb-8">
            For successfully demonstrating ingenuity, innovative design, and active competition in <strong class="text-primary">${event ? event.name : 'Technical Festival'}</strong> (${event ? event.category : 'General'}).
          </p>

          <div class="w-full grid grid-cols-3 gap-4 pt-6 border-t border-outline-variant text-center text-xs">
            <div>
              <div class="font-bold text-on-surface">Dr. S. K. Narayanan</div>
              <div class="text-[10px] text-on-surface-variant">Dean & Chief Convener</div>
            </div>
            <div class="flex flex-col items-center justify-center">
              <div class="w-10 h-10 rounded-full border-2 border-secondary flex items-center justify-center text-secondary">
                <span class="material-symbols-outlined text-base filled">verified</span>
              </div>
              <span class="text-[9px] font-mono text-on-surface-variant mt-1 font-bold">VERIFIED</span>
            </div>
            <div>
              <div class="font-bold text-on-surface">Jury Secretariat</div>
              <div class="text-[10px] text-on-surface-variant">Evaluation Board</div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-outline-variant/60 w-full flex justify-between items-center text-[10px] font-mono text-on-surface-variant">
            <span>ID: ${certId}</span>
            <span>Issued: ${new Date().toLocaleDateString()}</span>
          </div>

          <div class="flex gap-2 mt-6 w-full">
            <button onclick="window.print()" class="flex-1 py-2.5 rounded-lg border border-primary text-primary font-bold text-xs hover:bg-surface-variant flex items-center justify-center gap-1.5">
              <span class="material-symbols-outlined text-sm">print</span>
              <span>Print / Download PDF</span>
            </button>
            <button onclick="document.getElementById('cert-modal').remove()" class="flex-1 py-2.5 rounded-lg bg-primary text-on-primary font-bold text-xs shadow hover:bg-surface-tint">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    const el = document.createElement('div');
    el.innerHTML = modalHtml;
    document.body.appendChild(el.firstElementChild);
  },

  showDirectCertificateModal(certId) {
    const cert = window.db.getCertificates().find(c => c.certificateId === certId);
    if (!cert) return;

    const modalHtml = `
      <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in" id="cert-direct-modal" onclick="if(event.target.id==='cert-direct-modal') this.remove()">
        <div class="bg-surface rounded-2xl max-w-2xl w-full border-4 border-double border-primary/40 shadow-2xl relative my-8 p-6 md:p-10 text-center flex flex-col items-center bg-gradient-to-b from-white via-surface to-surface-container-lowest">
          
          <div class="w-16 h-16 rounded-2xl ${cert.award === 'Winner' ? 'bg-amber-400 text-white' : cert.award === 'Runner-up' ? 'bg-slate-400 text-white' : 'bg-primary text-white'} flex items-center justify-center mb-3 shadow-lg">
            <span class="material-symbols-outlined filled text-3xl">workspace_premium</span>
          </div>

          <div class="text-[10px] uppercase font-mono tracking-widest text-secondary font-extrabold mb-1">
            Abhiyantrix Central Technical Council
          </div>

          <h2 class="text-2xl md:text-3xl font-extrabold text-primary uppercase tracking-tight mb-2">
            Certificate of ${cert.award === 'Winner' || cert.award === 'Runner-up' || cert.award === 'Second Runner-up' ? 'Excellence & Distinction' : 'Participation'}
          </h2>

          <p class="text-xs text-on-surface-variant italic mb-6">
            Presented in recognition of ${cert.award === 'Winner' ? 'First Prize Championship Standing 🥇' : cert.award === 'Runner-up' ? 'Second Prize Runner-up Standing 🥈' : 'Meritorious Technical Performance'}.
          </p>

          <div class="text-2xl font-extrabold text-on-surface border-b-2 border-primary/20 pb-2 mb-2 px-8">
            ${cert.studentName}
          </div>

          <div class="text-xs text-on-surface-variant font-semibold mb-6">
            Representing <strong>${cert.college || 'Institution'}</strong>
          </div>

          <p class="text-xs text-on-surface max-w-lg leading-relaxed mb-8">
            For outstanding achievement in <strong class="text-primary">${cert.eventName}</strong>. Official Standing: <strong class="text-amber-800">${cert.award} ${cert.rank ? `(Rank #${cert.rank})` : ''}</strong> ${cert.score ? `with a final evaluation score of <strong>${cert.score}/100</strong>` : ''}.
          </p>

          <div class="w-full grid grid-cols-3 gap-4 pt-6 border-t border-outline-variant text-center text-xs">
            <div>
              <div class="font-bold text-on-surface">Dr. S. K. Narayanan</div>
              <div class="text-[10px] text-on-surface-variant">Dean & Chief Convener</div>
            </div>
            <div class="flex flex-col items-center justify-center">
              <div class="w-10 h-10 rounded-full border-2 border-secondary flex items-center justify-center text-secondary">
                <span class="material-symbols-outlined text-base filled">verified</span>
              </div>
              <span class="text-[9px] font-mono text-on-surface-variant mt-1 font-bold">OFFICIAL CERTIFIED</span>
            </div>
            <div>
              <div class="font-bold text-on-surface">Jury Secretariat</div>
              <div class="text-[10px] text-on-surface-variant">Evaluation Council</div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-outline-variant/60 w-full flex justify-between items-center text-[10px] font-mono text-on-surface-variant">
            <span>Certificate ID: ${cert.certificateId}</span>
            <span>Issued: ${new Date(cert.issuedDate).toLocaleDateString()}</span>
          </div>

          <div class="flex gap-2 mt-6 w-full">
            <button onclick="window.print()" class="flex-1 py-2.5 rounded-lg border border-primary text-primary font-bold text-xs hover:bg-surface-variant flex items-center justify-center gap-1.5">
              <span class="material-symbols-outlined text-sm">print</span>
              <span>Print / Download PDF</span>
            </button>
            <button onclick="document.getElementById('cert-direct-modal').remove()" class="flex-1 py-2.5 rounded-lg bg-primary text-on-primary font-bold text-xs shadow hover:bg-surface-tint">
              Close
            </button>
          </div>
        </div>
      </div>
    `;

    const el = document.createElement('div');
    el.innerHTML = modalHtml;
    document.body.appendChild(el.firstElementChild);
  },

  downloadCertificatePdf(certId) {
    this.showDirectCertificateModal(certId);
    setTimeout(() => {
      window.print();
    }, 400);
  }
};
