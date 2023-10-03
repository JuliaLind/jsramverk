<script setup>
/**
 * Table displaying delayed trains
 */
import { getDelayedTrains } from '../services/api.service.js'
import DelayedItem from './DelayedItem.vue'
import { onMounted, ref } from 'vue'
import socket from '../services/socket.service.js'

const delayedTrains = ref([])

onMounted(async () => {
    delayedTrains.value = await getDelayedTrains()
})

socket.on('delayedTrainsUpdate', (updatedTrains) => {
    delayedTrains.value = updatedTrains
})
</script>

<template>
    <div class="delayed">
        <h1>Försenade tåg</h1>
        <div id="delayed-trains" class="delayed-trains">
            <DelayedItem v-for="item in delayedTrains" :item="item" :key="item.ActivityId" />
        </div>
    </div>
</template>

<style>
.delayed {
    height: 100vh;
    width: 40vw;
    padding: 2rem;
    overflow: scroll;
    background-color: white;
}
</style>
