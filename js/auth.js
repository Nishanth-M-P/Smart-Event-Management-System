/**
 * Abhiyantrix Authentication & Credential Management Service
 * Provides role-based sessions, credential updating with password/OTP verification,
 * and standard User Icon rendering when no profile photo is uploaded.
 */

const SESSION_KEY = 'abhiyantrix_session_user_v2';

class AuthService {
  constructor() {
    this.currentUser = this.loadSession();
  }

  loadSession() {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load session:', e);
    }
    return null;
  }

  saveSession(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  getCurrentUser() {
    if (this.currentUser) {
      const fresh = window.db.getUserById(this.currentUser.id);
      if (fresh) {
        this.currentUser = fresh;
      }
    }
    return this.currentUser;
  }

  isAuthenticated() {
    return !!this.getCurrentUser();
  }

  getRole() {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  // Student Login
  loginStudent(identifier, password) {
    if (!identifier || !identifier.trim()) {
      throw new Error('Please enter your email, mobile number, or student ID.');
    }
    if (!password) {
      throw new Error('Please enter your password.');
    }

    const cleaned = identifier.trim().toLowerCase();
    const cleanDigits = identifier.replace(/\D/g, '');

    const user = window.db.findUser(u => {
      if (!u || (u.role && u.role.toLowerCase() !== 'student')) return false;
      const matchEmail = u.email && u.email.toLowerCase() === cleaned;
      const matchId = u.studentId && u.studentId.toLowerCase() === cleaned;
      const uDigits = u.mobile ? u.mobile.replace(/\D/g, '') : '';
      const matchMobile = cleanDigits.length >= 7 && uDigits.length >= 7 && (uDigits.includes(cleanDigits) || cleanDigits.includes(uDigits));
      return matchEmail || matchId || matchMobile;
    });

    if (!user) {
      throw new Error('Invalid email/mobile number or password.');
    }

    if (user.password && user.password !== password) {
      throw new Error('Invalid email/mobile number or password.');
    }

    user.lastLogin = new Date().toISOString();
    window.db.save();

    this.saveSession(user);
    window.db.addActivityLog(`Student ${user.name} logged in.`, 'login', 'student');
    return user;
  }

  // Student Registration
  registerStudent(formData) {
    const emailClean = formData.email.trim().toLowerCase();
    const mobileClean = formData.mobile.trim();
    const cleanDigits = mobileClean.replace(/\D/g, '');

    const existing = window.db.findUser(u => {
      if (!u || (u.role && u.role.toLowerCase() !== 'student')) return false;
      const matchEmail = u.email && u.email.toLowerCase() === emailClean;
      const uDigits = u.mobile ? u.mobile.replace(/\D/g, '') : '';
      const matchMobile = cleanDigits.length >= 7 && uDigits.length >= 7 && uDigits === cleanDigits;
      return matchEmail || matchMobile;
    });

    if (existing) {
      throw new Error('An account with this email address or mobile number already exists.');
    }

    const newStudent = window.db.createStudent({
      name: formData.name.trim(),
      email: emailClean,
      mobile: mobileClean,
      password: formData.password || 'password123',
      college: formData.college || 'Institution',
      department: formData.department || 'Department',
      skills: formData.skills || ''
    });

    this.saveSession(newStudent);
    return newStudent;
  }

  // Judge Login
  loginJudge(judgeId, judgeKey) {
    const idClean = judgeId.trim().toUpperCase();
    const keyClean = judgeKey.trim().toUpperCase();

    const judge = window.db.findUser(u => 
      u.role === 'judge' && 
      u.judgeId.toUpperCase() === idClean
    );

    if (!judge) {
      throw new Error(`Judge account "${idClean}" not found. Please contact the organizer.`);
    }

    if (judge.judgeKey.toUpperCase() !== keyClean) {
      throw new Error('Invalid Judge Key credential.');
    }

    judge.lastLogin = new Date().toISOString();
    window.db.save();

    this.saveSession(judge);
    window.db.addActivityLog(`Judge ${judge.name} (${judge.judgeId}) logged in.`, 'verified_user', 'judge');
    return judge;
  }

  // Organizer Login
  loginOrganizer(email, password) {
    const emailClean = email.trim().toLowerCase();
    const user = window.db.findUser(u => 
      u.role === 'organizer' && 
      u.email.toLowerCase() === emailClean
    );

    if (!user) {
      throw new Error('Organizer account not found with this email.');
    }

    if (password && user.password && user.password !== password) {
      throw new Error('Invalid organizer password.');
    }

    user.lastLogin = new Date().toISOString();
    window.db.save();

    this.saveSession(user);
    window.db.addActivityLog(`Organizer ${user.name} logged into Command Center.`, 'admin_panel_settings', 'organizer');
    return user;
  }

  // Change Password
  changePassword(userId, currentPassword, newPassword, confirmPassword) {
    const user = window.db.getUserById(userId);
    if (!user) throw new Error('User not found.');

    if (user.password && user.password !== currentPassword) {
      throw new Error('Current password does not match.');
    }

    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters.');
    }

    if (newPassword !== confirmPassword) {
      throw new Error('New password and confirm password do not match.');
    }

    user.password = newPassword;
    window.db.addActivityLog(`Password updated for ${user.name}.`, 'lock_reset', user.role);
    window.db.save();
    this.saveSession(user);
    return true;
  }

  // Update Account Profile
  updateAccount(userId, updates) {
    const user = window.db.updateUserProfile(userId, updates);
    if (user) {
      this.saveSession(user);
    }
    return user;
  }

  logout() {
    const user = this.currentUser;
    if (user) {
      window.db.addActivityLog(`${user.name} logged out.`, 'logout', user.role);
    }
    this.saveSession(null);
  }

  // Render User Avatar: Always standard user icon if no photo is uploaded
  static renderAvatar(user, sizeClass = 'w-10 h-10', iconSize = 'text-xl') {
    if (user && user.avatar) {
      return `
        <div class="${sizeClass} rounded-full overflow-hidden border border-outline-variant flex-shrink-0 bg-surface">
          <img src="${user.avatar}" class="w-full h-full object-cover" alt="${user.name || 'User'}" />
        </div>
      `;
    }
    return `
      <div class="${sizeClass} rounded-full bg-surface-container border border-outline-variant text-on-surface-variant flex items-center justify-center flex-shrink-0">
        <span class="material-symbols-outlined ${iconSize}">person</span>
      </div>
    `;
  }
}

window.auth = new AuthService();
