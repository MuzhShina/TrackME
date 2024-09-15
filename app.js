const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const server = http.createServer(app);
const io = socketio(server);

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname);  // Tell Express to look for views in the root folder

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname)));

// Handle socket connections
io.on('connection', (socket) => {
    console.log('New user connected: ' + socket.id);

    // Listen for location updates from clients
    socket.on('send-location', (data) => {
        io.emit('receive-location', { id: socket.id, ...data });
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
        io.emit('user-disconnected', socket.id);
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.render('index');
});

// Start the server
server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
