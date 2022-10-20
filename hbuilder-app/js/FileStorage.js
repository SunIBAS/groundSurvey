const FileStorage = {
    savebase64ToBitmap(base64,filename) {
        return new Promise((s,f) => {
            // var path ="_doc/project_barcode.jpg";
            var options = {"overwrite":true,"format":"jpg","quality":50}
            var bm = new  plus.nativeObj.Bitmap("barcode")//path: ( String ) 可选 Bitmap对象自动加载图片的地址
            bm.loadBase64Data( base64, function () {
                bm.save( filename, options, function (e) {
                    s(e.target);
                }, function (err) {
                    f(err)
                });//将图片保存到指定的路径（仅支持本地文件系统）
                //保存到相册后，回收Bitmap图片内存
                setTimeout(() => {
                    bm.recycle();
                },1000);
            }, function (err) {
                f(err);
            });//加载base64为数据到bm实例对象
        }).catch(e => {
            alert(e.message);
            console.log(e);
            return e;
        })
    },
    readBitmapToBase64(path) {
        return new Promise((s,f) => {
            var bm = new  plus.nativeObj.Bitmap("barcode")//path: ( String ) 可选 Bitmap对象自动加载图片的地址
            bm.load(path,function () {
                s(bm.toBase64Data());
                setTimeout(() => {
                    bm.recycle();
                },1000);
            },function (err) {
                f(err);
            })
        }).catch(e => {
            alert(e.message);
            console.log(e);
            return e;
        });
    }
}
