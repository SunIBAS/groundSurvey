<template>
	<CommonRecord
		ref="cr"
		:form-setting="formSetting"
		title="土壤湿度采集"></CommonRecord>
</template>

<script>
import CommonRecord from "./CommonRecord";
import {
	FieldTypeInput,
	FieldTable
} from "./CommonRecordConst";
import {
	createWheatYieldCollRecord,
	deleteWheatYieldCollRecord,
	updateWheatYieldCollRecord
} from "../../../api/selection";

let table = new FieldTable(
	'产量信息',
	['小麦产量'],
	['wheatSeedWeight'],
	[],
	['number']
);

export default {
	name: "WheatYieldCollRecord",
	components: {CommonRecord},
	data() {
		return {
			id: null,
			// FieldType,
			formSetting: [
				new FieldTypeInput("灾害类型",'disasterType'),
				new FieldTypeInput("防治措施",'solution'),
				table,
			]
		}
	},

	methods: {
		show() {
			this.$refs.cr.dialogVisible = true;
		},
		setList(list) {
			// console.log(list);
			list = list.map(_ => {
				return {
					..._,
					[table.name]: table.createEmpty().setValue(
						table.fields.map(k => _[k])
					)
				}
			});
			this.$refs.cr.list.splice(0, this.$refs.cr.list.length, ...list);
		},
		createRecord() {
			return createWheatYieldCollRecord(this.id);
			// return new Promise(s => s(1));
		},
		updateRecord(obj) {
			let updateObj = {
				"id": obj.id,
				"recordId": this.id,
				"latitude": obj.latitude,
				"longitude": obj.longitude,

				"disasterType": obj.disasterType,
				"solution": obj.solution,
				// "updateTime": "2022-07-30T15:34:37.955Z",
				"wheatSeedWeight": obj.wheatSeedWeight
			}
			return updateWheatYieldCollRecord(updateObj).then(() => {
				this.$emit('updateRecord', updateObj);
				return '';
			});
		},
		deleteRecord(id) {
			return deleteWheatYieldCollRecord(id).then(() => {
				this.$emit('deleteRecord', id);
				return '';
			});
		},
	},
	mounted() {
	}
}
</script>

<style scoped>

</style>
