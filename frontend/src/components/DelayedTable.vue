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
    <div class="delayed-container">
        <div class="delayed-header">
            <h1>Försenade tåg</h1>
        </div>
        <div class="delayed">
            <table id="delayed-trains" class="delayed-trains">
                <tr class="title-group">
                    <th id="th"><h3>Tåg</h3></th>
                    <th><h3>Station</h3></th>
                    <th><h3>Från</h3></th>
                    <th><h3>Mot</h3></th>
                    <th><h3>Försenad</h3></th>
                </tr>
                <DelayedItem
                    v-for="item in delayedTrains"
                    :item="item"
                    :key="item.ActivityId"
                    v-on:click="store.setCurrent(item.OperationalTrainNumber), $emit('refresh-map')"
                />
            </table>
        </div>
    </div>
</template>

<style>
.delayed {
    height: 75vh;
    /* width: 40vw; */
    width: 100%;
    padding: 2rem;
    overflow: scroll;
    background-color: white;
    margin-top: 2rem;
}

th {
    font-size: 25px;
}

#th {
    padding-left: 1.5rem;
}

.delayed-header {
    text-align: center;
    margin-top: 2rem;
}

.delayed-container {
    width: 100%;
    position: relative;
}

.delayed {
    padding: 1rem;
}

.delayed-trains {
    width: clamp(400px, 100%, 1000px);
    table-layout: fixed;
}

.title-group {
    position: sticky;
    top: -1rem;
    background-color: #fff;
}
</style>
