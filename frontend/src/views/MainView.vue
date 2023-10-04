<script setup>
/**
 * View that displays list of delayed
 * trains and a map with their current
 * positions
 */
import DelayedTable from '../components/DelayedTable.vue'
import MapComp from '../components/MapComp.vue'
import { RouterLink } from 'vue-router'



</script>

<template>
    <main>
        <RouterLink to="/admin"> Admin </RouterLink>
        <suspense>
            <keep-alive>
                <DelayedTable />
            </keep-alive>
            <template #fallback>
                <div class="delayed"></div>
            </template>
        </suspense>
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
