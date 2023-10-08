<script setup>
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'

const store = useAuthStore()
let username = ''
let password = ''
</script>

<template>
    <div class="ticket">
        <RouterLink to="/">Tillbaka</RouterLink>
        <h1>Logga in</h1>
        <form v-on:submit.prevent="store.login(username, password)">
            <label>E-postaddress</label>
            <input type="email" name="username" required="required" v-model="username" /><br />
            <label>Lösenord</label>
            <input type="password" required="required" name="password" v-model="password" /><br />
            <input type="submit" value="Logga in" />
        </form>
    </div>
</template>

<style scoped></style>
