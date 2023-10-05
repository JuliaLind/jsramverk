<script setup>
/* global L */

import socket from '../services/socket.service.js'
import { useTrainsStore } from '@/stores/trains'
/**
 * Delayed trains
 */
import { getDelayedTrains } from '../services/api.service.js'
import { onMounted, onBeforeMount } from 'vue';

const store = useTrainsStore()
const center = [62.173276, 14.942265]
let trainData = []
let markers = {}

socket.on('delayedTrainsUpdate', (updatedTrains) => {
    trainData = updatedTrains
})

function setupLeafletMap() {
    const map = L.map('map', {zoomAnimation:false}).setView(center, 5)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    /**
     * When receiving "message" signal from backend,
     * if the train is not already on the map adds a new marker,
     * if the train is on the map updates the marker's position
     */
    socket.on('trainpositions', (data) => {
        if (trainData) {
            if (trainData.some(train => data.trainnumber === train.OperationalTrainNumber)) {

                if (data.trainnumber in markers) {
                    let marker = markers[data.trainnumber]

                    marker.setLatLng(data.position)
                } else {
                    let marker = L.marker(data.position).bindPopup(data.trainnumber).on("click", function() {
                            store.setCurrent(data.trainnumber)
                            // add send emit to mainview
                        }).addTo(map)

                    markers[data.trainnumber] = marker
                }
            } else {
                if (data.trainnumber in markers) {
                    let marker = markers[data.trainnumber]
                    map.removeLayer(marker)
                    delete markers[data.trainnumber]
                }
            }
        }
    })
}

onMounted(async () => {
    trainData = await getDelayedTrains()
    setupLeafletMap()
})
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
