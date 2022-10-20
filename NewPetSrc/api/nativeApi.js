import {
    Message,
    MessageType
} from "../utils/Message";
import { Notification } from 'element-ui';
import {
    Base64ToJpegFile,
    File2Base64,
    Obj2Str, Str2Obj
} from "../utils/htmlUtils";
import {
    Dirs
} from "./apis";
import {
    Loading
} from "element-ui";


export const OpenImageRetureBinary = type => {
    return Message(MessageType.image,{
        type
    }).then(_ => {
        if (_.error) {
            Notification({
                title: 'Error',
                message: _.error,
                offset: 100,
            });
        } else {
            return Base64ToJpegFile(_.data);
        }
    });
}

export const otherRecordIds = {
    GetLandType: 'GetLandType',
    GetLandAttribute: 'GetLandAttribute',
    GetCropType: 'GetCropType',
    GetDiseaseType: 'GetDiseaseType',
    GetPestType: 'GetPestType',
    GetSeverity: 'GetSeverity',
}
export const TableName = {
    record: 'record',
    image: 'image',
    other: 'other',
    imageRecord: 'imageRecord'
};

export const DbMessage = (table,method,data) => {
    let loading = Loading.service({ fullscreen: true });
    return Message(MessageType.db,{
        table,
        method,
        data
    }).then(_ => {
        loading.close();
        if (_.error) {
            Notification({
                title: 'Error',
                message: _.error,
                offset: 100,
            });
        } else {
            return _.data;
        }
    });
}
export const CreateRecord = obj => {
    return DbMessage(TableName.record,'createOrUpdateRecord',{
        obj: {
            content: Obj2Str(obj)
        },id: null
    });
};
export const UpdateRecord = obj => {
    let id = obj.id;
    if (obj.id) {
        delete obj.id;
    }
    return DbMessage(TableName.record,'createOrUpdateRecord',{
        obj: {
            content: Obj2Str(obj)
        },id: id
    });
}
export const GetRecord = id => DbMessage(TableName.record,'getRecord',{ id }).then(data => {
    let content = Str2Obj(data.content);
    delete data.content;
    return {
        // id: data.id,
        ...content,
        ...data
    }
});
export const GetRecordList = (pageNo,pageSize) => DbMessage(TableName.record,'getList',{ pageNo,pageSize }).then(data => {
    data.data = data.data.map(_ => {
        return {
            id: _.id,
            ...Str2Obj(_.content)
        };
    });
    return data;
});
export const DeleteRecordById = id => DbMessage(TableName.record,'delete',{ id });

export const GetLandType = () => DbMessage(TableName.other,'select', {
    id: otherRecordIds.GetLandType,
});
export const GetLandAttribute = landTypeId => DbMessage(TableName.other,'select',{
    id: otherRecordIds.GetLandAttribute + '_' + landTypeId
});
export const GetCropType = () => DbMessage(TableName.other,'select',{
    id: otherRecordIds.GetCropType
});
export const GetPestType = () => DbMessage(TableName.other,'select',{
    id: otherRecordIds.GetPestType
});
export const GetDiseaseType = () => DbMessage(TableName.other,'select',{
    id: otherRecordIds.GetDiseaseType
});
export const GetSeverity = () => DbMessage(TableName.other,'select',{
    id: otherRecordIds.GetSeverity
});

export const UploadImage = (img) => {
    return File2Base64(img).then(base64 => {
        return DbMessage(TableName.image,'createImage',{
            imgBase64: base64,
        }).then(ret => {
            alert(ret);
            return ret;
        });
    });
    // let formData = new FormData();
    // formData.append('file',img);
    // return request(`${_Image}?dir=${dir}`,{
    //     headers: {
    //         // 'Content-Type': 'multipart/form-data',
    //     },
    //     body: formData,
    //     method: 'post',
    // });
}

export const UploadDiseaseImage = (recordId,imageId) => {
    return DbMessage(TableName.imageRecord,'insert',{
        recordId,imageId,imageType: Dirs.disease
    });
}

export const UploadDroughtImage = (recordId,imageId) => {
    return DbMessage(TableName.imageRecord,'insert',{
        recordId,imageId,imageType: Dirs.drought
    });
}

export const UploadPestImage = (recordId,imageId) => {
    return DbMessage(TableName.imageRecord,'insert',{
        recordId,imageId,imageType: Dirs.pest
    });
}

export const requestImage = url => {
    // url = 'img-db:${id}'
    let id = url.substring('img-db:'.length);
    return DbMessage(TableName.image,'getImage',{
        id
    }).then(base64 => {
        debugger
        return base64;
    });
}

window.DebuggerMessage = Message;
window.DebuggerMessageType = MessageType;
window.DebuggerDbMessage = DbMessage;
