<template>

    <gra-load v-if="isLoading" :isIf.sync='isLoading'></gra-load>


    <div class="home-container" v-else>


        <div class="stars"></div>
        <div class="stars2"></div>
        <div class="stars3"></div>


        <div class="qr-container">
            <div class="logo">
                <img src="./assets/logo.png" alt="QR-LOGO">
            </div>
            <div class="text">
                <div class="text-top">
                    <div class="flex-line"></div>
                    <h1 class="main">
                        <svg class="font-line" viewBox="0 0 200 60">
                            <symbol id="line-text">
                                <text text-anchor="middle" x="50%" y="50%" dy=".4em">
                                    成电翻江
                                </text>
                            </symbol>

                            <use xlink:href="#line-text" class="text"></use>
                            <use xlink:href="#line-text" class="text"></use>
                            <use xlink:href="#line-text" class="text"></use>
                            <use xlink:href="#line-text" class="text"></use>
                        </svg>
                    </h1>
                    <div class="flex-line"></div>
                </div>

                <p class="text-bottom" data-text='关注尽享评论消息通知'>关注尽享评论消息通知</p>
            </div>
        </div>
        <p class="footer">版权声明</p>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                isLoading: true,
            }
        },

    }
</script>


<style lang="scss">
    @import url('./assets/css/global.css');
    @import url('./assets/css/font-line.css');
    @import './assets/css/backgroundStars.scss';


    .home-container {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        transition: all 2s cubic-bezier(0, 0.03, 0.91, -0.06);

        &:before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background-image: linear-gradient(to top left, #002f4b, #dc4225);


            opacity: .8;
        }

        .qr-container {
            width: 50%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            overflow: hidden;

            .logo {
                width: 200px;
                height: 200px;
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 30px;
                background: #fff;
                box-shadow: 0 1px 1px #eee;

                &>img {
                    width: 100%;
                    height: 100%;
                }
            }

            .text {
                width: 100%;

                .text-top {
                    display: flex;
                    flex-direction: row;

                    div.flex-line {
                        height: 2px;
                        flex: 1;
                        margin: 30px 0;
                        background: #7b88ff;


                    }

                    h1.main {
                        position: relative;
                        width: 240px;
                        height: 60px;
                        line-height: 60px;
                        max-width: 600px;
                        letter-spacing: 1rem;
                        overflow: hidden;
                        display: flex;
                    }
                }

                p.text-bottom {
                    margin-top: 20px;
                    font-weight: 600;
                    letter-spacing: 2px;
                    text-align: center;
                    color: transparent;
                    position: relative;
                    background-image: linear-gradient(75deg, rgba(199, 86, 67, 1) 0%, rgba(247, 255, 86, 1) 33.33%, rgba(0, 0, 0, 0) 66.67%, rgba(0, 0, 0, 0) 100%);
                    background-size: 300% 100%;
                    background-position-x: 100%;
                    background-clip: text;
                    -webkit-background-clip: text;
                    animation: text-gradually 2s steps(10) alternate infinite;
                }
            }


        }

        .footer {
            position: fixed;
            bottom: 0;
            left: 50%;
            color: #fff;
            font-size: 12px;
            transform: translate(-50%, -50%);
        }
    }


    @keyframes text-gradually {
        0% {
            background-position-x: 100%;

        }

        50% {
            background-position-x: 50%;

        }

        100% {
            background-position-x: 0%;

        }

    }
</style>