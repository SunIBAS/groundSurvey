function GetImageFromGallery() {
// 从相册中选择图片
    return new Promise((s,f) => {
        plus.gallery.pick( function(file){
            FileStorage.readBitmapToBase64(file).then(s);
        }, function () {
            f("取消选择");
        },{
            filter: "image",
            multiple: false,
            maximum: 1,
            system: false,
            onmaxed: function() {
                f("只能选择一张");
            }
        });
    })
};

function GetImageFromCamera() {
    return new Promise((s,f) => {
        var c = plus.camera.getCamera();
        c.captureImage(function(e) {
            plus.io.resolveLocalFileSystemURL(e, function(entry) {
                // s(entry.toLocalURL());
                FileStorage.readBitmapToBase64(entry.toLocalURL()).then(s);
            }, function(e) {
                f(e.message)
            });
        }, function(s) {
            f(s.message);
        }, {
            filename: "_doc/camera/"
        })
    })
};
