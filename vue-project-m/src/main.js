import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import DelayedTable from './components/DelayedTable.vue';
import DelayedItem from './components/DelayedItem.vue';


const app = createApp(App)

app.component('DelayedTable', DelayedTable);
app.component('DelayedItem', DelayedItem);
app.use(createPinia());
app.use(router);

app.mount('#app');
