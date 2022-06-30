const getPosition = function() {
    return new Promise((s,f) => {
        if(navigator.geolocation){
            //navigator.geolocation.getCurrentPosition这个方法里面有三个参数
            //这个会在界面拉出一个消息框，让用户确认是否允许获取位置,不过pc端我试了都是err，
            //参1，成功后执行的函数
            //参2，失败时执行的函数
            //参3，选项配置，下面是在3000毫秒内结束请求
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    var latitude = position.coords.latitude;//纬度
                    var longitude = position.coords.longitude;//经度
                    // info.innerHTML += "Latitude : " + latitude + " Longitude: " + longitude;
                    // info.innerHTML += '<br>' + JSON.stringify(position);
                    s({
                        lat: latitude,
                        lng: longitude
                    });
                },
                function (err) {
                    // info.innerHTML += "您的浏览器不支持此项技术"
                    f(err.message);
                },
                {timeout : 3000}
            )
        } else {
            f('您的浏览器不支持此项技术')
        }
    })
}
export {
    getPosition
}
