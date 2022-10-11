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
