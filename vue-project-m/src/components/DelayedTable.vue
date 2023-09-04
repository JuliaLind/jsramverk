<!-- Single File Component DelayedTable -->

<!--
    Script
 -->
<script>
    export default {
        name: 'DelayedTable',
        props: {
            data: Array
        },
        methods: {
            renderTicketView(item) {
            // Här kommer logiken för renderTicketView-metoden.
            },
        },
    };
</script>

<!--
    Template
-->
<template>
    <div>
        <div v-for="item in data" :key="item.ActivityId" @click="renderTicketView(item)">
            <DelayedItem :item="item" />
        </div>
    </div>
</template>

<style scoped>
</style>