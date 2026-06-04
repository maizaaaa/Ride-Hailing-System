// Initialize the map
const map = L.map('map').setView([6.4638, 100.5039], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Store data globally for interactive filtering
let allUsersData = [];
let markerLayer = L.layerGroup().addTo(map); // Group markers so we can clear them easily
let markerDictionary = {}; // Keep track of markers to open popups later

// --- NEW: Interactivity Listeners ---
document.getElementById('searchInput').addEventListener('input', updateAdminView);
document.getElementById('roleFilter').addEventListener('change', updateAdminView);

function fetchLiveSystemData() {
    const cacheBuster = new Date().getTime();
    fetch(`api.php?_=${cacheBuster}`)
        .then(res => res.json())
        .then(users => {
            if (!Array.isArray(users)) return;
            allUsersData = users; // Save the fresh data
            updateAdminView(); // Redraw the UI
        })
        .catch(err => console.error('Data sync error:', err));
}

// --- NEW: Master rendering function ---
function updateAdminView() {
    // 1. Get current filter values
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter').value.toLowerCase();

    // 2. Filter the raw data
    const filteredUsers = allUsersData.filter(user => {
        const matchName = user.driver_id.toLowerCase().includes(searchTerm);
        const userRole = (user.user_role || 'Driver').toLowerCase();
        const matchRole = roleFilter === 'all' || userRole === roleFilter;
        return matchName && matchRole;
    });

    // 3. Update Statistics Cards
    document.getElementById('stat-total').innerText = filteredUsers.length;
    document.getElementById('stat-drivers').innerText = filteredUsers.filter(u => (u.user_role || 'Driver').toLowerCase() === 'driver').length;
    document.getElementById('stat-passengers').innerText = filteredUsers.filter(u => (u.user_role || '').toLowerCase() === 'passenger').length;

    // 4. Clear Old UI Elements
    const tableBody = document.getElementById('logTableBody');
    tableBody.innerHTML = '';
    markerLayer.clearLayers();
    markerDictionary = {};

    // 5. Draw the Filtered UI
    filteredUsers.forEach(user => {
        const lat = parseFloat(user.latitude);
        const lng = parseFloat(user.longitude);
        const role = user.user_role || 'Driver';
        
        if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return;

        // Add Marker
        const marker = L.marker([lat, lng])
            .bindPopup(`<b>User:</b> ${user.driver_id}<br><b>Role:</b> ${role}<br><b>Time:</b> ${user.timestamp}`);
        markerLayer.addLayer(marker);
        markerDictionary[user.driver_id] = marker; // Save for the click-to-locate feature

        // Determine Badge Color
        const badgeClass = (role.toLowerCase() === 'passenger') ? 'role-passenger' : 'role-driver';

        // Build Table Row
        const tr = document.createElement('tr');
        tr.className = "interactive-row"; // For CSS hover effects
        tr.innerHTML = `
            <td><b>${user.driver_id}</b></td>
            <td><span class="role-badge ${badgeClass}">${role}</span></td>
            <td>${lat.toFixed(5)}</td>
            <td>${lng.toFixed(5)}</td>
            <td class="ip-text">${user.ip_address || '127.0.0.1'}</td>
            <td>${user.timestamp}</td>
            <td><button class="locate-btn" onclick="focusOnUser('${user.driver_id}', ${lat}, ${lng})">📍 Locate</button></td>
        `;
        tableBody.appendChild(tr);
    });
}

// --- NEW: Click-to-Locate Feature ---
// This needs to be a global window function so the HTML button can trigger it
window.focusOnUser = function(userId, lat, lng) {
    // Fly the map smoothly to the user
    map.flyTo([lat, lng], 17, {
        animate: true,
        duration: 1.5
    });
    
    // Open their specific map pin popup
    if(markerDictionary[userId]) {
        setTimeout(() => {
            markerDictionary[userId].openPopup();
        }, 1500); // Wait for the fly animation to finish
    }
};

// Start the engine
fetchLiveSystemData();
setInterval(fetchLiveSystemData, 5000);