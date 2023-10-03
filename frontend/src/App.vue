<script setup>
import { RouterView } from 'vue-router'

// Work in Progress - not working yet
// import socket from './services/socket.service.js'
// import { useTrainsStore } from './stores/trains.js'
// import { getDelayedTrains } from './services/api.service.js'
// import { onMounted } from 'vue'
// const store = useTrainsStore()
// onMounted(async () => {
//     store.setTrains(await getDelayedTrains())
//     console.log("direct value on mount", store.delayed.value);
// });
// socket.on('delayedTrainsUpdate', (updatedTrains) => {
//     store.setTrains(updatedTrains)
// })
</script>

<template>
    <RouterView />
</template>

<style scoped></style>
