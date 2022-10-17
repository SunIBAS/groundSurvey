import * as PureApi from './apis'
import * as NativeApi from './nativeApi'
import {DbMessage, otherRecordIds} from "./nativeApi";
import {
    Obj2Str, Str2Obj
} from "../utils/htmlUtils";

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

export const CreateRecord = _selectApi(PureApi.CreateRecord,NativeApi.CreateRecord);
export const UpdateRecord = _selectApi(PureApi.UpdateRecord,NativeApi.UpdateRecord);
export const GetRecord = _selectApi(PureApi.GetRecord,NativeApi.GetRecord);
export const GetRecordList = _selectApi(PureApi.GetRecordList,NativeApi.GetRecordList);
export const DeleteRecordById = _selectApi(PureApi.DeleteRecordById,NativeApi.DeleteRecordById);

export const GetLandType = _selectApiWithCache(PureApi.GetLandType,NativeApi.GetLandType,otherRecordIds.GetLandType);
export const GetCropType = _selectApiWithCache(PureApi.GetCropType,NativeApi.GetCropType,otherRecordIds.GetCropType);
export const GetDiseaseType = _selectApiWithCache(PureApi.GetDiseaseType,NativeApi.GetDiseaseType,otherRecordIds.GetDiseaseType);
export const GetPestType = _selectApiWithCache(PureApi.GetPestType,NativeApi.GetPestType,otherRecordIds.GetPestType);
export const GetSeverity = _selectApiWithCache(PureApi.GetSeverity,NativeApi.GetSeverity,otherRecordIds.GetSeverity);
export const GetLandAttribute = _selectApiWithCache(PureApi.GetLandAttribute,NativeApi.GetLandAttribute,(id) => {
    return otherRecordIds.GetLandAttribute + `_` + id
});

