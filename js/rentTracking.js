class RentTracker {
    constructor() {
        this.currentUser = null;
        this.rentRecords = [];
    }

    async init(userId) {
        this.currentUser = await this.getUserProfile(userId);
        await this.loadRentRecords(userId);
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

    async loadRentRecords(userId) {
        try {
            const response = await fetch(`${apiBaseUrl}/rent/student/${userId}`);
            this.rentRecords = await response.json();
            this.displayRentRecords();
            this.updateReminders();
        } catch (error) {
            console.error('Error loading rent records:', error);
        }
    }

    async displayRentRecords() {
        const container = document.getElementById('rentRecordsContainer');
        if (!container) return;

        container.innerHTML = '';

        if (this.rentRecords.length === 0) {
            container.innerHTML = '<p>No rent records found.</p>';
            return;
        }

        for (const record of this.rentRecords) {
            const recordCard = await this.createRentRecordCard(record);
            container.appendChild(recordCard);
        }
    }

    async createRentRecordCard(record) {
        const card = document.createElement('div');
        card.className = 'rent-card';
        
        const dueDate = new Date(record.dueDate).toLocaleDateString();
        const paidDate = record.paidDate ? new Date(record.paidDate).toLocaleDateString() : 'Not paid';
        const statusClass = record.status.toLowerCase();
        const isOverdue = record.status === 'Unpaid' && new Date(record.dueDate) < new Date();
        const pgName = await this.getPgName(record.pgId);

        card.innerHTML = `
            <div class="rent-header">
                <h4>Rent for ${this.getMonthName(record.month)} ${record.year}</h4>
                <span class="status ${statusClass} ${isOverdue ? 'overdue' : ''}">${record.status}${isOverdue ? ' (Overdue)' : ''}</span>
            </div>
            <div class="rent-details">
                <p><strong>Amount:</strong> ₹${record.amount}</p>
                <p><strong>Due Date:</strong> ${dueDate}</p>
                <p><strong>Paid Date:</strong> ${paidDate}</p>
                <p><strong>PG:</strong> ${pgName}</p>
            </div>
            ${record.status === 'Unpaid' ? `
            <div class="rent-actions">
                <button class="btn-primary" onclick="markAsPaid(${record.id})">Mark as Paid</button>
                ${isOverdue ? '<span class="overdue-warning">Payment overdue!</span>' : ''}
            </div>
            ` : ''}
        `;

        return card;
    }

    async getPgName(pgId) {
        try {
            const response = await fetch(`${apiBaseUrl}/pg-listings/${pgId}`);
            const pg = await response.json();
            return pg.name;
        } catch (error) {
            console.error('Error fetching PG name:', error);
            return 'Unknown PG';
        }
    }

    getMonthName(month) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return months[month - 1] || 'Unknown';
    }

    updateReminders() {
        const unpaidRecords = this.rentRecords.filter(record => record.status === 'Unpaid');
        const dueSoonRecords = unpaidRecords.filter(record => {
            const dueDate = new Date(record.dueDate);
            const today = new Date();
            const diffTime = dueDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 3 && diffDays >= 0;
        });

        if (dueSoonRecords.length > 0) {
            this.showReminder(dueSoonRecords);
        }
    }

    showReminder(records) {
        const reminderContainer = document.getElementById('rentReminder');
        if (!reminderContainer) return;

        reminderContainer.innerHTML = '';
        
        records.forEach(record => {
            const dueDate = new Date(record.dueDate).toLocaleDateString();
            const reminder = document.createElement('div');
            reminder.className = 'reminder-alert';
            reminder.innerHTML = `
                <p>⚠️ Rent reminder: ₹${record.amount} due on ${dueDate} for ${this.getMonthName(record.month)} ${record.year}</p>
            `;
            reminderContainer.appendChild(reminder);
        });
    }

    async markAsPaid(recordId) {
        try {
            const response = await fetch(`${apiBaseUrl}/rent/${recordId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Paid' })
            });
            
            if (response.ok) {
                await this.loadRentRecords(this.currentUser.id);
                return true;
            }
        } catch (error) {
            console.error('Error marking rent as paid:', error);
        }
        return false;
    }

    async generateNextMonthRent() {
        if (!this.currentUser) return false;

        const lastRecord = this.rentRecords[this.rentRecords.length - 1];
        if (!lastRecord) return false;

        const nextMonth = lastRecord.month === 12 ? 1 : lastRecord.month + 1;
        const nextYear = lastRecord.month === 12 ? lastRecord.year + 1 : lastRecord.year;

        try {
            const response = await fetch(`${apiBaseUrl}/rent/generate-monthly`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: this.currentUser.id,
                    pgId: lastRecord.pgId,
                    amount: lastRecord.amount,
                    month: nextMonth,
                    year: nextYear
                })
            });
            
            if (response.ok) {
                await this.loadRentRecords(this.currentUser.id);
                return true;
            }
        } catch (error) {
            console.error('Error generating next month rent:', error);
        }
        return false;
    }
}

// Global instance
const rentTracker = new RentTracker();

// Mark rent as paid
async function markAsPaid(recordId) {
    const success = await rentTracker.markAsPaid(recordId);
    if (success) {
        alert('Rent marked as paid successfully!');
    } else {
        alert('Failed to mark rent as paid. Please try again.');
    }
}

// Generate next month rent (for owners)
async function generateNextMonthRent() {
    const success = await rentTracker.generateNextMonthRent();
    if (success) {
        alert('Next month rent generated successfully!');
    } else {
        alert('Failed to generate next month rent. Please try again.');
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // For demo purposes, initialize with user ID 2
    rentTracker.init(2);
});
