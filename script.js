const socket = io();

// Watch user position and send location updates to the server
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
        }
    );
}

// Initialize the map and set default view
const map = L.map("map").setView([0, 0], 10);

// Add OpenStreetMap tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "TrackME",
}).addTo(map);

// Object to hold markers for each socket ID
const markers = {};

// Listen for location updates from the server
socket.on("receive-location", (data) => {
    const { id, latitude, longitude, name } = data;

    // Update existing marker or create a new one
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
        markers[id].setPopupContent(`User ID: ${id}<br>Name: ${name || 'No name set'}`);
    }
    else {
        // Create a new marker and bind a popup with user ID and name
        markers[id] = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup(`User ID: ${id}<br>Name: ${name || 'No name set'}`);
    }

    map.setView([latitude, longitude], 11);
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
