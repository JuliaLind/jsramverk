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

socket.on('delayedTrainsUpdate', (updatedTrains) => {
    delayedTrains.value = updatedTrains
})
</script>

<template>
    <div class="delayed">
        <h1>Försenade tåg</h1>
        <table id="delayed-trains" class="delayed-trains">
            <tr>
                <th>Tåg</th>
                <th>Station</th>
                <th>Från</th>
                <th>Mot</th>
                <th>Försenad</th>
            </tr>
            <DelayedItem
                v-for="item in delayedTrains"
                :item="item"
                :key="item.ActivityId"
                v-on:click="store.setCurrent(item.OperationalTrainNumber), $emit('refresh-map')"
            />
        </table>
    </div>
</template>

<style>
.delayed {
    height: 100vh;
    /* width: 40vw; */
    width: fit-content;
    padding: 2rem;
    overflow: scroll;
    background-color: white;
}
</style>
