TrackMe is a real-time location tracking application that uses geolocation and WebSocket technologies to display users' locations on a map. Users can update their names and see others' locations in real-time.

**Features**
Real-time location tracking using WebSocket.
Map visualization with markers for each user.
Ability to update user names which are displayed on the map.

**Technologies Used**

**Frontend:**
Leaflet - A JavaScript library for interactive maps.
Socket.IO - Real-time bidirectional event-based communication.
OpenStreetMap - Map tiles provider.

**Backend:**
Node.js - JavaScript runtime for server-side logic.
Express - Web framework for Node.js.
Socket.IO - For real-time event handling.

****Installation******


**Install dependencies:**
npm install

**Start the server:**
npm start
The server will start on http://localhost:3000.

**Usage**
Open your browser and navigate to http://localhost:3000.
Enter your name in the input box and click "Update Name" to set or update your name.
Your location will be tracked and displayed on the map. You will also see other users' locations and names.

**File Structure**
app.js - Main server file for setting up the Express server and Socket.IO.
index.ejs - Main HTML template.
script.js - Client-side JavaScript for handling location updates and map interactions.
style.css - Stylesheet for the project.
README.md - This file.
