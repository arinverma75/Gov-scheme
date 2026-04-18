// In-memory database store - can be swapped with MongoDB for production
import { readFileSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Load seed data using ESM-compatible path resolution
const schemesData = JSON.parse(
  readFileSync(new URL('../../data/schemes.json', import.meta.url), 'utf-8')
);

// In-memory collections
const db = {
  schemes: schemesData,
  users: [],
  chatHistories: [],
  notifications: []
};

// ---------- Scheme Operations ----------
export const SchemeModel = {
  findAll(filters = {}) {
    let results = [...db.schemes];

    if (filters.category) {
      results = results.filter(s => s.category.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.state) {
      results = results.filter(s => 
        s.eligibility.states.includes('All') || 
        s.eligibility.states.map(st => st.toLowerCase()).includes(filters.state.toLowerCase())
      );
    }
    if (filters.status) {
      results = results.filter(s => s.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q)) ||
        s.category.toLowerCase().includes(q) ||
        (s.nameHindi && s.nameHindi.includes(filters.search))
      );
    }

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 12;
    const start = (page - 1) * limit;
    const total = results.length;

    return {
      schemes: results.slice(start, start + limit),
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  },

  findById(id) {
    return db.schemes.find(s => s.id === id) || null;
  },

  findByState(state) {
    return db.schemes.filter(s => 
      s.eligibility.states.includes('All') || 
      s.eligibility.states.map(st => st.toLowerCase()).includes(state.toLowerCase())
    );
  },

  findByCategory(category) {
    return db.schemes.filter(s => s.category.toLowerCase() === category.toLowerCase());
  },

  getCategories() {
    const cats = {};
    db.schemes.forEach(s => {
      if (!cats[s.category]) cats[s.category] = 0;
      cats[s.category]++;
    });
    return Object.entries(cats).map(([name, count]) => ({ name, count }));
  },

  getStates() {
    const states = new Set();
    db.schemes.forEach(s => {
      s.eligibility.states.forEach(st => {
        if (st !== 'All') states.add(st);
      });
    });
    return Array.from(states).sort();
  },

  // For recommendation engine
  findEligible(profile) {
    return db.schemes.filter(scheme => {
      const e = scheme.eligibility;

      // Category filter — only check schemes in the specified category
      if (profile.category && scheme.category.toLowerCase() !== profile.category.toLowerCase()) return false;

      // Age check
      if (profile.age && (profile.age < e.minAge || profile.age > e.maxAge)) return false;

      // Income check
      if (profile.income && profile.income > e.maxIncome) return false;

      // Gender check
      if (profile.gender && !e.gender.includes(profile.gender) && !e.gender.includes('Other')) return false;

      // Caste check
      if (profile.caste && e.caste.length > 0 && !e.caste.includes(profile.caste)) return false;

      // State check
      if (profile.state && !e.states.includes('All') && !e.states.map(s => s.toLowerCase()).includes(profile.state.toLowerCase())) return false;

      // Occupation check
      if (profile.occupation && e.occupation.length > 0 && !e.occupation.includes('Any') && !e.occupation.includes(profile.occupation)) return false;

      // Education check
      if (profile.education && e.education.length > 0 && !e.education.includes('Any') && !e.education.includes(profile.education)) return false;

      // Rural check
      if (e.isRural && profile.isRural === false) return false;

      // BPL check
      if (e.isBPL && profile.isBPL === false) return false;

      return true;
    });
  }
};

// ---------- User Operations ----------
export const UserModel = {
  create(userData) {
    const user = {
      id: uuidv4(),
      ...userData,
      savedSchemes: [],
      appliedSchemes: [],
      notifications: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.users.push(user);
    return user;
  },

  findById(id) {
    return db.users.find(u => u.id === id) || null;
  },

  findByPhone(phone) {
    return db.users.find(u => u.phone === phone) || null;
  },

  update(id, updates) {
    const idx = db.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    db.users[idx] = { ...db.users[idx], ...updates, updatedAt: new Date().toISOString() };
    return db.users[idx];
  },

  addNotification(userId, notification) {
    const user = this.findById(userId);
    if (!user) return null;
    const notif = {
      id: uuidv4(),
      ...notification,
      read: false,
      createdAt: new Date().toISOString()
    };
    user.notifications.unshift(notif);
    return notif;
  }
};

// ---------- Chat History Operations ----------
export const ChatModel = {
  create(userId) {
    const chat = {
      id: uuidv4(),
      userId,
      messages: [],
      createdAt: new Date().toISOString()
    };
    db.chatHistories.push(chat);
    return chat;
  },

  findByUserId(userId) {
    return db.chatHistories.filter(c => c.userId === userId);
  },

  findById(id) {
    return db.chatHistories.find(c => c.id === id) || null;
  },

  addMessage(chatId, message) {
    const chat = this.findById(chatId);
    if (!chat) return null;
    chat.messages.push({
      ...message,
      timestamp: new Date().toISOString()
    });
    return chat;
  },

  getOrCreateChat(sessionId) {
    let chat = db.chatHistories.find(c => c.id === sessionId);
    if (!chat) {
      chat = {
        id: sessionId || uuidv4(),
        userId: null,
        messages: [],
        createdAt: new Date().toISOString()
      };
      db.chatHistories.push(chat);
    }
    return chat;
  }
};

// ---------- Analytics ----------
export const AnalyticsModel = {
  getSchemesByCategory() {
    return SchemeModel.getCategories();
  },

  getSchemesByState() {
    const stateMap = {};
    db.schemes.forEach(s => {
      s.eligibility.states.forEach(state => {
        if (!stateMap[state]) stateMap[state] = 0;
        stateMap[state]++;
      });
    });
    return Object.entries(stateMap)
      .map(([state, count]) => ({ state, count }))
      .sort((a, b) => b.count - a.count);
  },

  getSchemesByStatus() {
    const statusMap = {};
    db.schemes.forEach(s => {
      if (!statusMap[s.status]) statusMap[s.status] = 0;
      statusMap[s.status]++;
    });
    return statusMap;
  },

  getSummary() {
    return {
      totalSchemes: db.schemes.length,
      activeSchemes: db.schemes.filter(s => s.status === 'Active').length,
      totalUsers: db.users.length,
      categories: SchemeModel.getCategories().length,
      states: SchemeModel.getStates().length + 1, // +1 for "All"
      totalChatSessions: db.chatHistories.length
    };
  },

  getAwarenessGap() {
    // Simulate awareness gap data based on category distribution
    const categories = SchemeModel.getCategories();
    return categories.map(cat => ({
      category: cat.name,
      totalSchemes: cat.count,
      estimatedAwareness: Math.floor(Math.random() * 40 + 20), // 20-60%
      gap: Math.floor(Math.random() * 40 + 40) // 40-80%
    }));
  }
};

export default db;
