<script setup>
/* global L */

import socket from '../services/socket.service.js'
import { useTrainsStore } from '@/stores/trains'
import { getDelayedTrains, getInitialPositions } from '../services/api.service.js'
import { onMounted } from 'vue'

const emit = defineEmits(['refresh-map'])
const store = useTrainsStore()
const center = [62.173276, 14.942265]
let trainData = []
let markers = {}
let map
let initialPositions

socket.on('delayedTrainsUpdate', (updatedTrains) => {
    trainData = updatedTrains
})

function updatePosition(positionObject) {
    if (trainData.some((train) => positionObject.trainnumber === train.OperationalTrainNumber)) {
        if (positionObject.trainnumber in markers) {
            let marker = markers[positionObject.trainnumber]

            marker.setLatLng(positionObject.position)
        } else {
            let marker = L.marker(positionObject.position)
                .bindPopup(positionObject.trainnumber)
                .on('click', function () {
                    store.setCurrent(positionObject.trainnumber)
                    emit('refresh-map')
                })
            marker.addTo(map)
            if (store.current === '' || store.current === positionObject.trainnumber) {
                // maybe second conditionCheck not really needed
                // if (store.current === "") {
                marker.addTo(map)
            }
            markers[positionObject.trainnumber] = marker
        }
    } else {
        if (positionObject.trainnumber in markers) {
            let marker = markers[positionObject.trainnumber]
            map.removeLayer(marker)
            delete markers[positionObject.trainnumber]
        }
    }
}

function setupLeafletMap() {
    map = L.map('map', { zoomAnimation: false }).setView(center, 5)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        // maxZoom: 19,
        maxZoom: 18,
        minZoom: 5,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)

    for (const position of initialPositions) {
        updatePosition(position)
    }
    /**
     * When receiving "message" signal from backend,
     * if the train is not already on the map adds a new marker,
     * if the train is on the map updates the marker's position
     */
    socket.on('trainpositions', (data) => {
        if (trainData) {
            updatePosition(data)
        }
    })
}

/**
 * Called from map component whenever a delayed item or a marker
 * is clicked on. Toggles between showing all or single markers
 */
function updateLayers() {
    for (const trainnr in markers) {
        const marker = markers[trainnr]
        if (store.current != '' && trainnr != store.current) {
            map.removeLayer(marker)
        } else {
            map.addLayer(marker)
        }
    }
}

// for the main view to access
defineExpose({
    map,
    markers,
    updateLayers
})

onMounted(async () => {
    trainData = await getDelayedTrains()
    initialPositions = await getInitialPositions()
    setupLeafletMap()
})
</script>

<template>
    <div id="map" class="map" ref="current"></div>
</template>

<style scoped>
.map {
    height: 100vh;
    width: 60vw;
}
</style>
