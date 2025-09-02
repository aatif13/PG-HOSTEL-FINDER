const express = require('express');
const router = express.Router();
const pgListingModel = require('../models/pgListing');

// Get all listings
router.get('/', (req, res) => {
  const listings = pgListingModel.getAllListings();
  res.json(listings);
});

// Get listing by ID
router.get('/:id', (req, res) => {
  const listing = pgListingModel.getListingById(req.params.id);
  if (listing) {
    res.json(listing);
  } else {
    res.status(404).json({ message: 'Listing not found' });
  }
});

// Create new listing
router.post('/', (req, res) => {
  const newListing = pgListingModel.createListing(req.body);
  res.status(201).json(newListing);
});

// Update listing
router.put('/:id', (req, res) => {
  const updatedListing = pgListingModel.updateListing(req.params.id, req.body);
  if (updatedListing) {
    res.json(updatedListing);
  } else {
    res.status(404).json({ message: 'Listing not found' });
  }
});

// Delete listing
router.delete('/:id', (req, res) => {
  const deletedListing = pgListingModel.deleteListing(req.params.id);
  if (deletedListing) {
    res.json({ message: 'Listing deleted' });
  } else {
    res.status(404).json({ message: 'Listing not found' });
  }
});

// Search listings with filters
router.get('/search', (req, res) => {
  const filters = {
    maxBudget: req.query.maxBudget ? parseInt(req.query.maxBudget) : null,
    maxDistance: req.query.maxDistance ? parseFloat(req.query.maxDistance) : null,
    gender: req.query.gender || null,
    availableOnly: req.query.availableOnly === 'true'
  };
  const results = pgListingModel.searchListings(filters);
  res.json(results);
});

module.exports = router;
