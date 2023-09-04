<!-- Script -->

<script>
    export default {
        name: 'DelayedItem',
        props: {
            item: Object
        },
        methods: {
            outputDelay(item) {
                let advertised = new Date(item.AdvertisedTimeAtLocation);
                let estimated = new Date(item.EstimatedTimeAtLocation);

                const diff = Math.abs(estimated - advertised);
                return Math.floor(diff / (1000 * 60)) + " minuter";
            }
        }
    };
</script>

<!-- Template -->

<template>
    <div>
        <div class="train-number">{{ item.OperationalTrainNumber }}</div>
        <div class="current-station">
            <div>{{ item.LocationSignature }}</div>
            <div>
            {{ item.FromLocation ? item.FromLocation[0].LocationName + " -> " : "" }}
            {{ item.ToLocation ? item.ToLocation[0].LocationName : "" }}
            </div>
        </div>
        <div class="delay">
            {{ outputDelay(item) }}
        </div>
    </div>
</template>

<!-- Style -->

<style scoped>
    .train-number {
        font-size: 2rem;
        font-weight: bold;
        width: 30%;
    }

    .current-station {
        width: 30%;
    }
</style>