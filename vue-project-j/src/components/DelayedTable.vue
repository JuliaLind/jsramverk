<script setup>
import DelayedItem from './DelayedItem.vue';

// const res = await fetch("http://localhost:1337/delayed");
// const delayed = await res.json();
// const data = await delayed.data;

const res = await fetch(`${import.meta.env.VITE_URL}/delayed`);
const delayed = await res.json();
const data = await delayed.data;
console.log(import.meta.env.VITE_URL);
</script>

<template>
<div class="delayed">
    <h1>Försenade tåg</h1>
    <div id="delayed-trains" class="delayed-trains">
        <DelayedItem v-for="(item, index) in data" :item="item" :key="index"/>
    </div>
</div>
</template>

<!-- <style scoped> -->
<style>
.delayed {
    height: 100vh;
    width: 40vw;
    padding: 2rem;
    overflow: scroll;
    background-color: white;
}
</style>
