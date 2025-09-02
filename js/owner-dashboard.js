class OwnerDashboard {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        await this.checkAuth();
        this.loadOwnerListings();
        this.loadOwnerIssues();
        this.loadRentRecords();
        this.loadKYCApplications();
        this.setupEventListeners();
    }

    async checkAuth() {
        const userData = localStorage.getItem('currentUser');
        if (!userData) {
            window.location.href = 'index.html';
            return;
        }
        
        this.currentUser = JSON.parse(userData);
        if (this.currentUser.role !== 'owner') {
            window.location.href = 'index.html';
        }
    }

    async loadOwnerListings() {
        try {
            const response = await fetch('http://localhost:5000/api/pg-listings');
            const listings = await response.json();
            
            const ownerListings = listings.filter(listing => listing.ownerId === this.currentUser.id);
            this.displayOwnerListings(ownerListings);
        } catch (error) {
            console.error('Error loading listings:', error);
        }
    }

    displayOwnerListings(listings) {
        const container = document.getElementById('ownerListings');
        container.innerHTML = listings.length === 0 ? 
            '<p>No listings found. Add your first PG listing!</p>' : 
            listings.map(listing => `
                <div class="listing-card">
                    <h3>${listing.name}</h3>
                    <p><strong>Rent:</strong> ₹${listing.rent}</p>
                    <p><strong>Rooms:</strong> ${listing.availableRooms}/${listing.totalRooms} available</p>
                    <p><strong>Gender:</strong> ${listing.genderPreference}</p>
                    <p><strong>Distance:</strong> ${listing.distanceFromCollege} km</p>
                    <p><strong>Amenities:</strong> ${listing.amenities.join(', ')}</p>
                    <button onclick="ownerDashboard.editListing(${listing.id})">Edit</button>
                    <button onclick="ownerDashboard.deleteListing(${listing.id})">Delete</button>
                </div>
            `).join('');
    }

    async addListing(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const listingData = {
            name: formData.get('name'),
            rent: parseInt(formData.get('rent')),
            totalRooms: parseInt(formData.get('totalRooms')),
            genderPreference: formData.get('genderPreference'),
            distanceFromCollege: parseFloat(formData.get('distanceFromCollege')),
            location: {
                lat: parseFloat(formData.get('lat')),
                lng: parseFloat(formData.get('lng'))
            },
            amenities: formData.get('amenities') ? formData.get('amenities').split(',').map(a => a.trim()) : [],
            images: formData.get('images') ? formData.get('images').split(',').map(i => i.trim()) : [],
            ownerId: this.currentUser.id
        };

        try {
            const response = await fetch('http://localhost:5000/api/pg-listings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(listingData)
            });

            if (response.ok) {
                alert('Listing added successfully!');
                event.target.reset();
                this.loadOwnerListings();
            } else {
                alert('Error adding listing');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding listing');
        }
    }

    async editListing(listingId) {
        // Implementation for editing listing
        alert('Edit functionality coming soon!');
    }

    async deleteListing(listingId) {
        if (confirm('Are you sure you want to delete this listing?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/pg-listings/${listingId}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Listing deleted successfully!');
                    this.loadOwnerListings();
                } else {
                    alert('Error deleting listing');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error deleting listing');
            }
        }
    }

    async loadOwnerIssues() {
        try {
            const response = await fetch('http://localhost:5000/api/issues');
            const issues = await response.json();
            
            // Filter issues for this owner's listings
            const ownerIssues = issues.filter(issue => {
                // In a real app, you'd check if the issue's pgId belongs to this owner
                return true; // For demo, show all issues
            });
            
            this.displayOwnerIssues(ownerIssues);
        } catch (error) {
            console.error('Error loading issues:', error);
        }
    }

    displayOwnerIssues(issues) {
        const container = document.getElementById('ownerIssues');
        container.innerHTML = issues.length === 0 ? 
            '<p>No issues reported</p>' : 
            issues.map(issue => `
                <div class="issue-card">
                    <h4>${issue.title}</h4>
                    <p>${issue.description}</p>
                    <p><strong>Status:</strong> ${issue.status}</p>
                    <p><strong>Reported:</strong> ${new Date(issue.createdAt).toLocaleDateString()}</p>
                    ${issue.status === 'Open' ? 
                        `<button onclick="ownerDashboard.resolveIssue(${issue.id})">Mark Resolved</button>` : ''}
                </div>
            `).join('');
    }

    async resolveIssue(issueId) {
        try {
            const response = await fetch(`http://localhost:5000/api/issues/${issueId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Resolved' })
            });

            if (response.ok) {
                alert('Issue marked as resolved!');
                this.loadOwnerIssues();
            } else {
                alert('Error resolving issue');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error resolving issue');
        }
    }

    async loadRentRecords() {
        try {
            const response = await fetch('http://localhost:5000/api/rent');
            const records = await response.json();
            this.displayRentRecords(records);
        } catch (error) {
            console.error('Error loading rent records:', error);
        }
    }

    displayRentRecords(records) {
        const container = document.getElementById('rentRecords');
        container.innerHTML = records.length === 0 ? 
            '<p>No rent records found</p>' : 
            records.map(record => `
                <div class="rent-card">
                    <h4>Rent for ${record.month}/${record.year}</h4>
                    <p><strong>Amount:</strong> ₹${record.amount}</p>
                    <p><strong>Status:</strong> ${record.status}</p>
                    <p><strong>Due:</strong> ${new Date(record.dueDate).toLocaleDateString()}</p>
                    ${record.status === 'Unpaid' ? 
                        `<button onclick="ownerDashboard.markPaid(${record.id})">Mark Paid</button>` : ''}
                </div>
            `).join('');
    }

    async markPaid(recordId) {
        try {
            const response = await fetch(`http://localhost:5000/api/rent/${recordId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Paid' })
            });

            if (response.ok) {
                alert('Rent marked as paid!');
                this.loadRentRecords();
            } else {
                alert('Error updating rent status');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating rent status');
        }
    }

    async loadKYCApplications() {
        try {
            const response = await fetch('http://localhost:5000/api/agreements');
            const applications = await response.json();
            this.displayKYCApplications(applications);
        } catch (error) {
            console.error('Error loading KYC applications:', error);
        }
    }

    displayKYCApplications(applications) {
        const container = document.getElementById('kycApplications');
        container.innerHTML = applications.length === 0 ? 
            '<p>No KYC applications found</p>' : 
            applications.map(app => `
                <div class="kyc-card">
                    <h4>Application #${app.id}</h4>
                    <p><strong>Status:</strong> ${app.status}</p>
                    <p><strong>Uploaded:</strong> ${new Date(app.uploadedAt).toLocaleDateString()}</p>
                    ${app.status === 'Pending' ? 
                        `<button onclick="ownerDashboard.verifyKYC(${app.id})">Verify</button>
                         <button onclick="ownerDashboard.rejectKYC(${app.id})">Reject</button>` : ''}
                </div>
            `).join('');
    }

    async verifyKYC(applicationId) {
        try {
            const response = await fetch(`http://localhost:5000/api/agreements/${applicationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    status: 'Verified',
                    verifiedAt: new Date().toISOString(),
                    verifiedBy: this.currentUser.id
                })
            });

            if (response.ok) {
                alert('KYC application verified!');
                this.loadKYCApplications();
            } else {
                alert('Error verifying KYC');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error verifying KYC');
        }
    }

    async rejectKYC(applicationId) {
        try {
            const response = await fetch(`http://localhost:5000/api/agreements/${applicationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Rejected' })
            });

            if (response.ok) {
                alert('KYC application rejected!');
                this.loadKYCApplications();
            } else {
                alert('Error rejecting KYC');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error rejecting KYC');
        }
    }

    setupEventListeners() {
        document.getElementById('addListingForm').addEventListener('submit', (e) => this.addListing(e));
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
    }

    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Initialize the dashboard
const ownerDashboard = new OwnerDashboard();
