<template>
	<CommonRecord
		ref="cr"
		:form-setting="formSetting"
		title="机-地病害数据采集表"></CommonRecord>
</template>

<script>
import CommonRecord from "./CommonRecord";
import {
	FieldTypeImage,
	FieldTypeInput,
	FieldTypeInputNumber,
} from "./CommonRecordConst";
import {
	createDiseaseDataCollUavRecord,
	deleteDiseaseDataCollUavRecord,
	updateDiseaseDataCollUavRecord,
	uploadImage
} from "../../../api/selection";

export default {
	name: "DiseaseDataCollUavRecord",
	components: {CommonRecord},
	data() {
		return {
			id: null,
			// FieldType,
			formSetting: [
				new FieldTypeInput("灾害类型",'diseaseType'),
				new FieldTypeInputNumber("调查总叶片数",'surveyLeaves'),
				new FieldTypeInputNumber("调查病害叶片数",'diseasedLeaves',),
				new FieldTypeImage("样点叶片图片",'siteCanopyImg',this.uploadImage_DiseaseDataCollUavRecord_quadratCanopyImg),
			]
		}
	},

	methods: {
		show() {
			this.$refs.cr.dialogVisible = true;
		},
		setList(list) {
			console.log(list);
			this.$refs.cr.list.splice(0,this.$refs.cr.list.length,...list);
		},
		createRecord() {
			return createDiseaseDataCollUavRecord(this.id);
		},
		updateRecord(obj) {
			let updateObj = {
				"id": obj.id,
				"recordId": this.id,
				"latitude": obj.latitude,
				"longitude": obj.longitude,

				"diseasedLeaves": 0,
				"diseaseType": "string",
				"quadratCanopyImg": "string",
				"quadratLeavesImg": "string",
				"surveyLeaves": 0,
			}
			return updateDiseaseDataCollUavRecord(updateObj).then(() => {
				this.$emit('updateRecord',updateObj);
				return '';
			});
		},
		deleteRecord(id) {
			return deleteDiseaseDataCollUavRecord(id).then(() => {
				this.$emit('deleteRecord',id);
				return '';
			});
		},
		/////////////////////////
		uploadImage_DiseaseDataCollUavRecord_quadratCanopyImg(img,id,) {
			let name = 'DiseaseDataCollUavRecord-quadratCanopyImg';
			return uploadImage(img,name).then(url => {
				let obj = {
					"id": id,
					siteCanopyImg: url,
					recordId: this.id
				};
				return updateDiseaseDataCollUavRecord(obj).then(() => {
					return url;
				});
			});
		},
	}
}
</script>

<style scoped>

</style>
