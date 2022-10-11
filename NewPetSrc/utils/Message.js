export const MessageType = {
    xid: 'xid',
    tmpStorage: 'tmpStorage',
    position: 'position'
}

let createId = (function () {
    let timer = 0;
    return function () {
        timer++;
        return `${new Date().getTime()}#${timer}`;
    }
})();
let fnMap = {};
let receiveFn = ({data}) => {
    if (data.id in fnMap) {
        fnMap[data.id] = data;
    }
};

window.addEventListener("message",data => {
    receiveFn(data);
},false);

export const Message = function (type,content) {
    let id = createId();
    fnMap[id] = null;
    return new Promise(s => {
        window.parent.postMessage({
            type,
            content: content || '',
            id,
        },"*");
        let _id = setInterval(() => {
            if (fnMap[id]) {
                s(fnMap[id]);
                clearInterval(_id);
                setTimeout(() => {
                    delete fnMap[id];
                },500);
            }
        },500);
    })
};
