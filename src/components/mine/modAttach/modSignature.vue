<template>
    <div class='modSignature'>
        <mt-field ref='focus' type="textarea" rows="3" v-model.trim="signature" :attr='{maxlength: 30}'
            @keydown.enter.native="textareaKeydown"></mt-field>
        <span>{{remainWords}}</span>
    </div>
</template>

<script>
    export default {
        props: ['origin'],
        data() {
            return {
                signature: '',
            }
        },
        created() {
            this.signature = this.origin
        },
        methods: {
            // 禁止换行
            textareaKeydown() {
                let e = window.event || arguments[0];
                if (e.key == 'Enter' || e.code == 'Enter' || e.keyCode == 13) {
                    e.returnValue = false;
                    return false;
                }
            }
        },
        mounted() {
            this.$refs.focus.$refs.textarea.focus()
        },
        updated() {
            this.$emit('update:origin', this.signature)
        },
        computed: {
            remainWords() {
                return 30 - parseInt(this.signature.length)
            }
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './modCommon.scss';

    .modSignature {
        position: relative;

        >span {
            position: absolute;
            color: #fff;
            right: .5rem;
            bottom: .2rem;
        }
    }
</style>