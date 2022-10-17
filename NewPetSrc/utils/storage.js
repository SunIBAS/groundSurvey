import {
    MessageType,
    Message
} from "./Message";

let Storage_ = {
    setItem(key,value) {
        return new Promise(s => {
            sessionStorage.setItem(key,value);
            s();
        });
    },
    removeItem(key) {
        return new Promise(s => {
            sessionStorage.removeItem(key);
            s();
        });
    },
    getItem(key) {
        return new Promise(s => {
            s(sessionStorage.getItem(key));
        });
    },
};
let _updateStorage = false;

function updateStorage() {
    if (_updateStorage) {
        return;
    }
    _updateStorage = true;
    if (window.hbuilder) {
        Storage_ = {
            setItem(key, value) {
                return Message(MessageType.tmpStorage,{
                    key,value,event: 'setItem',
                });
            },
            removeItem(key) {
                return Message(MessageType.tmpStorage,{
                    key,event: 'removeItem',
                });
            },
            getItem(key) {
                return Message(MessageType.tmpStorage,{
                    key,event: 'getItem',
                }).then(obj => {
                    return obj.data;
                });
            }
        }
    }
}

const Storage = new (class  {
    constructor() {
        this.user_info_id = `_user_info_id_`;
        this.offline_user_token = '_offline_token_';
        this._kv = {};
    }

    _get_info_from_sessionStorage(key) {
        updateStorage();
        if (key in this._kv) {
            return new Promise(s => {
                s(this._kv[key]);
            })
        } else {
            return Storage_.getItem(key).then(ret => {
                if (ret) {
                    try {
                        ret = JSON.parse(ret);
                    } catch (e) {
                        ret = null;
                    }/* finally {
            }*/
                    return ret;
                } else {
                    return null;
                }
            });
        }
    }

    _set_info_to_sessionStorage(key,value) {
        updateStorage();
        delete this._kv[key];
        return Storage_.setItem(key,JSON.stringify(value)).then(() => {
            this._kv[key] = value;
        });
    }

    get_user_info() {
        return this._get_info_from_sessionStorage(this.user_info_id);
    }
    set_user_info(value) {
        if (!value) {
            delete this._kv[this.user_info_id];
            Storage_.removeItem(this.user_info_id);
        } else {
            this._set_info_to_sessionStorage(this.user_info_id,value);
        }
    }

    set_offline_user_token() {
        this.set_user_info(this.offline_user_token);
    }
    check_offline_user_token(utk) {
        return utk === this.offline_user_token;
    }
});

export {
    Storage
}
