<script setup>
/**
 * Component representing one row in the table that displays displays delayed trains
 */
import { outputDelay } from '../services/utils.service.js'
import { useTrainsStore } from '@/stores/trains'

const store = useTrainsStore()
const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})
/**
 * @var {Object} item - Object containing data for a delayed train
 */
const item = props.item
const delayTime = outputDelay(item)

item.delayTime = delayTime
</script>

<template>
    <tr
        class="delay-item"
        v-if="store.current === '' || store.current === item.OperationalTrainNumber"
    >
        <td class="train-number">
            {{ item.OperationalTrainNumber }}
        </td>
        <td class="current-station">
            {{ item.LocationSignature }}
        </td>
        <td class="station">
            {{ item.FromLocation }}
        </td>
        <td class="station">
            {{ item.ToLocation }}
        </td>
        <td class="delay">
            <div class="old-time">{{ item.AdvertisedTimeAtLocation.substring(12, 16) }}</div>
            <div class="new-time">{{ item.EstimatedTimeAtLocation.substring(12, 16) }}</div>
            <div>{{ delayTime }}</div>
        </td>
    </tr>
</template>

<style scoped>
.stations {
    font-size: 1rem;
}

.old-time {
    text-decoration: line-through;
}

td,
td > div {
    font-size: 1rem;
    white-space: nowrap;
}

a {
    color: #000;
    text-decoration: none;
}

.delay-item {
    /* display: flex; */
    flex-direction: row;
    border-top: 1px solid #ccc;
    padding: 0.2rem 0.8rem;
    align-items: center;
    cursor: pointer;
}

.delay-item:nth-of-type(2n) {
    background-color: #f6f6f6;
}

.train-number {
    font-size: 1.7rem;
    font-weight: bold;
    padding: 1.2rem 1.5rem;
    /* width: 30%; */
}
/* 
.current-station {
    width: 30%;
} */

.delay {
    padding: 1.2rem 1.5rem;
}

@media (max-width: 1600px) {
    .delay {
        width: 100%;
    }

    td,
    td > div {
    font-size: 1rem;
    white-space: normal;
}
}
</style>
