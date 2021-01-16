<template>
    <!-- 发消息表单 -->
    <div class='messageSort'>
        <mt-field label="意图" disableClear @focus.native.capture="selectPurpose" v-model="messageForm.purpose">
        </mt-field>
        <mt-field label="联系人" v-model="messageForm.linkman" placeholder='你的姓名'></mt-field>
        <mt-field label="联系电话" v-model="messageForm.phone" placeholder='手机号或者微信号'></mt-field>
        <mt-field label='标签' v-model='messageForm.tags'></mt-field>

        <!-- 这里要进行额外实现 ！！！！！！！-->
        <mt-field label='图片上传' v-model='messageForm.pictures'></mt-field>


        <mt-field type='textarea' rows='5' v-model.trim='messageForm.description' placeholder='请输入'></mt-field>

        <!-- 显示意图选择 -->
        <mt-actionsheet :actions="purposeActions" v-model="purposeSheetVisible">
        </mt-actionsheet>

        <mt-button type='primary'>确定发布</mt-button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                messageForm: {
                    purpose: '请选择',
                    linkman: '',
                    phone: '',
                    tags: '',
                    pictures: '',
                    description: ''
                },
                // 意图选择显示
                purposeSheetVisible: false,
                // 意图选择
                purposeActions: []
            }
        },
        //生命周期 - 创建完成（访问当前this实例）
        created() {
            this.purposeActions = [{
                name: '招聘',
                method: () => {
                    this.messageForm.purpose = '招聘';
                    this.surePurpose()
                }
            }, {
                name: '求职',
                method: () => {
                    this.messageForm.purpose = '求职';
                    this.surePurpose()
                }
            }]
        },
        //生命周期 - 挂载完成（访问DOM元素）
        mounted() {

        },
        methods: {
            selectPurpose() {
                console.log('show');
                this.purposeSheetVisible = true;
            },
            // 确认是招聘还是求职
            surePurpose() {
                console.log('mes---', this.messageForm.purpose);
            }

        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    @import './messageSort.scss'
</style>