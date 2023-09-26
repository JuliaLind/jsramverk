<script>
/* global L */
/* global io */
/**
 * For communicating with backend
 */
const socket = io(import.meta.env.VITE_URL)

/**
 * Map with markers that display current positions of trains.
 */
export default {
    name: 'Map-comp',
    data() {
        return {
            center: [62.173276, 14.942265]
        }
    },
    methods: {
        setupLeafletMap() {
            const map = L.map('map').setView(this.center, 5)

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map)

            let markers = {}

            /**
             * When receiving "message" signal from backend,
             * if the train is not already on the map adds a new marker,
             * if the train is on the map updates the marker's position
             */
            socket.on('message', (data) => {
                if (Object.prototype.hasOwnProperty.call(markers, data.trainnumber)) {
                    let marker = markers[data.trainnumber]

                    marker.setLatLng(data.position)
                } else {
                    let marker = L.marker(data.position).bindPopup(data.trainnumber).addTo(map)

                    markers[data.trainnumber] = marker
                }
            })
        }
    },
    mounted() {
        this.setupLeafletMap()
    }
}
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
