<script setup>
/**
 * Table displaying delayed trains
 */
// import apiModel from '../models/api.js'
import { getDelayedTrains } from '../models/api.service.js'
import DelayedItem from './DelayedItem.vue'

const data = await getDelayedTrains()
// const data = await apiModel.getDelayedTrains()
</script>

<template>
    <div class="delayed">
        <h1>Försenade tåg</h1>
        <div id="delayed-trains" class="delayed-trains">
            <DelayedItem v-for="(item, index) in data" :item="item" :key="index" />
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
