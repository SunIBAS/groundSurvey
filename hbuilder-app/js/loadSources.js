let sources = [
    'SelectImage.js',
    'FileStorage.js',
    'utils.js',
    'DefaultRequest.js',
    'hash.js',
    'Database.js',
    'MapDatabase.js',
    'DownloadMap.js',
    'Message.js',
]
// 执行一个队列的 promise 并以 promise 返回
/**
 * @param promise   要执行的 promise，可以自行封装一次
 * @param arr       数组，参数集合，记得和 promise 匹配
 * @param doPromiseReturn   如果需要对 promise 的结果进行处理，可以使用这个参数
 * @returns {Promise<unknown>}
 */
var runPromiseByArrReturnPromise = (promise,arr,doPromiseReturn) => {
    let doing = false;
    doPromiseReturn = doPromiseReturn || (_=>_);
    return new Promise(s => {
        let _id = setInterval(() => {
            if (!doing) {
                doing = true;
                if (arr.length) {
                    let id = arr.pop();
                    promise(id)
                        .then(o => {
                            doPromiseReturn(o,id);
                            doing = false;
                        });
                } else {
                    clearInterval(_id);
                    s();
                }
            }
        },500);
    });
};
const loadScript = function (url) {
    return new Promise(s => {
        let sc = document.createElement('script');
        sc.src = url;
        sc.onload = s;
        document.body.append(sc);
    });
}
const source_from = 'server';
const base_server_path = 'https://172.20.109.222:8081/AppSource/'
function loadSources() {
    if (source_from === 'server') {
        sources = sources.map(_ => `${base_server_path}${_}?t=${new Date().getTime()}`);
    } else {
        sources = sources.map(_ => `./js/${_}`);
    }
    sources = sources.reverse();
    return runPromiseByArrReturnPromise(loadScript,sources);
}
