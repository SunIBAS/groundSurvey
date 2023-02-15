<template>
    <div v-show="show">
        <div class="help-close">
            <div v-if="currentInd === 0">
                <div class="btn" @click="$refs.carousel.setActiveItem(currentInd + 1)">下一页<Br/>Next.</div>
            </div>
            <div v-else-if="showCloseBtn">
                <div class="btn" @click="$refs.carousel.setActiveItem(currentInd - 1)" style="margin-right: 10px;">上一页<Br/>Previous.</div>
                <div class="btn" @click="show=false;" style="width: 160px;">开始使用<Br/>Begin to use.</div>
            </div>
            <div v-else>
                <div class="btn" @click="$refs.carousel.setActiveItem(currentInd - 1)" style="margin-right: 10px;">上一页<Br/>Previous.</div>
                <div class="btn" @click="$refs.carousel.setActiveItem(currentInd + 1)">下一页<Br/>Next.</div>
            </div>
        </div>
        <div class="help" :style="helpStyle">
            <el-carousel class="help-contain" @change="change" ref="carousel"
                         arrow="never" :loop="false" :autoplay="false">
                <el-carousel-item>
                    <div class="help-img-div" style="background: url('./img/主页面.jpg')"></div>
<!--                    <img :style="imageMargin" class="help-img" src="./../assets/主页面.jpg"/>-->
                </el-carousel-item>
                <el-carousel-item>
                    <div class="help-img-div" style="background: url('./img/记录第一页.jpg')"></div>
<!--                    <img :style="imageMargin" class="help-img" src="./../assets/记录第一页.jpg"/>-->
                </el-carousel-item>
                <el-carousel-item>
                    <div class="help-img-div" style="background: url('./img/记录第二页.jpg')"></div>
<!--                    <img :style="imageMargin" class="help-img" src="./../assets/记录第二页.jpg"/>-->
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

// let calcImageLocation = () => {
//     let wh = window.innerHeight;
//     let ww = window.innerWidth;
//     let iw = 893;
//     let ih = 1559;
//     let rw = iw / ww;
//     let rh = ih / wh;
//     let r = 0;
//     if (rw > rh) {
//         r = rw;
//     } else {
//         r = rh;
//     }
//     let lPadding = (ww - iw / r) / 2;
//     let tPadding = (wh - ih / r) / 2;
//     if (lPadding < 2) lPadding = 0;
//     if (tPadding < 2) tPadding = 0;
//     // debugger
//     return {
//         marginTop: tPadding + 'px',
//         marginLeft: lPadding + 'px',
//     }
// };

// import {checkHeight} from "../utils/checkHeight";

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
            showCloseBtn: false,
            showPreBtn: false,
            showNextBtn: true,
            helpStyle: {
                height: window.maxHeight
            },
            currentInd: 0
        }
    },
    methods: {
        change(ind) {
            this.currentInd = ind;
            this.showCloseBtn = this.$refs.carousel.items.length === ind + 1;
            this.showPreBtn = ind > 0;
            this.showNextBtn = ind < this.$refs.carousel.items.length;
        }
    },
    mounted() {
        window.$Help = this;
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
.help-close>div {
    display: flex;
    width: 260px;
    margin: auto;
}
.help-close .btn{
    background: #1565c0;
    font-size: 20px;
    color: #fff8e1;
    margin: auto;
    width: 100px;
    border-radius: 8px;
    padding: 5px;
}
.help {
    position: fixed;
    top: 0;
    left: 0;
    height: 100dvh;
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
.help-img-div {
    width: 100%;
    height: 100%;
    background-size: contain !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
}
.help-img {
    max-width: 100%;
    max-height: 100%;
}
</style>