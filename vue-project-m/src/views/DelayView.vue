<!-- Script -->

<script>
    import DelayedTable from '../components/DelayedTable.vue';

    export default {
        /* Data property initializing delayedTrains property */
        data() {
            return {
                delayedTrains: null
            };
        },
        /* Mounted hook which gets executed when component is mounted to DOM */
        mounted() {
            this.getDelayedTrains();
        },
        methods: {
            /* This method fetches the delayed trains from API endpoint "delayed" */
            getDelayedTrains() {
                // const response = await fetch("http://localhost:1337/delayed");
                // const result = await response.json();
            fetch("http://localhost:1337/delayed")
                .then((response) => response.json())
                .then((result) => {
                    this.delayedTrains = result.data;
                    console.log(result.data);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
            },
        },
    };
</script>

<!-- Template -->

<template>
  <main>
    <DelayedTable :data="delayedTrains" />
  </main>
</template>

<!-- Style -->

<style scoped></style>
