/**
 * Abhiyantrix Main Application Coordinator & Router
 * Manages routing, dynamic rendering, role guards, toast alerts, and floating quick-role switcher.
 */

window.App = {
  currentRoute: 'landing', // 'landing', 'student', 'judge', 'organizer'

  init() {
    // Check initial auth state & route
    const user = window.auth.getCurrentUser();
    if (user) {
      if (user.role === 'student') this.currentRoute = 'student';
      else if (user.role === 'judge') this.currentRoute = 'judge';
      else if (user.role === 'organizer') this.currentRoute = 'organizer';
    } else {
      this.currentRoute = 'landing';
    }

    this.render();
  },

  navigate(route) {
    const user = window.auth.getCurrentUser();
    const role = (user && user.role) ? user.role.toLowerCase() : null;

    if (route === 'student') {
      if (!user || role !== 'student') {
        this.toast('Please sign in with your student credentials to access the Student Portal.', 'info');
        this.currentRoute = 'landing';
        LandingView.activeTab = 'student';
        LandingView.studentMode = 'login';
        window.scrollTo(0, 0);
        this.render();
        return;
      }
      this.currentRoute = 'student';
      window.scrollTo(0, 0);
      this.render();
      return;
    }

    if (route === 'judge') {
      if (!user || role !== 'judge') {
        this.toast('Please authenticate with a Judge ID & Secret Key.', 'info');
        this.currentRoute = 'landing';
        LandingView.activeTab = 'judge';
        window.scrollTo(0, 0);
        this.render();
        return;
      }
      this.currentRoute = 'judge';
      window.scrollTo(0, 0);
      this.render();
      return;
    }

    if (route === 'organizer') {
      if (!user || role !== 'organizer') {
        this.toast('Organizer credentials required to access Command Center.', 'info');
        this.currentRoute = 'landing';
        LandingView.activeTab = 'organizer';
        window.scrollTo(0, 0);
        this.render();
        return;
      }
      this.currentRoute = 'organizer';
      window.scrollTo(0, 0);
      this.render();
      return;
    }

    this.currentRoute = 'landing';
    window.scrollTo(0, 0);
    this.render();
  },

  loadDemoFest() {
    window.db.loadSampleFestShowcase();
    const org = window.db.getUsers().find(u => u.role === 'organizer');
    window.auth.saveSession(org);
    this.toast('⚡ Loaded Grand University Hackathon & Fest dataset!', 'success');
    this.currentRoute = 'organizer';
    this.render();
  },

  resetDemoData() {
    window.db.resetToClean();
    window.auth.logout();
    this.currentRoute = 'landing';
    this.toast('Database reset to clean state (1 Organizer account).', 'info');
    this.render();
  },

  logout() {
    window.auth.logout();
    this.toast('Logged out successfully', 'info');
    this.currentRoute = 'landing';
    this.render();
  },

  render() {
    const root = document.getElementById('app-root');
    if (!root) return;

    let contentHtml = '';
    if (this.currentRoute === 'landing') {
      contentHtml = window.LandingView.render();
    } else if (this.currentRoute === 'student') {
      contentHtml = window.StudentView.render();
    } else if (this.currentRoute === 'judge') {
      contentHtml = window.JudgeView.render();
    } else if (this.currentRoute === 'organizer') {
      contentHtml = window.OrganizerView.render();
    }

    root.innerHTML = contentHtml;
  },

  toast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `p-3.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-bold text-white transition-all transform translate-y-2 opacity-0 animate-fade-in ${
      type === 'success' ? 'bg-[#006a61]' :
      type === 'error' ? 'bg-[#ba1a1a]' :
      type === 'warning' ? 'bg-[#d97706]' :
      'bg-[#00288e]'
    }`;

    const iconName = 
      type === 'success' ? 'check_circle' :
      type === 'error' ? 'error' :
      type === 'warning' ? 'warning' :
      'info';

    toast.innerHTML = `
      <span class="material-symbols-outlined text-lg">${iconName}</span>
      <span class="flex-grow">${message}</span>
      <button onclick="this.parentElement.remove()" class="p-0.5 hover:bg-white/20 rounded">
        <span class="material-symbols-outlined text-sm">close</span>
      </button>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', '-translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  // Priority 5: AI Event Assistant Copilot
  isAiOpen: false,
  aiChatHistory: [
    { sender: 'ai', text: 'Hello! I am your **Abhiyantrix AI Event Copilot**. I can help you discover upcoming hackathons, check your match scores, explain venues and schedule, or guide you through QR check-in.' }
  ],

  toggleAiAssistant() {
    this.isAiOpen = !this.isAiOpen;
    this.renderAiAssistant();
  },

  renderAiAssistant() {
    const container = document.getElementById('ai-copilot-container');
    if (!container) return;

    if (!this.isAiOpen) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="fixed bottom-28 right-4 z-50 w-full max-w-sm bg-surface rounded-2xl shadow-2xl border border-outline-variant flex flex-col overflow-hidden animate-fade-in glass-panel h-[480px]">
        <!-- Copilot Header -->
        <div class="p-3.5 bg-gradient-to-r from-primary via-tertiary to-secondary text-white flex justify-between items-center shadow-md">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-lg filled">smart_toy</span>
            </div>
            <div>
              <h3 class="text-xs font-extrabold leading-tight">Abhiyantrix AI Copilot</h3>
              <span class="text-[10px] text-white/80 font-mono">Live Intelligence Connected</span>
            </div>
          </div>
          <button onclick="App.toggleAiAssistant()" class="p-1 hover:bg-white/20 rounded-full">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <!-- Chat Feed -->
        <div id="ai-chat-feed" class="p-3.5 flex-1 overflow-y-auto flex flex-col gap-3 text-xs">
          ${this.aiChatHistory.map(msg => `
            <div class="flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}">
              <div class="max-w-[85%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-surface-container border border-outline-variant/60 text-on-surface rounded-bl-none'} leading-relaxed">
                ${msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Quick Prompts Chips -->
        <div class="px-3 py-1.5 bg-surface-container-low border-t border-outline-variant/60 flex gap-1.5 overflow-x-auto text-[10px] font-bold">
          <button onclick="App.sendAiPrompt('What events are happening this week?')" class="px-2.5 py-1 rounded-full bg-surface border border-outline-variant text-primary hover:border-primary whitespace-nowrap">
            📅 Events this week
          </button>
          <button onclick="App.sendAiPrompt('Which events are best for me?')" class="px-2.5 py-1 rounded-full bg-surface border border-outline-variant text-secondary hover:border-secondary whitespace-nowrap">
            🎯 Best for me
          </button>
          <button onclick="App.sendAiPrompt('Show technology events')" class="px-2.5 py-1 rounded-full bg-surface border border-outline-variant text-tertiary hover:border-tertiary whitespace-nowrap">
            💻 Tech events
          </button>
        </div>

        <!-- Input Form -->
        <form onsubmit="App.handleAiSubmit(event)" class="p-2.5 bg-surface border-t border-outline-variant flex gap-2">
          <input id="ai-user-input" type="text" placeholder="Ask anything about events, venues..." class="flex-1 px-3 py-2 text-xs border border-outline-variant rounded-xl bg-surface-container focus:outline-none focus:border-primary" autofocus />
          <button type="submit" class="px-3 py-2 bg-primary text-white rounded-xl font-bold text-xs hover:opacity-95 shadow">
            <span class="material-symbols-outlined text-base">send</span>
          </button>
        </form>
      </div>
    `;

    const feed = document.getElementById('ai-chat-feed');
    if (feed) feed.scrollTop = feed.scrollHeight;
  },

  sendAiPrompt(text) {
    this.processAiMessage(text);
  },

  handleAiSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('ai-user-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    this.processAiMessage(text);
  },

  processAiMessage(text) {
    this.aiChatHistory.push({ sender: 'user', text });
    this.renderAiAssistant();

    setTimeout(() => {
      const reply = window.SmartEngine.askAssistant(text);
      this.aiChatHistory.push({ sender: 'ai', text: reply });
      this.renderAiAssistant();
    }, 300);
  }
};

// Bootstrap when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
