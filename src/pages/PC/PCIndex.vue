<template>
	<div>
		<AddOnePointDetail ref="aopd"></AddOnePointDetail>
		<el-dialog
			custom-class="basemap-dialog"
			title="更换底图"
			:visible.sync="dialogBasemapVisible"
			width="50%">
			<el-row :gutter="20">
				<template v-for="bm in basemap">
					<el-col :span="12" :key="bm.key" style="margin-top: 10px;margin-bottom: 10px;padding-top: 10px;">
						<div style="">
							<div class="basemap-shadow" @click="changeBaseMap(bm.key)">
								<div v-show="bm.key === basemapkey" style="width: 100%;height: 100%;background: rgba(0,0,0,0.1);text-align: center;">
									<i style="line-height: 260px;color: #50a6ff;font-size: 80px;" class="el-icon-check"></i>
								</div>
							</div>
							<div style="padding: 10px;display: flex;flex-direction: column;">
								<img :src="`./basemap-image/${bm.key}.png`" alt="" width="200" height="200" style="margin: auto;">
								<el-button type="text" style="width: 100%;">
									{{bm.name}}
								</el-button>
							</div>
						</div>
					</el-col>
				</template>
			</el-row>
		</el-dialog>
		<div class="top-center" v-show="marker_click">
			<el-button type="text" @click="addOnePointDetail">添加地点</el-button>
			<i class="el-icon-close" style="line-height: 40px;float: right;padding-right: 5px;" @click="removeMarker"></i>
		</div>
		<div class="left-bottom" :style="{backgroundImage: `url(./basemap-image/${basemapkey}.png)`}" @click="dialogBasemapVisible=true">
		</div>
		<div class="right-bottom" @click="()=>{}">
			<!--退出登录-->
			<i class="el-icon-close"></i>
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

let marker = null;
let latlng = null;
export default {
	name: "PCIndex",
	props: {
		ifr: {}
	},
	components: {AddOnePointDetail},
	data() {
		return {
			dialogBasemapVisible: false,
			basemap: [],
			basemapkey: null,
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
		changeBaseMap(key) {
			if (key === this.basemapkey) {
				return;
			}
			this.$addin.$leafletAPI.changeBaseMap(key);
			this.basemapkey = key;
		}
	},
	mounted() {
		window.$pc = this;
		console.log(this.$addin.$leafletAPI);
		this.basemap = this.$addin.$leafletAPI.get_basemap();
		this.basemapkey = this.$addin.$leafletAPI.get_current_basemap_key();
		addMarker(this)(this.addOnePoint.bind(this));
	}
}
</script>

<style>
.basemap-dialog {
	min-width: 500px !important;
}
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
	line-height: 40px;
	text-align: center;
	position: fixed;
	right: 10px;
	bottom: 20px;
	width: 40px;
	height: 40px;
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
.basemap-shadow {
	position: absolute;
	height: 260px;
	width: calc(50% - 20px);
}
</style>
