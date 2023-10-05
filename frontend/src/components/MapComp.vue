<script setup>
/* global L */

import socket from '../services/socket.service.js'
import { useTrainsStore } from '@/stores/trains'
import { getDelayedTrains } from '../services/api.service.js'
import { onMounted } from 'vue';

const emit = defineEmits(['refresh-map'])
const store = useTrainsStore()
const center = [62.173276, 14.942265]
let trainData = []
let markers = {}
let map

socket.on('delayedTrainsUpdate', (updatedTrains) => {
    trainData = updatedTrains
})

function setupLeafletMap() {
    map = L.map('map', {zoomAnimation:false}).setView(center, 5)

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
                        emit('refresh-map')
                    })
                    // only add new marker to the map if all trains are visible
                    // second conditionscheck should probably not be needed as the set train
                    // should obviusly already be on the map. However if the list has been rendered
                    // before map and user clicks on list it could happen that marker
                    // has not been added to map yet. Will se what Scrutinizer says
                    if (store.current === "" || store.current === data.OperationalNumber) {
                    // console.log("new train incomming, nr:", data.trainnumber)
                    // if (store.current === "") {
                        marker.addTo(map)
                    }
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

/**
 * Called from map component whenever a delayed item or a marker
 * is clicked on. Toggles between showing all or single markers
 */
function updateLayers() {
    for (const trainnr in markers) {
        const marker = markers[trainnr]
        if (store.current != "" && trainnr != store.current) {
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
