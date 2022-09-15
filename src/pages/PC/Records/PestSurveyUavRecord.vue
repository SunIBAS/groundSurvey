<template>
	<CommonRecord
		ref="cr"
		:form-setting="formSetting"
		title="机-地虫害调查表"></CommonRecord>
</template>

<script>
import CommonRecord from "./CommonRecord";
import {
	FieldTypeImage,
	FieldTypeInput,
	FieldTypeImageArray,
} from "./CommonRecordConst";
import {
	createPestSurveyUavRecord,
	deletePestSurveyUavRecord,
	updatePestSurveyUavRecord,
	insertPestSurveyUavRecordImageRecord,
	uploadImage
} from "../../../api/selection";

export default {
	name: "PestSurveyUavRecord",
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
			return createPestSurveyUavRecord(this.id);
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
			return updatePestSurveyUavRecord(updateObj).then(() => {
				this.$emit('updateRecord', updateObj);
				return '';
			});
		},
		deleteRecord(id) {
			return deletePestSurveyUavRecord(id).then(() => {
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
				return updatePestSurveyUavRecord(obj).then(() => {
					return url;
				});
			});
		},
		uploadImage_PestCollRecord_single_image_record(img,pestCollRecordId) {
			let name = 'PestCollRecord-single-image';
			return uploadImage(img,name).then(url => {
				let obj = {
					"img": url,
					"pestSurveyUAVRecordId": pestCollRecordId,
				};
				return insertPestSurveyUavRecordImageRecord(obj).then(() => {
					return url;
				});
			});
		}
	}
}
</script>

<style scoped>

</style>
