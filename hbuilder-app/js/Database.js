const errorContent = {
    code: '',
    message: '',
};
const tables = {
    image: 'create table if not exists image(id varchar(20) PRIMARY KEY not null,imageUrl varchar (30) not null,recordId varchar(30) not null,imgBase64 text)',
    record: 'create table if not exists record(id varchar(20) Primary key not null,content varchar(200))',
    // image 和 record 连表查询
    imageRecord: 'create table if not exists imageRecord(id varchar(20) Primary key not null,imageId varchar(20),recordId varchar(20),imageType varchar(4))',
    // 用于存储将被不断覆盖更新的内容
    other: `create table if not exists other(id varchar(20) not null,hash varchar(200),content text)`
};
const createId = (function () {
    let ind = 0;
    let date = new Date().getTime();
    return function () {
        ind++;
        return `${date}#${ind}`;
    };
})();
const parser = {
    record: {
        save({
                 cropType, cropVariety,
                 diseaseSeverity, diseaseType,
                 droughtSeverity,
                 landMsg, lat, lng,
                 pestSeverity, pestType, surveyTime},id) {
            if (!id) {
                id = createId();
            }
            return {
                id,
                content: {
                    cropType,cropVariety,
                    landMsg,lat,lng,
                    // diseaseImgRecordList,
                    diseaseSeverity,diseaseType,
                    // droughtImgRecordList,
                    droughtSeverity,
                    // pestImgRecordList,
                    pestSeverity,pestType,surveyTime
                }
            };
        },
        read(text) {
            return JSON.parse(text);
        }
    }
}

// 执行一个队列的 promise 并以 promise 返回
/**
 * @param promise   要执行的 promise，可以自行封装一次
 * @param arr       数组，参数集合，记得和 promise 匹配
 * @param doPromiseReturn   如果需要对 promise 的结果进行处理，可以使用这个参数
 * @returns {Promise<unknown>}
 */
const runPromiseByArrReturnPromise = (promise,arr,doPromiseReturn,catchFn,stopWhenCatch) => {
    let doing = false;
    doPromiseReturn = doPromiseReturn || (_=>_);
    return new Promise((s,f) => {
        let _id = setInterval(() => {
            if (!doing) {
                doing = true;
                if (arr.length) {
                    let id = arr.pop();
                    promise(id)
                        .then(o => {
                            doPromiseReturn(o,id);
                            doing = false;
                        }).catch(e => {
                            catchFn(e);
                            if (stopWhenCatch) {
                                clearInterval(_id);
                                f(e);
                            }
                        });
                } else {
                    clearInterval(_id);
                    s();
                }
            }
        },100);
    });
}
const dbName = 'pet';
class Database {
    constructor() {
        this.option = {
            name: dbName,
            path: '_doc/pet.db',
        }
    }
    init() {
        return new Promise((s,f) => {
            plus.sqlite.openDatabase({
                ...this.option,
                success() {
                    s();
                },
                fail(e) {
                    f(e);
                }
            });
        }).then(() => {
            return this.createTable();
        }).catch(e => {
            if (e.code.toString() === "-1402") {
                return this.createTable();
            } else {
                throw e;
            }
        });
    }
    createTable() {
        let sqls = [];
        for (let i in tables) {
            sqls.push(tables[i]);
        }
        return runPromiseByArrReturnPromise(sql => {
            return this.insert(sql);
        },sqls,()=>{},() => {},true);
    }
    insert(sql) {
        return new Promise((s,f) => {
            return plus.sqlite.executeSql({
                name: this.option.name,
                sql: sql,
                success() {
                    s();
                },fail(e) {
                    f(e);
                },
            });
        });
    }
}

