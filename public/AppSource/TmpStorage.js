// 临时存储
const TmpStorage = {
    getItem(key) {
        return plus.storage.getItem(key);
    },
    removeItem(key) {
        return plus.storage.removeItem(key);
    },
    setItem(key,value) {
        return plus.storage.setItem(key, value);
    }
}

