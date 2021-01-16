<template>
    <div class="main">

        <transition name="test">
            <p v-if="top" key="hey"> hello test</p>
            <p v-else key='goodbye'>goodbye test</p>
        </transition>

        <button @click="top = !top">Toggle</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                top: true
            }
        }
    }
</script>

<style scoped lang='scss'>
    .main {
        height: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;


        .test-enter,
        .test-leave-to {
            transform: translateX(-30px);
        }

        .test-enter-active,
        .test-leave-active {
            transition: all 2s ease-out;
        }



    }
</style>