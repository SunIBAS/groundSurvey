// 土地类型菜单和提交表单互转
const classesMenuXForm = function (menus) {
    // menus
    // let menus = [
    //     {
    //         "label": "耕地",
    //         "children": [
    //             {
    //                 "label": "水田",
    //                 "form": [
    //                     {
    //                         "label": "水田作物",
    //                         "options": [
    //                             {
    //                                 "label": "水稻",
    //                                 "id": "水稻"
    //                             },
    //                             {
    //                                 "label": "莲藕",
    //                                 "id": "莲藕"
    //                             },
    //                             {
    //                                 "label": "休耕",
    //                                 "id": "休耕"
    //                             },
    //                             {
    //                                 "label": "撂荒",
    //                                 "id": "撂荒"
    //                             },
    //                             {
    //                                 "id": "add",
    //                                 "type": "add",
    //                                 "label": "添加其他"
    //                             }
    //                         ],
    //                         "id": "id_1"
    //                     },
    //                     {
    //                         "label": "地形",
    //                         "options": [
    //                             {
    //                                 "label": "梯田",
    //                                 "id": "梯田"
    //                             },
    //                             {
    //                                 "label": "平原",
    //                                 "id": "平原"
    //                             },
    //                             {
    //                                 "label": "坡地",
    //                                 "id": "坡地"
    //                             }
    //                         ],
    //                         "id": "id_2"
    //                     },
    //                     {
    //                         "label": "作物高度",
    //                         "options": [
    //                             {
    //                                 "label": "0.03~0.3m",
    //                                 "id": "0.03~0.3m"
    //                             },
    //                             {
    //                                 "label": "0.3~1m",
    //                                 "id": "0.3~1m"
    //                             },
    //                             {
    //                                 "label": "1~3m",
    //                                 "id": "1~3m"
    //                             }
    //                         ],
    //                         "id": "id_3"
    //                     },
    //                     {
    //                         "label": "覆盖度",
    //                         "options": [
    //                             {
    //                                 "label": "<4%",
    //                                 "id": "<4%"
    //                             },
    //                             {
    //                                 "label": "4~20%",
    //                                 "id": "4~20%"
    //                             },
    //                             {
    //                                 "label": "20~40%",
    //                                 "id": "20~40%"
    //                             },
    //                             {
    //                                 "label": "40~65%",
    //                                 "id": "40~65%"
    //                             },
    //                             {
    //                                 "label": ">65%",
    //                                 "id": ">65%"
    //                             }
    //                         ],
    //                         "id": "id_4"
    //                     },
    //                     {
    //                         "label": "浇灌方式",
    //                         "options": [
    //                             {
    //                                 "label": "雨养",
    //                                 "id": "雨养"
    //                             },
    //                             {
    //                                 "label": "漫灌",
    //                                 "id": "漫灌"
    //                             },
    //                             {
    //                                 "label": "沟灌",
    //                                 "id": "沟灌"
    //                             },
    //                             {
    //                                 "label": "滴灌",
    //                                 "id": "滴灌"
    //                             },
    //                             {
    //                                 "label": "喷灌",
    //                                 "id": "喷灌"
    //                             }
    //                         ],
    //                         "id": "id_5"
    //                     },
    //                     {
    //                         "label": "复种特征",
    //                         "options": [
    //                             {
    //                                 "label": "单季",
    //                                 "id": "单季"
    //                             },
    //                             {
    //                                 "label": "多季",
    //                                 "id": "多季"
    //                             }
    //                         ],
    //                         "id": "id_6"
    //                     },
    //                     {
    //                         "label": "全年淹水长度",
    //                         "options": [
    //                             {
    //                                 "id": "add",
    //                                 "type": "add",
    //                                 "label": "输入月份"
    //                             }
    //                         ],
    //                         "id": "id_7"
    //                     }
    //                 ],
    //                 "id": "id_15"
    //             },
    //             {
    //                 "label": "旱地",
    //                 "form": [
    //                     {
    //                         "label": "旱田作物",
    //                         "options": [
    //                             {
    //                                 "label": "土豆",
    //                                 "id": "土豆"
    //                             },
    //                             {
    //                                 "label": "红薯",
    //                                 "id": "红薯"
    //                             },
    //                             {
    //                                 "label": "大麦",
    //                                 "id": "大麦"
    //                             },
    //                             {
    //                                 "label": "谷子",
    //                                 "id": "谷子"
    //                             },
    //                             {
    //                                 "label": "豆角",
    //                                 "id": "豆角"
    //                             },
    //                             {
    //                                 "id": "add",
    //                                 "type": "add",
    //                                 "label": "添加其他作物"
    //                             }
    //                         ],
    //                         "id": "id_8"
    //                     },
    //                     {
    //                         "label": "地形",
    //                         "options": [
    //                             {
    //                                 "label": "梯田",
    //                                 "id": "梯田"
    //                             },
    //                             {
    //                                 "label": "平原",
    //                                 "id": "平原"
    //                             },
    //                             {
    //                                 "label": "坡地",
    //                                 "id": "坡地"
    //                             }
    //                         ],
    //                         "id": "id_9"
    //                     },
    //                     {
    //                         "label": "套种类型",
    //                         "options": [
    //                             {
    //                                 "label": "无",
    //                                 "id": "无"
    //                             },
    //                             {
    //                                 "id": "add",
    //                                 "type": "add",
    //                                 "label": "添加套种类型"
    //                             }
    //                         ],
    //                         "id": "id_10"
    //                     },
    //                     {
    //                         "label": "作物高度",
    //                         "options": [
    //                             {
    //                                 "label": "0.03~0.3m",
    //                                 "id": "0.03~0.3m"
    //                             },
    //                             {
    //                                 "label": "0.3~1m",
    //                                 "id": "0.3~1m"
    //                             },
    //                             {
    //                                 "label": "1~3m",
    //                                 "id": "1~3m"
    //                             }
    //                         ],
    //                         "id": "id_11"
    //                     },
    //                     {
    //                         "label": "覆盖度",
    //                         "options": [
    //                             {
    //                                 "label": "<4%",
    //                                 "id": "<4%"
    //                             },
    //                             {
    //                                 "label": "4~20%",
    //                                 "id": "4~20%"
    //                             },
    //                             {
    //                                 "label": "20~40%",
    //                                 "id": "20~40%"
    //                             },
    //                             {
    //                                 "label": "40~65%",
    //                                 "id": "40~65%"
    //                             },
    //                             {
    //                                 "label": ">65%",
    //                                 "id": ">65%"
    //                             }
    //                         ],
    //                         "id": "id_12"
    //                     },
    //                     {
    //                         "label": "浇灌方式",
    //                         "options": [
    //                             {
    //                                 "label": "雨养",
    //                                 "id": "雨养"
    //                             },
    //                             {
    //                                 "label": "漫灌",
    //                                 "id": "漫灌"
    //                             },
    //                             {
    //                                 "label": "沟灌",
    //                                 "id": "沟灌"
    //                             },
    //                             {
    //                                 "label": "滴灌",
    //                                 "id": "滴灌"
    //                             },
    //                             {
    //                                 "label": "喷灌",
    //                                 "id": "喷灌"
    //                             }
    //                         ],
    //                         "id": "id_13"
    //                     },
    //                     {
    //                         "label": "复种特征",
    //                         "options": [
    //                             {
    //                                 "label": "单季",
    //                                 "id": "单季"
    //                             },
    //                             {
    //                                 "label": "多季",
    //                                 "id": "多季"
    //                             }
    //                         ],
    //                         "id": "id_14"
    //                     }
    //                 ],
    //                 "id": "id_16"
    //             }
    //         ],
    //         "id": "id_21"
    //     },
    //     {
    //         "label": "水面",
    //         "children": [
    //             {
    //                 "label": "常年水面",
    //                 "form": [
    //                     {
    //                         "label": "水面类型",
    //                         "options": [
    //                             {
    //                                 "label": "湖泊",
    //                                 "id": "湖泊"
    //                             },
    //                             {
    //                                 "label": "水库",
    //                                 "id": "水库"
    //                             },
    //                             {
    //                                 "label": "坑塘",
    //                                 "id": "坑塘"
    //                             },
    //                             {
    //                                 "label": "蓄水池",
    //                                 "id": "蓄水池"
    //                             },
    //                             {
    //                                 "label": "景观水体",
    //                                 "id": "景观水体"
    //                             }
    //                         ],
    //                         "id": "id_17"
    //                     }
    //                 ],
    //                 "id": "id_19"
    //             },
    //             {
    //                 "label": "季节性水面",
    //                 "form": [
    //                     {
    //                         "label": "水面类型",
    //                         "options": [
    //                             {
    //                                 "label": "湖泊",
    //                                 "id": "湖泊"
    //                             },
    //                             {
    //                                 "label": "水库",
    //                                 "id": "水库"
    //                             },
    //                             {
    //                                 "label": "坑塘",
    //                                 "id": "坑塘"
    //                             },
    //                             {
    //                                 "label": "蓄水池",
    //                                 "id": "蓄水池"
    //                             },
    //                             {
    //                                 "label": "景观水体",
    //                                 "id": "景观水体"
    //                             }
    //                         ],
    //                         "id": "id_18"
    //                     }
    //                 ],
    //                 "id": "id_20"
    //             }
    //         ],
    //         "id": "id_22"
    //     }
    // ];
    //
    let deepSearch = function (id0,menus) {
        let ret = false;
        let list = [];
        for (let i = 0;i < menus.length && !ret;i++) {
            if (menus[i].children) {
                ret = deepSearch(id0,menus[i].children);
                if (ret) {
                    console.log(i);
                    list = ret;
                    list.push(i);
                }
            } else {
                let ids = menus[i].form.flatMap(_=>_.options).map(_=>_.id);
                if (ids.indexOf(id0) !== -1) {
                    ret = true;
                    list = [i];
                }
            }
        }
        return ret ? list : false;
    };
    let getPathIndex = function (id0) {
        return deepSearch(id0,menus).reverse();
    }
    return {
        // ids = ['水稻', '0.3~1m']
        // 只需要找其中一个即可
        menus2Form(ids) {
            if (ids.length) {
                let pathIndex = getPathIndex(ids[0]);
                let selectedOption = [];
                let selection = {
                    content: [],
                    type: 'detail'
                };
                let plantType = [];
                let m = menus;
                pathIndex.forEach(pi => {
                    selectedOption.push({
                        id: m[pi].id,
                        ind: pi,
                        label: m[pi].label
                    });
                    if (m[pi].children) {
                        m = m[pi].children;
                    } else {
                        m = m[pi];
                    }
                });
                selection.content = m.form;
                m.form.forEach(f => {
                    let ind = -1;
                    for (let i = 0;i < f.options.length;i++) {
                        if (ids.indexOf(f.options[i].id) !== -1) {
                            ind = i;
                        }
                    }
                    if (-1 !== ind) {
                        plantType.push({
                            id: f.options[ind].id,
                            ind: ind,
                            label: f.options[ind].label
                        });
                    } else {
                        plantType.push({id: '',ind: -1,label: ''});
                    }
                });
                return {
                    pathIndex,
                    selection,
                    plantType,
                    selectedOption
                };
            } /*else{}*/
        }
    }
};

export {
    classesMenuXForm
}
