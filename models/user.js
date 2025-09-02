// In-memory storage for users
let users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "owner",
    phone: "1234567890",
    preferences: {
      budget: 10000,
      location: { lat: 28.6139, lng: 77.2090 },
      gender: "Male",
      habits: {
        cleanliness: 8,
        noiseLevel: 6,
        studyTime: 7,
        sleepTime: 23
      }
    }
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    role: "student",
    phone: "0987654321",
    preferences: {
      budget: 8000,
      location: { lat: 28.6129, lng: 77.2295 },
      gender: "Female",
      habits: {
        cleanliness: 9,
        noiseLevel: 4,
        studyTime: 8,
        sleepTime: 22
      }
    }
  }
];

let nextId = 3;

module.exports = {
  getAllUsers: () => users,
  
  getUserById: (id) => users.find(user => user.id === parseInt(id)),
  
  getUserByEmail: (email) => users.find(user => user.email === email),
  
  createUser: (userData) => {
    const newUser = {
      id: nextId++,
      ...userData,
      preferences: userData.preferences || {
        budget: 0,
        location: { lat: 0, lng: 0 },
        gender: "Any",
        habits: {
          cleanliness: 5,
          noiseLevel: 5,
          studyTime: 6,
          sleepTime: 23
        }
      }
    };
    users.push(newUser);
    return newUser;
  },
  
  updateUser: (id, updates) => {
    const index = users.findIndex(user => user.id === parseInt(id));
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      return users[index];
    }
    return null;
  },
  
  deleteUser: (id) => {
    const index = users.findIndex(user => user.id === parseInt(id));
    if (index !== -1) {
      return users.splice(index, 1)[0];
    }
    return null;
  },
  
  calculateMatchScore: (user1Id, user2Id) => {
    const user1 = users.find(u => u.id === parseInt(user1Id));
    const user2 = users.find(u => u.id === parseInt(user2Id));
    
    if (!user1 || !user2) return 0;
    
    let score = 0;
    const habits1 = user1.preferences.habits;
    const habits2 = user2.preferences.habits;
    
    // Budget compatibility (30% weight)
    const budgetDiff = Math.abs(user1.preferences.budget - user2.preferences.budget);
    const budgetScore = Math.max(0, 100 - (budgetDiff / 1000) * 30);
    score += budgetScore * 0.3;
    
    // Habits compatibility (70% weight)
    const habitScore = (
      (Math.abs(habits1.cleanliness - habits2.cleanliness) <= 2 ? 25 : 0) +
      (Math.abs(habits1.noiseLevel - habits2.noiseLevel) <= 2 ? 25 : 0) +
      (Math.abs(habits1.studyTime - habits2.studyTime) <= 2 ? 25 : 0) +
      (Math.abs(habits1.sleepTime - habits2.sleepTime) <= 2 ? 25 : 0)
    ) * 0.7;
    score += habitScore;
    
    return Math.round(score);
  },
  
  findMatches: function(userId) {
    const currentUser = users.find(u => u.id === parseInt(userId));
    if (!currentUser || currentUser.role !== 'student') return [];
    
    return users
      .filter(user => user.id !== parseInt(userId) && user.role === 'student')
      .map(user => ({
        user,
        matchScore: this.calculateMatchScore(userId, user.id)
      }))
      .sort((a, b) => b.matchScore - a.matchScore);
  }
};
