// Apni Kirana - Auth & Account Engine (LocalStorage Session)

const DEMO_VENDOR = {
  id: 'vendor_001',
  name: 'Vijay Dukan Owner',
  email: 'vendor@apnikirana.in',
  phone: '9811122233',
  role: 'vendor',
  shopName: 'Apni Kirana Store',
  address: {
    house: 'Shop No. 1',
    street: 'Mandi Market Main Gate, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034'
  }
};

const DEMO_USER = {
  id: 'usr_1001',
  name: 'Harsh Sharma',
  email: 'harsh@example.com',
  phone: '9876543210',
  role: 'user',
  address: {
    house: 'Flat 302, Sai Residency',
    street: '12th Main, Koramangala 4th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034'
  }
};

class AuthManager {
  constructor() {
    this.sessionKey = 'apnikirana_session';
    this.usersKey = 'apnikirana_users';

    // Seed initial demo users
    if (!localStorage.getItem(this.usersKey)) {
      localStorage.setItem(this.usersKey, JSON.stringify([DEMO_VENDOR, DEMO_USER]));
    }
  }

  getUsers() {
    try {
      const saved = localStorage.getItem(this.usersKey);
      return saved ? JSON.parse(saved) : [DEMO_VENDOR, DEMO_USER];
    } catch {
      return [DEMO_VENDOR, DEMO_USER];
    }
  }

  saveUsers(users) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  getUser() {
    try {
      const saved = localStorage.getItem(this.sessionKey);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  isLoggedIn() {
    return !!this.getUser();
  }

  isVendor() {
    const user = this.getUser();
    return user && user.role === 'vendor';
  }

  login(email, password) {
    const cleanEmail = email.toLowerCase().trim();
    const users = this.getUsers();
    let found = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!found) {
      // Auto-create customer session for demo
      const isVendorEmail = cleanEmail.includes('vendor') || cleanEmail.includes('admin');
      found = {
        id: 'usr_' + Date.now(),
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        phone: '9876543210',
        role: isVendorEmail ? 'vendor' : 'user',
        address: {
          house: 'House 12',
          street: 'Main Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560034'
        }
      };
      users.push(found);
      this.saveUsers(users);
    }

    localStorage.setItem(this.sessionKey, JSON.stringify(found));
    if (window.showToast) window.showToast(`Welcome back, ${found.name}! 👋`, "success");
    return found;
  }

  loginDemoUser() {
    localStorage.setItem(this.sessionKey, JSON.stringify(DEMO_USER));
    if (window.showToast) window.showToast("Logged in as Customer Demo! 🛒", "success");
    return DEMO_USER;
  }

  loginDemoVendor() {
    localStorage.setItem(this.sessionKey, JSON.stringify(DEMO_VENDOR));
    if (window.showToast) window.showToast("Logged in as Store Vendor Demo! 🏪", "success");
    return DEMO_VENDOR;
  }

  register({ name, email, phone, password }) {
    const cleanEmail = email.toLowerCase().trim();
    const users = this.getUsers();

    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      if (window.showToast) window.showToast("An account with this email already exists!", "error");
      return null;
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name,
      email: cleanEmail,
      phone: phone || '9876543210',
      role: 'user',
      address: {
        house: 'Flat 101',
        street: 'Green Meadows',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560034'
      }
    };

    users.push(newUser);
    this.saveUsers(users);
    localStorage.setItem(this.sessionKey, JSON.stringify(newUser));
    if (window.showToast) window.showToast(`Account registered successfully! Welcome ${name}`, "success");
    return newUser;
  }

  updateProfile(profileData) {
    let user = this.getUser();
    if (!user) return;

    user = { ...user, ...profileData };
    localStorage.setItem(this.sessionKey, JSON.stringify(user));

    const users = this.getUsers().map(u => u.id === user.id ? user : u);
    this.saveUsers(users);

    if (window.showToast) window.showToast("Profile updated successfully! ✅", "success");
  }

  logout() {
    localStorage.removeItem(this.sessionKey);
    if (window.showToast) window.showToast("Logged out successfully", "info");
  }
}

window.Auth = new AuthManager();
