<script setup>

const res = await fetch("http://localhost:1337/tickets");
const data = await res.json();
const tickets = await data.data;

// let newTicketId = 0;
// const lastId = result.data[1] ? result.data[1].id : 0;
// newTicketId = lastId + 1;

</script>

<template>
  <div class="old-tickets" id="old-tickets">
      <h2>Befintliga ärenden</h2>
      <div v-for="(ticket, index) in tickets" :key="index">{{ ticket._id }} - {{ ticket.code }} - {{ ticket.trainnumber }} - {{ ticket.traindate }}</div>
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
