<script setup>
    import TicketTable from '../components/TicketTable.vue'
    import TicketForm from '../components/TicketForm.vue'
</script>

<template>
  <suspense>
    <div class="ticket-container">
        <TicketForm />
		<br>
        <TicketTable />
    </div>
  </suspense>
</template>

<style>
.ticket-container {
    padding: 2rem;
}
</style>
