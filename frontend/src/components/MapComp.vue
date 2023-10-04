<script>
/* global L */
import io from 'socket.io-client'
import socket from '../services/socket.service.js'

/**
 * Delayed trains
 */
import { getDelayedTrains } from '../services/api.service.js'

/**
 * For communicating with backend
 */
// const socket = io(import.meta.env.VITE_URL)

/**
 * Map with markers that display current positions of trains.
 */
export default {
    name: 'Map-comp',
    data() {
        return {
            center: [62.173276, 14.942265],
            trainData: [],
            markers: {}
        }
    },
    methods: {
        setupLeafletMap() {
            const map = L.map('map', {zoomAnimation:false}).setView(this.center, 5)

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map)

            // let markers = {}

            /**
             * When receiving "message" signal from backend,
             * if the train is not already on the map adds a new marker,
             * if the train is on the map updates the marker's position
             */
            socket.on('trainpositions', (data) => {
                if (this.trainData) {
                    if (this.trainData.some(train => data.trainnumber === train.OperationalTrainNumber)) {

                        if (Object.prototype.hasOwnProperty.call(this.markers, data.trainnumber)) {
                            let marker = this.markers[data.trainnumber]

                            marker.setLatLng(data.position)
                        } else {
                            let marker = L.marker(data.position).bindPopup(data.trainnumber).addTo(map)

                            this.markers[data.trainnumber] = marker
                        }
                    } else {
                        if (Object.prototype.hasOwnProperty.call(this.markers, data.trainnumber)) {
                            let marker = this.markers[data.trainnumber]
                            map.removeLayer(marker)
                            delete this.markers[data.trainnumber]
                        }
                    }
                }
            })
        }
    },
    async beforeMount() {
        this.trainData = await getDelayedTrains()
    },
    mounted() {
        this.setupLeafletMap()

        socket.on('delayedTrainsUpdate', (updatedTrains) => {
            this.trainData = updatedTrains
        })
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
