<template>
    <div class="addPictures">
        <input ref='upload_file' accept="image/*" @change="fileChange($event)" type="file" multiple
            style="display: none" />



        <div class="show-img">
            <ul class="img-list">
                <template v-if="showImgList">
                    <li v-for="(url,index) in realImgList" :key="index">
                        <!-- <img class="del" src="../../../assets/imgs/money.png" @click.stop="delImg(index)" /> -->
                        <img :src="url" @click.stop="previewPicture(url,index)">
                    </li>
                </template>

                <li class="loadingLi" v-show="loadingPopVisible">
                    <span ref='loadingLi'></span>
                </li>
                <!-- 添加图片按钮 -->
                <li class="add-image-btn" align="center" @click="chooseType" v-show="showAddBtn">
                    <span>+</span>
                    <p>添加图片</p>
                </li>
            </ul>
        </div>

        <!-- 加载中的弹出框 -->
        <mt-popup v-model="loadingPopVisible" popup-transition="popup-fade" :closeOnClickModal='false'>
            <div class="loading-toast">
                <mt-spinner type="fading-circle" :size='38'></mt-spinner>
                <p>上传中</p>
            </div>
        </mt-popup>

        <!-- 预览图片的弹出框 -->
        <mt-popup v-model="previewPopVisible" popup-transition="popup-fade" class="previewPicture">
            <div class="pictureBox" @click.stop="previewPopVisible = false" ref="pictureBox">
                <!-- <img src="../../../assets/imgs/long.jpg" alt=""> -->
                <!-- <img src="../../../assets/imgs/7f.png" alt=""> -->
            </div>
            <div class="deleteBox" @click.stop="delImg">
                <span class="iconfont icon-lajitong fz-15"></span>
            </div>
        </mt-popup>
    </div>
</template>

