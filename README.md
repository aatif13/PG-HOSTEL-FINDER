# PG/Hostel Finder Application

A comprehensive web application for finding PG/Hostel accommodations with roommate matching, issue reporting, rent tracking, and KYC verification features.

## Features

### Core Features
- **PG/Hostel Listing Management**: Owners can add PG listings with images, rent, amenities
- **Advanced Search**: Students can search by budget, distance, gender preference, and availability
- **Google Maps Integration**: Basic location pinning for PG locations

### Roommate Matcher
- **Lifestyle Quiz**: Simple quiz for budget, habits, cleanliness preferences
- **Match Scoring**: Percentage-based compatibility scoring between students
- **Basic Chat**: Direct messaging functionality

### Issue Reporting System
- **Complaint Management**: Students can raise issues with title and description
- **Owner Notifications**: Owners get notified of new issues
- **Status Tracking**: Open/Resolved status management

### Rent Tracking
- **Monthly Rent Cycle**: Automated rent cycle management
- **Payment Reminders**: Dashboard reminders for upcoming payments
- **Payment Status**: Paid/Unpaid status tracking

### Agreement & KYC Upload
- **Document Management**: Students can upload ID proof and rental agreements
- **Manual Verification**: Owners can view and verify documents
- **Status Tracking**: Pending/Verified status management

## Project Structure

```
hostel/
├── backend/
│   ├── models/
│   │   ├── pgListing.js      # PG listing data model
│   │   ├── user.js           # User data model
│   │   ├── issue.js          # Issue reporting model
│   │   ├── rent.js           # Rent tracking model
│   │   └── agreement.js      # KYC agreement model
│   ├── routes/
│   │   ├── pgListings.js     # PG listing API routes
│   │   ├── users.js          # User management routes
│   │   ├── issues.js         # Issue reporting routes
│   │   ├── rent.js           # Rent tracking routes
│   │   └── agreements.js     # KYC agreement routes
│   ├── app.js                # Main Express server
│   └── package.json          # Backend dependencies
└── frontend/
    ├── css/
    │   └── styles.css        # Main stylesheet
    ├── js/
    │   ├── app.js           # Main application logic
    │   ├── roommateMatcher.js # Roommate matching functionality
    │   ├── issueReporting.js # Issue reporting functionality
    │   ├── rentTracking.js   # Rent tracking functionality
    │   └── kycUpload.js      # KYC upload functionality
    └── index.html           # Main landing page
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Open the frontend/index.html file in a web browser
2. The frontend will connect to the backend API at `http://localhost:5000`

## API Endpoints

### PG Listings
- `GET /api/pg-listings` - Get all listings
- `GET /api/pg-listings/:id` - Get listing by ID
- `POST /api/pg-listings` - Create new listing
- `GET /api/pg-listings/search` - Search listings with filters

### Users
- `GET /api/users` - Get all users
- `POST /api/users/login` - User login
- `GET /api/users/:id/matches` - Get roommate matches

### Issues
- `POST /api/issues` - Report new issue
- `PUT /api/issues/:id` - Update issue status

### Rent
- `GET /api/rent/student/:id` - Get rent records for student
- `PUT /api/rent/:id` - Update rent payment status

### Agreements
- `POST /api/agreements` - Upload KYC documents
- `POST /api/agreements/:id/verify` - Verify documents

## Demo Data

The application comes with pre-loaded demo data:
- 2 sample PG listings
- 2 sample users (owner and student)
- Sample rent records and agreements
- Test issues for demonstration

## Usage

1. **Search PGs**: Use the search filters to find PGs by budget, distance, and gender preference
2. **Roommate Matching**: Complete the lifestyle quiz to find compatible roommates
3. **Issue Reporting**: Report maintenance issues or complaints
4. **Rent Tracking**: View and manage rent payments
5. **KYC Upload**: Upload identification and agreement documents

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: In-memory storage (can be replaced with database)
- **API**: RESTful API design

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Real-time chat functionality
- Payment gateway integration
- Advanced search filters
- Mobile app development
- Admin dashboard
- Email/SMS notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
