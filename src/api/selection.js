import {
    request, requestPostWithData
} from "./request";

const Records = `${window.config.baseApiUrl}/page-record`
const getLandType = `${window.config.baseApiUrl}/land-type`;
const getLandForm = `${window.config.baseApiUrl}/land-attribute`;
const getLandAttributeValue = `${window.config.baseApiUrl}/land-attribute-value`;
const getDisasterType = `${window.config.baseApiUrl}/disaster-type`;

const imgUrl = `${window.config.baseApiUrl}/img`;

export const GetRecordByPage = (page,pageSize) => {
    // size = 10
    return request(`${Records}?pageNo=${page}&pageSize=${pageSize}`);
}

const getMenus = () => {
    return request(getLandType,{}).then(data => {
        return data;
    })
};
// todo ： 缓存
const addLandType = (nameChs,nameEn,parentId) => {
    let obj = {
        nameChs,
        nameEn,
    }
    if (parentId !== -1) {
        obj.parentId = parentId;
    }
    return request(getLandType,{
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    });
}
// todo ： 缓存
const addLandTypeAttribute = (nameChs,nameEn) => {
    return request(getLandForm,{
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nameChs,
            nameEn,
        })
    });
};
const addLandTypeAttributeValue = (landAttrId,landTypeId,valueChs,valueEn) => {
    return request(getLandAttributeValue,{
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "attributeValues": [
                {
                    "valueChs": valueChs,
                    "valueEn": valueEn,
                }
            ],
            "landAttrId": landAttrId,
            "landTypeId": landTypeId,
        })
    });
};
const getForm = (landTypeId) => {
    return request(getLandForm + `?landTypeId=${landTypeId}`,{
        method: 'get',
    });
};
const getDisaster = () => {
    return request(getDisasterType);
}

// 主记录
const investRecord = `${window.config.baseApiUrl}/invest-record`;
const createInvestRecord = () => {
    return request(investRecord,{
        method: 'post'
    });
}
const updateInvestRecord = (obj,surveyTime) => {
    return requestPostWithData(investRecord + `?surveyTime=${surveyTime}`,obj,'put');
};
const getInvestRecordById = id => {
    return request(investRecord + `?recordId=${id}`).then(o => {
        // todo 这里修改为时间戳便于使用
        o.surveyTime = 1658456926181;
        return o;
    });
};
const Dirs = {
    MainRecord: 'mainRecord',
};
// 上传图片
const uploadImage = (img,dir) => {
    let formData = new FormData();
    formData.append('file',img);
    return request(`${imgUrl}?dir=${dir}`,{
        headers: {
            // 'Content-Type': 'multipart/form-data',
        },
        body: formData,
        method: 'post',
    });
}

// 环境要素
const environmentFactor = `${window.config.baseApiUrl}/environment-factor-record`;
export const createEnvironmentFactorRecord = id => {
    return request(environmentFactor + '?mainRecordId=' + id,{
        method: 'post',
    });
}
export const updateEnvironmentFactorRecord = obj => {
    return requestPostWithData(environmentFactor,obj,'put');
}
export const deleteEnvironmentFactorRecord = id => {
    return request(environmentFactor + '?id=' + id,{
        method: 'delete'
    });
};
// 环境要素
const diseaseSysSurveyRecord = `${window.config.baseApiUrl}/disease-sys-survey-record`;
export const createDiseaseSysSurveyRecord = id => {
    return request(diseaseSysSurveyRecord + '?mainRecordId=' + id,{
        method: 'post',
    });
}
export const updateDiseaseSysSurveyRecord = obj => {
    return requestPostWithData(diseaseSysSurveyRecord,obj,'put');
}
export const deleteDiseaseSysSurveyRecord = id => {
    return request(diseaseSysSurveyRecord + '?id=' + id,{
        method: 'delete'
    });
};

