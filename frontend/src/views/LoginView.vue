<script setup>
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'
import { ref } from 'vue'
const login=ref(true);
let innerText = ref("Register")
const toggleForm = () => {
    if (login.value == true) {
        login.value = false
        innerText = "Log in"
    } else {
        login.value = true
        innerText = "Register"
    }
}
</script>

<template>
    <suspense>
    <div>
        <LoginForm v-if="login" />
        <RegisterForm v-else />
        <!-- Make this a button or a link later-->
        <span class="toggle-link" v-on:click="toggleForm()">{{ innerText }}</span>
    </div>
</suspense>
</template>

<style>
.toggle-link {
    cursor: pointer;
    text-decoration: underline;
}

.toggle-link:hover {
    color: blue;
}
.ticket-container {
    padding: 2rem;
}
</style>
