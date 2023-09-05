<script setup>
import DelayedTable from '../components/DelayedTable.vue'
import MapComp from '../components/MapComp.vue'
</script>

<template>
  <main>
  <suspense>
      <DelayedTable />
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
