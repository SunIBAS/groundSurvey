import { Loading } from 'element-ui';
import { Notification } from 'element-ui';
import {
    Storage
} from "../utils/storage";

const loginUrl = `${window.config.baseApiUrl}/user/login`;
export const toLogoutAndReload = (url,ret) => {
    // todo 这里比较粗暴，因为这里本来不应该是这样子的
    if (url === loginUrl) {
        return;
    }
    if (ret.code !== 200) {
        setTimeout(() => {
            Storage.set_user_info(null);
            // window.location.reload();
        },2000);
    }
};
const dearError = msg => {
    Notification({
        title: 'Error',
        message: msg,
        offset: 100,
    });
};
const request = (url,options,noWithToken) => {
    let loading = Loading.service({ fullscreen: true });
    if (!noWithToken) {
        if (!options) {
            options = {};
        }
        if (!options.headers) {
            options.headers = {};
        }
        if (url !== loginUrl) {
            options.headers.token = Storage.get_user_info();
            options.headers.withcredentials = true;
        }
    }
    return fetch(url,options || {}).then(_ => _.json()).then(ret => {
        loading.close();
        if (ret.code === 200) {
            return ret.data;
        } else {
            // dearError(ret.msg || ret.error);
            throw new Error(ret.msg || ret.error);
            // toLogoutAndReload(url,ret);
        }
    }).catch(e => {
        toLogoutAndReload(url,{code:500});
        dearError(e.message);
        loading.close();
    });
}
const requestImage = url => {
    let loading = Loading.service({ fullscreen: true });
    url  = `${window.config.baseApiUrl}${url}`;
    console.log(`[img]:${url}`)
    return fetch(url,{
        // responseType: 'blob',
        method: 'get',
        headers: {
            token : Storage.get_user_info(),
            withcredentials : true,
        }
    }).then(_=>_.blob()).then(_ => {
        loading.close();
        return URL.createObjectURL(_);
    }).catch(e => {
        dearError(e.message);
        loading.close();
    });
}
const requestPostWithData = (url,data,method,noWithToken) => {
    return request(url,{
        method: method || 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    },noWithToken);
}

export {
    request,
    requestPostWithData,
    loginUrl,
    requestImage
}
