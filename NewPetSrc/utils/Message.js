export const MessageType = {
    xid: 'xid',
    tmpStorage: 'tmpStorage',
    position: 'position',
    db: 'db',
    dbinit: 'dbinit',
    image: 'image',
    nativeUI: 'nativeUI',
    map: 'map',
    openDownloadDom: 'open_map_download'
}

window.createId = (function () {
    let timer = 0;
    return function () {
        timer++;
        return `${new Date().getTime()}#${timer}`;
    }
})();
window.fnMap = {};
window.receiveFn = ({data}) => {
    if (data.id in window.fnMap) {
        window.fnMap[data.id] = data;
    }
};

window.addEventListener("message",data => {
    window.receiveFn(data);
},false);

export const Message = function (type,content) {
    let id = window.createId();
    window.fnMap[id] = null;
    return new Promise(s => {
        window.parent.postMessage({
            type,
            content: content || '',
            id,
        },"*");
        let _id = setInterval(() => {
            if (window.fnMap[id]) {
                s(window.fnMap[id]);
                clearInterval(_id);
                setTimeout(() => {
                    delete window.fnMap[id];
                },500);
            }
        },500);
    })
};

window.getMapBase64 = url => {
    let xyz = {};
    url.split('?')[1].split('&').forEach(a => {
        let aa = a.split('=');
        xyz[aa[0]] = +aa[1];
    });
    // let {x,y,z} = xyz;
    return Message(MessageType.map,xyz);
}

window.open_downloadDom = function () {
    return Message(MessageType.openDownloadDom,"");
}

const NativeUI = {
    toast(msg, option) {
        Message(MessageType.nativeUI,{
            name: 'toast',
            param: {
                option,
                content: msg,
            }
        });
    }
}

export const NUI = {
    toast(msg, option) {
        if (window.hbuilder) {
            NativeUI.toast(msg,option);
        } else {
            alert(msg);
        }
    }
}
