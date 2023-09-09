<script setup>
import { useTicketStore } from '@/stores/ticket'
const store = useTicketStore();
const item = store.getCurrent();
let locationString = "";

if (item.FromLocation) {
        locationString = `Tåg från ${item.FromLocation[0].LocationName} till ${item.ToLocation[0].LocationName}. Just nu i ${item.LocationSignature}.`;
}

const res = await fetch("https://jsramverk-editor-julmar2023.azurewebsites.net/codes");
const data = await res.json();
const reasonCodes = await data.data;

item.reasonCode = reasonCodes[0].Code;

function onChange(event) {
    item.reasonCode = event.target.value;
}

async function submitForm() {
    const newTicket = {
        code: item.reasonCode,
        trainnumber: item.OperationalTrainNumber,
        traindate: item.EstimatedTimeAtLocation.substring(0, 10),
    };

    const response = await fetch("https://jsramverk-editor-julmar2023.azurewebsites.net//tickets", {
          body: JSON.stringify(newTicket),
          headers: {
              'content-type': 'application/json'
          },
          method: 'POST'
      });

    // const response = await fetch("http://localhost:1337/tickets", {
    //    body: JSON.stringify(newTicket),
    //    headers: {
    //        'content-type': 'application/json'
    //    },
    //    method: 'POST'
    // });

}
</script>

<template>
<div class="ticket">
    <RouterLink to="/">Tillbaka</RouterLink>
    <h1>Nytt ärende #<span id="new-ticket-id"></span></h1>
    <h3>{{ locationString }}</h3>
    <p><strong>Försenad:</strong> {{ item.delayTime }}</p>

    <form id="new-ticket-form" v-on:submit.prevent="submitForm">
        <label>Orsakskod</label><br>
        <select id="reason-code" name="code" @change="onChange">
            <option v-for="(code, index) in reasonCodes" :key="index" :value="code.Code">
                {{ code.Code }} - {{ code.Level3Description }}
            </option>
        </select><br><br>
        <input type="submit" value="Skapa nytt ärende" />
    </form>
</div>
</template>

<!-- <style scoped> -->
<style>
</style>
