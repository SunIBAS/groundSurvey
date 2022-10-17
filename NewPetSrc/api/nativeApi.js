import {
    Message,
    MessageType
} from "../utils/Message";
import { Notification } from 'element-ui';
import {
    Obj2Str, Str2Obj
} from "../utils/htmlUtils";


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
    other: 'other'
};
export const DbMessage = (table,method,data) => {
    return Message(MessageType.db,{
        table,
        method,
        data
    }).then(_ => {
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
    return {
        id: data.id,
        ...Str2Obj(data.content)
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


window.DebuggerMessage = Message;
window.DebuggerMessageType = MessageType;
window.DebuggerDbMessage = DbMessage;
