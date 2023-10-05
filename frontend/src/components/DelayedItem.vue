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
    <div
        class="delay-item"
        v-if="store.current === '' || store.current === item.OperationalTrainNumber"
    >
        <div class="train-number">{{ item.OperationalTrainNumber }}</div>
        <div class="current-station">
            <div>{{ item.LocationSignature }}</div>
            <div>
                {{ item.FromLocation ? item.FromLocation[0].LocationName + ' -> ' : '' }}
                {{ item.ToLocation ? item.ToLocation[0].LocationName : '' }}
            </div>
        </div>
        <div class="delay">{{ delayTime }}</div>
    </div>
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
