<template>
	<el-form label-width="120px" label-position="top" class="my-form">
		<el-form-item v-for="formItem in formItems" :label="formItem.label" :key="formItem.name">
			<el-select style="width: 100%;" v-model="formItem.value"
					   @change="updateChange" :disabled="!edit"
					   clearable placeholder="请选择">
				<el-option
					v-for="item in formItem.options"
					:key="item.id"
					:label="item.label"
					:value="item.id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="图片">
			<el-upload v-show="edit"
			    accept="image/*"
				class="avatar-uploader"
				:auto-upload="false"
				action=""
				:show-file-list="false"
				:on-change="handleAvatarSuccess">
				<i style="padding: 0 10px;" class="el-icon-plus avatar-uploader-icon"></i>
			</el-upload>
			<div class="dpp-images" style="padding-top: 5px;">
				<img v-for="(url,ind) in images.urls" :src="url" :key="ind" alt="">
			</div>
			<div class="dpp-images">
				<MyImage v-for="(src,ind) in images.sources" :src="src.imgUrl" :key="ind"></MyImage>
			</div>
		</el-form-item>
	</el-form>
</template>

<script>
import MyImage from "./MyImage";

export default {
	name: "DpdForm",
	components: {MyImage},
	props: {
		edit: {
			type: Boolean,
			require: true,
		},
		drawerType: {
			type: String,
		},
		formItems: {
			type: Array,
			default() {
				return []
			}
		}
	},
	data() {
		return {
			recordId: '',
			images: {
				sources: [], // 源链接
				urls: [], // base64
			}
		}
	},
	methods: {
		updateChange() {
			// if (!this.edit) return;
			let obj = {};
			this.formItems.forEach(o => {
				if (o.value) obj[o.name] = o.value;
			});
			this.$emit('updateChange',obj);
		},
		setImage(images) {
			console.log(images)
			this.images.sources.splice(0,this.images.sources.length);
			this.images.urls.splice(0,this.images.urls.length);
			if (images instanceof Array) {
				this.images.sources.splice(0,0,...images);
			}
		},
		handleAvatarSuccess(response) {
			this.$parent.$parent.handleAvatarSuccess(this.drawerType,response).then(({url/*,file_path*/}) => {
				this.images.urls.push(url);
				// 将 file_path 提交
			});
		},
	},
	mounted() {
		window.$dpf = this;
	}
}
</script>

<style>
.avatar-uploader {
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
	text-align: center;
	border: 2px dotted gray;
}
.avatar-uploader div{
	width: 100%;
}
.dpp-images img {
	width: 100%;
	padding-top: 5px;
}
</style>
