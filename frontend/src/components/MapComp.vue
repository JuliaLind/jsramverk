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
    let fromLocation
    let toLocation

    if (
        trainData.some((train) => {
            if (positionObject.trainnumber === train.OperationalTrainNumber) {
                fromLocation = train.FromLocation
                toLocation = train.ToLocation
                return true
            }
            return false
        })
    ) {
        if (positionObject.trainnumber in markers) {
            let marker = markers[positionObject.trainnumber]

            marker.setLatLng(positionObject.position)
        } else {
            const popupContent = `<div class="popup-content yellow-popup">
                <div class="trainnr">${positionObject.trainnumber}</div>
                <div class="stations">
                    <span class="mini-circle"></span>
                <div class="station">Från ${fromLocation}</div>
                <div class="station">Mot ${toLocation}</div>
                </div>
            </div>`

            let icon = L.icon({
                iconUrl: 'grey_train.jpg',
                iconSize: [45, 45],
                iconAnchor: [22, 22],
                popupAnchor: [9, -3]
            })
            let marker = L.marker(positionObject.position, {
                icon: icon
            })
                .bindPopup(popupContent)
                .on('click', function () {
                    store.setCurrent(positionObject.trainnumber)
                    emit('refresh-map')
                })
            marker.addTo(map)
            if (store.current === '' || store.current === positionObject.trainnumber) {
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
    map = L.map('map', { zoomAnimation: true }).setView(center, 5)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
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
    <div class="map-container">
        <div id="map" class="map" ref="current"></div>
    </div>
</template>

<style scoped>
/* .map-container {
    padding: 7rem 0 0 0;
}

.map {
    border-radius: 20px;
}

.leaflet-container { */
    /* margin-left: 1rem; */
    /* height: 75vh; */
    /* min-width: 20vw;
    width: 50vw; */
/* } */


.map-container,
.leaflet-container {
    height: 100%;
    /* width: 45vw; */
}

map {
    /* width: 100%; */
    height: 100%;
}

.map-container {
    padding: 0;
}

.map {
    border-radius: 0;
}
@media (max-width: 1600px) {
    .map-container,
    .map,
    .leaflet-container {
        height: 100%;
        width: 45vw;
    }
}

</style>
