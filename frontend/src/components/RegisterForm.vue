<script setup>
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const store = useAuthStore()
let username = ''
let password = ''
let name = ''
let innerText = ref("visibility")
let fieldType = ref("password")

function toggleVisibility() {
    if (innerText.value === "visibility" && fieldType.value === "password") {
        innerText.value = "visibility_off"
        fieldType.value = "text"
    } else {
        innerText.value = "visibility"
        fieldType.value = "password"
    }
}

</script>

<template>
    <div class="ticket">
        <h1>Registreringsformulär</h1>
        <form v-on:submit.prevent="store.register(username, password, name)">
            <!--Idea for later: add a name field (+ in bakend) so we can make toast with greeting when logged in -->
            <label>Namn</label>
            <input type="text" name="name" required="required" v-model="name" /><br />
            <label>E-postaddress</label>
            <input type="email" name="username" required="required" v-model="username" /><br />
            <label>Lösenord</label>
            <input v-bind:type="fieldType" required="required" name="password" v-model="password" /><span class="material-symbols-outlined" @click="toggleVisibility()">{{ innerText }}</span><br />
            <input type="submit" value="Submit" />
        </form>
    </div>
</template>

<style scoped>
.material-symbols-outlined {
    cursor: pointer;
}
</style>
