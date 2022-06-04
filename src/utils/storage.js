const Storage = new (class  {
    constructor() {
        this.user_info_id = `_user_info_id_`;
    }

    _get_info_from_sessionStorage(key) {
        let ret = sessionStorage.getItem(key);
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
    }

    _set_info_to_sessionStorage(key,value) {
        sessionStorage.setItem(key,JSON.stringify(value));
    }

    get_user_info() {
        return this._get_info_from_sessionStorage(this.user_info_id);
    }
    set_user_info(value) {
        this._set_info_to_sessionStorage(this.user_info_id,value);
    }
});

export {
    Storage
}