class Api {
    static buildSql = {
        selectAll(tbname) {
            return `select * from ${tbname};`;
        },
        selectByPageSize(tbname,page,pageSize) {
            return `select * from ${tbname} limit ${pageSize} offset ${pageSize * (page - 1)};`;
        },
        selectById(tbname,id) {
            return `select * from ${tbname} where id="${id}";`;
        },
        insertOrUpdate(tbname,id,obj) {
            let fields = ["id"];
            let values = [id];
            let sql = `insert or replace into ${tbname}(#{fields}) values("#{values}");`;
            for (let i in obj) {
                fields.push(i);
                if (typeof obj[i] === 'object') {
                    values.push(JSON.stringify(obj[i]));
                } else {
                    values.push(obj[i]);
                }
            }
            sql = sql.replace(`#{fields}`,fields.join(','));
            sql = sql.replace(`#{values}`,values.join('","'));
            console.log(`[select Sql] : ${sql}`);
            return sql;
        },
        delete(tbname,id,fieldName) {
            fieldName = fieldName || 'id';
            return `delete from ${tbname} where ${fieldName}="${id}";`;
        }
    }
    constructor(tbname) {
        this.tbname = tbname;
    }
    selectSql(id,page,pageSize) {
        let sql = '';
        if (id) {
            sql = Api.buildSql.selectById(this.tbname,id);
        } else if (page && pageSize) {
            sql = Api.buildSql.selectByPageSize(this.tbname,page,pageSize);
        } else {
            sql = Api.buildSql.selectAll(this.tbname);
        }
        console.log(sql);
        return this.selectSqlExecute(sql);
    }
    selectSqlExecute(sql) {
        return new Promise((s,f) => {
            plus.sqlite.selectSql({
                name: dbName,
                sql: sql,
                success: function(data){
                    // console.log('selectSql success: ');
                    // for(var i in data){
                    //     console.log(data[i]);
                    // }
                    s(data);
                },
                fail: function(e){
                    // console.log('selectSql failed: '+JSON.stringify(e));
                    f(e);
                }
            });
        });
    }
    getCounts() {
        return this.selectSqlExecute(`select count(*) total from ${this.tbname}`).then(_ => _[0].total);
    }
    executeSql(sql) {
        return new Promise((s,f) => {
            plus.sqlite.executeSql({
                name: dbName,
                sql: sql,
                success: function(e){
                    s(e);
                },
                fail: function(e){
                    f(e);
                }
            });
        });
    }
    insertSql(id,obj) {
        return this.executeSql(Api.buildSql.insertOrUpdate(this.tbname,id,obj));
    }
    updateSql(id,obj) {
        return this.insertSql(id,obj);
    }
    deleteSql(id,fieldName) {
        return this.executeSql(Api.buildSql.delete(this.tbname,id,fieldName));
    }
}

const ApiFail = () => new Promise((s,f) => {
    f({
        error: 'image type is not found',
        message: 'image type is not found'
    });
});

class RecordApi extends Api {
    constructor() {
        super("record");
    }
    createOrUpdateRecord({id, obj}) {
        if (!id) {
            id = createId();
        }
        return this.insertSql(id,obj).then(() => {
            return id;
        });
    }
    getList({pageNo, pageSize}) {
        return this.getCounts().then(total => {
            if (total === 0) {
                return {
                    total: 0,
                    data: []
                }
            } else {
                return this.selectSql(null,pageNo,pageSize).then(data => {
                    return {
                        data,
                        total
                    }
                });
            }
        })
    }
    getRecord({id}) {
        return this.selectSql(id).then(e => e[0]);
    }
    delete({id}) {
        return this.deleteSql(id);
    }
}

class ImageApi extends Api {
    constructor() {
        super("image");
        this.imageRecordApi = null;
    }
    setImageRecordApi(api) {
        return this.imageRecordApi = api;
    }
    createImage(recordId,imgBase64,imageType) {
        // id,imageUrl
        let id = createId();
        let imageUrl = `img-db:${id}`;
        return this.insertSql(id,{
            imageUrl,recordId,imgBase64
        }).then(() => {
            return this.imageRecordApi.insert(recordId,id,imageType);
        });
    }
    getImage(id) {
        return this.selectSql(id).then(obj => obj.imgBase64);
    }
    deleteImage(imageId) {
        return this.deleteSql(imageId).then(() => {
            this.imageRecordApi.delete({imageId: imageId});
        }); // 同时需要删除记录中的 id
    }
}

class ImageRecordApi extends Api {
    static imageType = {
        disease: 'disease',
        drought: 'drought',
        pest: 'pest'
    }
    constructor() {
        super("imageRecord");
    }
    insert({recordId, imageId, imageType}) {
        let id = createId();
        let it = ImageRecordApi.imageType[imageType];
        if (it) {
            return this.insertSql(id,{
                imageId,recordId,imageType,
            });
        } else {
            return ApiFail();
        }
    }
    delete(recordId,imageId,id) {
        if (recordId) {
            return this.deleteSql(recordId,'recordId');
        } else if (imageId) {
            return this.deleteSql(imageId,'imageId');
        } else if (id) {
            return this.deleteSql(id,'id');
        } else {
            return ApiFail();
        }
    }
}

class OtherRecordApi extends Api {
    constructor() {
        super('other');
    }
    insert({id,content}) {
        return this.insertSql(id, {
            content: content,
            hash: sha1(content),
        });
    }
    select({id}) {
        return this.selectSql(id).then(data => {
            if (data.length) {
                return data[0];
            } else {
                let ret = DefaultRequest[id];
                if (ret) {
                    return ret;
                } else {
                    if (id.startsWith('GetLandAttribute')) {
                        return DefaultRequest.DefaultGetLandAttribute;
                    }
                }
            }
        });
    }
}
