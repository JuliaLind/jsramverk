<script setup>

</script>

<template>
<!-- Footer -->
    <div id="footer">
        <div class="footer-container">
            <ul class="icons">
                <li><a href="#" class="icon fab fa-facebook-f fa-2x"></a></li>
                <li><a href="#" class="icon fab fa-twitter fa-2x"></a></li>
                <li><a href="#" class="icon fab fa-instagram fa-2x"></a></li>
            </ul>
            <ul class="copyright">
                <li>Copy Julia & Martin</li>
                <li>Design <a href="#">Julia & Martin</a></li>
            </ul>
        </div>
    </div>
<!-- End Footer -->
</template>

<style scoped>
/*10.Footer*/
#footer {
    padding:  4em 0 5em 0;
    color: #aaa;
    background: #f6f6f6;
    text-align: center;
    margin-top: 2rem;
    width: 100%;
}
#footer a {
    color:#aaa;
    text-decoration: none;
}

#footer .icons {
    font-size: 1.5em;
}

ul.icons li {
    display: inline-block;
    padding:0 1em 0 0;}

#footer .copyright {
    margin: 2em 0;
    padding: 0;
    text-align: center;
}
#footer .copyright li{ 
    display: inline-block;
    border-left: solid 1px rgba(144,144,144,0.25);
    list-style: none;
    margin-left: 1.5em;
    padding-left: 1.5em;
}

@media (max-width: 1600px) {
    #footer {
        margin-top: unset;
        padding: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #footer .copyright {
        margin: unset;
    }
}

</style>