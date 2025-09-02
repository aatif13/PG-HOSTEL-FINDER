// In-memory storage for agreements and KYC documents
let agreements = [
  {
    id: 1,
    studentId: 2,
    pgId: 1,
    agreementFile: "agreement_1.pdf",
    idProofFile: "id_proof_1.jpg",
    status: "Verified",
    uploadedAt: new Date('2024-01-01'),
    verifiedAt: new Date('2024-01-02'),
    verifiedBy: 1
  },
  {
    id: 2,
    studentId: 3,
    pgId: 2,
    agreementFile: "agreement_2.pdf",
    idProofFile: "id_proof_2.jpg",
    status: "Pending",
    uploadedAt: new Date('2024-01-05'),
    verifiedAt: null,
    verifiedBy: null
  }
];

let nextId = 3;

module.exports = {
  getAllAgreements: () => agreements,
  
  getAgreementById: (id) => agreements.find(agreement => agreement.id === parseInt(id)),
  
  getAgreementsByStudentId: (studentId) => 
    agreements.filter(agreement => agreement.studentId === parseInt(studentId)),
  
  getAgreementsByPgId: (pgId) => 
    agreements.filter(agreement => agreement.pgId === parseInt(pgId)),
  
  createAgreement: (agreementData) => {
    const newAgreement = {
      id: nextId++,
      ...agreementData,
      status: "Pending",
      uploadedAt: new Date(),
      verifiedAt: null,
      verifiedBy: null
    };
    agreements.push(newAgreement);
    return newAgreement;
  },
  
  updateAgreement: (id, updates) => {
    const index = agreements.findIndex(agreement => agreement.id === parseInt(id));
    if (index !== -1) {
      if (updates.status === "Verified" && agreements[index].status !== "Verified") {
        updates.verifiedAt = new Date();
      }
      agreements[index] = { ...agreements[index], ...updates };
      return agreements[index];
    }
    return null;
  },
  
  deleteAgreement: (id) => {
    const index = agreements.findIndex(agreement => agreement.id === parseInt(id));
    if (index !== -1) {
      return agreements.splice(index, 1)[0];
    }
    return null;
  },
  
  getPendingAgreements: () => agreements.filter(agreement => agreement.status === "Pending"),
  
  getVerifiedAgreements: () => agreements.filter(agreement => agreement.status === "Verified"),
  
  verifyAgreement: (id, verifiedBy) => {
    const index = agreements.findIndex(agreement => agreement.id === parseInt(id));
    if (index !== -1) {
      agreements[index].status = "Verified";
      agreements[index].verifiedAt = new Date();
      agreements[index].verifiedBy = verifiedBy;
      return agreements[index];
    }
    return null;
  },
  
  getAgreementsByOwner: (ownerId) => {
    // This would need to be connected to PG listings to get owner's PGs
    // For now, return all agreements
    return agreements;
  }
};
