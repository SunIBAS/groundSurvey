(function () {
    // tmp storage
    // content = { event: '',key: '',value: '' }
    var _tmpStorage = function (content) {
        if (content.event === 'getItem') {
            return plus.storage.getItem(content.key);
        } else if (content.event === 'removeItem') {
            return plus.storage.removeItem(content.key);
        } else if (content.event === 'setItem') {
            return plus.storage.setItem(content.key, content.value);
        }
    }

    let downloadMap = new DownloadMap();
    window.downloadMap = downloadMap;

    var db = {
        _map: new MapDatabase(),
        _db: new Database(),
        record: new RecordApi(),
        image: new ImageApi(),
        imageRecord: new ImageRecordApi(),
        otherRecord: new OtherRecordApi(),
    };
    window.db = db;
    downloadMap.set_map_db(db._map);
    db.image.setImageRecordApi(db.imageRecord);
    db.record.setImageRecordApi(db.imageRecord);
    const _tableNameApiMap = {
        record: 'record',
        other: 'otherRecord',
        image: 'image',
        imageRecord: 'imageRecord',
    };
    // {
    //      table: '',
    //      method: '',
    //      data: {}
    // }
    function dearDbMessage(content) {
        return db[_tableNameApiMap[content.table]][content.method](content.data);
    }

    const nativeUI = {
        toast({content, option}) {
            plus.nativeUI.toast(content, option || {})
        }
    }

    window.addEventListener('message', function (e) {
        // e.data = {
        //     type: '',
        //     content: {},
        //     id: '',
        // };
        // console.log(msg.data);
        let ret = {
            error: 'type is not found',
            data: null,
            id: e.data.id
        };
        switch (e.data.type) {
            case "tmpStorage":
                ret.data = _tmpStorage(e.data.content);
                ret.error = '';
                e.source.postMessage(ret,"*");
                break;
            case "xid":
                ret.data = 'fawegaij;ofa;efknagoijaoeifjaoiwnfoaijgoiawe;ofnaweofiajwoiga;woeina;woifjaw;oifjawe';
                ret.error = '';
                e.source.postMessage(ret,"*");
                break;
            case "position":
                plus.geolocation.getCurrentPosition(function (p) {
                    ret.error = '';
                    ret.data = {
                        ...p.coords
                    }
                    e.source.postMessage(ret,"*");
                }, function (err) {
                    ret.error = err.message;
                    e.source.postMessage(ret,"*");
                });
                break;
            case "db":
                // alert(JSON.stringify(e.data));
                dearDbMessage(e.data.content).then(data => {
                    e.source.postMessage({
                        ...ret,
                        error: '',
                        data: data
                    },"*");
                }).catch(err => {
                    e.source.postMessage({
                        ...ret,
                        error: err,
                        data: ''
                    },"*");
                });
                break;
            case "map":
                db._map.getxyz(e.data.content).then(base64 => {
                    e.source.postMessage({
                        ...ret,
                        error: '',
                        data: base64,
                    },"*");
                }).catch(err => {
                    e.source.postMessage({
                        ...ret,
                        error: err,
                        data: ''
                    },"*");
                });
                break;
            case "open_map_download":
                downloadMap.open_downloadDom();
                e.source.postMessage({
                    ...ret,
                    error: '',
                    data: ""
                },"*");
                break;
            case "dbinit":
                db._db.init().then(() => {
                    db._map.init().then(() => {
                        e.source.postMessage({
                            ...ret,
                            error: '',
                            data: ''
                        },"*");
                    }).catch(err => {
                        e.source.postMessage({
                            ...ret,
                            error: err,
                            data: ''
                        },"*");
                    });
                }).catch(err => {
                    e.source.postMessage({
                        ...ret,
                        error: err,
                        data: ''
                    },"*");
                });
                break;
            case "image":
                let prom = GetImageFromGallery;
                if (e.data.content.type === 'camera') {
                    prom = GetImageFromCamera;
                }
                prom().then(base64 => {
                    e.source.postMessage({
                        ...ret,
                        error: '',
                        data: base64
                    },"*");
                }).catch(err => {
                    e.source.postMessage({
                        ...ret,
                        error: err,
                        data: ''
                    },"*");
                });
                break;
            case "nativeUI":
                nativeUI[e.data.content.name](e.data.content.param)
                break;
            default:
                e.source.postMessage(ret,"*");
        }

    })
})();
