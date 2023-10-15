<script setup>
import { RouterLink } from 'vue-router';
import { useTrainsStore } from '@/stores/trains'
import { ref, onMounted } from 'vue';

const store = useTrainsStore()
let current = ref('')

function switchCurrent() {
    current.value = store.current
}

onMounted(() => {
    switchCurrent()
})
</script>

<template>
<!--Navbar-->
<div id="header">
    <nav id="nav">
        <ul>
            <li>
                <RouterLink to="/" @click="store.current = ''"> Start </RouterLink>
            </li>
            <li>
                <RouterLink to="/admin" @click="store.current = ''"> Admin </RouterLink>
            </li>
        </ul>
    </nav>
</div>
<!-- End Header -->
</template>

<style scoped>
#header {
    /* position: fixed; */
    /* display: flex; */
    background-color: #f6f6f6;
    border-bottom: solid 1px rgba(144, 144, 144, 0.25);
    box-shadow: 0px 0.0375em 0.125em 0px rgba(0,0,0,0.05);
    color: #484848;  
    width: 100%; 
    text-transform: uppercase;
    height: 4.5em;
    font-size: 1.25em;
}

#header nav{
    float: right;
    margin-right: 2em;
    margin-top: 1.5em;
}
#header nav ul li {
    display: inline-block;
    border-radius: 4px;
    margin-left: 2.5em;
}
#header nav ul li a {
    color: #3e3e3e;
    text-decoration: none;
}

#header nav ul li a:hover {
    color: #2d2c2c;
}

/* For laptop and smaller */
@media (max-width: 1600px) {
    #header {
        height: unset;
        display: flex;
        padding: 0.5em;
    }

    #header nav {
        margin-top: unset;
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    #header nav ul {
        margin-bottom: unset;
        display: flex;
        justify-content: flex-end;
        width: 100%;
    }

    #header nav ul li {
        border-radius: unset;
    }

}
</style>