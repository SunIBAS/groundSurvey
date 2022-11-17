<template>
    <div>
        <el-dialog title="设置 / Setting" width="90%" :visible.sync="dialogTableVisible">
            <el-form label-position="top" class="setting-form">
                <el-form-item>
                    <el-button style="width: 100%;" type="primary" @click="backToCreate">{{$lang.get('退出记录历史页面')}}</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="text" @click="setSearchTime(1)">最近一天<br/>Last day</el-button>
                    <el-button type="text" @click="setSearchTime(7)">最近一周<br/>Last week</el-button>
                    <el-button type="text" @click="setSearchTime(30)">最近一个月<br/>Last month</el-button>
                    <el-button type="text" @click="setSearchTime(365)">最近一年<br/>Last month</el-button>
                </el-form-item>
                <el-form-item :label="$lang.get('开始日期')">
                    <el-date-picker
                            style="width: 100%;"
                            v-model="dateFrom"
                            type="date">
                    </el-date-picker>
                </el-form-item>
                <el-form-item :label="$lang.get('结束日期')">
                    <el-date-picker
                            style="width: 100%;"
                            v-model="dateTo"
                            type="date">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 100%;" type="primary" @click="toSearch">{{$lang.get('查询')}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <div>
            <div class="recordListSettingBottomPanel left" v-show="mode === Mode.record && recordCount">
                <el-button v-show="recordCount > 1" type="primary"
                           @click="nextOne(-1)"
                           icon="el-icon-arrow-up"></el-button>
                <div style="margin-top: 5px;">
                    <span v-if="currentRecordIndex === -1">-</span>
                    <span v-else>{{ currentRecordIndex + 1 }}</span>
                    <div style="transform: rotateX(77deg) rotateY(-28deg);background: #3f51b5;margin: 0 10px;height: 10px;border-radius: 2px;"></div>
                    {{ recordCount }}
                </div>
                <el-button v-show="recordCount > 1" type="primary"
                           @click="nextOne(1)"
                           icon="el-icon-arrow-down"></el-button>
            </div>
            <div class="recordListSettingBottomPanel" v-show="mode === Mode.record">
                <el-button v-show="oneMarkClickId !== -1" type="primary"
                           @click="loadMainRecordById(true)"
                           icon="el-icon-edit"></el-button>
                <el-button v-show="oneMarkClickId !== -1" type="primary"
                           @click="loadMainRecordById(false)"
                           icon="el-icon-document-checked"></el-button>
                <el-button v-show="oneMarkClickId !== -1" type="primary"
                           @click="deleteRecord"
                           icon="el-icon-delete"></el-button>
                <el-button v-show="recordCount > 0" type="primary"
                           @click="zoomToAll"
                           icon="el-icon-full-screen"></el-button>
                <el-button v-show="oneMarkClickId === -1 & recordCount > 0" type="primary"
                           @click="toSearch"
                           icon="el-icon-refresh-left"></el-button>
                <el-button type="primary"
                           @click="dialogTableVisible = true"
                           icon="el-icon-search"></el-button>
                <el-button type="primary" v-show="oneMarkClickId !== -1"
                           @click="zoomToAll();removeMarkerSelected();"
                           icon="el-icon-circle-close"></el-button>
                <el-button type="primary" v-show="oneMarkClickId === -1"
                           @click="backToCreate"
                           icon="el-icon-circle-close"></el-button>
            </div>
            <div class="recordListSettingBottomPanelCircle">
                <div class="circle"></div>
                <div class="line"></div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    GetRecordListNotPage
} from "../api/apis";
import {addMarkerWithAction} from "../utils/mapAction";
import {DeleteRecordById} from "../api/UpperApi";
import {
    getDateTSByOneDay,
    TS_Tag,
} from "../utils/time";
import {
    Mode
} from "../utils/Fields";

let _addMarkerWithAction = null;
let _tmpArr = [];

