class DownloadMap {
    constructor() {
        this.dom_created = false;
        this.mapdb_url = 'https://172.20.109.222:8081/map.db';
        this.mapdb = null;
        let dl_task = null;
        this.current_status = -1;
        this.id = null;
        this.downloadUi = null;
    }

    set_map_db(map) {
        this.mapdb = map;
    }

    // 确定是否已经下载好了地图数据库
    open_downloadDom() {
        return this.mapdb.getMapSize().then(s => {
            if (s === 0) {
                // return false;
                this.createDom(false);
            } else {
                this.createDom(true);
                // return true;
            }
        })
    }
    todownload(statusDom,stopDom,pauseDom,continueDom,setProcess) {
        setProcess = setProcess || (_=>_);
        this.dl_task = plus.downloader.createDownload(this.mapdb_url,{
            method: 'get',
            filename: this.mapdb.option.path,
            priority: 0,
            // timeout: 120, // 超时
            // retry: 3,    // 重试
            // retryInterval: 30, // 重试时间间隔
        });
        this.dl_task.addEventListener("statechanged",(download,status) => {
            if (status === 200) {
                this.current_status = download.state;
                switch (download.state) {
                    case 1:
                        statusDom.innerHTML = "开始请求下载<br/>Start to request."
                        // 开始请求下载
                        break;
                    case 2:
                        statusDom.innerHTML = "下载请求已经被接受<br/>Download request is accepted."
                        // 下载请求已经被接受
                        break;
                    case 3:
                        var progressVal = (download.downloadedSize / download.totalSize);
                        setProcess(progressVal);
                        statusDom.innerHTML = "正在下载<br/>Download..."
                        // 开始接受数据
                        break;
                    case 4:
                        setProcess(1);
                        statusDom.innerHTML = "下载完成<br/>Download complete."
                        this.dl_task = null;
                        this.update_state_on_dom(true,false,false);
                        plus.nativeUI.alert("即将重启应用(Application will be restart.)");
                        setTimeout(() => {
                            plus.runtime.restart()
                        },5000);
                        // 下载完成
                        break;
                    case 5:
                        statusDom.innerHTML = "下载已被暂停<br/>Download is paused."
                        // 下载已经暂停
                        break;
                    default:
                        statusDom.innerHTML = "未知状态<br/>Unknown status."
                        // 未知状态
                        break;
                }
            }/* else {
                statusDom.innerHTML = "下载失败<br/>Download fail."
                // this.stopDownload(true);
                // 下载失败
            }*/
        },false);
        this.dl_task.start();

        stopDom.onclick = this.stopDownload;
        pauseDom.onclick = this.pauseDownload;
        continueDom.onclick = this.continueDownload;

        this.update_state_on_dom(false,true,false,false,false,true);
    }
    pauseDownload() {
        if (this.dl_task && (this.current_status === 2 || this.current_status === 3)) {
            this.dl_task.pause();
            this.update_state_on_dom(false,true,false,true,true,false);
        }
    }
    stopDownload(force) {
        if (this.dl_task && (force || this.current_status === 2 || this.current_status === 3)) {
            this.dl_task.abort();
            this.dl_task = null;
            this.current_status = -1;
            this.update_state_on_dom(false,false,true);
        }
    }
    // 继续下载
    continueDownload() {
        if (this.dl_task && this.current_status === 5) {
            this.dl_task.start();
            this.dl_task = null;
        }
    }
    createDom(downloaded) {
        if (!this.dom_created) {
            let style = `<style>
        .download_ui {
            position: absolute;
            z-index: 100;
            background: aliceblue;
            opacity: 0.8;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
        }
        .download_ui_content {
            width: 100vw;
            padding: 20% 20px;
            box-sizing: border-box;
            height: 100vh;
        }
        .download_ui_content_img {
            width: 80%;
            padding: 0 10%;
        }
        .download_ui_content_img_mask {
            width: 100%;
            height: 0%;
            display: block;
            position: absolute;
            background: #f0f8ff;
            opacity: 0.6;
            bottom: 0;
        }
        .download_ui_content_img_num {
            width: 100%;
            position: absolute;
            bottom: 0;
            text-align: center;
            font-size: 100px;
            height: 100%;
            display: table;
        }
        .download_ui_content_img_num span {
            display: table-cell;
            vertical-align: middle;
        }
        .download_btn {
            font-size: 20px;
            background: #2196f3d4;
            padding: 5px;
            border-radius: 5px;
            margin: 5px 0;
            box-shadow: 0px 0px 1px 1px #d3d1d1;
        }
        .download_disable_btn {
            background: gray;
        }
        .downloading_text {
            font-size: 20px;
            text-align: center;
            margin: 8px 0;
            background: #f0f8ff33;
            padding: 5px;
            border-radius: 5px;
        }
        </style>`;
            this.id = `map_download_${new Date().getTime()}`;
            let downloadUi = document.createElement('div');
            this.downloadUi = downloadUi;
            downloadUi.classList.add("download_ui");
            downloadUi.innerHTML = `
        <div class="download_ui_content">
            <div style="text-align: right;height: 45px;line-height: 0px;">
                <span class="download_btn" id="${this.id}_close">关闭 / Close</span>
            </div>
            <div style="width: 100%;position: relative;">
                <div class="download_ui_content_img_mask" id="${this.id}_download_mask"></div>
                <div class="download_ui_content_img_num">
                    <span id="${this.id}_download_num">
                        100%
                    </span>
                </div>
                <img src="./img/MAP.png" class="download_ui_content_img" alt="">
            </div>
            <div style="margin-top: 50px;">
                <div class="start_download" style="display: none;" id="${this.id}_start_download">
                    <div style="width: 100%;text-align: center;" class="download_btn">下载/Download</div>
                </div>
                <div class="over_download" style="display: none;" id="${this.id}_download_over">
                    <div style="width: 100%;text-align: center;" class="download_btn">已下载/Downloaded</div>
                </div>
                <div class="downloading" style="display: none;" id="${this.id}_downloading">
                    <div class="download_btn" style="flex: 1;text-align: center;margin: 0 5px 0 0px;" id="${this.id}_continue_download">继续下载<br/>Continue</div>
                    <div class="download_btn" style="flex: 1;text-align: center;margin: 0 5px 0 5px;" id="${this.id}_pause_download">暂停<br/>Pause</div>
                    <div class="download_btn" style="flex: 1;text-align: center;margin: 0 0px 0 5px;" id="${this.id}_abort_download">中止<br/>Abort</div>
                </div>
                <div class="downloading" style="display: none;">
                    <div class="downloading_text" id="${this.id}_download_text">正在下载/Downloading</div>
                </div>
            </div>
        </div>`;
            document.head.innerHTML += style;
            document.body.append(downloadUi);
            document.getElementById(`${this.id}_close`).onclick = function () {
                downloadUi.style.display = 'none';
            };
        } else {
            this.downloadUi.style.display = 'unset';
        }
        let setProcess = pec => {
            document.getElementById(`${this.id}_download_num`).innerText = (Math.floor(pec * 10000) / 100) + "%";
            document.getElementById(`${this.id}_download_mask`).style.height = ((1 - pec) * 100) + "%";
        }
        this.dom_created = true;

        if (downloaded) {
            document.getElementById(`${this.id}_download_over`).style.display = 'block';
        } else {
            let start_download_btn = document.getElementById(`${this.id}_start_download`);
            setProcess(0);
            start_download_btn.style.display = 'block';
            start_download_btn.onclick = () => this.todownload(
                document.getElementById(`${this.id}_download_text`),
                document.getElementById(`${this.id}_abort_download`),
                document.getElementById(`${this.id}_pause_download`),
                document.getElementById(`${this.id}_continue_download`),
                setProcess
            );
        }
    }
    // 将状态变化映射到 dom 上
    update_state_on_dom(download_over,download_ing,download_start,pause_disable,abort_disable,continue__disable) {
        document.getElementById(`${this.id}_download_over`).style.display = download_over ? 'block' : 'none';
        // document.getElementById(`${this.id}_downloading`).style.display = download_ing ? 'flex' : 'none';
        document.getElementById(`${this.id}_downloading`).style.display = 'none';
        document.getElementById(`${this.id}_start_download`).style.display = download_start ? 'block' : 'none';
        if (download_ing) {
            document.getElementById(`${this.id}_close`).style.display = 'none';
        } else {
            document.getElementById(`${this.id}_close`).style.display = 'block';
        }

        let upadate_classlist = (id,disable) => {
            let dom = document.getElementById(id);
            dom.classList.remove('download_disable_btn');
            if (disable) {
                dom.classList.add('download_disable_btn');
            }
        }
        upadate_classlist(`${this.id}_abort_download`,abort_disable);
        upadate_classlist(`${this.id}_pause_download`,pause_disable);
        upadate_classlist(`${this.id}_continue_download`,continue__disable);
    }
}
