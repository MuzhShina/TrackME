const socket = io();

// Object to hold markers for each socket ID
const markers = {};

// Initialize the map and set default view
const map = L.map("map").setView([0, 0], 10);

// Add OpenStreetMap tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "TrackME",
}).addTo(map);

// Throttle updates to avoid frequent zoom changes
let lastUpdate = 0;
const updateInterval = 1000; // Update every 1000 milliseconds

// Listen for location updates from the server
socket.on("receive-location", (data) => {
    const now = Date.now();
    if (now - lastUpdate < updateInterval) return;
    lastUpdate = now;

    const { id, latitude, longitude, name } = data;

    // Update existing marker or create a new one
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
        markers[id].setPopupContent(`User ID: ${id}<br>Name: ${name || 'No name set'}`);
    } else {
        // Create a new marker and bind a popup with user ID and name
        markers[id] = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(`User ID: ${id}<br>Name: ${name || 'No name set'}`);
    }

    // Set the view only if needed
    map.setView([latitude, longitude], map.getZoom()); // Use the current zoom level
});

// Listen for name updates from the server
socket.on("receive-name", (data) => {
    const { id, name } = data;

    if (markers[id]) {
        markers[id].setPopupContent(`User: ${name}`);
    }
});

// Handle user disconnection
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});

// Add event listener to the button
document.getElementById("sendName").addEventListener("click", () => {
    const name = document.getElementById("nameInput").value;
    if (name.trim()) {
        socket.emit("send-name", { name });
    }
});
