import {
    request, requestPostWithData
} from "./request";
import {
    Loading
} from "element-ui";

const _CreateRecord = `${window.config.baseApiUrl}/record/add`;
export const CreateRecord = obj => {
    obj["module"] = window.module;
    return request(_CreateRecord,{
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    });
};
const _UpdateRecord = `${window.config.baseApiUrl}/record/update`;
export const UpdateRecord = obj => {
    delete obj["module"]
    return request(_UpdateRecord,{
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    });
};
const _GetRecord = `${window.config.baseApiUrl}/record/get`;
export const GetRecord = id => {
    return request(`${_GetRecord}?id=${id}`);
};
const _GetRecordList = `${window.config.baseApiUrl}/record/page-get`;
export const GetRecordList = (pageNo,pageSize) => {
    let module = window.module;
    return request(`${_GetRecordList}?pageNo=${pageNo}&pageSize=${pageSize}&module=${module}`).then(data => {
        return data;
    });
}
const _GetRecordListNotPage = `${window.config.baseApiUrl}/record/get/record/time`;
export const GetRecordListNotPage = (timeFrom,timeTo) => {
    let module = window.module;
    return request(`${_GetRecordListNotPage}?startTime=${timeFrom}&endTime=${timeTo}&module=${module}`).then(data => {
        return data;
    });
    // let obj = {
    //     "success": true,
    //     "code": 200,
    //     "msg": "success",
    //     "r": [timeFrom,timeTo],
    //     "data": {
    //         "total": 2,
    //         "data": [
    //             {
    //                 "id": 76,
    //                 "surveyTime": 1667964574947,
    //                 "lat": 23.086715,
    //                 "lng": 114.423523,
    //             },
    //             {
    //                 "id": 75,
    //                 "userId": 14,
    //                 "surveyTime": 1667964569219,
    //                 "lat": 23.031136,
    //                 "lng": 114.388847,
    //             }
    //         ]
    //     }
    // };
    // return new Promise(s => s(obj));
}
const _DeleteRecordById = `${window.config.baseApiUrl}/record/delete`;
export const DeleteRecordById = id => request(`${_DeleteRecordById}?id=${id}`,{method: 'DELETE'});

// 作物类型管理
const _ListCrop = `${window.config.baseApiUrl}/Geo-Investigate/crop/get-variety`;
export const ListCrop = () => {
    return request(_ListCrop,{});
}

// land msg
const _LandType = `${window.config.baseApiUrl}/record/get/land/type`;
const _LandAttribute = `${window.config.baseApiUrl}/record/get/land/attribute`;

export const GetLandType = () => {
    let module = window.module;
    return request(`${_LandType}?module=${module}`,{}).then(data => {
        return data;
    })
};
export const GetLandAttribute = (landTypeId) => {
    let module = window.module;
    return request(_LandAttribute + `?landTypeId=${landTypeId}&module=${module}`,{
        method: 'get',
    });
};

window.GetLandAttribute = GetLandAttribute;

const _CropType = `${window.config.baseApiUrl}/record/get/crop/type`
export const GetCropType = () => {
    return request(_CropType,{});/*.then(data => {
        return data;
    })*/
}

const _DiseaseType = `${window.config.baseApiUrl}/record/get/disease/type`
export const GetDiseaseType = () => {
    return request(_DiseaseType);
}
// 病害图片
const _DiseaseImage = `${window.config.baseApiUrl}/record/add/disease/img`
export const UploadDiseaseImage = (recordId,imageUrl) => {
    return requestPostWithData(_DiseaseImage,{
        "imgUrl": imageUrl,
        "recordId": recordId,
    });
}
// 病害图片
const _DroughtImage = `${window.config.baseApiUrl}/record/add/drought/img`
export const UploadDroughtImage = (recordId,imageUrl) => {
    return requestPostWithData(_DroughtImage,{
        "imgUrl": imageUrl,
        "recordId": recordId,
    });
}

const _PestType = `${window.config.baseApiUrl}/record/get/pest/type`
export const GetPestType = () => {
    return request(_PestType);
}
const _PestImage = `${window.config.baseApiUrl}/record/add/pest/img`
export const UploadPestImage = (recordId,imageUrl) => {
    return requestPostWithData(_PestImage,{
        "imgUrl": imageUrl,
        "recordId": recordId,
    });
}

const _DeleteImage = `${window.config.baseApiUrl}/record/delete/{type}/img`
export const DeleteImage = (type,imageId) => {
    return request(_DeleteImage.replace('{type}',type) + '?id=' + imageId,{method: 'DELETE'});
}

const _Severity = `${window.config.baseApiUrl}/record/get/severity`
export const GetSeverity = () => request(_Severity)

// 上传图片
const _Image = `${window.config.baseApiUrl}/record/img`;

export const UploadImage = (img,dir) => {
    let formData = new FormData();
    formData.append('file',img, 'a.jpg');
    return request(`${_Image}?dir=${dir}`,{
        headers: {
            // 'Content-Type': 'multipart/form-data',
        },
        body: formData,
        method: 'post',
    });
}
export const Dirs = {
    pest: 'pest',
    disease: 'disease',
    drought: 'drought'
}

export const TestNetwork = () => {
    let load = Loading.service({fullscreen: true});
    const timeout = 5000;
    return new Promise((s,f) => {
        const controller = new AbortController();
        const id = setTimeout(() => {
            controller.abort();
            f("");
            load.close();
        }, timeout);
        return fetch(`${window.config.baseApiUrl}/system/user/test`, {
            signal: controller.signal
        }).then(o => {
            clearTimeout(id);
            s(o);
            load.close();
        }).catch(f);
    })
}
window.TestNetwork = TestNetwork;
