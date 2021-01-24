<template>
    <div class="test">
        <input ref='upload_file' accept="image/*" @change="fileChange($event)" type="file" multiple
            style="display: none" />



        <div class="show-img">
            <ul class="img-list">
                <li v-for="(url,index) in imgList" :key="index">
                    <img class="del" src="../assets/imgs/money.png" @click.stop="delImg(index)" />
                    <img :src="url.file.src">
                </li>

                <!-- 添加图片按钮 -->
                <li class="add-image-btn" align="center" @click="chooseType" v-show="showAddBtn">
                    <span>+</span>
                    <p>添加图片</p>
                </li>
            </ul>
        </div>

        <div>
            <!-- <progress ref="progress" value="0" max="100"></progress> -->
            <p ref='testG'></p>
        </div>
    </div>
</template>

<script>
    function PartFileReader(files, type, event) {
        this.files = files; //inputObj.files[0]
        this.type = type; //配置FileReader读取文件的方法
        this.event = event; //配置读取文件时需要触发的事件
        this.total = files.size; //获取文件大小
        this.step = 1024 * 2; //1MB（单片大小/一兆）
        this.loaded = 0; //文件当前读取进度
        this.reader = new FileReader(); //实际读取文件的FileReader对象实例
        this.abort = this.reader.abort; //中断文件读取（可以通过中断文件读取事件保留切片数据，实现下一次可以在原读取位置继续开始读取）
        this.readPartFile(this.loaded); //开启读取文件
        this.bindEvent(); //绑定FileReader文件读取
    }
    //给切片读取对象原型上添加FileReader获取读取类型，开启读取文件
    PartFileReader.prototype.readPartFile = function (start) {
        if (this.files.slice) {
            var file = this.files.slice(start, this.loaded + this.step);
            switch (this.type) {
                case 'readAsBinaryString':
                    this.reader.readAsBinaryString(file);
                    break;
                case 'readAsDataURL':
                    this.reader.readAsDataURL(file);
                    break;
                case 'readAsArrayBuffer':
                    this.reader.readAsArrayBuffer(file);
                    break;
                case 'readAsText':
                    this.readAsText(file);
                    break;
            }
        }
    }
    //给切片读取对象原型上绑定FileReader对象事件
    PartFileReader.prototype.bindEvent = function () {
        var self = this;
        this.reader.onloadstart = function (e) {
            self.event.loadStart && self.event.loadStart.call(this, e, self.loaded);
        }
        this.reader.onprogress = function (e) {
            self.event.progress && self.event.progress.call(this, e);
        }
        this.reader.onload = function (e) {
            // 切片读取文件有别于非切片读取，切片读取的文件读取状态需要在每个切片读取成功后再刷新读取进度
            self.loaded += e.loaded;
            self.event.load && self.event.load.call(this, e, self.loaded, self.total);
            if (self.loaded < self.total) {
                self.readPartFile(self.loaded);
            }
        }
        this.reader.onloadend = function (e) {
            self.event.loadend && self.event.loadend.call(this, e);
        }
        this.reader.onabort = function (e) {
            self.event.abort && self.event.abort.call(this, e);
        }
    }

    export default {
        data() {
            return {
                imgList: [],
                limit: 6,
                size: 0,
                loaded: 0,
                // 发送这个至后端
                formData: new FormData(),
            }
        },
        methods: {

            fileChange(ev) {
                console.log(ev);
                // 大小为0？
                if (!ev.target.files[0].size) return;
                // 目标元素对象传入?
                this.fileList(ev.target);
                // 清空选择的值
                ev.target.value = ''

            },
            fileList(targetObj) {
                let files = targetObj.files;
                // 没有必要判断是否是文件夹 因为不开启这个功能
                files.forEach(file => {
                    this.fileAdd(file)
                });
            },
            fileAdd(file) {
                //判断是否为图片文件
                /* if (file.type.indexOf('image') == -1) {
                    return this.$message({
                        message: '请选择图片文件'
                    })
                } */
                console.log('遍历文件--', file);
                if (this.limit !== undefined) this.limit--;
                if (this.limit !== undefined && this.limit < 0) return;
                this.formData.append("files", file, file.name);
                let _this = this;
                // let reader = new FileReader();
                // let image = new Image();
                // let _this = this;

                // 1M= 1024K = 1024 * 1024B
                //   reader.onprogress = function (e) {
                //       console.log('e---', e);
                //       // _this.loaded += e.loaded;
                //       _this.$refs.progress.value = (e.loaded / e.total) * 100;
                //   }
                /*   reader.onload = function (ev) {
                    file.src = ev.target.result;
                    // console.log(typeof ev.target.result);
                    console.log(ev.target.result);
                    let findIdx = file.src.indexOf('base64');
                    // console.log(findIdx);
                    let startStr = file.src.substring(0, findIdx + 7);
                    let tempS = file.src.substring(findIdx + 7);
                    //  console.log(startStr, tempS);
                    console.log((startStr + tempS) === file.src);
                    _this.imgList.push({
                        file
                    });
                    console.log(_this.imgList);
                }
                reader.readAsDataURL(file);
 */
                let buffer = [];
                console.log(buffer, '--?');
                let reader = new PartFileReader(file, 'readAsArrayBuffer', {
                    loadStart: function (e, loaded) {
                        // console.log('111', loaded) ;
                        // progressTextObj.innerText = `hhh正在读取文件(${loaded}%)...`;
                        _this.$refs.testG.innerText = '正在读取文件0%';
                    },
                    progress: function (e) {},
                    load: function (e, loaded, total) {
                        // 如果在读取的基础上写上传的话在这里获取读取成功的文件切片
                        // e.target.result //当前文件切片的数据
                        console.log(e.target.result, '---1');
                        buffer.push(e.target.result)
                        // （但是千万别在这里直接写网络请求，本地读取的速度远远大于网络请求，直接请求一个文件就会在瞬间发起大量请求）
                        // （最好的处理方式是将切片数据写入一个有序列表中，然后通过控制网络请求数量来实现）
                        var precent = Math.round(loaded / total * 100);
                        // progressSpanObj.style.width = precent / 100 * 300 + 'px';
                        if (precent < 100) {
                            _this.$refs.testG.innerText = '正在读取文件(' + precent + '%)...';
                        } else if (precent == 100) {

                            _this.$refs.testG.innerText = '文件读取完成(100%)';
                            let nowTime = Date.now();
                            console.log(nowTime, '000');
                            let merge = new Blob(buffer, {
                                type: "image/jpeg"
                            });
                            let newReader = new FileReader()
                            newReader.onload = (e) => {
                                let endTime = Date.now()
                                console.log(endTime - nowTime, '??');
                                let url = e.target.result;
                                file.src = url;
                                _this.imgList.push({
                                    file
                                });
                                console.log(_this.imgList);
                            }
                            newReader.readAsDataURL(merge)

                        }
                    },
                    loadend: function (e) {},
                    abort: function (e) {},
                    error: function (e) {
                        _this.$refs.testG.innerText = "文件读取出错误(~0v0~)";
                    }
                })














                //总大小
                this.size += file.size;
            },
            chooseType() {
                console.log('choose pictures');
                this.$refs.upload_file.click();
            },
            delImg(index) {
                console.log('delete--', index);
                this.size -= this.imgList[index].file.size; //总大小
                console.log(this.size, '--');
                this.imgList.splice(index, 1);
                this.limit = 6 - this.imgList.length;
            }
        },
        computed: {
            showAddBtn() {
                return this.limit > 0
            }
        }
    }
</script>

<style scoped lang='scss'>
    /* @import url(); 引入css类 */
    .test {





        .show-img {
            width: 100%;
            padding: 10px;

            >p {
                color: #999;
            }

            .img-list {
                border: 1px solid red;
                display: flex;
                flex-flow: row wrap;

                >li {
                    border: 1px solid red;
                    flex: 0 0 calc((100vw - .55rem *3 - 1.8rem)/3);
                    height: calc((100vw - .55rem *3 - 1.8rem)/3);
                    text-align: center;
                    position: relative;
                    margin-right: .55rem;
                    margin-bottom: .55rem;

                    >img {
                        width: 100%;
                        height: 100%;
                    }
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
    }
</style>