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
	createSoilMoistureCollRecord,
	deleteSoilMoistureCollRecord,
	updateSoilMoistureCollRecord
} from "../../../api/selection";

let table = new FieldTable(
	'土壤信息',
	['10cm土壤湿度','20cm土壤湿度','30cm土壤湿度','空气温度','空气湿度'],
	['depth_10','depth_20','depth_30','airTemp','airMoisture'],
	[],
	['number','number','number','number','number']
);

export default {
	name: "SoilMoistureCollRecord",
	components: {CommonRecord},
	data() {
		return {
			id: null,
			// FieldType,
			formSetting: [
				new FieldTypeInput("土壤类型",'soilType'),
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
			return createSoilMoistureCollRecord(this.id);
			// return new Promise(s => s(1));
		},
		updateRecord(obj) {
			let updateObj = {
				"id": obj.id,
				"recordId": this.id,
				"latitude": obj.latitude,
				"longitude": obj.longitude,

				"airMoisture": obj.airMoisture,
				"airTemp": obj.airTemp,
				"depth_10": obj.depth_10,
				"depth_20": obj.depth_20,
				"depth_30": obj.depth_30,
				// "siteId": 0,
				"soilType": obj.soilType,
				// "updateTime": "2022-07-29T08:32:52.081Z"
			}
			return updateSoilMoistureCollRecord(updateObj).then(() => {
				this.$emit('updateRecord', updateObj);
				return '';
			});
		},
		deleteRecord(id) {
			return deleteSoilMoistureCollRecord(id).then(() => {
				this.$emit('deleteRecord', id);
				return '';
			});
		},
	},
	mounted() {
		// this.setList(
		// 	[
		// 		{
		// 			// "airMoisture": "",
		// 			// "airTemp": "",
		// 			// "depth_10": "",
		// 			// "depth_20": "",
		// 			// "depth_30": "",
		// 			"id": 0,
		// 			"latitude": 0,
		// 			"longitude": 0,
		// 			"recordId": 0,
		// 			"soilType": "",
		// 			"createTime": "2022-07-29T09:28:15.054Z",
		// 			"updateTime": "2022-07-29T09:28:15.054Z",
		// 			[table.name]: table.createEmpty().setValue(['[1,2]','[2,3]','[3,4]','[4,5]','[6,7]'])
		// 		}
		// 	]
		// )
	}
}
</script>

<style scoped>

</style>