<script>
    class PartFileReader {
        constructor(file, type, evConfig) {
            this.file = file; //inputObj.files[0]
            this.type = type; //配置FileReader读取文件的方法
            this.event = evConfig; //配置读取文件时需要触发的事件
            this.total = file.size; //获取文件大小
            this.step = 400; //500KB（单片大小/一兆）1024*
            this.loaded = 0; //文件当前读取进度
            this.curPer = 0; //文件当前读取进度百分比
            this.reader = new FileReader(); //实际读取文件的FileReader对象实例
            this.abort = this.reader.abort; //中断文件读取（可以通过中断文件读取事件保留切片数据，实现下一次可以在原读取位置继续开始读取）
            this.readPartFile(this.loaded); //开启读取文件
            this.bindEvent(); //绑定FileReader文件读取
        }
        //给切片读取对象原型上添加FileReader获取读取类型，开启读取文件
        readPartFile(start) {
            if (this.file.slice) {
                var fileFrag = this.file.slice(start, this.loaded + this.step);
                switch (this.type) {
                    case 'readAsBinaryString':
                        this.reader.readAsBinaryString(fileFrag);
                        break;
                    case 'readAsDataURL':
                        this.reader.readAsDataURL(fileFrag);
                        break;
                    case 'readAsArrayBuffer':
                        this.reader.readAsArrayBuffer(fileFrag);
                        break;
                    case 'readAsText':
                        this.readAsText(fileFrag);
                        break;
                }
            }
        }
        //给切片读取对象原型上绑定FileReader对象事件
        bindEvent() {
            this.reader.onloadstart = (e) => {
                this.event.loadStart && this.event.loadStart.call(this, e, this.curPer);
            }
            this.reader.onprogress = (e) => {
                this.event.progress && this.event.progress.call(this, e);
            }
            this.reader.onload = (e) => {
                // 切片读取文件有别于非切片读取，切片读取的文件读取状态需要在每个切片读取成功后再刷新读取进度
                this.loaded += e.loaded;
                this.curPer = Math.round(this.loaded / this.total * 100);
                this.event.load && this.event.load.call(this, e, this.loaded, this.total, this.file.type, this
                    .curPer);
                if (this.loaded < this.total) {
                    this.readPartFile(this.loaded);
                }
            }
            this.reader.onloadend = (e) => {
                this.event.loadend && this.event.loadend.call(this, e);
            }
            this.reader.onabort = (e) => {
                this.event.abort && this.event.abort.call(this, e);
            }
        }
    }
    export default {
        name: 'addPictures',
        props: {
            maxSelect: {
                type: Number,
                default: 3
            },
        },
        data() {
            return {
                // 专门存放读取成功后的base64URL
                imgList: [],
                // 默认为三张
                limit: 0,
                size: 0,
                // 发送这个至后端
                formData: new FormData(),
                // 这个存的是读取时的file结构
                previewList: [],
                // 加载中弹出框
                loadingPopVisible: false,
                // 预览图片弹出框
                previewPopVisible: false,
                preDelInfo: {
                    // 预览或删除的url
                    url: null,
                    // 图片Index 删除用
                    index: null,
                },
                // 将上传的图片进行保存一份至当前组件 方便删除同步
                curPics:[],
            }
        },
        created() {
            this.limit = this.maxSelect;
        },
        methods: {
            // 显示input功能
            chooseType() {
                console.log('choose pictures');
                this.$refs.upload_file.click();
            },
            // 选择图片
            fileChange(ev) {
                // 大小为0 判断异常
                if (!ev.target.files[0].size) return;
                // 将files数组进行遍历读取
                let files = ev.target.files;
                // console.log('fileLen--',files.length);
                if (files.length > this.limit) {
                    return this.$message({
                        message: '已超过上传数量6张限制'
                    })
                }
                // 构造imgList
                const zeroArr =new Array(files.length).fill('J');
                // 起始的偏移索引位置
                let baseIndex = this.imgList.length;
                this.imgList= this.imgList.concat(...zeroArr)
                // console.log('imL--',this.imgList);
                files.forEach((file,picIndex) => this.fileAdd(file,picIndex+baseIndex))
                // console.log('previewList---',this.previewList);
                // 这里调用发送图片的API
                // console.log('调用发图片--');
                this.sendPicturesData(files)
                // 清空选择的值(可以选相同照片)
                ev.target.value = '';

            },
            fileAdd(file,picIndex) {
                // console.log('file--',file);
                //判断是否为图片文件
                if (file.type.indexOf('image') == -1) {
                    return this.$message({
                        message: '请选择图片文件'
                    })
                }
                // 限制上传图片为2MB
                if (file.size > 2 * 1024 * 1024) {
                    return this.$message({
                        message: '图片大小不能超过2MB'
                    })
                }
                // 上传数量-1
                this.limit--;

                // 先进行备份 后面留置formData使用
                this.previewList.push(file)
                // 生成配置函数
                const evConfig = this.produceEvConfig(this,picIndex)
                let reader = new PartFileReader(file, 'readAsArrayBuffer', evConfig)

                //总大小
                this.size += file.size;
            },
            // 删除图片
            delImg() {
                const {
                    index
                } = this.preDelInfo
                this.size -= this.previewList[index].size;
                this.previewList.splice(index, 1);
                // 删除图片
                this.curPics.splice(index,1);
                // 像父组件进行同步
                this.$emit('pics',this.curPics);
                this.imgList.splice(index, 1);
                this.limit = this.maxSelect - this.imgList.length;
                // 关闭预览弹出框
                this.previewPopVisible = false;
            },
            // 查看图片 
            previewPicture(url, index) {
                this.preDelInfo.url = url;
                this.preDelInfo.index = index;
                this.$refs.pictureBox.style.backgroundImage = `url(${url})`;
                // console.log('ccc~', this.preDelInfo);
                this.previewPopVisible = true;
            },
            // 发送图片
            sendPictures() {
                console.log('OK');
                console.log(this.previewList);
                if (this.previewList.length > 0) {
                    // 往formData表单数组添加图片信息
                    this.previewList.forEach(file => {
                        this.formData.append('files', file, file.name)
                    })
                    return this.formData
                } else {
                    return []
                }
            },
            // 上传图片至服务器
            async sendPicturesData(files) {
                // 往formData表单数组添加图片信息
                files.forEach(file => {
                    this.formData.append('files', file, file.name)
                })
                const res = await this.$http.post('/info/view/uploadImg', this.formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).catch(err => {
                    console.log(err);
                })
                // 这里是请求错误
                if (!res) {
                    return this.sendErr()
                }
                // 解构出图片
                const {
                    data: pictures
                } = res
                // 这里是返回出错
                if (pictures.length < 1) {
                    return this.sendErr()
                }
                // 清空FORMDATA
                this.formData.delete('files')
                // console.log('pics====',pictures);
                // 保存
                this.curPics.push(...pictures);
                // this.imgList.push(...pictures);
                // this.loadingPopVisible = false;
                // 同步至父组件中
                this.$emit('pics', this.curPics)
            },
            // 修改进度条和修改data数据
            produceEvConfig(vue,picIndex) {
                let buffer = [];
                return {
                    loadStart(e, percent) {
                        vue.$refs.loadingLi.innerText = `${percent}%`
                        vue.loadingPopVisible = true;

                    },
                    progress(e) {},
                    load(e, loaded, total, fileType, percent) {
                        // 如果在读取的基础上写上传的话在这里获取读取成功的文件切片
                        // e.target.result //当前文件切片的数据
                        buffer.push(e.target.result)
                        // （但是千万别在这里直接写网络请求，本地读取的速度远远大于网络请求，直接请求一个文件就会在瞬间发起大量请求）
                        // （最好的处理方式是将切片数据写入一个有序列表中，然后通过控制网络请求数量来实现）
                        if (loaded < total) {
                            vue.$refs.loadingLi.innerText = `${percent}%`
                        } else {
                            // 关闭加载框
                            vue.loadingPopVisible = false;
                            // 组合碎片
                            let merge = new Blob(buffer, {
                                type: fileType
                            });
                            let newReader = new FileReader()
                            newReader.onload = (e) => {
                                // base64的图片形式
                                let url = e.target.result;
                                // console.log('url---',url);
                                // console.log('vue---',vue.imgList);
                                vue.$nextTick(()=> {
                                    // 对号入座
                                    // vue.imgList[picIndex] = url;
                                    vue.imgList.splice(picIndex,1,url)
                                })
                                // vue.imgList.push(
                                //     url
                                // );
                                // 对号入座
                                // vue.imgList[picIndex] = url;
                                // vue.imgList.splice(picIndex,1,url)
                            }
                            newReader.readAsDataURL(merge)

                        }
                    },
                    loadend(e) {},
                    abort(e) {},
                    error(e) {
                        // 关闭加载框
                        vue.loadingPopVisible = false;
                        // 弹出错误框
                        vue.$message({
                            message: '文件读取出错误(~0v0~)'
                        })
                    }
                }
            },
            // 提交数据时重置formData previewList可以不清空 保存图片的存在
            // 由父组件进行调用
            deleteFormData() {
                if (this.formData.has('files')) {
                    this.formData.delete('files')
                }
            },
        },

        computed: {
            showAddBtn() {
                return this.limit > 0
            },
            showImgList() {
                // console.log('触发--');
                return this.imgList[0] !== 'J'
            },
            realImgList() {
                return this.imgList.filter((img)=>img!=='J')
            }
        },
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    .addPictures {
        .show-img {
            width: 100%;

            >p {
                color: #999;
            }

            .img-list {
                display: flex;
                flex-flow: row wrap;

                >li {
                    // border: 1px solid red;
                    flex: 0 0 calc((100vw - .55rem *3 - 1.8rem)/3);
                    height: calc((100vw - .55rem *3 - 1.8rem)/3);
                    text-align: center;
                    position: relative;
                    margin-right: .55rem;
                    margin-bottom: .55rem;

                    >img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }
                }

                >li.loadingLi {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #333;
                    color: #fff;
                }

                >li.add-image-btn {
                    padding-top: 1.8rem;
                    border: 1px dashed rgba(0, 0, 0, .2);
                }

                .del {
                    position: absolute;
                    width: 18px;
                    height: auto;
                    top: 0;
                    right: 0;
                    z-index: 999
                }
            }

        }

        .mint-popup {
            width: 30%;
            height: 7rem;
            background-color: hsla(0, 0%, 7%, .7);
            border-radius: .3rem;

            .loading-toast {
                height: 100%;
                display: flex;
                flex-flow: column;
                justify-content: center;
                align-items: center;

                >p {
                    color: #fff;
                    margin-top: .5rem;
                    font-size: .9rem;
                }
            }
        }

        ::v-deep .v-modal {
            background: #fff;
            opacity: 0;
        }

        .mint-popup.previewPicture {
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, .95);
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            div.pictureBox {
                flex-grow: 1;
                width: 100%;
                // display: flex;
                // justify-content: center;
                // align-items: center;
                // background-image: url('../../../assets/imgs/long.jpg');
                background-position: center;
                background-repeat: no-repeat;
                background-size: contain;

            }

            div.deleteBox {
                color: #fff;
                height: 3.2rem;
                min-height: 3.2rem;
                line-height: 3.2rem;
                flex-basis: 3.2rem;
                flex-shrink: 0;
                flex-grow: 0;
                width: 100%;
                text-align: center;
                background: #374045;

                >span {
                    vertical-align: middle;
                }
            }
        }
    }
</style>