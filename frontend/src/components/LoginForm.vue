<script setup>
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const store = useAuthStore()
let username = ''
let password = ''

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
        <RouterLink to="/">Tillbaka</RouterLink>
        <h1>Logga in</h1>
        <form v-on:submit.prevent="store.login(username, password)">
            <label>E-postaddress</label>
            <input type="email" name="username" required="required" v-model="username" /><br />
            <label>Lösenord</label>
            <input v-bind:type="fieldType" required="required" name="password" v-model="password" />
            <span class="material-symbols-outlined" @click="toggleVisibility()">
{{ innerText }}
</span>
<br />
            <input type="submit" value="Logga in" />
        </form>
    </div>
</template>

<style scoped>
.material-symbols-outlined {
    cursor: pointer;
}</style>
