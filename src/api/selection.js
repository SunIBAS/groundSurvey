// const {
//     listToTree
// } = require('./../utils/buildTree');
import { Loading } from 'element-ui';
const getLandType = `${window.config.baseApiUrl}/land-type`;
const getLandForm = `${window.config.baseApiUrl}/land-attribute`;

const dearError = () => {};

const toFetch = (url,options) => {
    let loading = Loading.service({ fullscreen: true });
    return fetch(url,options || {}).then(_ => _.json()).then(ret => {
        loading.close();
        if (ret.code === 200) {
            return ret.data;
        } else {
            dearError(ret);
        }
    }).catch(e => {
        dearError(e);
        loading.close();
    });
}

const getMenus = () => {
    return toFetch(getLandType,{}).then(data => {
        return data;
    })
};
// form: [
//     {
//         label: '水田作物',
//         id: '',
//         options: buildOption(['水稻','莲藕','休耕','撂荒',],[
//             {
//                 id: 'add',
//                 type: 'add',
//                 label: '添加其他'
//             }
//         ])
//     },
// ]
const getForm = (landTypeId) => {
    return toFetch(getLandForm + `?landTypeId=${landTypeId}`,{
        method: 'get',
        // data: JSON.stringify({landTypeId})
    });
};

export {
    getMenus,
    getForm
}
