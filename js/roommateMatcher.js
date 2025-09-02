class RoommateMatcher {
    constructor() {
        this.currentUser = null;
        this.matches = [];
    }

    async init(userId) {
        this.currentUser = await this.getUserProfile(userId);
        await this.loadMatches(userId);
    }

    async getUserProfile(userId) {
        try {
            const response = await fetch(`${apiBaseUrl}/users/${userId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }

    async loadMatches(userId) {
        try {
            const response = await fetch(`${apiBaseUrl}/users/${userId}/matches`);
            this.matches = await response.json();
            this.displayMatches();
        } catch (error) {
            console.error('Error loading matches:', error);
        }
    }

    displayMatches() {
        const container = document.getElementById('matchResults');
        container.innerHTML = '';

        if (this.matches.length === 0) {
            container.innerHTML = '<p>No matches found. Complete your lifestyle quiz to find compatible roommates.</p>';
            return;
        }

        this.matches.forEach(match => {
            const card = this.createMatchCard(match);
            container.appendChild(card);
        });
    }

    createMatchCard(match) {
        const card = document.createElement('div');
        card.className = 'match-card';
        
        card.innerHTML = `
            <div class="match-header">
                <h4>${match.user.name}</h4>
                <span class="match-score">${match.matchScore}% Match</span>
            </div>
            <div class="match-details">
                <p><strong>Email:</strong> ${match.user.email}</p>
                <p><strong>Phone:</strong> ${match.user.phone || 'Not provided'}</p>
                <p><strong>Budget:</strong> ₹${match.user.preferences.budget}</p>
            </div>
            <div class="match-actions">
                <button class="btn-primary" onclick="startChat(${match.user.id})">Chat</button>
                <button class="btn-secondary" onclick="viewProfile(${match.user.id})">View Profile</button>
            </div>
        `;

        return card;
    }

    async updateLifestylePreferences(preferences) {
        if (!this.currentUser) return;

        try {
            const response = await fetch(`${apiBaseUrl}/users/${this.currentUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ preferences })
            });
            
            if (response.ok) {
                this.currentUser = await response.json();
                await this.loadMatches(this.currentUser.id);
                return true;
            }
        } catch (error) {
            console.error('Error updating preferences:', error);
        }
        return false;
    }

    calculateCompatibility(user1, user2) {
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
    }
}

// Global instance
const roommateMatcher = new RoommateMatcher();

// Chat functionality (simplified for MVP)
function startChat(userId) {
    alert(`Starting chat with user ${userId}. This feature will be implemented in the next version.`);
}

function viewProfile(userId) {
    alert(`Viewing profile of user ${userId}. This feature will be implemented in the next version.`);
}

// Handle lifestyle quiz submission
async function handleLifestyleQuiz(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const preferences = {
        budget: parseInt(formData.get('budget')) || 0,
        habits: {
            cleanliness: parseInt(formData.get('cleanliness')) || 5,
            noiseLevel: parseInt(formData.get('noiseLevel')) || 5,
            studyTime: parseInt(formData.get('studyTime')) || 6,
            sleepTime: parseInt(formData.get('sleepTime')) || 23
        }
    };

    const success = await roommateMatcher.updateLifestylePreferences(preferences);
    if (success) {
        alert('Lifestyle preferences updated successfully!');
    } else {
        alert('Failed to update preferences. Please try again.');
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // For demo purposes, initialize with user ID 2
    roommateMatcher.init(2);
    
    // Add event listener to lifestyle quiz form
    const quizForm = document.getElementById('lifestyleQuiz');
    if (quizForm) {
        quizForm.addEventListener('submit', handleLifestyleQuiz);
    }
});
