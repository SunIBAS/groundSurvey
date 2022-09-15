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

export {
    readFileAsDataURL
}
