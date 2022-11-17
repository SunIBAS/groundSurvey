import * as PureApi from './apis'
import * as NativeApi from './nativeApi'
import {DbMessage, otherRecordIds} from "./nativeApi";
import {
    Base64ToJpegFile,
    Obj2Str, Str2Obj
} from "../utils/htmlUtils";
import {
    requestImage as ri
} from "./request";

const _selectApi = (pure,native) => {
    return function (a,b,c,d,e,f,g) {
        if (window.hbuilder && window.offline) {
            return native(a,b,c,d,e,f,g);
        } else {
            return pure(a,b,c,d,e,f,g);
        }
    }
}

const _selectApiWithCache = (pure,native,id) => {
    return function (a,b,c,d,e,f,g) {
        if (window.hbuilder && window.offline) {
            return native(a,b,c,d,e,f,g).then(_ => {
                if (typeof _.content === "string") {
                    return Str2Obj(_.content);
                } else {
                    return _;
                }
            });
        } else {
            let tid = id;
            if (typeof id === "function") {
                tid = id(a,b,c,d,e,f,g);
            }
            return pure(a,b,c,d,e,f,g).then(ret => {
                return DbMessage('other','insert',{
                    id: tid,content: Obj2Str(ret),
                }).then(() => {
                    return ret;
                });
            });
        }
    }
}


// todo 修改 api 使用情况
export const CreateRecord = _selectApi(PureApi.CreateRecord,NativeApi.CreateRecord);
// export const UpdateRecord = _selectApi(PureApi.UpdateRecord,NativeApi.UpdateRecord);
export const UpdateRecord = obj => {
    obj.id = obj.id + '';
    if (obj.id.indexOf('_') !== -1) {
        return NativeApi.UpdateRecord(obj);
    } else {
        return PureApi.UpdateRecord(obj);
    }
}
// export const GetRecord = _selectApi(PureApi.GetRecord,NativeApi.GetRecord);
export const GetRecord = id => {
    id = id + '';
    if (id.indexOf('_') !== -1) {
        return NativeApi.GetRecord(id);
    } else {
        return PureApi.GetRecord(id);
    }
}
// export const GetRecordList = _selectApi(PureApi.GetRecordList,NativeApi.GetRecordList);
export const DeleteRecordById = id => {
    id = id + '';
    if (id.indexOf('_') !== -1) {
        return NativeApi.DeleteRecordById(id);
    } else {
        return PureApi.DeleteRecordById(id);
    }
}
// export const DeleteRecordById = _selectApi(PureApi.DeleteRecordById,NativeApi.DeleteRecordById);

export const GetLandType = _selectApiWithCache(PureApi.GetLandType,NativeApi.GetLandType,otherRecordIds.GetLandType);
export const GetCropType = _selectApiWithCache(PureApi.GetCropType,NativeApi.GetCropType,otherRecordIds.GetCropType);
export const GetDiseaseType = _selectApiWithCache(PureApi.GetDiseaseType,NativeApi.GetDiseaseType,otherRecordIds.GetDiseaseType);
export const GetPestType = _selectApiWithCache(PureApi.GetPestType,NativeApi.GetPestType,otherRecordIds.GetPestType);
export const GetSeverity = _selectApiWithCache(PureApi.GetSeverity,NativeApi.GetSeverity,otherRecordIds.GetSeverity);
export const GetLandAttribute = _selectApiWithCache(PureApi.GetLandAttribute,NativeApi.GetLandAttribute,(id) => {
    return otherRecordIds.GetLandAttribute + `_` + id
});

export const UploadImage = (img,dir,offline) => {
    if (offline) {
        return NativeApi.UploadImage(img);
    } else {
        return PureApi.UploadImage(img,dir);
    }
}
// export const UploadImage = _selectApi(PureApi.UploadImage,NativeApi.UploadImage);
const UploadDDPImage = (pureApi,nativeApi) => {
    return (recordId,imageId,offline) => {
        if (offline) {
            return nativeApi(recordId,imageId);
        } else {
            return pureApi(recordId,imageId);
        }
    }
}
export const UploadDiseaseImage = UploadDDPImage(PureApi.UploadDiseaseImage,NativeApi.UploadDiseaseImage);
export const UploadDroughtImage = UploadDDPImage(PureApi.UploadDroughtImage,NativeApi.UploadDroughtImage);
export const UploadPestImage = UploadDDPImage(PureApi.UploadPestImage,NativeApi.UploadPestImage);

export const DeleteImage = (type,id) => {
    id = id + '';
    if (id.indexOf('_') !== -1) {
        // return NativeApi.DeleteRecordById(id);
        // todo 删除本地图片
    } else {
        return PureApi.DeleteImage(type,id);
    }
}

export const requestImage = url => {
    if (url.startsWith('img-db:')) {
        return NativeApi.requestImage(url);
    } else {
        return ri(url);
    }
}

// 将本地的图片上传到服务器
// tmpObj 是 AddOnePointDetail 总的 tmp 对象
// tmpObj = {
//     diease: [
//         {
//             id: '',
//             imageUrl: '',
//             recordId: ''
//         }
//     ],
//      drought: [],
//      pest: [],
// }
import {
    Dirs
} from "./apis";
import {
    runPromiseByArrReturnPromise
} from "../utils/htmlUtils";
import {
    NUI
} from "../utils/Message";

const UploadImageMethod = {
    [Dirs.disease]: UploadDiseaseImage,
    [Dirs.pest]: UploadPestImage,
    [Dirs.drought]: UploadDroughtImage,
};
export const UploadImageFromLocal = (tmpObj,recordId) => {
    let images = [];
    let count = 0;
    for (let i in tmpObj) {
        tmpObj[i].forEach(img => {
            count++;
            images.push({
                type: i,
                dir: Dirs[i],
                localImageId: img.id,
                localImageUrl: img.imgUrl,
            });
        });
    }
    if (count) {
        NUI.toast(`总共(total) ${count} 图片(Picture(s)) 需要上传(should be upload)`);
    }
    let timer = 1;
    return runPromiseByArrReturnPromise(imageOObj => {
        return NativeApi.requestImage(imageOObj.localImageUrl).then(base64 => {
            let binary = Base64ToJpegFile(base64);
            PureApi.UploadImage(binary, imageOObj.dir).then(ret => {
                return UploadImageMethod[imageOObj.type](recordId,ret).then(r => {
                    NUI.toast(`已经完成${timer}张(${timer} picture(s) over)`,{
                        duration: '0.2s'
                    });
                    timer++;
                    return r;
                });
            });
        });
    },images,);
}
