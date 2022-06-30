
/**
 * @param {*} list  将要变成树的列表
 * @param {*} id    元素id字段名称
 * @param {*} parentId 元素父id名称
 * @return {*} tree
 */
const listToTree = function(list, id = 'id', parentId = 'parent') {
    let tree = [];
    let map = {};
    tree = list.map(_ => (_.deep = 0,_)).filter(
        item1 =>
            !list.find((item2, index) => {
                // 如果有父节点
                if (item1[parentId] === item2[id]) {
                    // 放进它父节点的children数组中；如果children不存在，初始化为空数组
                    list[index].children = list[index].children || [];
                    list[index].children.push(item1);
                    map[item1[id]] = list[index][id];
                }
                // find返回第一个符合条件的元素，找到后，剩余的元素不再判断
                return item1[parentId] === item2[id];
            })
    );
    console.log(map);
    let allParentId = {};
    tree.map((t,ind) => {
        allParentId[t[id]] = ind;
    });
    for (let i in map) {
        let deep = 0;
        let cid = i;
        while (!(cid in allParentId)) {
            deep++;
            cid = map[cid];
        }
        if (tree[allParentId[cid]].deep < deep) {
            tree[allParentId[cid]].deep = deep;
        }
    }
    return tree;
};

export {
    listToTree
}
