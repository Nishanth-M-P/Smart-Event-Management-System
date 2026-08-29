/**
 * Judge Dashboard & Evaluation Studio View
 * Zero dummy data, standard User Icons, real profile photo management,
 * dynamic rubric weighting, and anti-tamper submission locks.
 */

window.JudgeView = {
  currentTab: 'assignments',
  selectedEventId: null,
  selectedRegId: null,
  currentScores: {},

  render() {
    const judge = window.auth.getCurrentUser();
    if (!judge || judge.role !== 'judge') {
      return `<div class="p-8 text-center">Unauthorized. Please authenticate with your Judge ID & Key.</div>`;
    }

    const allEvents = window.db.getEvents();
    const assignedEvents = allEvents.filter(e => 
      (judge.assignedEvents || []).includes(e.id)
    );

    const evaluations = window.db.getEvaluationsByJudge(judge.judgeId);
    let totalAssignedEntries = 0;
    assignedEvents.forEach(e => {
      totalAssignedEntries += window.db.getRegistrationsByEvent(e.id).length;
    });
    const pendingCount = Math.max(0, totalAssignedEntries - evaluations.length);

    return `
      <div class="bg-background text-on-background flex min-h-screen antialiased">
        <!-- SideNavBar (Desktop) -->
        <nav class="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 py-lg px-md gap-md overflow-y-auto bg-surface-container border-r border-outline-variant shadow-sm z-40">
          <div class="mb-6 flex flex-col items-center cursor-pointer" onclick="App.navigate('landing')">
            <div class="h-14 w-14 rounded-2xl bg-tertiary text-on-tertiary flex items-center justify-center mb-2 shadow-md">
              <span class="material-symbols-outlined filled text-2xl">gavel</span>
            </div>
            <h1 class="text-xl font-extrabold text-primary tracking-tight">Abhiyantrix</h1>
            <p class="text-xs font-semibold text-on-surface-variant">Evaluation Studio</p>
          </div>

          <!-- Judge Profile Badge -->
          <div class="p-3 rounded-xl bg-surface border border-outline-variant flex items-center gap-3 mb-2 cursor-pointer hover:border-tertiary transition-colors" onclick="JudgeView.switchTab('profile')">
            ${AuthService.renderAvatar(judge, 'w-10 h-10', 'text-xl')}
            <div class="overflow-hidden">
              <div class="font-bold text-sm text-on-surface truncate">${judge.name}</div>
              <div class="text-[11px] font-mono text-tertiary font-bold">${judge.judgeId}</div>
            </div>
          </div>

          <!-- Navigation Links -->
          <div class="flex flex-col gap-1.5 flex-grow text-sm font-semibold">
            <button onclick="JudgeView.switchTab('assignments')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${this.currentTab === 'assignments' ? 'bg-primary-container text-on-primary-container border-l-4 border-secondary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <span class="material-symbols-outlined ${this.currentTab === 'assignments' ? 'filled text-secondary' : ''}">event_available</span>
              <span>Assigned Events</span>
            </button>

            <button onclick="JudgeView.switchTab('studio')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${this.currentTab === 'studio' ? 'bg-primary-container text-on-primary-container border-l-4 border-secondary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <span class="material-symbols-outlined ${this.currentTab === 'studio' ? 'filled text-secondary' : ''}">rate_review</span>
              <span>Evaluation Studio</span>
            </button>

            <button onclick="JudgeView.switchTab('leaderboard')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${this.currentTab === 'leaderboard' ? 'bg-primary-container text-on-primary-container border-l-4 border-secondary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <span class="material-symbols-outlined ${this.currentTab === 'leaderboard' ? 'filled text-secondary' : ''}">leaderboard</span>
              <span>Leaderboard</span>
            </button>

            <button onclick="JudgeView.switchTab('profile')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${this.currentTab === 'profile' ? 'bg-primary-container text-on-primary-container border-l-4 border-secondary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'}">
              <span class="material-symbols-outlined ${this.currentTab === 'profile' ? 'filled text-secondary' : ''}">badge</span>
              <span>Judge Profile</span>
            </button>
          </div>

          <!-- Bottom Actions -->
          <div class="mt-auto pt-4 border-t border-outline-variant">
            <button onclick="App.logout()" class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-error hover:bg-error-container hover:text-on-error-container transition-colors font-semibold">
              <span class="material-symbols-outlined text-base">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </nav>

        <!-- Main Content Area -->
        <main class="flex-grow md:ml-64 w-full p-4 md:p-8 lg:p-10 overflow-x-hidden min-h-screen flex flex-col">
          <!-- Header Section -->
          <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h1 class="text-3xl font-extrabold text-on-surface">Welcome, ${judge.name}</h1>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-tertiary-container text-on-tertiary-container">Jury Panel</span>
              </div>
              <p class="text-base text-on-surface-variant">${judge.organization} • Expertise: ${judge.expertise || 'General'}</p>
            </div>

            <div class="flex gap-2">
              <button onclick="JudgeView.switchTab('studio')" class="px-5 py-2.5 rounded-lg bg-tertiary text-on-tertiary hover:opacity-90 font-bold text-sm flex items-center gap-2 shadow-sm">
                <span class="material-symbols-outlined text-lg">rate_review</span>
                <span>Open Score Sheet</span>
              </button>
            </div>
          </div>

          <!-- Dynamic Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div class="bg-surface rounded-xl p-5 border border-outline-variant shadow-sm">
              <p class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Assigned Events</p>
              <p class="text-3xl font-extrabold text-primary mt-1">${assignedEvents.length}</p>
            </div>

            <div class="bg-surface rounded-xl p-5 border border-outline-variant shadow-sm">
              <p class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pending Evaluations</p>
              <p class="text-3xl font-extrabold text-secondary mt-1">${pendingCount}</p>
            </div>

            <div class="bg-surface rounded-xl p-5 border border-outline-variant shadow-sm">
              <p class="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Completed & Locked</p>
              <p class="text-3xl font-extrabold text-tertiary mt-1">${evaluations.length}</p>
            </div>
          </div>

          <!-- Dynamic Active View -->
          <div class="flex-grow">
            ${this.renderActiveTabContent(judge, assignedEvents, evaluations)}
          </div>
        </main>
      </div>
    `;
  },

  renderActiveTabContent(judge, assignedEvents, evaluations) {
    if (this.currentTab === 'assignments') {
      return this.renderAssignmentsTab(assignedEvents, evaluations);
    } else if (this.currentTab === 'studio') {
      return this.renderStudioTab(judge, assignedEvents);
    } else if (this.currentTab === 'leaderboard') {
      return this.renderLeaderboardTab(assignedEvents);
    } else if (this.currentTab === 'profile') {
      return this.renderJudgeProfileTab(judge);
    }
    return '';
  },

  // 1. ASSIGNED EVENTS TAB
  renderAssignmentsTab(assignedEvents, evaluations) {
    return `
      <section class="animate-fade-in flex flex-col gap-6">
        <div>
          <h3 class="text-xl font-bold text-primary">Assigned Event Panels</h3>
          <p class="text-xs text-on-surface-variant">Select an event to inspect participant deliverables and record scores.</p>
        </div>

        ${assignedEvents.length === 0 ? `
          <div class="p-12 text-center bg-surface rounded-2xl border border-outline-variant text-on-surface-variant">
            <span class="material-symbols-outlined text-4xl text-outline mb-2">event_busy</span>
            <p class="text-sm font-bold text-on-surface">No events assigned yet</p>
            <p class="text-xs mt-1">The event organizer will assign competition panels to your Judge ID.</p>
          </div>
        ` : `
          <div class="flex flex-col gap-4">
            ${assignedEvents.map(event => {
              const regs = window.db.getRegistrationsByEvent(event.id);
              const evals = window.db.getEvaluationsByEvent(event.id);

              return `
                <div class="bg-surface rounded-2xl border border-outline-variant shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start md:items-center relative hover:border-secondary transition-all">
                  <div class="flex-grow">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="bg-primary-container text-on-primary-container px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">${event.category || event.type}</span>
                      <span class="text-xs text-on-surface-variant">${new Date(event.startDate).toLocaleDateString()}</span>
                    </div>

                    <h4 class="text-lg font-bold text-on-surface mb-1">${event.name}</h4>
                    <p class="text-xs text-on-surface-variant mb-3">${event.description}</p>

                    <div class="flex items-center gap-4 text-xs font-semibold">
                      <span class="text-primary">👥 ${regs.length} Total Teams</span>
                      <span class="text-secondary">✅ ${evals.length} Evaluated</span>
                      <span class="text-outline">📍 ${event.venue}</span>
                    </div>
                  </div>

                  <button onclick="JudgeView.openStudioForEvent('${event.id}')" class="bg-primary text-on-primary px-5 py-2.5 rounded-lg text-xs font-bold hover:bg-surface-tint shadow flex items-center gap-2">
                    <span>Evaluate Entries</span>
                    <span class="material-symbols-outlined text-sm">assignment_turned_in</span>
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </section>
    `;
  },

  // 2. EVALUATION STUDIO TAB
  renderStudioTab(judge, assignedEvents) {
    if (assignedEvents.length === 0) {
      return `
        <div class="p-12 text-center bg-surface rounded-2xl border border-outline-variant text-on-surface-variant">
          <p class="text-sm font-bold text-on-surface">No assigned events</p>
          <p class="text-xs mt-1">Contact the organizer to assign you to an event panel.</p>
        </div>
      `;
    }

    const activeEvent = window.db.getEventById(this.selectedEventId) || assignedEvents[0];
    const registrations = window.db.getRegistrationsByEvent(activeEvent.id);
    const activeReg = registrations.find(r => r.id === this.selectedRegId) || registrations[0];

    const existingEval = activeReg ? window.db.getEvaluations().find(
      e => e.eventId === activeEvent.id && e.registrationId === activeReg.id && e.judgeId === judge.judgeId
    ) : null;

    const isLocked = existingEval ? existingEval.isLocked : false;

    if (activeEvent.criteria) {
      activeEvent.criteria.forEach(c => {
        if (this.currentScores[c.id] === undefined) {
          this.currentScores[c.id] = existingEval ? (existingEval.scores[c.id] || 8.0) : 8.0;
        }
      });
    }

    const computedTotal = this.calculateWeightedScore(activeEvent.criteria || [], this.currentScores);

    return `
      <section class="animate-fade-in flex flex-col gap-6">
        <div class="bg-surface rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex items-center gap-3 w-full md:w-auto">
            <label class="text-xs font-bold text-on-surface-variant uppercase">Event:</label>
            <select onchange="JudgeView.setSelectedEvent(this.value)" class="px-3 py-2 border border-outline-variant rounded-lg text-xs font-bold text-primary bg-surface-container focus:outline-none">
              ${assignedEvents.map(e => `
                <option value="${e.id}" ${e.id === activeEvent.id ? 'selected' : ''}>${e.name}</option>
              `).join('')}
            </select>
          </div>

          <div class="flex items-center gap-3 w-full md:w-auto">
            <label class="text-xs font-bold text-on-surface-variant uppercase">Team / Participant:</label>
            <select onchange="JudgeView.setSelectedReg(this.value)" class="px-3 py-2 border border-outline-variant rounded-lg text-xs font-bold text-secondary bg-surface-container focus:outline-none">
              ${registrations.length === 0 ? '<option value="">No participants yet</option>' : registrations.map(r => {
                const isEval = window.db.getEvaluations().some(e => e.registrationId === r.id && e.judgeId === judge.judgeId);
                return `
                  <option value="${r.id}" ${r.id === (activeReg ? activeReg.id : '') ? 'selected' : ''}>
                    ${r.teamName || r.studentName} ${isEval ? '✅' : '⏳'}
                  </option>
                `;
              }).join('')}
            </select>
          </div>
        </div>

        ${!activeReg ? `
          <div class="p-12 text-center bg-surface rounded-2xl border border-outline-variant">
            <p class="text-sm font-bold text-on-surface">No registered teams found for this event yet.</p>
          </div>
        ` : `
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div class="lg:col-span-5 flex flex-col gap-4">
              <div class="bg-surface rounded-2xl border border-outline-variant p-5 shadow-sm">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <span class="text-[10px] font-bold text-secondary uppercase">${activeReg.id} • ${activeReg.college}</span>
                    <h3 class="text-xl font-bold text-primary">${activeReg.teamName || activeReg.studentName}</h3>
                  </div>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${isLocked ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-primary-container text-on-primary-container'}">
                    ${isLocked ? 'LOCKED' : 'PENDING'}
                  </span>
                </div>

                <div class="text-xs text-on-surface-variant mb-4">
                  <strong>Lead:</strong> ${activeReg.studentName}
                </div>

                <!-- Deliverables -->
                <div class="border-t border-outline-variant pt-4">
                  <h4 class="text-xs font-bold text-primary uppercase mb-2">Deliverables</h4>
                  ${activeReg.submission ? `
                    <div class="text-xs flex flex-col gap-2">
                      <div class="font-bold">${activeReg.submission.title}</div>
                      <p class="text-on-surface-variant">${activeReg.submission.description || 'No description.'}</p>
                      <div class="flex gap-2 pt-2">
                        ${activeReg.submission.repoUrl ? `<a href="${activeReg.submission.repoUrl}" target="_blank" class="px-3 py-1.5 rounded-lg border border-outline-variant text-primary font-bold text-xs">Repo</a>` : ''}
                        ${activeReg.submission.demoUrl ? `<a href="${activeReg.submission.demoUrl}" target="_blank" class="px-3 py-1.5 rounded-lg border border-outline-variant text-secondary font-bold text-xs">Demo</a>` : ''}
                      </div>
                    </div>
                  ` : `
                    <p class="text-xs text-on-surface-variant">Evaluate based on live presentation or onsite demo.</p>
                  `}
                </div>
              </div>
            </div>

            <!-- Rubric Form -->
            <div class="lg:col-span-7 flex flex-col gap-4">
              <div class="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col gap-5">
                <div class="flex justify-between items-center pb-3 border-b border-outline-variant">
                  <h3 class="text-lg font-bold text-primary">Scoring Rubric</h3>
                  <div class="p-2.5 bg-tertiary-container text-on-tertiary-container rounded-xl text-center">
                    <div class="text-[10px] font-bold uppercase">Total Score</div>
                    <div id="live-total-display" class="text-xl font-extrabold">${computedTotal.score100} / 100</div>
                  </div>
                </div>

                <form onsubmit="JudgeView.handleSubmitEvaluation(event, '${activeEvent.id}', '${activeReg.id}')" class="flex flex-col gap-4">
                  ${(activeEvent.criteria || []).map(c => {
                    const val = this.currentScores[c.id] || 8.0;
                    return `
                      <div class="p-3 bg-surface-container-low rounded-xl border border-outline-variant flex flex-col gap-1.5">
                        <div class="flex justify-between items-center">
                          <span class="font-bold text-xs text-on-surface">${c.name} (${c.weight}%)</span>
                          <span class="font-mono font-bold text-xs text-primary" id="label-${c.id}">${parseFloat(val).toFixed(1)} / 10.0</span>
                        </div>
                        <input type="range" min="1.0" max="10.0" step="0.5" value="${val}" ${isLocked ? 'disabled' : ''} oninput="JudgeView.updateScore('${c.id}', this.value)" class="w-full h-2 bg-surface-container-highest rounded-lg cursor-pointer" />
                      </div>
                    `;
                  }).join('')}

                  <div class="flex flex-col gap-1">
                    <label class="text-xs font-bold text-on-surface-variant uppercase">Comments</label>
                    <textarea id="eval-feedback" rows="2" ${isLocked ? 'disabled' : ''} class="px-3 py-2 border rounded-xl text-xs bg-surface" placeholder="Feedback for the participant...">${existingEval ? (existingEval.feedback || '') : ''}</textarea>
                  </div>

                  <div class="flex justify-end gap-2 pt-2">
                    ${isLocked ? `
                      <span class="text-xs font-bold text-tertiary">Evaluation locked</span>
                    ` : `
                      <button type="submit" class="px-6 py-2.5 rounded-lg bg-tertiary text-on-tertiary font-bold text-xs shadow">
                        Submit & Lock Score
                      </button>
                    `}
                  </div>
                </form>
              </div>
            </div>
          </div>
        `}
      </section>
    `;
  },

  // 3. LEADERBOARD TAB
  renderLeaderboardTab(assignedEvents) {
    if (assignedEvents.length === 0) {
      return `<div class="p-12 text-center bg-surface rounded-2xl border text-xs text-on-surface-variant">No events assigned.</div>`;
    }

    const activeEvent = window.db.getEventById(this.selectedEventId) || assignedEvents[0];
    const leaderboard = window.db.calculateLeaderboard(activeEvent.id);

    return `
      <section class="animate-fade-in flex flex-col gap-6 max-w-4xl mx-auto">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-bold text-primary">Live Leaderboard: ${activeEvent.name}</h3>
        </div>

        <div class="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
          ${leaderboard.length === 0 ? `
            <div class="p-8 text-center text-xs text-on-surface-variant">No scores recorded yet.</div>
          ` : `
            <table class="w-full text-left text-xs">
              <thead class="bg-surface-container text-on-surface-variant font-bold uppercase">
                <tr>
                  <th class="p-4 w-16">Rank</th>
                  <th class="p-4">Team</th>
                  <th class="p-4">Institution</th>
                  <th class="p-4">Score</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-outline-variant">
                ${leaderboard.map((entry, idx) => `
                  <tr>
                    <td class="p-4 font-bold text-center">${idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx+1}`}</td>
                    <td class="p-4 font-bold text-primary">${entry.teamName}</td>
                    <td class="p-4 text-on-surface-variant">${entry.college}</td>
                    <td class="p-4 font-extrabold text-primary">${entry.score > 0 ? `${entry.score} / 100` : 'Pending'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>
      </section>
    `;
  },

  // 4. JUDGE PROFILE TAB WITH REAL PHOTO UPLOAD
  renderJudgeProfileTab(judge) {
    return `
      <section class="animate-fade-in max-w-3xl mx-auto flex flex-col gap-6">
        <div class="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <div class="flex flex-col items-center gap-2">
            ${AuthService.renderAvatar(judge, 'w-24 h-24', 'text-4xl')}
            
            <div class="flex gap-2">
              <label class="px-3 py-1 bg-surface-container border border-outline-variant rounded-lg text-xs font-bold text-primary hover:bg-surface-variant cursor-pointer">
                <span>Upload</span>
                <input type="file" accept="image/png, image/jpeg, image/webp" class="hidden" onchange="JudgeView.handlePhotoUpload(event)" />
              </label>

              ${judge.avatar ? `
                <button onclick="JudgeView.handleRemovePhoto()" class="px-3 py-1 bg-surface-variant text-error rounded-lg text-xs font-bold hover:bg-error-container" title="Remove custom photo">
                  Remove
                </button>
              ` : ''}
            </div>
          </div>

          <div class="flex-grow text-center sm:text-left">
            <h2 class="text-2xl font-bold text-on-surface mb-1">${judge.name}</h2>
            <p class="text-xs text-on-surface-variant mb-3">${judge.organization} • ${judge.email}</p>
            
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="p-2.5 rounded-lg bg-surface-container border border-outline-variant">
                <div class="text-[10px] uppercase font-bold text-on-surface-variant">Judge ID</div>
                <div class="font-mono font-bold text-tertiary">${judge.judgeId}</div>
              </div>
              <div class="p-2.5 rounded-lg bg-surface-container border border-outline-variant">
                <div class="text-[10px] uppercase font-bold text-on-surface-variant">Secure Key</div>
                <div class="font-mono font-bold text-primary">${judge.judgeKey}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm">
          <h4 class="text-sm font-bold text-primary uppercase tracking-wider mb-4">Edit Profile & Expertise</h4>
          
          <form onsubmit="JudgeView.handleProfileUpdate(event)" class="flex flex-col gap-4 text-xs">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-1">
                <label class="font-bold text-on-surface-variant">Full Name</label>
                <input id="jdg-prof-name" class="px-3 py-2 border rounded-lg bg-surface text-xs" value="${judge.name}" required />
              </div>
              <div class="flex flex-col gap-1">
                <label class="font-bold text-on-surface-variant">Organization</label>
                <input id="jdg-prof-org" class="px-3 py-2 border rounded-lg bg-surface text-xs" value="${judge.organization || ''}" required />
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <label class="font-bold text-on-surface-variant">Domain Expertise</label>
              <input id="jdg-prof-exp" class="px-3 py-2 border rounded-lg bg-surface text-xs" value="${judge.expertise || ''}" required />
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

  openStudioForEvent(eventId) {
    this.selectedEventId = eventId;
    this.currentTab = 'studio';
    App.render();
  },

  setSelectedEvent(id) {
    this.selectedEventId = id;
    this.currentScores = {};
    App.render();
  },

  setSelectedReg(regId) {
    this.selectedRegId = regId;
    this.currentScores = {};
    App.render();
  },

  updateScore(critId, val) {
    this.currentScores[critId] = parseFloat(val);
    const label = document.getElementById(`label-${critId}`);
    if (label) label.innerText = `${parseFloat(val).toFixed(1)} / 10.0`;

    const event = window.db.getEventById(this.selectedEventId);
    if (event) {
      const res = this.calculateWeightedScore(event.criteria || [], this.currentScores);
      const display = document.getElementById('live-total-display');
      if (display) display.innerText = `${res.score100} / 100`;
    }
  },

  calculateWeightedScore(criteria, scores) {
    let totalScore100 = 0;
    criteria.forEach(c => {
      const s = scores[c.id] || 8.0;
      const points = (s / 10.0) * c.weight;
      totalScore100 += points;
    });

    const score100 = parseFloat(totalScore100.toFixed(2));
    const weightedTotal = parseFloat((score100 / 10.0).toFixed(2));

    return { score100, weightedTotal };
  },

  handleSubmitEvaluation(e, eventId, regId) {
    e.preventDefault();
    try {
      const judge = window.auth.getCurrentUser();
      const event = window.db.getEventById(eventId);
      const reg = window.db.getRegistrations().find(r => r.id === regId);
      const feedback = document.getElementById('eval-feedback') ? document.getElementById('eval-feedback').value : '';

      const { score100, weightedTotal } = this.calculateWeightedScore(event.criteria || [], this.currentScores);

      window.db.saveEvaluation({
        eventId,
        judgeId: judge.judgeId,
        judgeName: judge.name,
        registrationId: regId,
        teamName: reg ? (reg.teamName || reg.studentName) : 'Participant',
        scores: { ...this.currentScores },
        weightedTotal,
        score100,
        feedback,
        isLocked: true
      });

      App.toast(`Score locked: ${score100}/100`, 'success');
      App.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
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
      const judge = window.auth.getCurrentUser();
      window.db.updateProfilePhoto(judge.id, base64);
      App.toast('Judge profile photo updated!', 'success');
      App.render();
    };
    reader.readAsDataURL(file);
  },

  handleRemovePhoto() {
    if (confirm('Remove profile photo? Standard user icon will be used.')) {
      const judge = window.auth.getCurrentUser();
      window.db.updateProfilePhoto(judge.id, null);
      App.toast('Profile photo removed.', 'info');
      App.render();
    }
  },

  handleProfileUpdate(e) {
    e.preventDefault();
    try {
      const judge = window.auth.getCurrentUser();
      const name = document.getElementById('jdg-prof-name').value;
      const organization = document.getElementById('jdg-prof-org').value;
      const expertise = document.getElementById('jdg-prof-exp').value;

      window.auth.updateAccount(judge.id, {
        name,
        organization,
        expertise
      });

      App.toast('Judge profile updated!', 'success');
      App.render();
    } catch (err) {
      App.toast(err.message, 'error');
    }
  }
};
