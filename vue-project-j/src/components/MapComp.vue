<script>
const socket = io("https://jsramverk-editor-julmar2023.azurewebsites.net/");

export default {
 name: "Map",
 data() {
    return{
      center: [62.173276, 14.942265]
    }},
    methods: {
      setupLeafletMap() {
        const map = L.map('map').setView(this.center, 5);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        let markers = {};

        socket.on("message", (data) => {
            if (markers.hasOwnProperty(data.trainnumber)) {
                let marker = markers[data.trainnumber];

                marker.setLatLng(data.position);
            } else {
                let marker = L.marker(data.position).bindPopup(data.trainnumber).addTo(map);

                markers[data.trainnumber] = marker;
            }
        });
    },
 },
 mounted() {
    this.setupLeafletMap();
 },
};
</script>


<template>
  <div id="map" class="map"></div>
</template>

<style scoped>
.map {
    height: 100vh;
    width: 60vw;
}
</style>
