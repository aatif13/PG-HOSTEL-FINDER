// In-memory storage for PG listings (can be replaced with database later)
let pgListings = [
  {
    id: 1,
    name: "Green Valley PG",
    ownerId: 1,
    images: ["pg1.jpg", "pg2.jpg"],
    rent: 8000,
    amenities: ["WiFi", "AC", "Laundry", "Food"],
    location: { lat: 28.6139, lng: 77.2090 },
    distanceFromCollege: 2.5,
    genderPreference: "Male",
    availableRooms: 5,
    totalRooms: 10
  },
  {
    id: 2,
    name: "Sunshine Hostel",
    ownerId: 2,
    images: ["hostel1.jpg", "hostel2.jpg"],
    rent: 12000,
    amenities: ["WiFi", "AC", "Gym", "Food", "Security"],
    location: { lat: 28.6129, lng: 77.2295 },
    distanceFromCollege: 1.8,
    genderPreference: "Female",
    availableRooms: 3,
    totalRooms: 8
  }
];

let nextId = 3;

module.exports = {
  getAllListings: () => pgListings,
  
  getListingById: (id) => pgListings.find(listing => listing.id === parseInt(id)),
  
  createListing: (listingData) => {
    const newListing = {
      id: nextId++,
      ...listingData,
      availableRooms: listingData.totalRooms || 1
    };
    pgListings.push(newListing);
    return newListing;
  },
  
  updateListing: (id, updates) => {
    const index = pgListings.findIndex(listing => listing.id === parseInt(id));
    if (index !== -1) {
      pgListings[index] = { ...pgListings[index], ...updates };
      return pgListings[index];
    }
    return null;
  },
  
  deleteListing: (id) => {
    const index = pgListings.findIndex(listing => listing.id === parseInt(id));
    if (index !== -1) {
      return pgListings.splice(index, 1)[0];
    }
    return null;
  },
  
  searchListings: (filters) => {
    let filtered = [...pgListings];
    
    if (filters.maxBudget) {
      filtered = filtered.filter(listing => listing.rent <= filters.maxBudget);
    }
    
    if (filters.maxDistance) {
      filtered = filtered.filter(listing => listing.distanceFromCollege <= filters.maxDistance);
    }
    
    if (filters.gender) {
      filtered = filtered.filter(listing => listing.genderPreference === filters.gender);
    }
    
    if (filters.availableOnly) {
      filtered = filtered.filter(listing => listing.availableRooms > 0);
    }
    
    return filtered;
  }
};
