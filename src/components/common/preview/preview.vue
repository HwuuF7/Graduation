<template>
    <div class="preview" ref="preview" @touchstart='onTouchStart' @touchmove='onTouchMove' @touchend='onTouchEnd'
        @click="test">
        <header>
            <span>{{currentIndex +1}}/{{picsLen}}</span>
        </header>
        <div class="wrap" ref="wrap">
            <div class="wrap-item" v-for="(picture,pIndex) in pictures" :key="pIndex">
                <img :src="picture" alt="预览图片">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'preview',
        // see用来获取盒子的offsetWidth 
        // popUp设置为display:none后 会拿不到
        // 因此要监听这一值的变化 当打开了popup之后进行赋值
        props: ['pictures', 'see', 'preIndex'],
        data() {
            return {
                imgWidth: null,
                // 按下的起始坐标X
                startPointX: 0,
                // 起始坐标Y
                startPointY: 0,
                // 按下时已走的距离
                startLeft: 0,
                // 手指移动X的距离
                moveDisX: 0,
                // 手指移动Y的距离
                moveDisY: 0,
                // 用来判断用户意图 
                firstDirection: false,
                moveDir: null,
                // 当前展示的索引
                currentIndex: 0,
                countIndex: 0,
            }
        },
        mounted() {
            let {
                preview,
                wrap
            } = this.$refs;
            /*  this.$nextTick(() => {
                 this.imgWidth = preview.offsetWidth;
             }) */
            if (this.picsLen > 1) {
                wrap.innerHTML += this.$refs.wrap.innerHTML;
                wrap.style.width = this.picsLen * 2 * 100 + 'vw';
                wrap.style.transform = 'translate3d(0px,0px,0px)';
                // wrap.style.transitionDuration = '0ms';
            }
        },
        methods: {
            test() {
                this.$emit('closePop')
            },
            onTouchStart(ev) {

                this.startPointX = ev.changedTouches[0].pageX;
                this.startPointY = ev.changedTouches[0].pageY;

                if (this.picsLen > 1) {
                    this.$refs.wrap.style.transition = 'null'
                    // this.$refs.wrap.style.transitionDuration = '0ms';
                    this.$refs.wrap.children[this.countIndex].style.transition = 'null'

                    if (this.countIndex === 0) {
                        this.countIndex = this.picsLen;
                    }
                    if (this.countIndex === this.picsLen * 2 - 1) {
                        this.countIndex = this.picsLen - 1;
                    }
                    this.$refs.wrap.style.transform = `translate3d(${ -this.countIndex * this.imgWidth}px,0px,0px)`
                    this.startLeft = parseFloat(this.$refs.wrap.style.transform.split('(')[1]);

                }
            },
            onTouchMove(ev) {
                this.moveDisX = ev.changedTouches[0].pageX - this.startPointX;
                this.moveDisY = ev.changedTouches[0].pageY - this.startPointY;
                if (!this.firstDirection) {
                    this.firstDirection = true;
                    // 水平滑动的距离大 则左右滑动
                    if ((Math.abs(this.moveDisX) > Math.abs(this.moveDisY)) && (this.picsLen > 1)) {
                        // 阻止上下滑动
                        ev.preventDefault();
                        this.moveDir = 'left';
                        this.$refs.wrap.style.transform = `translate3d(${this.moveDisX + this.startLeft}px,0px,0px)`
                    }
                    // 相反 如果上下滑动距离大 则上下滑动
                    if (Math.abs(this.moveDisX) < Math.abs(this.moveDisY)) {
                        ev.preventDefault();
                        this.moveDir = 'down';
                    }
                } else {
                    if (this.moveDir === 'left') {
                        ev.preventDefault();
                        this.$refs.wrap.children[this.countIndex - 1].style.transition = 'null'
                        this.$refs.wrap.children[this.countIndex].style.transition = 'null'
                        this.$refs.wrap.children[this.countIndex - 1].style.marginRight = '.6rem';
                        this.$refs.wrap.children[this.countIndex].style.marginRight = '.6rem';
                        this.$refs.wrap.style.transform = `translate3d(${this.moveDisX + this.startLeft}px,0px,0px)`
                    }
                    // if (this.moveDir === 'down') {
                    // }
                }
            },
            onTouchEnd(ev) {
                if ((this.picsLen > 1) && (this.moveDir === 'left')) {
                    this.moveDisX = ev.changedTouches[0].pageX - this.startPointX;
                    this.$refs.wrap.children[this.countIndex - 1].style.transition = '.3s'
                    this.$refs.wrap.children[this.countIndex].style.transition = '.3s'
                    this.$refs.wrap.children[this.countIndex - 1].style.marginRight = '0';
                    this.$refs.wrap.children[this.countIndex].style.marginRight = '0';
                    // 回弹
                    const backWidth = this.imgWidth / 4;
                    if (Math.abs(this.moveDisX) > backWidth) {
                        this.countIndex -= this.moveDisX / Math.abs(this.moveDisX);
                    }
                    this.$refs.wrap.style.transition = '.3s'
                    // this.$refs.wrap.style.transitionDuration = '300ms';
                    this.$refs.wrap.children[this.countIndex].style.transition = '.3s'
                    this.$refs.wrap.style.transform = `translate3d(${-this.countIndex*this.imgWidth}px,0px,0px)`
                    this.$refs.wrap.children[this.countIndex].style.marginRight = '0';
                }
                this.currentIndex = this.countIndex % this.picsLen
                // console.log(this.currentIndex, '---==');

                this.firstDirection = false;
                this.moveDir = null;
            }
        },
        computed: {
            picsLen() {
                return this.pictures.length
            }
        },
        watch: {
            see(newBool) {
                // 如果为true 则意味着外部点击了预览
                if (newBool) {
                    this.imgWidth = this.$refs.preview.offsetWidth;
                    //  传入显示的图片索引
                    this.countIndex = this.preIndex;
                    this.$refs.wrap.style.transform = `translate3d(${-this.countIndex*this.imgWidth}px,0px,0px)`
                    this.currentIndex = this.preIndex;
                }
            }
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './preview.scss';
</style>