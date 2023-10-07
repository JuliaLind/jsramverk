<script setup>
/**
 * Table displaying delayed trains
 */
import { getDelayedTrains } from '../services/api.service.js'
import DelayedItem from './DelayedItem.vue'
import { onMounted, ref } from 'vue'
import socket from '../services/socket.service.js'
import { useTrainsStore } from '@/stores/trains'

const store = useTrainsStore()
const delayedTrains = ref([])

onMounted(async () => {
    delayedTrains.value = await getDelayedTrains()
})

socket.on('initial', (reasonCodes) => {
    console.log(reasonCodes)
})

socket.on('delayedTrainsUpdate', (updatedTrains) => {
    delayedTrains.value = updatedTrains
})
</script>

<template>
    <div class="delayed">
        <h1>Försenade tåg</h1>
        <div id="delayed-trains" class="delayed-trains">
            <!-- <DelayedItem v-for="item in delayedTrains" :item="item" :key="item.ActivityId" /> -->
            <DelayedItem
                v-for="item in delayedTrains"
                :item="item"
                :key="item.ActivityId"
                v-on:click="store.setCurrent(item.OperationalTrainNumber), $emit('refresh-map')"
            />
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
