<template>
	<div>
		<AddOnePointDetail ref="aopd"></AddOnePointDetail>
		<RecordList @loadMainRecordById="loadMainRecordById" ref="recordList"></RecordList>
		<ChangeMap ref="cmap"></ChangeMap>
		<div :class="marker_class" :style="marker_css" v-show="marker_click">
			<el-button type="text" @click="addOnePointDetail()">{{$lang.get('创建记录')}}</el-button>
			<i class="el-icon-close" style="line-height: 40px;float: right;padding-right: 5px;" @click="removeMarker"></i>
		</div>

		<div class="right-top" @click="toCurrentLocation">
			<!--转到当前位置-->
			<img src="./../assets/locate.png" alt="">
		</div>

		<div class="right-bottom" @click="openRecords">
			<!--历史列表-->
			<i class="el-icon-s-grid"></i>
		</div>

		<Setting/>

	</div>
</template>

<script>
import ChangeMap from "./RecordList";
// import {createInvestRecord} from "../../src/api/selection";
import {getPosition} from "../utils/getGeoLocation";
import {addMarker} from "../../src/utils/mapAction";
import AddOnePointDetail from "./AddOnePointDetail";
import RecordList from "./RecordList";
import Setting from "./Setting";
let marker = null;
let latlng = null;
export default {
	name: "PageIndex",
	components: {Setting, RecordList, AddOnePointDetail, ChangeMap},
	props: {
		ifr: {}
	},
	data() {
		return {
			showForm: false,
			marker_click: false,
			marker_class: 'top-center',
			marker_css: {
				width: '200px',
				left: 'calc(50% - 100px)',
			},
			needToSetNewMarker: false,
		};
	},
	methods: {
		openRecords() {
			this.$refs.recordList.dialogVisible = true;
			this.$nextTick(() => {
				this.$refs.recordList.refreshRecords();
			});
		},
		setNewMarker(latlng) {
			this.needToSetNewMarker = false;
			this.removeMarker(latlng);
			marker = this.$addin.$leafletAPI.addMarker({lat: latlng.lat || 0,lng: latlng.lng || 0});
			this.$addin.$map.flyTo(latlng);
		},
		removeMarker() {
			if (marker) {
				this.$addin.$leafletAPI.removeLayer(marker);
			}
			marker = null;
			this.marker_click = false;
		},
		loadMainRecordById(id,edit) {
			this.needToSetNewMarker = true;
			this.$refs.recordList.dialogVisible = false;
			// this.addOnePointDetail(id);
			this.$refs.aopd.newForm({id: id || null});
			this.$refs.aopd.dialogVisible = true;
			this.$refs.aopd.edit = edit;
			this.ifr.style.height = '30%';
			this.showForm = true;
			this.marker_click = false;
		},
		addOnePointDetail(id) {
			this.$refs.aopd.edit = true;
			this.$refs.aopd.newForm({...latlng,id: id || null});
			this.$refs.aopd.dialogVisible = true;
			this.ifr.style.height = '30%';
			this.showForm = true;
			this.marker_click = false;
			// this.removeMarker();
			// this.removeMarker();
			// this.$refs.aopd.loadMainRecord(() => {
			// 	this.$refs.aopd.form.latitude = latlng.lat;
			// 	this.$refs.aopd.form.longitude = latlng.lng;
			// });
		},
		addOnePoint(time,_marker,_latlng) {
			this.removeMarker();
			if ('before' !== time) {
				// this.removeMarker();
				marker = _marker;
				latlng = _latlng;
				if (this.showForm) {
					this.$refs.aopd.newForm({...latlng,update:true});
				} else {
					this.marker_click = true;
				}
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
	},
	mounted() {
		addMarker(this)(this.addOnePoint.bind(this));
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
.right-bottom {
	font-size: 30px;
	line-height: 50px;
	text-align: center;
	position: fixed;
	right: 10px;
	bottom: 20px;
	width: 50px;
	height: 50px;
	background: white;
	border-radius: 60px;
	border: 2px solid white;
	background-size: 100%;
	cursor: pointer;
}
.right-bottom img {
	width: 100%;
	height: 100%;
}

.right-top {
	padding: 10px;
	box-sizing: border-box;
	line-height: 40px;
	text-align: center;
	position: fixed;
	right: 10px;
	top: 20px;
	width: 60px;
	height: 60px;
	background: white;
	border-radius: 60px;
	border: 2px solid white;
	background-size: 100%;
	cursor: pointer;
}
.right-top img {
	width: 100%;
	height: 100%;
}
</style>
