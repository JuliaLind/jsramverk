<script setup>
import { RouterView } from 'vue-router'
import { getCodes, getDelayedTrains } from './services/api.service.js'
import socket from './services/socket.service.js'
import { useTrainsStore } from './stores/trains.js'
import { onMounted } from 'vue'
const store = useTrainsStore()

// store data to be used in admin view
onMounted(async () => {
    store.setDelayed(await getDelayedTrains())
    store.setCodes(await getCodes())
});

socket.on('delayedTrainsUpdate', (updatedTrains) => {
    store.setDelayed(updatedTrains)
})
</script>

<template>
    <RouterView />
</template>

<style scoped></style>
