import {
    GetLandType,
    GetLandAttribute
} from "../api/apis";

// landMsg: {
//     landTypeId: -1,
//     // [天然林,用材林]
//     attributeValues: {
//     },
//     landTypeList: [],
//     attributeValueList: {
//     }
// },
let _landTypes = null;
let _landAttribute = {};
const _getLandTypes = () => {
    if (_landTypes) {
        return new Promise(s => s(_landTypes));
    } else {
        return GetLandType().then(obj => {
            _landTypes = obj;
            return obj;
        });
    }
};
const _getLandAttribute = landTypeId => {
    if (_landAttribute[landTypeId]) {
        return new Promise(s => s(_landAttribute[landTypeId]));
    } else {
        return GetLandAttribute(landTypeId).then(obj => {
            _landAttribute[landTypeId] = obj.map(la => {
                return {
                    ...la,
                    landTypeId: la.landTypeId + '',
                    landAttrId: la.landAttrId + '',
                    attributeValues: la.attributeValues.map(lav => {
                        return {
                            ...lav,
                            id: lav.id + ''
                        }
                    })
                }
            });
            return obj;
        })
    }
};
const _getBaseInfo = (landTypeId) => {
    return _getLandTypes().then(() => {
        return _getLandAttribute(landTypeId);
    });
};
const _formatLandMsg = (landMsg,lang) => {
    landMsg = JSON.parse(JSON.stringify(landMsg));
    landMsg.landTypeList = [];
    landMsg.attributeValueList = {};
    return _getBaseInfo(landMsg.landTypeId).then(() => {
        _landTypes.forEach(lt => {
            lt.subLandType.forEach(slt => {
                if (slt.id === landMsg.landTypeId) {
                    landMsg.landTypeList = [lt[`name${lang}`],slt[`name${lang}`]];
                }
            });
        });
        _landAttribute[landMsg.landTypeId].forEach(la => {
            let atv = landMsg.attributeValues[la.landAttrId] + '';
            if (atv) {
                let t = la.attributeValues.filter(latv => {
                    return latv.id === atv;
                });
                if (t.length) {
                    landMsg.attributeValueList[la[`name${lang}`]] = t[0][`value${lang}`];
                } else {
                    landMsg.attributeValueList[la[`name${lang}`]] = '/';
                }
            } else {
                landMsg.attributeValueList[la[`name${lang}`]] = '/';
            }
        });
        console.log(landMsg);
        return landMsg;
    });
}
export const formatLandMsg = (landMsg,lang) => {
    if (landMsg && typeof landMsg === 'object' && landMsg.landTypeId && landMsg.landTypeId !== -1 && landMsg.attributeValues) {
        return _formatLandMsg(landMsg,lang);
    } else {
        return new Promise(s => s(landMsg));
    }
};
