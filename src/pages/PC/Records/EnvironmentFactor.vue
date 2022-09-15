<template>
	<CommonRecord ref="cr"
		:form-setting="formSetting"
		title="环境要素"></CommonRecord>
</template>

<script>
import CommonRecord from "./CommonRecord";
import {
	FieldTypeInput,
	InputType
} from "./CommonRecordConst";
import {
	createEnvironmentFactorRecord,
	updateEnvironmentFactorRecord,
	deleteEnvironmentFactorRecord
} from "../../../api/selection";

export default {
	name: "EnvironmentFactor",
	components: {CommonRecord},
	data() {
		return {
			id: null,
			// FieldType,
			formSetting: [
				new FieldTypeInput("土壤湿度",'soilMoisture',InputType.number),
				new FieldTypeInput("土壤温度",'soilTemp',InputType.number),
				new FieldTypeInput("空气湿度",'airMoisture',InputType.number),
				new FieldTypeInput("空气温度",'airTemp',InputType.number),
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
			return createEnvironmentFactorRecord(this.id);
		},
		updateRecord(obj) {
			let updateObj = {
				"airMoisture": obj.airMoisture,
				"airTemp": obj.airTemp,
				"id": obj.id,
				"recordId": this.id,
				"latitude": obj.latitude,
				"longitude": obj.longitude,
				"soilMoisture": obj.soilMoisture,
				"soilTemp": obj.soilTemp,
			}
			return updateEnvironmentFactorRecord(updateObj).then(() => {
				this.$emit('updateRecord',updateObj);
				return '';
			});
		},
		deleteRecord(id) {
			return deleteEnvironmentFactorRecord(id).then(() => {
				this.$emit('deleteRecord',id);
				return '';
			});
		}
	}
}
</script>

<style scoped>

</style>
