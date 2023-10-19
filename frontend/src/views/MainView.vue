<script setup>
/**
 * View that displays list of delayed
 * trains and a map with their current
 * positions
 */
import DelayedTable from '../components/DelayedTable.vue'
import MapComp from '../components/MapComp.vue'
import HeaderComp from '../components/HeaderComp.vue'
import FooterComp from '../components/FooterComp.vue'
import { ref } from 'vue'

const map = ref(null)
</script>

<template>
    <main>
        <div class="main-nav">
            <HeaderComp @refresh-map="map.updateLayers()" />
        </div>
        <div class="main-content">
            <keep-alive>
                <DelayedTable @refresh-map="map.updateLayers()" />
            </keep-alive>
            <keep-alive>
                <MapComp ref="map" @refresh-map="map.updateLayers()" />
            </keep-alive>
        </div>
        <div class="main-footer">
            <FooterComp />
        </div>
    </main>
</template>

<style>
main {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
}

.main-content {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

@media (max-width: 1200px) {
    main {
        min-height: 100vh;
    }
    .main-content {
        flex-direction: column;
        flex-wrap: wrap-reverse;
    }
}
</style>
