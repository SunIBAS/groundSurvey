<template>
    <el-drawer :visible.sync="drawer" size="100%" direction="btt" title="帮助/Help" :modal="false">
        <div style="padding: 5px 20px;">
            <div class="AuthGeoLocation-title">苹果设备(iPhone/iPad)启用位置权限</div>
            <div class="AuthGeoLocation-title">Apple devices (iPhone/iPad) turn Location Services on.</div>
            <el-alert
                title="苹果设备请使用Safari。 Please use safari."
                type="success"
                :closable="false">
            </el-alert>
            <div class="AuthGeoLocation-Menu">步骤一/Step One</div>
            <div style="margin-bottom: 5px;"><a href="https://support.apple.com/zh-cn/HT207092" target="_blank">[中文] 在 iPhone、iPad 或 iPod touch 上打开或关闭定位服务和 GPS</a></div>
            <div style="margin-bottom: 5px;"><a href="https://support.apple.com/en-us/HT207092" target="_blank">[English] Turn Location Services and GPS on or off on your iPhone, iPad, or iPod touch</a></div>
            <div class="AuthGeoLocation-Menu">步骤二/Step Two</div>
            <div style="margin-bottom: 5px;">为该网站授权/Authorize this site</div>
            <div class="AuthGeoLocation-Img" style="background-image: url('./img/iphone_location_1.jpg');"></div>
            <div class="AuthGeoLocation-Img" style="background-image: url('./img/iphone_location_2.jpg');"></div>
        </div>
    </el-drawer>
</template>

<script>
export default {
    name: "AuthGeoLocation",
    data() {
        return {
            drawer: false,
        }
    }
}
</script>

<style>
.AuthGeoLocation-title {
    margin: 5px 0 15px;
    text-align: center;
    font-size: 24px;
}
.AuthGeoLocation-Menu {
    font-size: 20px;
    font-weight: bold;
    margin: 20px 0 10px;
}
.AuthGeoLocation-Img {
    background-size: contain;
    width: 100vw;
    height: 100vh;
    background-repeat: no-repeat;
}
</style>