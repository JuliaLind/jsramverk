<script setup>
import { useTicketStore } from '@/stores/ticket'

const store = useTicketStore()
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

function outputDelay(item) {
    let advertised = new Date(item.AdvertisedTimeAtLocation);
    let estimated = new Date(item.EstimatedTimeAtLocation);
    const diff = Math.abs(estimated - advertised);

    return Math.floor(diff / (1000 * 60)) + " minuter";
}

const item = props.item;
const delayTime = outputDelay(item);

item.delayTime = delayTime;
</script>

<template>
  <RouterLink class="delay-item" @click.native="store.setCurrent(item)" to="/tickets">
    <div class="train-number"> {{ item.OperationalTrainNumber }}</div>
      <div class="current-station">
        <div>{{ item.LocationSignature }}</div>
        <div>{{ (item.FromLocation ? item.FromLocation[0].LocationName + " -> " : "") }} {{ (item.ToLocation ? item.ToLocation[0].LocationName : "") }}</div>
      </div>
      <div class="delay">{{ delayTime }}</div>
</RouterLink>
</template>

<style scoped>

a {
  color: #000;
  text-decoration: none;
}

.delay-item {
    display: flex;
    flex-direction: row;
    border-top: 1px solid #ccc;
    padding: 0.2rem 0.8rem;
    align-items: center;
    cursor: pointer;
}

.delay-item:nth-of-type(2n) {
    background-color: #eee;
}

.train-number {
    font-size: 2rem;
    font-weight: bold;
    width: 30%;
}

.current-station {
    width: 30%;
}
</style>