export default {
    name: "RecordListSetting",
    props: {
        mode: {
            type: String,
            default() {
                return 'create'
            }
        }
    },
    data() {
        return {
            dialogTableVisible: false,
            dateFrom: '',
            dateTo: '',
            oneMarkClickId: -1,
            currentRecordIndex: -1,
            recordCount: -1,
            Mode
        }
    },
    methods: {
        setSearchTime(days) {
            this.dateFrom = new Date();
            this.dateFrom.setTime(this.dateFrom.getTime() - 3600 * 1000 * 24 * days);
        },
        nextOne(dir) {
            // dir === -1 // 前一个
            // dir === 1 // 后一个
            let {marker,index} = _addMarkerWithAction.getNextOneMarker(this.oneMarkClickId,dir);
            this.markerClick({target: marker});
            _addMarkerWithAction.highlightAndStopFlash(marker);
            this.currentRecordIndex = index;
        },
        backToCreate(tmp) {
            this.$emit('backToCreate',tmp);
            _addMarkerWithAction.clearMarkers()
        },
        // type = ['delete','update']
        // id = recordId
        // latlng 修改的情况下会传递经纬度
        backToRecord(type,id,latlng) {
            setTimeout(() => {
                this.dialogTableVisible = false;
            },200);
            console.log(type,id,latlng);
            let ind = -1;
            for (let i = 0;i < _tmpArr.length;i++) {
                if (_tmpArr[i].id === id) {
                    ind = i;
                    break;
                }
            }
            if (type === 'delete') {
                _tmpArr.splice(ind,1);
            } else if (type === 'update') {
                _tmpArr[ind].lat = latlng.lat;
                _tmpArr[ind].lng = latlng.lng;
            }
            this.recordCount = _tmpArr.length;
            _addMarkerWithAction.drawMarker(_tmpArr);
        },
        removeMarkerSelected() {
            this.oneMarkClickId = -1;
            this.currentRecordIndex = -1;
            _addMarkerWithAction.highlightAndStopFlash(-1);
        },
        show() {
            this.dialogTableVisible = true;
            this.oneMarkClickId = -1;
            this.currentRecordIndex = -1;
        },
        toSearch() {
            this.oneMarkClickId = -1;
            this.currentRecordIndex = -1;
            _tmpArr = [];
            GetRecordListNotPage(getDateTSByOneDay(this.dateFrom,TS_Tag.start),getDateTSByOneDay(this.dateTo,TS_Tag.end))
                /*.then(_=>_.data)*/.then(arr => {
                this.recordCount = arr.length;
                if (this.recordCount === 0) {
                    this.$message({
                        message: this.$lang.get("没有记录"),
                        showClose: true,
                    });
                } else {
                    _addMarkerWithAction.drawMarker(arr)
                    _tmpArr = arr;
                }
                this.dialogTableVisible = false;
                // arr = [
                //     {
                //         "id": 76,
                //         "surveyTime": 1667964574947,
                //         "lat": 23.086715,
                //         "lng": 114.423523,
                //     }
                // ]
            });
        },
        markerClick(obj) {
            console.log(obj);
            this.$addin.$leafletAPI.flyTo(obj.target._latlng);
            let id = obj.target.objid; // recordId
            this.oneMarkClickId = id;
            this.currentRecordIndex = _addMarkerWithAction.getIndex(obj.target.objid);
            window.marker = obj;
            console.log(id);
        },
        zoomToAll() {
            _addMarkerWithAction.flyToBounds();
        },
        loadMainRecordById(edit) {
            this.backToCreate(true);
            this.$emit('loadMainRecordById',this.oneMarkClickId,edit,this.offline);
        },
        deleteRecord() {
            this.$confirm(this.$lang.get('此操作将永久删除该记录, 是否继续?'), this.$lang.get('提示'), {
                confirmButtonText: this.$lang.get('确定'),
                cancelButtonText: this.$lang.get('取消'),
                type: 'warning'
            }).then(() => {
                DeleteRecordById(this.oneMarkClickId).then(() => {
                    this.$message({
                        type: 'success',
                        message: this.$lang.get('删除成功!')
                    });
                    _addMarkerWithAction.removeMarker(this.oneMarkClickId);
                    this.oneMarkClickId = -1;
                    this.currentRecordIndex = -1;
                    this.toSearch()
                });
            }).catch(e => {
                console.log(e);
                this.$message({
                    type: 'info',
                    message: this.$lang.get('已取消删除')
                });
            });
        }
    },
    mounted() {
        this.dateFrom = new Date();
        this.dateFrom.setTime(this.dateFrom.getTime() - 3600 * 1000 * 24);
        this.dateTo = new Date();
        _addMarkerWithAction = addMarkerWithAction(this);
    }
}
</script>

<style scoped>
.recordListSettingBottomPanel {
    position: fixed;
    right: 20px;
    width: 60px;
    /*height: 140px;*/
    /*top: calc(50% - 120px);*/
    top: 50%;
    transform: translateY(-50%);
    border: 2px solid #2196f3;
    text-align: center;
    padding: 4px 4px 8px;
    border-radius: 6px;
    background: #46798c;
    /*padding-bottom: 8px;*/
}
.recordListSettingBottomPanel.left {
    left: 20px;
}
.recordListSettingBottomPanel button {
    margin-left: 0 !important;
    margin-top: 5px;
}
</style>