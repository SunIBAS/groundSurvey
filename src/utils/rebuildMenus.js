// lang = 'Chs' 'En'
// menus = [
//     {
//         id: 1,
//         nameChs: '',
//         nameEn: '',
//         subLandType: [
//             {
//                 id: 2,
//                 nameChs: '',
//                 nameEn: '',
//                 parentId: 1
//             }
//         ]
//     }
// ]
// targetMenus = [
//     {
//         id: 1,
//         label: '',
//         children: [
//             {
//                 id: 2,
//                 label: ''
//             }
//         ]
//     }
// ];
export const rebuildMenus = (menus,lang) => {
    return menus.map(m => {
        if (m.subLandType && m.subLandType.length) {
            m.subLandType = rebuildMenus(m.subLandType,lang);
            return {
                id: m.id,
                label: m[`name${lang}`],
                children: m.subLandType
            }
        } else {
            return {
                id: m.id,
                label: m[`name${lang}`]
            }
        }
    })
};
// form =  [
//     {
//       "landTypeId": 2,
//       "landAttrId": 1,
//       "nameChs": "森林起源类型",
//       "nameEn": "origin of forest",
//       "unit": "无",
//       "required": 0,
//       "attributeValues": [
//         {
//           "id": 1,
//           "landTypeId": 2,
//           "landAttributeId": 1,
//           "valueChs": "天然林",
//           "valueEn": "wildwood"
//         },
//         {
//           "id": 2,
//           "landTypeId": 2,
//           "landAttributeId": 1,
//           "valueChs": "次生林",
//           "valueEn": "secondary forest"
//         },
//         {
//           "id": 5,
//           "landTypeId": 2,
//           "landAttributeId": 1,
//           "valueChs": "人工林",
//           "valueEn": "artificial forest"
//         }
//       ]
//     },
//   ];
// targetForm = [
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
export const rebuildForm = (form,lang) => {
    return form.map(f => {
        return {
            label: f[`name${lang}`],
            id: f.landTypeId + `-` + f.landAttrId,
            landTypeId: f.landTypeId,
            landAttrId: f.landAttrId,
            options: f.attributeValues.map(atr => {
                return {
                    id: `${atr.id}-${atr.landTypeId}-${atr.landAttributeId}`,
                    landAttributeId: atr.landAttributeId,
                    landTypeId: atr.landTypeId,
                    label: atr[`value${lang}`]
                }
            })
        }
    })
}
