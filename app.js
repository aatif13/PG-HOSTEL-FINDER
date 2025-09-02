const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import routes
const pgListingsRouter = require('./routes/pgListings');
const usersRouter = require('./routes/users');
const issuesRouter = require('./routes/issues');
const rentRouter = require('./routes/rent');
const agreementsRouter = require('./routes/agreements');

// Routes
app.get('/', (req, res) => {
  res.send('PG/Hostel Finder API is running');
});

app.use('/api/pg-listings', pgListingsRouter);
app.use('/api/users', usersRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/rent', rentRouter);
app.use('/api/agreements', agreementsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
