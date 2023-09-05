<script setup>
    import DelayedTable from '../components/DelayedTable.vue'

  const props = defineProps({
    item: {
      type: Array,
      required: true
    }
  })

    const item = props.item;
    console.log(item);

</script>

<template>
  <main>
    <suspense>
      <DelayedTable />
    </suspense>
  </main>
</template>

<style>
</style>
