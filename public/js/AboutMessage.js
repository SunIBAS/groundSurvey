window.createId = (function () {
    let timer = 0;
    return function () {
        timer++;
        return `map_${new Date().getTime()}#${timer}`;
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

window.getMapBase64 = (url) => {
    if (window.parent.parent === window) {
        return new Promise(s=>s(''));
    }
    let xyz = {};
    url.split('?')[1].split('&').forEach(a => {
        let aa = a.split('=');
        xyz[aa[0]] = +aa[1];
    });
    let {x,y,z} = xyz;
    let id = window.createId();
    window.fnMap[id] = null;
    return new Promise(s => {
        window.parent.parent.postMessage({
            type: 'map',
            content: {
                x,y,z
            },
            id,
        },"*");
        let _id = setInterval(() => {
            if (window.fnMap[id]) {
                s(window.fnMap[id].data);
                clearInterval(_id);
                setTimeout(() => {
                    delete window.fnMap[id];
                },500);
            }
        },500);
    })
}

// over = false;
// for (A = 0;!over && A < 100;A++) {
//     for (B = 0;!over && B < 100;B++) {
//         for (C = 0;!over && C < 100;C++) {
//             cut = 15 * A + 9 * B + C;
//             total = A + B + C;
//             if (cut == 300 && total == 100) {
//                 // over = true;
//                 console.log(`A = ${A}\tB= ${B}\tC = ${C}`)
//             }
//         }
//     }
// }
