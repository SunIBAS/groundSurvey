let empty_tile = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANQAAADSCAQAAACYjiaOAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAF0WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTEwLTI5VDExOjEwOjA5KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTEwLTI5VDExOjEwOjA5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0xMC0yOVQxMToxMDowOSswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4MGFiY2FiNS04ZjUxLTg5NDMtYTdiNC01Y2YwY2I2ZjlmZmYiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDphMWU0YTcwNi1jZTJkLWM3NDktOTAy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';
class MapDatabase {
    constructor() {
        this.option = {
            name: "main",
            path: "_doc/map.db",
        }
        this.open = false;
        this.init_time = 3;
    }
    close() {
        return new Promise((s,f) => {
            plus.sqlite.closeDatabase({
                name: 'main',
                success: function(e){
                    s();
                },
                fail: function(e){
                    // console.log(e);
                    s();
                }
            });
        }).then(() => {
            return this.init();
        })
    }
    init() {
        this.init_time--;
        if (!this.init_time) {
            alert("数据库打开错误，清重新安装应用(db open fail, please reinstall app.)")
            return;
        }
        let close_ = this.close.bind(this);
        return new Promise((s,f) => {
            // debugger
            let setOpen = () => this.open = true;
            let option = this.option;
            plus.io.getFileInfo({filePath: option.path,complete(e) {
                    if (e.code && e.code === -4) {
                        // 文件不存在
                        s();
                    } else if (e.size) {
                        plus.sqlite.openDatabase({
                            ...option,
                            success() {
                                setOpen();
                                s();
                            },
                            fail(e) {
                                if (e.code.toString() === "-1402") {
                                    // setOpen();
                                    // s();
                                    return close_().then(() => {
                                        s();
                                    });
                                } else {
                                    f(e);
                                }
                            }
                        });
                    }
                }
            })

        }).catch(e => {
            alert(e.message);
            if (e.code.toString() === "-1402") {
                // return this.createTable();
                return "";
            } else {
                throw e;
            }
        });
    }
    getxyz({x, y, z}) {
        if (!this.open) {
            return new Promise(s => s(""));
        }
        let sql = `select base64 from tiles LEFT JOIN maps where tiles.id == maps.hash and x=${x} and y=${y} and z=${z}`
        return new Promise((s,f) => {
            plus.sqlite.selectSql({
                name: "main",
                sql: sql,
                success: function(data){
                    // console.log('selectSql success: ');
                    // for(var i in data){
                    //     console.log(data[i]);
                    // }
                    if (data.length === 1) {
                        s(data[0].base64);
                    } else {
                        s(empty_tile);
                    }
                },
                fail: function(e){
                    // console.log('selectSql failed: '+JSON.stringify(e));
                    s(empty_tile);
                }
            });
        });
    }
    getMapSize() {
        if (!this.open) {
            return new Promise(s => s(0));
        }
        let sql = `select count(*) count from tiles;`;
        return new Promise((s,f) => {
            plus.sqlite.selectSql({
                name: "main",
                sql: sql,
                success: function(data){
                    // console.log('selectSql success: ');
                    // for(var i in data){
                    //     console.log(data[i]);
                    // }
                    if (data.length === 1) {
                        s(data[0].count);
                    } else {
                        s(0);
                    }
                },
                fail: function(e){
                    // console.log('selectSql failed: '+JSON.stringify(e));
                    s(0)
                }
            });
        })
    }
}
