const socket = io();

// Initialize default name
let name = "No name";

// Update the name when the user clicks the "Send Name" button
document.getElementById('sendName').addEventListener('click', () => {
    const inputName = document.getElementById('nameInput').value.trim();
    if (inputName && inputName !== name) {
        name = inputName;
        console.log(`Name updated to: ${name}`); // Debug statement
    }
});

// Watch user position and send location updates to the server
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log(`Sending location: ${latitude}, ${longitude}, Name: ${name}`); // Debug statement
            socket.emit('send-location', { latitude, longitude, name });
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0, // Prevents caching
            timeout: 1000, // Timeout for getting location
        }
    );
}


// Initialize the map and set default view
const map = L.map('map').setView([0, 0], 15);

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'TrackME'
}).addTo(map);

// Object to hold markers for each socket ID
const markers = {};



// Listen for location updates from the server
socket.on('receive-location', (data) => {
    const { id, latitude, longitude, name } = data;

    console.log(`Received location update: ${id}, ${latitude}, ${longitude}, Name: ${name}`); // Debug statement
    map.setView([latitude,longitude],15);
    // Update existing marker or create a new one
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
        markers[id].setPopupContent(`User ID: ${id}<br>Name: ${name}`);
    } else {
        markers[id] = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(`User ID: ${id}<br>Name: ${name}`);
    }

    map.setView([latitude, longitude], 11);
});

// Handle user disconnection
socket.on('user-disconnected', (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
