const socket= io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude,longitude}=position.coords;
        socket.emit("send-location",{latitude,longitude});
    },
(error)=>{
    console.error(error);
},
{
    enableHighAccuracy:true,
    maximumAge:true,
    timeout:5000
});
}

const map = L.map("map").setView([0,0],10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"TrackME"
}).addTo(map)

const markers={};

socket.on("receive-location",(data)=>{
    const { id, latitude, longitude} = data;// this  code will set ur location
    map.setView([latitude,longitude],11);
    if(markers[id]){ // update the marker
        markers[id].setLatLng([latitude,longitude]);
    }
    else{ // create new marker in case it doesnt exist
        markers[id]=L.marker([latitude,longitude]).addTo(map).bindPopup(`User ID: ${id}`)
        .openPopup(); ;
        
    }
});

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id]
    }
});
