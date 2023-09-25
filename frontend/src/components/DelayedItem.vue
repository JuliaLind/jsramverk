<script setup>
/**
 * Component representing one row in the table that displays displays delayed trains
 */
import { useTicketStore } from '@/stores/ticket'
import { RouterLink } from 'vue-router'
import { outputDelay } from '../models/utils.js'

const store = useTicketStore()
const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

/**
 * @var {Object} item - Object containing data for a delayed train
 * @example {
 * ActivityId: "1500adde-f75d-c409-08db-aa83ab51b321"
 * ActivityType: "Avgang",
 * AdvertisedTimeAtLocation: "2023-09-16T18:45:00.000+02:00",
 * AdvertisedTrainIdent: "442",
 * Canceled: false,
 * EstimatedTimeAtLocation: "2023-09-16T19:16:00.000+02:00",
 * FromLocation: [
 *      {
 *          LocationName: "G",
 *          Priority: 1,
 *          Order: 0
 *      }
 * ],
 * LocationSignature: "K",
 * OperationalTrainNumber: "442",
 * ToLocation: [
 *      {
 *          LocationName: "Cst",
 *          Priority: 1,
 *          Order: 0
 *      }
 * ],
 * TrainOwner: "SJ"
 * }
 */
const item = props.item
const delayTime = outputDelay(item)

item.delayTime = delayTime
</script>

<template>
    <!-- When link to new ticket is clicked the object containing information about the delayed train is stored in the "tickets"-store to be accessed from the TickerForm component -->
    <RouterLink class="delay-item" to="/tickets" @click="store.setCurrent(item)">
        <div class="train-number">{{ item.OperationalTrainNumber }}</div>
        <div class="current-station">
            <div>{{ item.LocationSignature }}</div>
            <div>
                {{ item.FromLocation ? item.FromLocation[0].LocationName + ' -> ' : '' }}
                {{ item.ToLocation ? item.ToLocation[0].LocationName : '' }}
            </div>
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
