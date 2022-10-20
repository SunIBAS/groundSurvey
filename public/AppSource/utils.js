// 判断是否联网
window.isNetConnection = function(){
    if(plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE){
        return false;
    }
    return true;
};
window.addNetworkEvent = function () {
    document.addEventListener("netchange", function(){
        if(!window.isNetConnection()){
            // 网络异常处理，比如取消上拉动作等
            $.toast(" 请检查网络连接 ");
        }
    }, false);
}

function RequestPermission() { // 这里一定要加上  不然会报push 未定义
    return new Promise(s => {
        plus.android.requestPermissions(['android.permission.CAMERA'], function(e){
            if(e.deniedAlways.length>0){    //权限被永久拒绝
                // 弹出提示框解释为何需要定位权限，引导用户打开设置页面开启
                alert('相机权限用于上传调查图片(Camera be used to upload servery image)')
                //上面打开权限后，这里直接重启APP
                plus.runtime.restart();
            }
            if(e.deniedPresent.length>0){   //权限被临时拒绝
                // 弹出提示框解释为何需要定位权限，可再次调用plus.android.requestPermissions申请权限
                //alert('临时 ');
            }
            if(e.granted.length>0){ //权限被允许
                //调用依赖获取定位权限的代码
                //alert('允许!!! ');

            }
        }, function(e){
            alert('Request Permissions error:'+JSON.stringify(e));
        });
    })
}
