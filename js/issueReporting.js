class IssueReporter {
    constructor() {
        this.currentUser = null;
        this.currentPg = null;
    }

    async init(userId, pgId) {
        this.currentUser = await this.getUserProfile(userId);
        this.currentPg = await this.getPgDetails(pgId);
        await this.loadIssues(pgId);
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

    async getPgDetails(pgId) {
        try {
            const response = await fetch(`${apiBaseUrl}/pg-listings/${pgId}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching PG details:', error);
            return null;
        }
    }

    async loadIssues(pgId) {
        try {
            const response = await fetch(`${apiBaseUrl}/issues/pg/${pgId}`);
            const issues = await response.json();
            this.displayIssues(issues);
        } catch (error) {
            console.error('Error loading issues:', error);
        }
    }

    displayIssues(issues) {
        const container = document.getElementById('issuesContainer');
        if (!container) return;

        container.innerHTML = '';

        if (issues.length === 0) {
            container.innerHTML = '<p>No issues reported yet.</p>';
            return;
        }

        issues.forEach(issue => {
            const issueCard = this.createIssueCard(issue);
            container.appendChild(issueCard);
        });
    }

    createIssueCard(issue) {
        const card = document.createElement('div');
        card.className = 'issue-card';
        
        const statusClass = issue.status.toLowerCase();
        const createdAt = new Date(issue.createdAt).toLocaleDateString();
        const resolvedAt = issue.resolvedAt ? new Date(issue.resolvedAt).toLocaleDateString() : 'Not resolved';

        card.innerHTML = `
            <div class="issue-header">
                <h4>${issue.title}</h4>
                <span class="status ${statusClass}">${issue.status}</span>
            </div>
            <div class="issue-details">
                <p>${issue.description}</p>
                <div class="issue-meta">
                    <span>Reported: ${createdAt}</span>
                    <span>Resolved: ${resolvedAt}</span>
                </div>
            </div>
            ${issue.status === 'Open' ? `
            <div class="issue-actions">
                <button class="btn-secondary" onclick="markAsResolved(${issue.id})">Mark Resolved</button>
            </div>
            ` : ''}
        `;

        return card;
    }

    async reportIssue(issueData) {
        if (!this.currentUser || !this.currentPg) return false;

        const issue = {
            ...issueData,
            studentId: this.currentUser.id,
            pgId: this.currentPg.id
        };

        try {
            const response = await fetch(`${apiBaseUrl}/issues`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(issue)
            });
            
            if (response.ok) {
                await this.loadIssues(this.currentPg.id);
                return true;
            }
        } catch (error) {
            console.error('Error reporting issue:', error);
        }
        return false;
    }

    async markAsResolved(issueId) {
        try {
            const response = await fetch(`${apiBaseUrl}/issues/${issueId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Resolved' })
            });
            
            if (response.ok) {
                await this.loadIssues(this.currentPg.id);
                return true;
            }
        } catch (error) {
            console.error('Error marking issue as resolved:', error);
        }
        return false;
    }
}

// Global instance
const issueReporter = new IssueReporter();

// Handle issue form submission
async function handleIssueForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    const issueData = {
        title: formData.get('title'),
        description: formData.get('description')
    };

    const success = await issueReporter.reportIssue(issueData);
    if (success) {
        alert('Issue reported successfully!');
        form.reset();
    } else {
        alert('Failed to report issue. Please try again.');
    }
}

// Mark issue as resolved
async function markAsResolved(issueId) {
    const success = await issueReporter.markAsResolved(issueId);
    if (success) {
        alert('Issue marked as resolved!');
    } else {
        alert('Failed to mark issue as resolved. Please try again.');
    }
}

// Show issue reporting modal
function showIssueModal() {
    const modal = document.getElementById('issueModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // For demo purposes, initialize with user ID 2 and PG ID 1
    issueReporter.init(2, 1);
    
    // Add event listener to issue form
    const issueForm = document.getElementById('issueForm');
    if (issueForm) {
        issueForm.addEventListener('submit', handleIssueForm);
    }
});
