<script setup>
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'
import HeaderComp from '../components/HeaderComp.vue'
import FooterComp from '../components/FooterComp.vue'
import { ref } from 'vue'
const login = ref(true)
let innerText = ref('Till registrering')
const toggleForm = () => {
    if (login.value == true) {
        login.value = false
        innerText.value = 'Till inloggning'
    } else {
        login.value = true
        innerText.value = 'Till registrering'
    }
}
</script>

<template>
    <div class="main-nav">
        <HeaderComp></HeaderComp>
    </div>
    <div class="container">
        <LoginForm v-if="login" />
        <RegisterForm v-else />
        <!-- Make this a button or a link later-->
        <div class="button-container">
            <button class="toggle-link btn btn-secondary mt-3" v-on:click="toggleForm()">
                {{ innerText }}
            </button>
        </div>
    </div>
    <div class="footer fixed-bottom">
        <FooterComp></FooterComp>
    </div>
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
.button-container {
    text-align: center;
}
</style>
