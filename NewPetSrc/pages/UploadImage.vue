<template>
	<div>
		<el-upload v-show="!offline"
				   accept="image/*"
				   class="avatar-uploader"
				   :auto-upload="false"
				   action=""
				   :show-file-list="false"
				   :on-change="handleAvatarSuccess">
			<i style="padding: 0 10px;" class="el-icon-plus avatar-uploader-icon"></i>
		</el-upload>
		<div v-show="offline" @click="drawer=true"
			 style="text-align: center;border: 1px black dashed;padding: 10px;box-sizing: border-box;">
			<i style="padding: 0 10px;" class="el-icon-plus avatar-uploader-icon"></i>
		</div>
		<el-drawer :modal="false"
				   :size="100"
			:withHeader="false"
			:visible.sync="drawer"
			direction="btt">
			<div style="display: flex;flex-direction: row;height: 100%;width: 100%;padding: 5px;">
				<div class="upload-image-col" @click="openImage('camera')">
					<i class="el-icon-camera"></i>
				</div>
				<div style="height: 100%;width: 2px;background: gray;"></div>
				<div class="upload-image-col" @click="openImage('gallery')">
					<i class="el-icon-picture-outline"></i>
				</div>
			</div>
		</el-drawer>
	</div>
</template>

<script>
import {
	OpenImageRetureBinary
} from "../api/nativeApi";

export default {
	name: "UploadImage",
	props: {
		offline: {
			type: Boolean,
			default() {
				return false;
			}
		}
	},
	data() {
		return {
			drawer: false
		}
	},
	methods: {
		handleAvatarSuccess(response,offline) {
			this.$emit('handleAvatarSuccess',response.raw,offline || false);
		},
		openImage(type) {
			this.drawer = false;
			OpenImageRetureBinary(type).then(raw => {
				if (raw) {
					this.handleAvatarSuccess({raw},true);
				}
			});
		}
	}
}
</script>

<style>
.upload-image-col {
	width: calc(50% - 1px);
	height: 100%;
	background: #ffffff;
	text-align: center;
	line-height: 100px;
	font-size: 40px;
}
</style>
