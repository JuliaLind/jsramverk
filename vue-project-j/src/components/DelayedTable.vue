<script setup>
import DelayItem from './DelayItem.vue'

const res = await fetch("http://localhost:1337/delayed")
const delayed = await res.json()
// console.log(delayed);
</script>

<template>
  <div class="delayed">
      <h1>Försenade tåg</h1>
      <div id="delayed-trains" class="delayed-trains">
        <DelayItem v-for="(delay, index) in delayed.data" :item="delay" :key="index"/>

      </div>
  </div>
</template>

<style scoped>
.delayed {
    height: 100vh;
    width: 40vw;
    padding: 2rem;
    overflow: scroll;
    background-color: white;
}

</style>
