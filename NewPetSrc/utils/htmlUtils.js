function readFileAsDataURL(file) {
    return new Promise((s,f) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(event) {
            s(event.target.result);
        };
        reader.onerror = function() {
            f('Unable to read ' + file.fileName);
        };
    })
}

export const Obj2Str = obj => {
    if (typeof obj === "undefined") {
        return obj;
    } else {
        return JSON.stringify(obj).replace(/"/g,'=-=-=');
    }
};
export const Str2Obj = str => {
    if (str) {
        return JSON.parse(str.replace(/=-=-=/g,'"'));
    } else {
        return {};
    }
}

export const File2Base64 = file => {
    return new Promise((s) => {
        let invoke = false;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            if (!invoke) {
                s(this.result);
                invoke = true;
            }
        }
        reader.onloadend = function (evt) {
            if (!invoke) {
                s(evt.target.result);
                invoke = true;
            }
        };
    });
}

export const Base64ToJpegFile = base64 => {
    //去掉url的头，并转换为byte
    var bytes=window.atob(base64.split(',')[1]);
    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob( [ab] , {type : 'image/jpeg'});
}

/**
 * @param promise   要执行的 promise，可以自行封装一次
 * @param arr       数组，参数集合，记得和 promise 匹配
 * @param doPromiseReturn   如果需要对 promise 的结果进行处理，可以使用这个参数
 * @returns {Promise<unknown>}
 */
export const runPromiseByArrReturnPromise = (promise,arr,doPromiseReturn) => {
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

// 输入经纬度
export const inputLatlng = function ($this) {
    let inputOne = function (title,df) {
        return $this.$prompt(title, '提示/Tip', {
            inputValue: df,
            confirmButtonText: '确定/Confirm',
            cancelButtonText: '取消/Cancel',
            inputPattern: /^[0-9.]+$/,
            inputErrorMessage: '只能是数字/Number Only'
        }).then(({ value }) => {
            return parseFloat(value);
        });
    }
    return function (defaultLat,defaultLng) {
        let result = {
            lng: -1,
            lat: -1
        };
        return inputOne("Longitude/经度",defaultLng).then(lng => {
            result.lng = lng;
            return inputOne('Latitude/纬度',defaultLat).then(lat => {
                result.lat = lat;
                return result;
            }).catch(() => {
                return null;
            });
        }).catch(() => {
            return null;
        });
    }
}

export {
    readFileAsDataURL
}
