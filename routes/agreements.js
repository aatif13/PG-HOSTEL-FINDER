const express = require('express');
const router = express.Router();
const agreementModel = require('../models/agreement');

// Get all agreements
router.get('/', (req, res) => {
  const agreements = agreementModel.getAllAgreements();
  res.json(agreements);
});

// Get agreement by ID
router.get('/:id', (req, res) => {
  const agreement = agreementModel.getAgreementById(req.params.id);
  if (agreement) {
    res.json(agreement);
  } else {
    res.status(404).json({ message: 'Agreement not found' });
  }
});

// Get agreements by student ID
router.get('/student/:studentId', (req, res) => {
  const agreements = agreementModel.getAgreementsByStudentId(req.params.studentId);
  res.json(agreements);
});

// Get agreements by PG ID
router.get('/pg/:pgId', (req, res) => {
  const agreements = agreementModel.getAgreementsByPgId(req.params.pgId);
  res.json(agreements);
});

// Create new agreement
router.post('/', (req, res) => {
  const newAgreement = agreementModel.createAgreement(req.body);
  res.status(201).json(newAgreement);
});

// Update agreement
router.put('/:id', (req, res) => {
  const updatedAgreement = agreementModel.updateAgreement(req.params.id, req.body);
  if (updatedAgreement) {
    res.json(updatedAgreement);
  } else {
    res.status(404).json({ message: 'Agreement not found' });
  }
});

// Delete agreement
router.delete('/:id', (req, res) => {
  const deletedAgreement = agreementModel.deleteAgreement(req.params.id);
  if (deletedAgreement) {
    res.json({ message: 'Agreement deleted' });
  } else {
    res.status(404).json({ message: 'Agreement not found' });
  }
});

// Get pending agreements
router.get('/status/pending', (req, res) => {
  const pending = agreementModel.getPendingAgreements();
  res.json(pending);
});

// Get verified agreements
router.get('/status/verified', (req, res) => {
  const verified = agreementModel.getVerifiedAgreements();
  res.json(verified);
});

// Verify agreement
router.post('/:id/verify', (req, res) => {
  const { verifiedBy } = req.body;
  const verifiedAgreement = agreementModel.verifyAgreement(req.params.id, verifiedBy);
  if (verifiedAgreement) {
    res.json({ message: 'Agreement verified', agreement: verifiedAgreement });
  } else {
    res.status(404).json({ message: 'Agreement not found' });
  }
});

// Get agreements for owner (all for now)
router.get('/owner/:ownerId', (req, res) => {
  const ownerAgreements = agreementModel.getAgreementsByOwner(req.params.ownerId);
  res.json(ownerAgreements);
});

module.exports = router;
