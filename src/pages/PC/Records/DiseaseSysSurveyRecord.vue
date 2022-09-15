<template>
	<CommonRecord
		ref="cr"
		:form-setting="formSetting"
		title="病害系统调查表"></CommonRecord>
</template>

<script>
import CommonRecord from "./CommonRecord";
import {
	FieldTypeInput,
	FieldTypeImage,
	FieldTypeInputNumber,
} from "./CommonRecordConst";
import {
	createDiseaseSysSurveyRecord,
	updateDiseaseSysSurveyRecord,
	deleteDiseaseSysSurveyRecord,
	uploadImage
} from "../../../api/selection";

export default {
	name: "DiseaseSysSurveyRecord",
	components: {CommonRecord},
	data() {
		return {
			id: null,
			// FieldType,
			formSetting: [
				new FieldTypeInput("灾害类型",'diseaseType'),
				new FieldTypeInputNumber("调查总叶片数",'surveyLeaves'),
				new FieldTypeInputNumber("调查病害叶片数",'diseasedLeaves',),
				new FieldTypeImage("样方冠城图片",'quadratCanopyImg',this.uploadImage_DiseaseSysSurveyRecord_quadratCanopyImg),
				new FieldTypeImage("样方叶片图片",'quadratLeavesImg',this.uploadImage_DiseaseSysSurveyRecord_quadratLeavesImg),
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
			return createDiseaseSysSurveyRecord(this.id);
		},
		updateRecord(obj) {
			let updateObj = {
				"id": obj.id,
				"recordId": this.id,
				"latitude": obj.latitude,
				"longitude": obj.longitude,

				"diseaseType": obj.diseaseType,
				"diseasedLeaves": obj.diseasedLeaves,
				// "quadratCanopyImg": obj.quadratCanopyImg,
				// "quadratLeavesImg": obj.quadratLeavesImg,
				"surveyLeaves": obj.surveyLeaves,
				// "updateTime": "2022-07-29T03:10:58.384Z"
			}
			return updateDiseaseSysSurveyRecord(updateObj).then(() => {
				this.$emit('updateRecord',updateObj);
				return '';
			});
		},
		deleteRecord(id) {
			return deleteDiseaseSysSurveyRecord(id).then(() => {
				this.$emit('deleteRecord',id);
				return '';
			});
		},
		/////////////////////////
		uploadImage_DiseaseSysSurveyRecord_quadratCanopyImg(img,id,) {
			let name = 'DiseaseSysSurveyRecord-quadratCanopyImg';
			return uploadImage(img,name).then(url => {
				let obj = {
					"id": id,
					quadratCanopyImg: url,
					recordId: this.id
				};
				return updateDiseaseSysSurveyRecord(obj).then(() => {
					return url;
				});
			});
		},
		uploadImage_DiseaseSysSurveyRecord_quadratLeavesImg(img,id,) {
			let name = 'DiseaseSysSurveyRecord-quadratLeavesImg';
			return uploadImage(img,name).then(url => {
				let obj = {
					"id": id,
					quadratLeavesImg: url,
					recordId: this.id
				};
				return updateDiseaseSysSurveyRecord(obj).then(() => {
					return url;
				});
			});
		}
	}
}
</script>

<style scoped>

</style>
