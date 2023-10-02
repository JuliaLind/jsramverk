<script setup>
import { useAuthStore } from '@/stores/auth'


const store = useAuthStore()

let username = "";
let password = "";
let name="";

</script>

<template>
    <div class="ticket">
        <h1>Registreringsformulär</h1>
        <form v-on:submit.prevent="store.register(username, password, name)">
            <!--Idea for later: add a name field (+ in bakend) so we can make toast with greeting when logged in -->
            <label>Namn</label>
            <input type="text" name="name" required="required" v-model="name"/><br />
            <label>E-postaddress</label>
            <input type="email" name="username" required="required" v-model="username"/><br />
            <label>Lösenord</label>
            <input type="password" required="required" name="password" v-model="password" /><br />
            <input type="submit" value="Submit" />
        </form>
    </div>
</template>

<style scoped></style>
