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

    window.addEventListener('message', function (e) {
        // msg.data = {
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
            default:
                e.source.postMessage(ret,"*");
        }

    })
})();
