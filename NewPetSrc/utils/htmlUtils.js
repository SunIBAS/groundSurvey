function readFileAsDataURL(file) {
    return new Promise((s,f) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(event) {
            s(event.target.result);
        };
        reader.onerror = function() {
            f('Unable to read ' + file.fileName);
        };
    })
}

export const Obj2Str = obj => {
    if (typeof obj === "undefined") {
        return obj;
    } else {
        return JSON.stringify(obj).replace(/"/g,'=-=-=');
    }
};
export const Str2Obj = str => {
    if (str) {
        return JSON.parse(str.replace(/=-=-=/g,'"'));
    } else {
        return {};
    }
}

export {
    readFileAsDataURL
}
