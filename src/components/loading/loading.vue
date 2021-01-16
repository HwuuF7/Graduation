<template>
    <div class="loading-page">
        <div class="counter">
            <span class="loader" :data-loading=content>{{content}}</span>
            <h1 ref="$h1">0%</h1>
            <hr ref="$hr" />
        </div>
    </div>
</template>

<script>
    export default {
        name: 'graLoad',
        props: {
            content: {
                type: String,
                default: 'Loading'
            },
            delay: {
                type: Number,
                default: 20
            },
            isIf: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {

            }
        },
        mounted() {
            let counter = 0;
            let timeId = setInterval(() => {
                this.$refs.$h1.innerText = `${counter}%`;
                this.$refs.$hr.style.width = `${counter}%`;
                counter++;
                if (counter === 101) {
                    clearInterval(timeId);
                    //  this.isLoading = false;
                    if (this.isIf) {
                        this.$emit('update:isIf', false)
                    }

                }
            }, this.delay);
        }
    }
</script>

<style scoped lang='scss'>
    @import './loading.scss';
</style>