<template>
    <div v-show="show">
        <div class="help-close">
            <div class="btn" @click="show=false;" v-show="showCloseBtn">开始使用<Br/>Begin to use.</div>
        </div>
        <div class="help">
            <el-carousel class="help-contain" @change="change" ref="carousel"
                         arrow="always" :loop="false" :autoplay="false">
                <el-carousel-item>
                    <img :style="imageMargin" class="help-img" src="./../assets/主页面.jpg"/>
                </el-carousel-item>
                <el-carousel-item>
                    <img :style="imageMargin" class="help-img" src="./../assets/记录第一页.jpg"/>
                </el-carousel-item>
                <el-carousel-item>
                    <img :style="imageMargin" class="help-img" src="./../assets/记录第二页.jpg"/>
                </el-carousel-item>
            </el-carousel>
        </div>
    </div>
</template>

<script>
// const imgs = [
//     require('./../assets/主页面.jpg'),
//     require('./../assets/记录第一页.jpg'),
//     require('./../assets/记录第而页.jpg'),
// ];

let calcImageLocation = () => {
    let wh = window.innerHeight;
    let ww = window.innerWidth;
    let iw = 893;
    let ih = 1559;
    let rw = iw / ww;
    let rh = ih / wh;
    let r = 0;
    if (rw > rh) {
        r = rw;
    } else {
        r = rh;
    }
    let lPadding = (ww - iw / r) / 2;
    let tPadding = (wh - ih / r) / 2;
    if (lPadding < 2) lPadding = 0;
    if (tPadding < 2) tPadding = 0;
    // debugger
    return {
        marginTop: tPadding + 'px',
        marginLeft: lPadding + 'px',
    }
};

export default {
    name: "Help",
    data() {
        return {
            show: false,
            // imgs
            imageMargin: {
                marginLeft: 0,
                marginTop: 0,
            },
            showCloseBtn: false
        }
    },
    methods: {
        change(ind) {
            this.showCloseBtn = this.$refs.carousel.items.length === ind + 1;
        }
    },
    mounted() {
        let m = calcImageLocation();
        this.imageMargin.marginTop = m.marginTop;
        this.imageMargin.marginLeft = m.marginLeft;
        // let (document.getElementsByClassName('help')[0].clientHeight - document.getElementsByClassName('help-img')[0].clientHeight) / 2;
    }
}
</script>

<style>
.help-close {
    position: fixed;
    left: 0;
    bottom: 20px;
    z-index: 100001;
    text-align: center;
    width: 100%;
}
.help-close .btn{
    background: #4f95af;
    font-size: 20px;
    color: white;
    margin: auto;
    width: 160px;
    border-radius: 8px;
    padding: 5px;
}
.help {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    z-index: 100000;
    text-align: center;
    background: #46798c;
    display: table;
}
.help-contain {
    display: table-cell;
    vertical-align: middle;
}
.help .help-contain .el-carousel__container {
    width: 100%;
    height: 100%;
}
.help-img {
    max-width: 100%;
    max-height: 100%;
}
</style>