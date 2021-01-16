<template>
    <!-- 个人基础信息修改页面 -->
    <div class="modAttach">
        <mt-header :title="title" v-if="mod !== 'modAvatar'">
            <mt-button slot='left' @click="cancelMod">取消</mt-button>
            <mt-button class="finishModBtn" slot="right" @click="finishMod">完成</mt-button>
        </mt-header>
        <mt-header :title="title" v-else>
            <mt-button icon="back" slot='left' @click="cancelMod"></mt-button>
            <mt-button icon="more" slot="right" @click="selectMod"></mt-button>
        </mt-header>
        <mt-actionsheet :actions="sheetActions" v-model="sheetVisible">
        </mt-actionsheet>
        <component :is='mod' :origin.sync="propVal" />
    </div>
</template>

<script>
    import modAvatar from './modAvatar.vue';
    import modName from './modName.vue';
    import modSex from './modSex.vue';
    import modRegion from './modRegion.vue';
    import modSignature from './modSignature.vue';


    export default {
        components: {
            modAvatar,
            modName,
            modSex,
            modRegion,
            modSignature
        },
        data() {
            return {
                mod: '',
                propVal: '',
                title: '',
                sheetActions: [],
                sheetVisible: false,
            }
        },
        methods: {
            cancelMod() {
                console.log('cacel');
                this.$router.go(-1);
            },
            finishMod() {
                this.postMessage(this.propVal)
            },
            // 修改个人头像触发
            selectMod() {
                // console.log('选择');
                this.sheetVisible = true
            },
            getTitle(mod) {
                const title = ['个人头像', '设置名字', '设置性别', '设置地区', '设置个性签名']
                switch (mod) {
                    case 'modAvatar':
                        this.title = title[0]
                        break;
                    case 'modName':
                        this.title = title[1]
                        break;
                    case 'modSex':
                        this.title = title[2]
                        break;
                    case 'modRegion':
                        this.title = title[3]
                        break;
                    case 'modSignature':
                        this.title = title[4]
                        break;
                }
            },
            getMessageFromSession(keyName) {
                return JSON.parse(sessionStorage.getItem('userInfo'))[keyName]
            },
            // 发起请求更新数据
            postMessage(updateData) {
                //1、 发起请求修改数据
                setTimeout(() => {
                    console.log(updateData);
                }, 2000);
                // 2、修改服务器端数据成功后 将sessionStorage里对应的也修改
                let tempObj = JSON.parse(sessionStorage.getItem('userInfo'))
                tempObj[this.getKey] = updateData
                sessionStorage.setItem('userInfo', JSON.stringify(tempObj));
                // 3、回退
                this.$router.go(-1)
            },
            initSheetActions() {
                const names = ['拍照', '从相册中选择', '保存相片'];
                const methods = [this.takePhoto, this.selectPiture, this.savePicture]
                this.sheetActions = names.map((name, index) => {
                    return {
                        name,
                        method: methods[index]
                    }
                })
            },
            // 拍照
            takePhoto() {
                console.log('拍照');
            },
            // 从相册中选择照片
            selectPiture() {
                console.log('选择照片');
            },
            // 保存照片
            savePicture() {
                console.log('保存相片');
            }
        },
        computed: {
            // 获取sessionStorage里的对应键
            getKey() {
                return this.mod.slice(3).toLowerCase()
            }
        },
        created() {
            console.log('加载1');
            // console.log(this.$route.params);
            this.mod = this.$route.params.mod
            this.propVal = this.getMessageFromSession(this.getKey)
            this.getTitle(this.mod)
            this.initSheetActions()
        },
        mounted() {

        },
        watch: {
            propVal(newVal) {
                console.log(newVal);
            }
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    $bgColor: #606266;

    .modAttach {
        height: 100%;
        width: 100%;
        overflow: hidden;
        background-color: $bgColor;

        .mint-header {
            background-color: $bgColor;
            height: 3.125rem;
            font-size: 1rem;
            margin-bottom: .2rem;

            .mint-header-button.is-right {

                .finishModBtn.mint-button {
                    background-color: #67C23A;
                    color: #fff;
                    padding: 0 .3rem;
                }

            }
        }

        .mint-actionsheet {
            background-color: #333;

            ::v-deep li.mint-actionsheet-listitem,
            ::v-deep a.mint-actionsheet-button {
                background-color: $bgColor;
                color: #fff;
            }

            ::v-deep li.mint-actionsheet-listitem {
                border-bottom-color: #777;

                &:last-child {
                    border-bottom: none;
                }
            }

        }

    }
</style>