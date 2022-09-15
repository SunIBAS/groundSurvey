<template>
	<div>
		<AddOnePointDetail ref="aopd"></AddOnePointDetail>
		<!-- 修改底图 -->
		<ChangeMap ref="cmap"></ChangeMap>
		<div :class="marker_class" :style="marker_css" v-show="marker_click">
			<el-button type="text" @click="addOnePointDetail">添加地点</el-button>
			<i class="el-icon-close" style="line-height: 40px;float: right;padding-right: 5px;" @click="removeMarker"></i>
		</div>
		<div class="right-bottom" @click="toCurrentLocation">
			<!--转到当前位置-->
			<i class="el-icon-map-location"></i>
		</div>
		<div class="right-top" @click="$refs.recordList.dialogVisible = true;">
			<!--历史列表-->
			<i class="el-icon-s-grid"></i>
		</div>
		<RecordList @loadMainRecordById="loadMainRecordById" ref="recordList"></RecordList>
		<div class="left-top" @click="logoutDialogVisible = true;">
			<!--退出登录-->
			<i class="el-icon-circle-close"></i>
		</div>

		<el-dialog
			title="登出"
			:visible.sync="logoutDialogVisible"
			width="80%">
			<span>去顶退出登录？</span>
			<span slot="footer" class="dialog-footer">
    <el-button @click="logoutDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="logout()">确 定</el-button>
  </span>
		</el-dialog>
	</div>
</template>

<script>
import AddOnePointDetail from "./AddOnePointDetail";
import {
	addMarker
} from "../../utils/mapAction";
import ChangeMap from "./ChangeMap";
import {
	getPosition
} from './../../utils/getGeoLocation'
import {
	logout
} from "../../api/UserApi";
import {
	Storage
} from "../../utils/storage";
import {
	checkOS,
	OS
} from "../../utils/checkOS";
import {
	createInvestRecord
} from "../../api/selection";
import RecordList from "./RecordList";

let marker = null;
let latlng = null;
export default {
	name: "PCIndex",
	props: {
		ifr: {}
	},
	components: {RecordList, ChangeMap, AddOnePointDetail},
	data() {
		return {
			marker_click: false,
			marker_class: 'top-center',
			marker_css: {
				width: '200px',
				left: 'calc(50% - 100px)',
			},
			logoutDialogVisible: false
		}
	},
	methods: {
		removeMarker() {
			if (marker) {
				this.$addin.$leafletAPI.removeLayer(marker);
			}
			marker = null;
			this.marker_click = false;
		},
		loadMainRecordById(id) {
			this.$refs.aopd.id = id;
			this.$refs.aopd.loadMainRecord();
			this.$refs.aopd.dialogVisible = true;
		},
		addOnePointDetail() {
			createInvestRecord().then(id => {
				this.$refs.aopd.id = id;
				this.$refs.aopd.dialogVisible = true;
				this.removeMarker();
				this.$refs.aopd.loadMainRecord(() => {
					this.$refs.aopd.form.latitude = latlng.lat;
					this.$refs.aopd.form.longitude = latlng.lng;
				});
			})
		},
		addOnePoint(time,_marker,_latlng) {
			if ('before' === time) {
				this.removeMarker();
			} else {
				marker = _marker;
				latlng = _latlng;
				this.marker_click = true;
			}
		},
		toCurrentLocation() {
			this.removeMarker();
			getPosition().then(p => {
				console.log(p);
				// this.$message(JSON.stringify(p));
				let zoom = this.$addin.$leafletAPI.get_map().getZoom();
				zoom = zoom > 15 ? zoom : 15;
				this.$addin.$leafletAPI.get_map().flyTo([p.lat,p.lng],zoom);
				this.addOnePoint('after',this.$addin.$leafletAPI.addMarker([p.lat,p.lng]),p);
			}).catch(e => {
				this.$message(e);
			})
		},
		// 退出登录
		logout() {
			this.logoutDialogVisible = false;
			logout().then(() => {
				Storage.set_user_info(null);
				window.location.reload();
			});
		}
	},
	mounted() {
		window.$pc = this;
		console.log(this.$addin.$leafletAPI);
		addMarker(this)(this.addOnePoint.bind(this));
		checkOS().then(ret => {
			if (ret === OS.Android) {
				this.marker_class = 'bottom-center';
			}
			if (window.innerWidth < 500) {
				this.marker_class = 'bottom-center';
			}
			this.marker_css.width = window.innerWidth - 190;
			this.marker_css.left = `calc(50% - 80px)`;
		});
	}
}
</script>

<style>
.addPointAction {
	position: fixed;
	bottom: 0px;
	margin: auto;
	width: 70%;
	text-align: center;
	background: white;
	left: 30%;
}
.top-center {
	position: fixed;
	top: 10px;
	width: 200px;
	height: 40px;
	background: white;
	background-size: 100%;
	line-height: 25px;
	left: calc(50% - 100px);
	text-align: center;
	border-radius: 5px;
}
.bottom-center {
	position: fixed;
	bottom: 30px;
	width: 200px;
	height: 40px;
	background: white;
	background-size: 100%;
	line-height: 25px;
	left: calc(50% - 100px);
	text-align: center;
	border-radius: 5px;
}
.left-bottom {
	position: fixed;
	left: 10px;
	bottom: 10px;
	width: 80px;
	height: 80px;
	background: white;
	border-radius: 60px;
	border: 2px solid white;
	background-size: 100%;
	cursor: pointer;
}
.right-bottom {
	line-height: 60px;
	text-align: center;
	position: fixed;
	right: 10px;
	bottom: 20px;
	width: 60px;
	height: 60px;
	background: white;
	border-radius: 60px;
	border: 2px solid white;
	background-size: 100%;
	cursor: pointer;
}
.right-top {
	line-height: 40px;
	text-align: center;
	position: fixed;
	right: 10px;
	top: 20px;
	width: 40px;
	height: 40px;
	background: white;
	border-radius: 60px;
	border: 2px solid white;
	background-size: 100%;
	cursor: pointer;
}
.left-top {
	line-height: 40px;
	text-align: center;
	position: fixed;
	left: 10px;
	top: 20px;
	width: 40px;
	height: 40px;
	background: white;
	border-radius: 60px;
	border: 2px solid white;
	background-size: 100%;
	cursor: pointer;
}
</style>
