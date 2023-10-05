<script setup>
/**
 * View that displays list of delayed
 * trains and a map with their current
 * positions
 */
import DelayedTable from '../components/DelayedTable.vue'
import MapComp from '../components/MapComp.vue'
import { RouterLink } from 'vue-router'
// import { useTrainsStore } from '@/stores/trains'
// import { ref } from 'vue'

// const store = useTrainsStore()
// let current = store.current;

</script>

<template>
    <main>
        <RouterLink to="/admin"> Admin </RouterLink>
        <!-- <keep-alive> -->
        <!-- <DelayedTable :current="current"/> -->
        <!-- </keep-alive> -->
        <keep-alive>
            <DelayedTable />
        </keep-alive>
        <MapComp />
    </main>
</template>

<style>
main {
    height: 100vh;
    width: 100vw;
    display: flex;
}
</style>
