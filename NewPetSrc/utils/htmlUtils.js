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

export {
    readFileAsDataURL
}
