const express = require('express');
const router = express.Router();
const issueModel = require('../models/issue');

// Get all issues
router.get('/', (req, res) => {
  const issues = issueModel.getAllIssues();
  res.json(issues);
});

// Get issue by ID
router.get('/:id', (req, res) => {
  const issue = issueModel.getIssueById(req.params.id);
  if (issue) {
    res.json(issue);
  } else {
    res.status(404).json({ message: 'Issue not found' });
  }
});

// Get issues by PG ID
router.get('/pg/:pgId', (req, res) => {
  const issues = issueModel.getIssuesByPgId(req.params.pgId);
  res.json(issues);
});

// Get issues by student ID
router.get('/student/:studentId', (req, res) => {
  const issues = issueModel.getIssuesByStudentId(req.params.studentId);
  res.json(issues);
});

// Create new issue
router.post('/', (req, res) => {
  const newIssue = issueModel.createIssue(req.body);
  res.status(201).json(newIssue);
});

// Update issue
router.put('/:id', (req, res) => {
  const updatedIssue = issueModel.updateIssue(req.params.id, req.body);
  if (updatedIssue) {
    res.json(updatedIssue);
  } else {
    res.status(404).json({ message: 'Issue not found' });
  }
});

// Delete issue
router.delete('/:id', (req, res) => {
  const deletedIssue = issueModel.deleteIssue(req.params.id);
  if (deletedIssue) {
    res.json({ message: 'Issue deleted' });
  } else {
    res.status(404).json({ message: 'Issue not found' });
  }
});

// Get open issues
router.get('/status/open', (req, res) => {
  const openIssues = issueModel.getOpenIssues();
  res.json(openIssues);
});

// Get resolved issues
router.get('/status/resolved', (req, res) => {
  const resolvedIssues = issueModel.getResolvedIssues();
  res.json(resolvedIssues);
});

// Get issues for owner (all issues for now)
router.get('/owner/:ownerId', (req, res) => {
  const ownerIssues = issueModel.getOwnerIssues(req.params.ownerId);
  res.json(ownerIssues);
});

module.exports = router;