// 病害样本采集表
const diseaseSamCollRecord = `${window.config.baseApiUrl}/disease-sam-coll-record`;
export const createDiseaseSamCollRecord = id => {
    return request(diseaseSamCollRecord + '?mainRecordId=' + id,{
        method: 'post',
    });
}
export const updateDiseaseSamCollRecord = obj => {
    return requestPostWithData(diseaseSamCollRecord,obj,'put');
}
export const deleteDiseaseSamCollRecord = id => {
    return request(diseaseSamCollRecord + '?id=' + id,{
        method: 'delete'
    });
};

// 更新机-地病害数据采集表记录
const diseaseDataCollUavRecord = `${window.config.baseApiUrl}/disease-data-coll-uav-record`;
export const createDiseaseDataCollUavRecord = id => {
    return request(diseaseDataCollUavRecord + '?mainRecordId=' + id,{
        method: 'post',
    });
}
export const updateDiseaseDataCollUavRecord = obj => {
    return requestPostWithData(diseaseDataCollUavRecord,obj,'put');
}
export const deleteDiseaseDataCollUavRecord = id => {
    return request(diseaseDataCollUavRecord + '?id=' + id,{
        method: 'delete'
    });
};

// 虫害采集
const pestCollRecord = `${window.config.baseApiUrl}/pest-coll-record`;
export const createPestCollRecord = id => {
    return request(pestCollRecord + '?mainRecordId=' + id,{
        method: 'post',
    });
}
export const updatePestCollRecord = obj => {
    return requestPostWithData(pestCollRecord,obj,'put');
}
export const deletePestCollRecord = id => {
    return request(pestCollRecord + '?id=' + id,{
        method: 'delete'
    });
};
export const insertPestImgRecord = obj => {
    return requestPostWithData(`${window.config.baseApiUrl}/pest-img-record`,obj,'post');
};

// 机-地虫害调查表记录
const pestSurveyUavRecord = `${window.config.baseApiUrl}/pest-survey-uav-record`;
export const createPestSurveyUavRecord = id => {
    return request(pestSurveyUavRecord + '?mainRecordId=' + id,{
        method: 'post',
    });
}
export const updatePestSurveyUavRecord = obj => {
    return requestPostWithData(pestSurveyUavRecord,obj,'put');
}
export const deletePestSurveyUavRecord = id => {
    return request(pestSurveyUavRecord + '?id=' + id,{
        method: 'delete'
    });
};
export const insertPestSurveyUavRecordImageRecord = obj => {
    return requestPostWithData(`${window.config.baseApiUrl}/pest-uav-img-record`,obj,'post');
};


// 土壤情况 soil-moisture-coll-record
const soilMoistureCollRecord = `${window.config.baseApiUrl}/soil-moisture-coll-record`;
export const createSoilMoistureCollRecord = id =>
    request(soilMoistureCollRecord + '?mainRecordId=' + id,{
        method: 'post',
    });
export const updateSoilMoistureCollRecord = obj =>
    requestPostWithData(soilMoistureCollRecord,obj,'put');
export const deleteSoilMoistureCollRecord = id => {
    return request(soilMoistureCollRecord + '?id=' + id,{
        method: 'delete'
    });
};

// 小麦产量表记录 wheat-yield-coll-record
const wheatYieldCollRecord = `${window.config.baseApiUrl}/wheat-yield-coll-record`;
export const createWheatYieldCollRecord = id =>
    request(wheatYieldCollRecord + '?mainRecordId=' + id,{
        method: 'post',
    });
export const updateWheatYieldCollRecord = obj =>
    requestPostWithData(wheatYieldCollRecord,obj,'put');
export const deleteWheatYieldCollRecord = id => {
    return request(wheatYieldCollRecord + '?id=' + id,{
        method: 'delete'
    });
};




export {
    getMenus,
    getForm,
    getMenus as getLandType,
    getForm as getLandAttribute,
    addLandType,
    addLandTypeAttribute,
    addLandTypeAttributeValue,
    getDisaster,
    createInvestRecord,
    getInvestRecordById,
    updateInvestRecord,
    Dirs,
    uploadImage,
}
