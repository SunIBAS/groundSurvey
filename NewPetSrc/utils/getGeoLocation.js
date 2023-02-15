import { Loading } from 'element-ui';
import { Notification } from 'element-ui';
import {
    MessageType,
    Message
} from "./Message";
import {checkAppleDevices} from "./checkHeight";

const showError = msg => {
    Notification({
        title: 'Error',
        message: `[Location Fetch]:${msg}`,
        offset: 100,
    });
}
const tryAutoPermissionForLocation = function () {
    return navigator.permissions.query({ name: 'geolocation' }).then(function(result) {
        // Will return ['granted', 'prompt', 'denied']
        const permission = result.state;
        alert(JSON.stringify(result));
        if ( permission === 'granted' || permission === 'prompt' ) {
            return true;
        }
    });
}
const getPosition_native = function() {
    let loading = Loading.service({ fullscreen: true });
    return new Promise((s) => {
        loading.close();
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
                    showError(err.message)
                    // s({
                    //     lat: -1,
                    //     lng: -1
                    // })
                    if (checkAppleDevices()) {
                        window.openAuthGeoLocationDrawer();
                        return true;
                    } else {
                        return tryAutoPermissionForLocation()/*.then(() => {
                        }); */
                    }
                },
                {timeout : 3000}
            )
        } else {
            s({
                lat: -1,
                lng: -1
            })
            showError('您的浏览器不支持此项技术');
        }
    })
}

const getPosition_android = function () {
    let loading = Loading.service({ fullscreen: true });
    return Message(MessageType.position).then((data) => {
        loading.close();
        if (data.error) {
            showError(data.error);
            return {
                lat: -1,lng: -1
            }
        } else {
            if (data.data) {
                data = data.data;
            } else {
                data = data.position;
            }
            // alert(JSON.stringify(data));
            return {
                lat: data.latitude,
                lng: data.longitude
            };
        }
    })
}

const getPosition = function () {
    if (window.hbuilder) {
        return getPosition_android();
    } else {
        return getPosition_native();
    }
};

export {
    getPosition
}
