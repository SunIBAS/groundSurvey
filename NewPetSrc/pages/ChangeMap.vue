<template>
	<div>
	<div class="left-bottom" @click="openDialog()">
		<img src="./../assets/layer.png" alt="">
	</div>
	<el-dialog
		ref="mapDialog"
		:fullscreen="dialogFullscreen"
		:custom-class="dialogTitleClass"
		:title=$lang.get("更换底图")
		:visible.sync="dialogBasemapVisible"
		:width="dialogWidth">
		<el-row :gutter="20">
			<template v-for="bm in basemap">
				<el-col :span="span" :key="bm.key" style="margin-top: 10px;margin-bottom: 10px;padding-top: 10px;">
					<div style="">
						<div :style="basemapShadowStyle" @click="changeBaseMap(bm.key)">
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
		<div class="basemap-close-btn" v-show="span===24" @click="dialogBasemapVisible = false">
			<!--退出登录-->
			<i class="el-icon-close"></i>
		</div>
	</el-dialog>
	</div>
</template>

<script>
export default {
	name: "ChangeMap",
	data() {
		return {
			dialogFullscreen: false,
			dialogBasemapVisible: false,
			basemap: [],
			basemapkey: '',
			dialogWidth: '50%',
			span: 12,
			basemapShadowStyle: {
				"position": "absolute",
				"height": "260px",
				"width": "calc(50% - 20px)",
			},
			dialogTitleClass: 'basemap-dialog'
		}
	},
	methods: {
		openDialog() {
			if (document.body.clientWidth < 600) {
				this.dialogWidth = '100%';
				this.span = 24;
				this.dialogFullscreen = true;
				this.$refs.mapDialog.style.minWidth = 'unset';
				this.basemapShadowStyle.width = 'calc(100% - 20px)';
				this.dialogTitleClass = 'basemap-dialog basemap-dialog-without-title';
			} else {
				this.dialogTitleClass = 'basemap-dialog';
				this.$refs.mapDialog.style.minWidth = '500px';
				this.dialogFullscreen = false;
				this.span = 12;
				this.basemapShadowStyle.width = 'calc(50% - 20px)';
				if (document.body.clientWidth * 0.5 < 500) {
					this.dialogWidth = '500px';
				} else {
					this.dialogWidth = '50%';
				}
			}
			this.dialogBasemapVisible = true;
		},
		changeBaseMap(key) {
			if (key === this.basemapkey) {
				return;
			}
			this.$addin.$leafletAPI.changeBaseMap(key);
			this.basemapkey = key;
			this.$parent.basemapkey = key;
		}
	},
	mounted() {
		this.basemap = this.$addin.$leafletAPI.get_basemap();
		this.basemapkey = this.$addin.$leafletAPI.get_current_basemap_key();
	}
}
</script>

<style>
	.basemap-dialog-without-title>.el-dialog__header {
		display: none;
	}
	.basemap-close-btn {
		line-height: 40px;
		text-align: center;
		position: fixed;
		right: 10px;
		top: 20px;
		width: 40px;
		height: 40px;
		background: white;
		border-radius: 60px;
		border: 2px solid #2196f3;
		background-size: 100%;
		cursor: pointer;
	}

	.left-bottom {
		position: fixed;
		left: 10px;
		bottom: 10px;
		width: 60px;
		height: 60px;
		background: white;
		border-radius: 60px;
		border: 2px solid white;
		background-size: 100%;
		cursor: pointer;
		padding: 10px;
		box-sizing: border-box;
		background: rgba(0,0,0,0);
	}
	.left-bottom img {
		width: 100%;
		height: 100%;
	}
</style>
