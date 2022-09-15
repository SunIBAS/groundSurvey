<template>
	<CommonRecord
		ref="cr"
		:form-setting="formSetting"
		title="虫害采集"></CommonRecord>
</template>

<script>
import CommonRecord from "./CommonRecord";

import {
	createPestCollRecord,
	updatePestCollRecord,
	deletePestCollRecord,
	uploadImage,
	insertPestImgRecord,
} from "../../../api/selection";
import {
	FieldTypeInput,
	FieldTypeImageArray,
	FieldTypeImage,
} from "./CommonRecordConst";

export default {
	name: "PestCollRecord",
	components: {CommonRecord},
	data() {
		return {
			id: null,
			// FieldType,
			formSetting: [
				new FieldTypeInput("虫害类型",'pestType'),
				new FieldTypeImage("样方冠层图片",'quadratCanopyImg',this.uploadImage_PestCollRecord_quadratCanopyImg),
				new FieldTypeImageArray("每个植株的图片",'pestLeavesImgs',this.uploadImage_PestCollRecord_single_image_record),
			]
		}
	},

	methods: {
		show() {
			this.$refs.cr.dialogVisible = true;
		},
		setList(list) {
			console.log(list);
			this.$refs.cr.list.splice(0, this.$refs.cr.list.length, ...list);
		},
		createRecord() {
			return createPestCollRecord(this.id);
		},
		updateRecord(obj) {
			let updateObj = {
				"id": obj.id,
				"recordId": this.id,
				"latitude": obj.latitude,
				"longitude": obj.longitude,

				"pestType": "string",
				// "quadratCanopyImg": "string",
				// "updateTime": "2022-07-29T07:05:03.686Z"
			}
			return updatePestCollRecord(updateObj).then(() => {
				this.$emit('updateRecord', updateObj);
				return '';
			});
		},
		deleteRecord(id) {
			return deletePestCollRecord(id).then(() => {
				this.$emit('deleteRecord', id);
				return '';
			});
		},
		/////////////////////////=
		uploadImage_PestCollRecord_quadratCanopyImg(img,id,) {
			let name = 'PestCollRecord-quadratCanopyImg';
			return uploadImage(img,name).then(url => {
				let obj = {
					"id": id,
					quadratCanopyImg: url,
					recordId: this.id
				};
				return updatePestCollRecord(obj).then(() => {
					return url;
				});
			});
		},
		uploadImage_PestCollRecord_single_image_record(img,pestCollRecordId) {
			let name = 'PestCollRecord-single-image';
			return uploadImage(img,name).then(url => {
				let obj = {
					"img": url,
					"pestCollRecordId": pestCollRecordId,
				};
				return insertPestImgRecord(obj).then(() => {
					return url;
				});
			});
		}
	},
	mounted() {
		window.$PestCollRecord = this;
	}
}
</script>

<style scoped>

</style>
