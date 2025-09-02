const apiBaseUrl = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    setupModalHandlers();
});

function setupModalHandlers() {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const closeButtons = document.querySelectorAll('.close');

    loginBtn.onclick = () => { loginModal.style.display = 'block'; };
    registerBtn.onclick = () => { registerModal.style.display = 'block'; };

    closeButtons.forEach(btn => {
        btn.onclick = () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        };
    });

    window.onclick = (event) => {
        if (event.target === loginModal) loginModal.style.display = 'none';
        if (event.target === registerModal) registerModal.style.display = 'none';
    };

    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

async function searchPGs() {
    const maxBudget = document.getElementById('maxBudget').value;
    const maxDistance = document.getElementById('maxDistance').value;
    const gender = document.getElementById('genderFilter').value;
    const availableOnly = document.getElementById('availableOnly').checked;

    let query = [];
    if (maxBudget) query.push(`maxBudget=${maxBudget}`);
    if (maxDistance) query.push(`maxDistance=${maxDistance}`);
    if (gender) query.push(`gender=${gender}`);
    if (availableOnly) query.push(`availableOnly=true`);

    const url = `${apiBaseUrl}/pg-listings/search?${query.join('&')}`;

    try {
        const response = await fetch(url);
        const listings = await response.json();
        displaySearchResults(listings);
    } catch (error) {
        console.error('Error fetching PG listings:', error);
    }
}

function displaySearchResults(listings) {
    const container = document.getElementById('searchResults');
    container.innerHTML = '';

    if (listings.length === 0) {
        container.innerHTML = '<p>No PGs found matching your criteria.</p>';
        return;
    }

    listings.forEach(listing => {
        const card = document.createElement('div');
        card.className = 'pg-card';

        const imgSrc = listing.images && listing.images.length > 0 ? listing.images[0] : 'https://via.placeholder.com/250x150?text=No+Image';
        card.innerHTML = `
            <img src="${imgSrc}" alt="${listing.name}">
            <h3>${listing.name}</h3>
            <p>Rent: ₹${listing.rent}</p>
            <p>Amenities: ${listing.amenities.join(', ')}</p>
            <p>Distance: ${listing.distanceFromCollege} km</p>
            <p>Gender Preference: ${listing.genderPreference}</p>
            <p>Available Rooms: ${listing.availableRooms} / ${listing.totalRooms}</p>
        `;

        container.appendChild(card);
    });
}

async function findMatches() {
    const form = document.getElementById('lifestyleQuiz');
    const formData = new FormData(form);

    // For demo, we will just show static matches from backend for user id 2
    const userId = 2;

    try {
        const response = await fetch(`${apiBaseUrl}/users/${userId}/matches`);
        const matches = await response.json();
        displayMatchResults(matches);
    } catch (error) {
        console.error('Error fetching matches:', error);
    }
}

function displayMatchResults(matches) {
    const container = document.getElementById('matchResults');
    container.innerHTML = '';

    if (matches.length === 0) {
        container.innerHTML = '<p>No matches found.</p>';
        return;
    }

    matches.forEach(match => {
        const card = document.createElement('div');
        card.className = 'match-card';
        card.innerHTML = `
            <h4>${match.user.name}</h4>
            <p>Match Score: ${match.matchScore}%</p>
            <p>Email: ${match.user.email}</p>
        `;
        container.appendChild(card);
    });
}

async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    try {
        const response = await fetch(`${apiBaseUrl}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Login successful! Welcome ' + data.user.name);
            document.getElementById('loginModal').style.display = 'none';
            
            // Redirect to owner dashboard if user is owner
            if (data.user.role === 'owner') {
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                window.location.href = 'owner-dashboard.html';
            }
        } else {
            alert('Login failed: ' + data.message);
        }
    } catch (error) {
        console.error('Login error:', error);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    const role = form.querySelector('select[name="role"]').value;
    const phone = form.querySelector('input[type="tel"]').value;

    try {
        const response = await fetch(`${apiBaseUrl}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role, phone })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Registration successful! Please login.');
            document.getElementById('registerModal').style.display = 'none';
        } else {
            alert('Registration failed: ' + data.message);
        }
    } catch (error) {
        console.error('Registration error:', error);
    }
}

function showSearch() {
    document.getElementById('search').scrollIntoView({ behavior: 'smooth' });
}

function showRoommate() {
    document.getElementById('roommate').scrollIntoView({ behavior: 'smooth' });
}
