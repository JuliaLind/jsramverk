<script setup>
/**
 * View that displays list of delayed
 * trains and a map with their current
 * positions
 */
import { onMounted } from 'vue'
import DelayedTable from '../components/DelayedTable.vue'
import MapComp from '../components/MapComp.vue'
import { RouterLink } from 'vue-router'
import { useTrainsStore } from '@/stores/trains'
import { ref } from 'vue'

const store = useTrainsStore()
let current = ref('')
const map = ref(null)

function switchCurrent() {
    current.value = store.current
}

onMounted(() => {
    switchCurrent()
})
</script>

<template>
    <main>
        <RouterLink to="/admin" @click="store.current = ''"> Admin </RouterLink>
        <keep-alive>
            <DelayedTable ref="current" @refresh-map="map.updateLayers()" />
        </keep-alive>
        <keep-alive>
            <MapComp ref="map" @refresh-map="map.updateLayers()" />
        </keep-alive>
    </main>
</template>

<style>
main {
    height: 100vh;
    width: 100vw;
    display: flex;
}
</style>
