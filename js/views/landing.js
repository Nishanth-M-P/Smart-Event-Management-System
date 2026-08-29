/**
 * Abhiyantrix Official Landing Page & Gateway
 * Ultra-fast demo logins, live dynamic metrics, and rich showcases.
 */

window.LandingView = {
  activeTab: 'student',
  studentMode: 'login',

  render() {
    const telemetry = window.db.getTelemetry();

    return `
      <div class="min-h-screen flex flex-col bg-background text-on-background relative overflow-x-hidden">
        
        <!-- Main Navigation Header -->
        <header class="bg-surface/90 text-primary flex justify-between items-center w-full px-4 md:px-margin h-16 sticky top-0 z-50 backdrop-blur-md border-b border-outline-variant/60 shadow-sm">
          <div class="flex items-center gap-2.5 cursor-pointer" onclick="App.navigate('landing')">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center shadow-md">
              <span class="material-symbols-outlined filled text-2xl">hub</span>
            </div>
            <div>
              <span class="text-xl font-extrabold text-primary tracking-tight">Abhiyantrix</span>
              <span class="text-[10px] block font-bold text-secondary uppercase tracking-wider leading-none">Event Operating System</span>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <nav class="hidden md:flex items-center gap-6 text-xs font-bold text-on-surface-variant mr-4">
              <a href="#features" class="hover:text-primary transition-colors">Features</a>
              <a href="#workflow" class="hover:text-primary transition-colors">How It Works</a>
              <a href="#categories" class="hover:text-primary transition-colors">Festivals</a>
            </nav>

            <div class="flex gap-2">
              <button onclick="LandingView.setTab('student', 'login')" class="px-3.5 py-1.5 rounded-lg border border-primary text-primary font-bold text-xs hover:bg-surface-variant transition-colors">
                Sign In
              </button>
              <button onclick="LandingView.setTab('student', 'register')" class="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs hover:opacity-95 shadow-sm transition-opacity">
                Register
              </button>
            </div>
          </div>
        </header>

        <!-- Hero Section & Auth Split Screen -->
        <main class="flex-grow flex flex-col lg:flex-row relative items-center justify-center p-4 md:p-8 lg:p-12">
          
          <!-- Animated Background Glowing Orbs -->
          <div class="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
          <div class="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-secondary/15 blur-3xl pointer-events-none"></div>

          <!-- Hero Left Column -->
          <section class="w-full lg:w-1/2 p-4 md:p-8 flex flex-col justify-center items-start z-10">
            <div class="max-w-2xl">
              
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider mb-4">
                <span class="material-symbols-outlined text-sm filled text-secondary">verified</span>
                Institutional Event Management Operating System
              </div>

              <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 leading-[1.1]">
                Empower <span class="gradient-text">Fests & Hackathons</span> With Intelligence.
              </h1>

              <p class="text-base text-on-surface-variant mb-6 max-w-xl leading-relaxed">
                A unified, role-based ecosystem connecting <strong class="text-primary">Students</strong>, <strong class="text-tertiary">Judges</strong>, and <strong class="text-secondary">Organizers</strong>. Features dynamic QR passes, instant QR scanner check-in, real-time weighted rubrics, automated leaderboards, and verified participation certificates.
              </p>
              
              <div class="flex flex-wrap gap-3 items-center mb-8">
                <button onclick="LandingView.setTab('student', 'register')" class="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-tertiary text-white font-bold text-xs shadow-lg hover:shadow-xl hover:opacity-95 transition-all flex items-center gap-2">
                  <span>Student Registration</span>
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
                <button onclick="LandingView.setTab('organizer')" class="px-5 py-3 rounded-xl bg-surface border border-outline-variant text-primary hover:border-primary font-bold text-xs shadow-sm transition-all flex items-center gap-2">
                  <span class="material-symbols-outlined text-sm">admin_panel_settings</span>
                  <span>Organizer Dashboard</span>
                </button>
              </div>

              <!-- Live Reactive Platform Telemetry -->
              <div class="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-surface border border-outline-variant/80 w-full max-w-lg shadow-md">
                <div>
                  <div class="text-2xl font-extrabold text-primary">${telemetry.totalEvents}</div>
                  <div class="text-[11px] font-bold text-on-surface-variant uppercase">Published Events</div>
                </div>
                <div class="border-l border-outline-variant pl-4">
                  <div class="text-2xl font-extrabold text-secondary">${telemetry.totalRegistrations}</div>
                  <div class="text-[11px] font-bold text-on-surface-variant uppercase">Registered Candidates</div>
                </div>
                <div class="border-l border-outline-variant pl-4">
                  <div class="text-2xl font-extrabold text-tertiary">${telemetry.totalJudges}</div>
                  <div class="text-[11px] font-bold text-on-surface-variant uppercase">Jury Members</div>
                </div>
              </div>

            </div>
          </section>

          <!-- Authentication Portal (Right Column) -->
          <section class="w-full lg:w-1/2 p-4 md:p-8 flex justify-center items-center z-10">
            <div class="w-full max-w-md bg-surface rounded-2xl shadow-2xl border border-outline-variant/80 overflow-hidden flex flex-col relative z-20 animate-glow">
              
              <!-- Role Tabs -->
              <div class="flex border-b border-outline-variant bg-surface-container-low p-1.5">
                <button id="tab-student" class="flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${LandingView.activeTab === 'student' ? 'bg-surface text-primary shadow-sm border border-outline-variant' : 'text-on-surface-variant hover:text-primary'}" onclick="LandingView.switchTab('student')">
                  <span class="material-symbols-outlined text-base ${LandingView.activeTab === 'student' ? 'filled' : ''}">school</span>
                  Student
                </button>
                <button id="tab-judge" class="flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${LandingView.activeTab === 'judge' ? 'bg-surface text-primary shadow-sm border border-outline-variant' : 'text-on-surface-variant hover:text-primary'}" onclick="LandingView.switchTab('judge')">
                  <span class="material-symbols-outlined text-base ${LandingView.activeTab === 'judge' ? 'filled' : ''}">gavel</span>
                  Judge
                </button>
                <button id="tab-organizer" class="flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${LandingView.activeTab === 'organizer' ? 'bg-surface text-primary shadow-sm border border-outline-variant' : 'text-on-surface-variant hover:text-primary'}" onclick="LandingView.switchTab('organizer')">
                  <span class="material-symbols-outlined text-base ${LandingView.activeTab === 'organizer' ? 'filled' : ''}">admin_panel_settings</span>
                  Organizer
                </button>
              </div>

              <div class="p-6 md:p-7 flex-grow">
                <!-- STUDENT AUTH -->
                <div id="student-portal" class="${LandingView.activeTab === 'student' ? 'block' : 'hidden'} animate-fade-in">
                  <div class="flex justify-between items-center mb-3">
                    <div>
                      <h2 class="text-lg font-extrabold text-primary">Student Gateway</h2>
                      <p class="text-xs text-on-surface-variant">Register for hackathons, workshops & track passes</p>
                    </div>
                    <div class="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                      <span class="material-symbols-outlined filled text-lg">school</span>
                    </div>
                  </div>

                  <div class="flex border-b border-outline-variant mb-4">
                    <button id="btn-tab-signin" class="flex-1 pb-2 text-xs font-bold transition-colors ${LandingView.studentMode === 'login' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}" onclick="LandingView.toggleStudentMode('login')">
                      Sign In
                    </button>
                    <button id="btn-tab-signup" class="flex-1 pb-2 text-xs font-bold transition-colors ${LandingView.studentMode === 'register' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}" onclick="LandingView.toggleStudentMode('register')">
                      Create Account
                    </button>
                  </div>

                  ${LandingView.studentMode === 'login' ? `
                    <!-- STUDENT LOGIN FORM -->
                    <form id="form-student-login" onsubmit="LandingView.handleStudentLogin(event)" class="flex flex-col gap-3 text-xs animate-fade-in">
                      <div class="flex flex-col gap-1">
                        <div class="flex justify-between items-center">
                          <label class="font-bold text-on-surface-variant">Email, Mobile, or Student ID *</label>
                          <button type="button" onclick="LandingView.fillStudentDemo()" class="text-[10px] font-bold text-secondary hover:underline">Autofill Demo</button>
                        </div>
                        <div class="relative">
                          <span class="material-symbols-outlined text-outline absolute left-3 top-2.5 text-base">person</span>
                          <input id="stu-login-identifier" class="w-full pl-8 pr-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-xs bg-surface" placeholder="darshan@campus.edu or STU-10001" required />
                        </div>
                      </div>

                      <div class="flex flex-col gap-1">
                        <label class="font-bold text-on-surface-variant">Password *</label>
                        <div class="relative">
                          <span class="material-symbols-outlined text-outline absolute left-3 top-2.5 text-base">lock</span>
                          <input id="stu-login-password" class="w-full pl-8 pr-3 py-2 border border-outline-variant rounded-lg focus:outline-none focus:border-primary text-xs bg-surface" placeholder="••••••••" type="password" required />
                        </div>
                      </div>

                      <button id="btn-access-portal" type="submit" class="mt-2 w-full py-2.5 rounded-lg bg-primary text-on-primary font-bold text-xs shadow hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer">
                        <span class="material-symbols-outlined text-base">login</span>
                        <span>Access Student Portal</span>
                      </button>
                    </form>
                  ` : `
                    <!-- STUDENT REGISTER FORM -->
                    <form id="form-student-register" onsubmit="LandingView.handleStudentRegister(event)" class="flex flex-col gap-2.5 text-xs animate-fade-in max-h-[60vh] overflow-y-auto pr-1">
                      <div class="flex flex-col gap-1">
                        <label class="font-bold text-on-surface-variant">Full Name *</label>
                        <input id="stu-reg-name" class="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs bg-surface" placeholder="e.g. Darshan Patel" required />
                      </div>

                      <div class="grid grid-cols-2 gap-2">
                        <div class="flex flex-col gap-1">
                          <label class="font-bold text-on-surface-variant">Email Address *</label>
                          <input id="stu-reg-email" type="email" class="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs bg-surface" placeholder="darshan@campus.edu" required />
                        </div>
                        <div class="flex flex-col gap-1">
                          <label class="font-bold text-on-surface-variant">Mobile Number *</label>
                          <input id="stu-reg-mobile" class="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs bg-surface" placeholder="+91 98765 43210" required />
                        </div>
                      </div>

                      <div class="grid grid-cols-2 gap-2">
                        <div class="flex flex-col gap-1">
                          <label class="font-bold text-on-surface-variant">College / Institution *</label>
                          <input id="stu-reg-college" class="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs bg-surface" placeholder="e.g. NITK Surathkal" required />
                        </div>
                        <div class="flex flex-col gap-1">
                          <label class="font-bold text-on-surface-variant">Department / Course *</label>
                          <input id="stu-reg-dept" class="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs bg-surface" placeholder="e.g. Computer Science" required />
                        </div>
                      </div>

                      <div class="grid grid-cols-2 gap-2">
                        <div class="flex flex-col gap-1">
                          <label class="font-bold text-on-surface-variant">Password *</label>
                          <input id="stu-reg-password" type="password" class="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs bg-surface" placeholder="••••••••" required />
                        </div>
                        <div class="flex flex-col gap-1">
                          <label class="font-bold text-on-surface-variant">Confirm Password *</label>
                          <input id="stu-reg-conf-password" type="password" class="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs bg-surface" placeholder="••••••••" required />
                        </div>
                      </div>

                      <div class="flex flex-col gap-1">
                        <label class="font-bold text-on-surface-variant">Skills / Interests <span class="text-on-surface-variant font-normal">(Optional)</span></label>
                        <input id="stu-reg-skills" class="w-full px-3 py-2 border border-outline-variant rounded-lg text-xs bg-surface" placeholder="e.g. React, Python, Machine Learning" />
                      </div>

                      <button id="btn-create-account" type="submit" class="mt-2 w-full py-2.5 rounded-lg bg-primary text-on-primary font-bold text-xs shadow hover:opacity-95 flex items-center justify-center gap-1.5 cursor-pointer">
                        <span class="material-symbols-outlined text-base">person_add</span>
                        <span>Create Account & Enter Portal</span>
                      </button>
                    </form>
                  `}
                </div>

                <!-- JUDGE AUTH -->
                <div id="judge-portal" class="${LandingView.activeTab === 'judge' ? 'block' : 'hidden'} animate-fade-in">
                  <div class="flex justify-between items-center mb-3">
                    <div>
                      <h2 class="text-lg font-extrabold text-tertiary">Judge Evaluation Studio</h2>
                      <p class="text-xs text-on-surface-variant">Authenticate using unique Judge ID & Secure Key</p>
                    </div>
                    <div class="w-9 h-9 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                      <span class="material-symbols-outlined filled text-lg">gavel</span>
                    </div>
                  </div>

                  <form id="form-judge" onsubmit="LandingView.handleJudgeSubmit(event)" class="flex flex-col gap-3 text-xs">
                    <div class="flex flex-col gap-1">
                      <div class="flex justify-between items-center">
                        <label class="font-bold text-on-surface-variant">Unique Judge ID</label>
                        <button type="button" onclick="LandingView.fillJudgeDemo()" class="text-[10px] font-bold text-tertiary hover:underline">Autofill Demo</button>
                      </div>
                      <div class="relative">
                        <span class="material-symbols-outlined text-outline absolute left-3 top-2.5 text-base">badge</span>
                        <input id="judge-id" class="w-full pl-8 pr-3 py-2 border border-outline-variant rounded-lg font-mono text-xs bg-surface" placeholder="JDG-2026-0001" required />
                      </div>
                    </div>

                    <div class="flex flex-col gap-1">
                      <label class="font-bold text-on-surface-variant">Secure Secret Key</label>
                      <div class="relative">
                        <span class="material-symbols-outlined text-outline absolute left-3 top-2.5 text-base">vpn_key</span>
                        <input id="judge-key" class="w-full pl-8 pr-3 py-2 border border-outline-variant rounded-lg font-mono text-xs bg-surface" placeholder="AXJ8-K92P-7LM4" type="password" required />
                      </div>
                    </div>

                    <button type="submit" class="mt-2 w-full py-2.5 rounded-lg bg-tertiary text-on-tertiary font-bold text-xs shadow hover:opacity-95 flex items-center justify-center gap-1.5">
                      <span class="material-symbols-outlined text-base">verified_user</span>
                      <span>Authenticate into Studio</span>
                    </button>
                  </form>
                </div>

                <!-- ORGANIZER AUTH -->
                <div id="organizer-portal" class="${LandingView.activeTab === 'organizer' ? 'block' : 'hidden'} animate-fade-in">
                  <div class="flex justify-between items-center mb-3">
                    <div>
                      <h2 class="text-lg font-extrabold text-primary">Organizer Command</h2>
                      <p class="text-xs text-on-surface-variant">Master ecosystem administration & verification</p>
                    </div>
                    <div class="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center">
                      <span class="material-symbols-outlined filled text-lg">admin_panel_settings</span>
                    </div>
                  </div>

                  <form id="form-organizer" onsubmit="LandingView.handleOrganizerSubmit(event)" class="flex flex-col gap-3 text-xs">
                    <div class="flex flex-col gap-1">
                      <label class="font-bold text-on-surface-variant">Admin Email</label>
                      <div class="relative">
                        <span class="material-symbols-outlined text-outline absolute left-3 top-2.5 text-base">mail</span>
                        <input id="org-email" class="w-full pl-8 pr-3 py-2 border border-outline-variant rounded-lg text-xs bg-surface" value="admin@abhiyantrix.edu" required />
                      </div>
                    </div>

                    <div class="flex flex-col gap-1">
                      <label class="font-bold text-on-surface-variant">Password</label>
                      <div class="relative">
                        <span class="material-symbols-outlined text-outline absolute left-3 top-2.5 text-base">lock</span>
                        <input id="org-password" class="w-full pl-8 pr-3 py-2 border border-outline-variant rounded-lg text-xs bg-surface" value="password123" type="password" required />
                      </div>
                    </div>

                    <button type="submit" class="mt-2 w-full py-2.5 rounded-lg bg-primary text-on-primary font-bold text-xs shadow hover:opacity-95 flex items-center justify-center gap-1.5">
                      <span class="material-symbols-outlined text-base">dashboard</span>
                      <span>Enter Command Center</span>
                    </button>
                  </form>
                </div>

              </div>

            </div>
          </section>
        </main>

        <!-- Feature Spotlight Section -->
        <section id="features" class="py-16 px-4 md:px-margin bg-surface-container-low border-t border-outline-variant/60">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-12">
              <span class="text-xs font-extrabold uppercase tracking-wider text-secondary">Ecosystem Architecture</span>
              <h2 class="text-3xl font-extrabold text-primary mt-1">Built for Complex Multi-Track University Festivals</h2>
              <p class="text-xs text-on-surface-variant mt-2 max-w-xl mx-auto">Real-time interconnection between students registering, judges evaluating with custom formulas, and organizers managing the entire pipeline.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Student Experience -->
              <div class="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm hover:shadow-md transition-all flex flex-col">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-tertiary text-white flex items-center justify-center mb-4 shadow">
                  <span class="material-symbols-outlined text-2xl">school</span>
                </div>
                <h3 class="text-lg font-bold text-on-surface mb-2">Student Experience</h3>
                <p class="text-xs text-on-surface-variant mb-4 leading-relaxed">Discover upcoming hackathons, register teams with automated ID generation, track live 6-step progress pipeline, and generate digital printable QR event badges.</p>
                <ul class="text-xs font-semibold text-on-surface flex flex-col gap-2 mt-auto">
                  <li class="flex items-center gap-2"><span class="material-symbols-outlined text-secondary text-base">check_circle</span> Live capacity tracking meters</li>
                  <li class="flex items-center gap-2"><span class="material-symbols-outlined text-secondary text-base">check_circle</span> GitHub & demo URL project submissions</li>
                  <li class="flex items-center gap-2"><span class="material-symbols-outlined text-secondary text-base">check_circle</span> Verified participation certificates</li>
                </ul>
              </div>

              <!-- Judge Studio -->
              <div class="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm hover:shadow-md transition-all flex flex-col">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-tertiary to-purple-600 text-white flex items-center justify-center mb-4 shadow">
                  <span class="material-symbols-outlined text-2xl">gavel</span>
                </div>
                <h3 class="text-lg font-bold text-on-surface mb-2">Judge Evaluation Studio</h3>
                <p class="text-xs text-on-surface-variant mb-4 leading-relaxed">Secure authentication with generated Judge IDs and secret keys. Dynamic rubrics tailored to event type with real-time weighted score calculation and tamper-proof locks.</p>
                <ul class="text-xs font-semibold text-on-surface flex flex-col gap-2 mt-auto">
                  <li class="flex items-center gap-2"><span class="material-symbols-outlined text-secondary text-base">check_circle</span> Dynamic weighted formula calculation</li>
                  <li class="flex items-center gap-2"><span class="material-symbols-outlined text-secondary text-base">check_circle</span> Immutable submission locking with audit log</li>
                  <li class="flex items-center gap-2"><span class="material-symbols-outlined text-secondary text-base">check_circle</span> Live scoring leaderboard preview</li>
                </ul>
              </div>

              <!-- Organizer Command -->
              <div class="bg-surface rounded-2xl p-6 border border-outline-variant shadow-sm hover:shadow-md transition-all flex flex-col">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-secondary to-teal-600 text-white flex items-center justify-center mb-4 shadow">
                  <span class="material-symbols-outlined text-2xl">admin_panel_settings</span>
                </div>
                <h3 class="text-lg font-bold text-on-surface mb-2">Organizer Command Center</h3>
                <p class="text-xs text-on-surface-variant mb-4 leading-relaxed">Executive telemetry, full event CRUD with lifecycle state transitions, participant verification desk, judge key provisioning, and broadcast announcements.</p>
                <ul class="text-xs font-semibold text-on-surface flex flex-col gap-2 mt-auto">
                  <li class="flex items-center gap-2"><span class="material-symbols-outlined text-secondary text-base">check_circle</span> Verification desk with 1-click actions & CSV export</li>
                  <li class="flex items-center gap-2"><span class="material-symbols-outlined text-secondary text-base">check_circle</span> Judge auto-key generator & panel assignment</li>
                  <li class="flex items-center gap-2"><span class="material-symbols-outlined text-secondary text-base">check_circle</span> 1-Click Leaderboard publishing to students</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="bg-surface-container-low border-t border-outline-variant py-8 px-4 md:px-margin text-center text-xs text-on-surface-variant">
          <div class="flex items-center justify-center gap-2 mb-2 font-bold text-primary">
            <span class="material-symbols-outlined text-base filled">hub</span>
            <span>Abhiyantrix Official Event Operating Platform</span>
          </div>
          <p>© 2026 Abhiyantrix Platform. Designed for State & National Level Technical & Cultural Festivals.</p>
        </footer>
      </div>
    `;
  },

  fillStudentDemo() {
    this.studentMode = 'login';
    this.activeTab = 'student';
    App.render();
    const student = window.db.getUsers().find(u => u.role === 'student');
    if (student) {
      setTimeout(() => {
        const idElem = document.getElementById('stu-login-identifier');
        const pwdElem = document.getElementById('stu-login-password');
        if (idElem) idElem.value = student.email || student.studentId;
        if (pwdElem) pwdElem.value = student.password || 'password123';
        App.toast(`Autofilled credentials for ${student.name}`, 'info');
      }, 50);
    } else {
      App.toast('No student account in database. Use "Create Account" tab to register.', 'info');
    }
  },

  fillJudgeDemo() {
    this.activeTab = 'judge';
    App.render();
    const judge = window.db.getUsers().find(u => u.role === 'judge');
    if (judge) {
      setTimeout(() => {
        const idElem = document.getElementById('judge-id');
        const keyElem = document.getElementById('judge-key');
        if (idElem) idElem.value = judge.judgeId;
        if (keyElem) keyElem.value = judge.judgeKey;
        App.toast(`Autofilled credentials for ${judge.name}`, 'info');
      }, 50);
    }
  },

  fillOrganizerDemo() {
    this.activeTab = 'organizer';
    App.render();
    const org = window.db.getUsers().find(u => u.role === 'organizer');
    if (org) {
      setTimeout(() => {
        const emailElem = document.getElementById('org-email');
        const pwdElem = document.getElementById('org-password');
        if (emailElem) emailElem.value = org.email;
        if (pwdElem) pwdElem.value = org.password || 'password123';
        App.toast(`Autofilled credentials for ${org.name}`, 'info');
      }, 50);
    }
  },

  switchTab(tab) {
    this.activeTab = tab;
    App.render();
  },

  setTab(tab, mode = 'login') {
    this.activeTab = tab;
    this.studentMode = mode;
    App.render();
  },

  toggleStudentMode(mode) {
    this.studentMode = mode;
    App.render();
  },

  handleStudentLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-access-portal');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="material-symbols-outlined text-base animate-spin">progress_activity</span><span>Signing in...</span>`;
    }

    try {
      const identifier = document.getElementById('stu-login-identifier').value.trim();
      const password = document.getElementById('stu-login-password').value;

      if (!identifier) {
        throw new Error('Please enter your email address, mobile number, or Student ID.');
      }
      if (!password) {
        throw new Error('Please enter your password.');
      }

      const user = window.auth.loginStudent(identifier, password);
      App.toast(`Welcome back, ${user.name}! Accessing portal...`, 'success');
      App.navigate('student');
    } catch (err) {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span class="material-symbols-outlined text-base">login</span><span>Access Student Portal</span>`;
      }
      App.toast(err.message, 'error');
    }
  },

  handleStudentRegister(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-create-account');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="material-symbols-outlined text-base animate-spin">progress_activity</span><span>Creating account...</span>`;
    }

    try {
      const name = document.getElementById('stu-reg-name').value.trim();
      const email = document.getElementById('stu-reg-email').value.trim();
      const mobile = document.getElementById('stu-reg-mobile').value.trim();
      const college = document.getElementById('stu-reg-college').value.trim();
      const department = document.getElementById('stu-reg-dept').value.trim();
      const password = document.getElementById('stu-reg-password').value;
      const confPassword = document.getElementById('stu-reg-conf-password').value;
      const skills = document.getElementById('stu-reg-skills').value.trim();

      if (!name) throw new Error('Please enter your full name.');
      if (!email) throw new Error('Please enter a valid email address.');
      if (!mobile) throw new Error('Please enter your mobile number.');
      if (!college) throw new Error('Please enter your college/institution.');
      if (!department) throw new Error('Please enter your department/course.');
      if (!password) throw new Error('Please enter a password.');
      if (password !== confPassword) throw new Error('Passwords do not match. Please verify.');

      const user = window.auth.registerStudent({
        name,
        email,
        mobile,
        college,
        department,
        password,
        skills
      });

      App.toast(`Account created successfully! Student ID: ${user.studentId}`, 'success');
      App.navigate('student');
    } catch (err) {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span class="material-symbols-outlined text-base">person_add</span><span>Create Account & Enter Portal</span>`;
      }
      App.toast(err.message, 'error');
    }
  },

  handleJudgeSubmit(e) {
    e.preventDefault();
    try {
      const judgeId = document.getElementById('judge-id').value;
      const judgeKey = document.getElementById('judge-key').value;
      const judge = window.auth.loginJudge(judgeId, judgeKey);
      App.toast(`Welcome, ${judge.name}! Authentication verified.`, 'success');
      App.navigate('judge');
    } catch (err) {
      App.toast(err.message, 'error');
    }
  },

  handleOrganizerSubmit(e) {
    e.preventDefault();
    try {
      const email = document.getElementById('org-email').value;
      const password = document.getElementById('org-password').value;
      const user = window.auth.loginOrganizer(email, password);
      App.toast(`Welcome back, ${user.name}!`, 'success');
      App.navigate('organizer');
    } catch (err) {
      App.toast(err.message, 'error');
    }
  }
};
