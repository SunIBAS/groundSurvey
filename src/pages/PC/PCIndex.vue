<template>
	<div>
		<AddOnePointDetail ref="aopd"></AddOnePointDetail>
		<!-- 修改底图 -->
		<ChangeMap ref="cmap"></ChangeMap>
		<div class="top-center" v-show="marker_click">
			<el-button type="text" @click="addOnePointDetail">添加地点</el-button>
			<i class="el-icon-close" style="line-height: 40px;float: right;padding-right: 5px;" @click="removeMarker"></i>
		</div>
		<div class="right-bottom" @click="toCurrentLocation">
			<!--转到当前位置-->
			<i class="el-icon-map-location"></i>
		</div>
		<div class="right-top" @click="()=>{}">
			<!--历史列表-->
			<i class="el-icon-s-grid"></i>
		</div>
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

let marker = null;
let latlng = null;
export default {
	name: "PCIndex",
	props: {
		ifr: {}
	},
	components: {ChangeMap, AddOnePointDetail},
	data() {
		return {
			marker_click: false,
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
		addOnePointDetail() {
			this.$refs.aopd.dialogVisible = true;
			this.removeMarker();
			this.$refs.aopd.form.latlng.lat = latlng.lat;
			this.$refs.aopd.form.latlng.lng = latlng.lng;
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
		}
	},
	mounted() {
		window.$pc = this;
		console.log(this.$addin.$leafletAPI);
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
</style>
