class KYCManger {
    constructor() {
        this.currentUser = null;
        this.currentAgreements = [];
    }

    async init(userId) {
        this.currentUser = await this.getUserProfile(userId);
        await this.loadAgreements(userId);
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

    async loadAgreements(userId) {
        try {
            const response = await fetch(`${apiBaseUrl}/agreements/student/${userId}`);
            this.currentAgreements = await response.json();
            this.displayAgreements();
        } catch (error) {
            console.error('Error loading agreements:', error);
        }
    }

    displayAgreements() {
        const container = document.getElementById('agreementsContainer');
        if (!container) return;

        container.innerHTML = '';

        if (this.currentAgreements.length === 0) {
            container.innerHTML = '<p>No agreements found. Please upload your documents.</p>';
            return;
        }

        this.currentAgreements.forEach(agreement => {
            const agreementCard = this.createAgreementCard(agreement);
            container.appendChild(agreementCard);
        });
    }

    createAgreementCard(agreement) {
        const card = document.createElement('div');
        card.className = 'agreement-card';
        
        const uploadedAt = new Date(agreement.uploadedAt).toLocaleDateString();
        const verifiedAt = agreement.verifiedAt ? new Date(agreement.verifiedAt).toLocaleDateString() : 'Not verified';
        const statusClass = agreement.status.toLowerCase();

        card.innerHTML = `
            <div class="agreement-header">
                <h4>Agreement #${agreement.id}</h4>
                <span class="status ${statusClass}">${agreement.status}</span>
            </div>
            <div class="agreement-details">
                <p><strong>Uploaded:</strong> ${uploadedAt}</p>
                <p><strong>Verified:</strong> ${verifiedAt}</p>
                <p><strong>Verified By:</strong> ${agreement.verifiedBy || 'Not verified'}</p>
            </div>
            <div class="agreement-files">
                <p><strong>ID Proof:</strong> ${agreement.idProofFile}</p>
                <p><strong>Agreement:</strong> ${agreement.agreementFile}</p>
            </div>
            ${agreement.status === 'Pending' ? `
            <div class="agreement-actions">
                <button class="btn-secondary" onclick="viewDocument(${agreement.id}, 'id')">View ID Proof</button>
                <button class="btn-secondary" onclick="viewDocument(${agreement.id}, 'agreement')">View Agreement</button>
            </div>
            ` : ''}
        `;

        return card;
    }

    async uploadDocuments(formData) {
        if (!this.currentUser) return false;

        try {
            const response = await fetch(`${apiBaseUrl}/agreements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: this.currentUser.id,
                    pgId: formData.pgId,
                    agreementFile: formData.agreementFile,
                    idProofFile: formData.idProofFile
                })
            });
            
            if (response.ok) {
                await this.loadAgreements(this.currentUser.id);
                return true;
            }
        } catch (error) {
            console.error('Error uploading documents:', error);
        }
        return false;
    }

    async verifyAgreement(agreementId, verifiedBy) {
        try {
            const response = await fetch(`${apiBaseUrl}/agreements/${agreementId}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ verifiedBy })
            });
            
            if (response.ok) {
                await this.loadAgreements(this.currentUser.id);
                return true;
            }
        } catch (error) {
            console.error('Error verifying agreement:', error);
        }
        return false;
    }
}

// Global instance
const kycManager = new KYCManger();

// Handle document upload form
async function handleDocumentUpload(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    // For file uploads, we would normally handle file objects
    // For this MVP, we'll just use file names
    const uploadData = {
        pgId: formData.get('pgId'),
        agreementFile: formData.get('agreementFile').name || 'agreement.pdf',
        idProofFile: formData.get('idProofFile').name || 'id_proof.jpg'
    };

    const success = await kycManager.uploadDocuments(uploadData);
    if (success) {
        alert('Documents uploaded successfully! Waiting for verification.');
        form.reset();
        closeModal('kycModal');
    } else {
        alert('Failed to upload documents. Please try again.');
    }
}

// View document (simplified for MVP)
function viewDocument(agreementId, documentType) {
    alert(`Viewing ${documentType} for agreement ${agreementId}. This feature will be implemented in the next version.`);
}

// Verify agreement (for owners)
async function verifyAgreement(agreementId) {
    const verifiedBy = prompt('Enter your owner ID for verification:');
    if (verifiedBy) {
        const success = await kycManager.verifyAgreement(agreementId, parseInt(verifiedBy));
        if (success) {
            alert('Agreement verified successfully!');
        } else {
            alert('Failed to verify agreement. Please try again.');
        }
    }
}

// Show KYC upload modal
function showKYCModal() {
    const modal = document.getElementById('kycModal');
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
    // For demo purposes, initialize with user ID 2
    kycManager.init(2);
    
    // Add event listener to KYC form
    const kycForm = document.getElementById('kycForm');
    if (kycForm) {
        kycForm.addEventListener('submit', handleDocumentUpload);
    }
});
