const express = require('express');
const router = express.Router();
const rentModel = require('../models/rent');

// Get all rent records
router.get('/', (req, res) => {
  const records = rentModel.getAllRentRecords();
  res.json(records);
});

// Get rent record by ID
router.get('/:id', (req, res) => {
  const record = rentModel.getRentRecordById(req.params.id);
  if (record) {
    res.json(record);
  } else {
    res.status(404).json({ message: 'Rent record not found' });
  }
});

// Get rent records by student ID
router.get('/student/:studentId', (req, res) => {
  const records = rentModel.getRentRecordsByStudentId(req.params.studentId);
  res.json(records);
});

// Get rent records by PG ID
router.get('/pg/:pgId', (req, res) => {
  const records = rentModel.getRentRecordsByPgId(req.params.pgId);
  res.json(records);
});

// Create new rent record
router.post('/', (req, res) => {
  const newRecord = rentModel.createRentRecord(req.body);
  res.status(201).json(newRecord);
});

// Update rent record
router.put('/:id', (req, res) => {
  const updatedRecord = rentModel.updateRentRecord(req.params.id, req.body);
  if (updatedRecord) {
    res.json(updatedRecord);
  } else {
    res.status(404).json({ message: 'Rent record not found' });
  }
});

// Delete rent record
router.delete('/:id', (req, res) => {
  const deletedRecord = rentModel.deleteRentRecord(req.params.id);
  if (deletedRecord) {
    res.json({ message: 'Rent record deleted' });
  } else {
    res.status(404).json({ message: 'Rent record not found' });
  }
});

// Get unpaid rent records
router.get('/status/unpaid', (req, res) => {
  const unpaidRecords = rentModel.getUnpaidRentRecords();
  res.json(unpaidRecords);
});

// Get paid rent records
router.get('/status/paid', (req, res) => {
  const paidRecords = rentModel.getPaidRentRecords();
  res.json(paidRecords);
});

// Get rent records due soon
router.get('/due-soon/:days?', (req, res) => {
  const days = req.params.days ? parseInt(req.params.days) : 3;
  const dueSoonRecords = rentModel.getRentRecordsDueSoon(days);
  res.json(dueSoonRecords);
});

// Mark reminder as sent
router.post('/:id/reminder', (req, res) => {
  const updatedRecord = rentModel.markReminderSent(req.params.id);
  if (updatedRecord) {
    res.json({ message: 'Reminder marked as sent', record: updatedRecord });
  } else {
    res.status(404).json({ message: 'Rent record not found' });
  }
});

// Generate monthly rent
router.post('/generate-monthly', (req, res) => {
  const { studentId, pgId, amount, month, year } = req.body;
  const newRecord = rentModel.generateMonthlyRent(studentId, pgId, amount, month, year);
  res.status(201).json(newRecord);
});

module.exports = router;
