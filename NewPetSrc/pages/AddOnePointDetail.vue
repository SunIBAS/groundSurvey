<template>
	<div>
		<div v-show="!edit && dialogVisible"
			 style="position: absolute;top: 0;height: 30%;
			 box-sizing: border-box;padding: 5px;
			 width: 100%;z-index: 1000;background: rgba(0,0,0,0.1);">
			{{$lang.get('仅查看')}}
		</div>
		<div v-show="dialogVisible" style="position:fixed;bottom: 0px;z-index: 1;background: white;height: 70%;overflow-y: scroll;">
			<div style="padding: 10px;font-size: 18px;font-weight: bold;position: fixed;z-index: 100;background: white;width: calc(100% - 20px);">
				<span v-if="edit">{{$lang.get('填写信息')}}</span>
				<span v-else>{{$lang.get('信息')}}</span>
				<span style="float: right;font-weight: bold;font-size: 14px;color: #686868;">
					<span @click="deleteRecord()" >{{$lang.get('删除记录')}}</span>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<span v-if="edit" @click="closeAndSave" style="float: right;font-weight: bold;font-size: 14px;color: #686868;">{{$lang.get('关闭并保存')}}</span>
					<span v-else @click="closeAndSave(false)" >{{$lang.get('关闭')}}</span>
				</span>
			</div>
			<el-form label-width="120px"
					 label-position="top" class="my-form">
				<el-form-item :label="$lang.get('坐标')">
					<el-row :gutter="20">
						<el-col :span="4">lat</el-col>
						<el-col :span="8">{{formData.lat || 'null'}}</el-col>
						<el-col :span="4">lng</el-col>
						<el-col :span="8">{{formData.lng || 'null'}}</el-col>
					</el-row>
				</el-form-item>
				<el-form-item :label="$lang.get('调查时间')">
					<el-row :gutter="5" style="margin: auto 0px !important;">
						<el-col :span="10">
							<el-date-picker :disabled="!edit"
											style="width: 100%"
											v-model="formData.surveyTime"
											type="date"
											@change="saving = false"
											:placeholder="$lang.get('日期')">
							</el-date-picker>
						</el-col>
						<el-col :span="10">
							<el-time-picker :disabled="!edit"
											style="width: 100%"
											@change="saving = false"
											v-model="formData.surveyTime"
											:placeholder="$lang.get('时间')">
							</el-time-picker>
						</el-col>
						<el-col :span="4">
							<el-button type="text" :disabled="!edit"
									   @click="setNow">Now</el-button>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item :label="$lang.get('土地类型')">
					<div style="border: 1px solid;border-radius: 5px;padding: 5px;" @click="openLandTypeSelection">
						<div v-if="formData.landMsg.landTypeId !== -1">
							<el-breadcrumb separator="/" style="width: 100%;">
								<el-breadcrumb-item v-for="lt in formData.landMsg.landTypeList" :key="lt">
									<el-button type="text">{{lt}}</el-button>
								</el-breadcrumb-item>
							</el-breadcrumb>
							<div>
								<el-tag v-for="(v,k) in formData.landMsg.attributeValueList" type="success" :key="k" style="margin-right: 4px;">
									{{k}}：{{v ? v : '/'}}
								</el-tag>
							</div>
						</div>
						<div v-else>
							<el-button style="width: 100%;" :disabled="!edit" type="text" @click="openLandTypeSelection">{{$lang.get('请选择')}}</el-button>
						</div>
					</div>
				</el-form-item>
				<el-form-item :label="$lang.get('作物类型')">
					<el-select style="width: 100%;" :disabled="!edit" v-model="formData.cropType" clearable :placeholder="$lang.get('请选择')">
						<el-option
							v-for="item in cropTypes"
							:key="item.id"
							:label="item.label"
							:value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
<!--				<el-form-item label="作物品种">-->
<!--					<el-input v-model="formData.cropVariety" placeholder="作物品种"></el-input>-->
<!--				</el-form-item>-->

				<el-form-item>
					<el-row :gutter="10">
						<el-col :span="8">
							<MyCard :title="$lang.get('病害信息')" :edit="edit"
									@open="drawerSetting.type = drawerTypes.disease;drawerSetting.visible = true;"
									:options="dpdForm[drawerTypes.disease]"></MyCard>
						</el-col>
						<el-col :span="8">
							<MyCard :title="$lang.get('虫害信息')" :edit="edit"
									@open="drawerSetting.type = drawerTypes.pest;drawerSetting.visible = true;"
									:options="dpdForm[drawerTypes.pest]"></MyCard>
						</el-col>
						<el-col :span="8">
							<MyCard :title="$lang.get('干旱信息')" :edit="edit"
									@open="drawerSetting.type = drawerTypes.drought;drawerSetting.visible = true;"
									:options="dpdForm[drawerTypes.drought]"></MyCard>
						</el-col>
					</el-row>
<!--					<el-button @click="drawerSetting.type = drawerTypes.disease;drawerSetting.visible = true;">病害信息</el-button>-->
<!--					<el-button @click="drawerSetting.type = drawerTypes.pest;drawerSetting.visible = true;">虫害信息</el-button>-->
<!--					<el-button @click="drawerSetting.type = drawerTypes.drought;drawerSetting.visible = true;">干旱信息</el-button>-->
				</el-form-item>

<!--				<el-form-item>-->
<!--					<el-button style="width: 100%" @click="updateRecord">提交</el-button>-->
<!--				</el-form-item>-->
			</el-form>
		</div>

<!--		<div class="aop_my_drawer" v-show="drawerSetting.visible">-->
		<el-drawer direction="btt" size="70%" :withHeader="false" :visible="drawerSetting.visible">
			<div style="padding: 10px;font-size: 18px;font-weight: bold;position: fixed;z-index: 100;background: white;width: 100%;">
				<span v-if="edit">{{$lang.get('填写信息')}}</span>
				<span v-else>{{$lang.get('信息')}}</span>
				<i style="float: right;" @click="drawerSetting.visible = false;" class="el-icon-close"></i>
			</div>
			<div style="padding: 10px;margin-top: 44px;">
				<!-- disease 病害 -->
				<DpdForm :edit="edit" v-show="drawerSetting.type === drawerTypes.disease"
						 :drawer-type="drawerTypes.disease"
						 :ref="`dpd_${drawerTypes.disease}`" :record-id="formData.id"
						 @updateChange="obj => updateChange(obj,drawerTypes.disease)"
						 :form-items="dpdForm[drawerTypes.disease]"></DpdForm>

				<DpdForm :edit="edit" v-show="drawerSetting.type === drawerTypes.pest"
						 :drawer-type="drawerTypes.pest"
						 :ref="`dpd_${drawerTypes.pest}`" :record-id="formData.id"
						 @updateChange="obj => updateChange(obj,drawerTypes.pest)"
						 :form-items="dpdForm[drawerTypes.pest]"></DpdForm>

				<DpdForm :edit="edit" v-show="drawerSetting.type === drawerTypes.drought"
						 :drawer-type="drawerTypes.drought"
						 :ref="`dpd_${drawerTypes.drought}`" :record-id="formData.id"
						 @updateChange="obj => updateChange(obj,drawerTypes.drought)"
						 :form-items="dpdForm[drawerTypes.drought]"></DpdForm>
			</div>
<!--		</div>-->
		</el-drawer>

		<LandTypeSelection @updateLandMsg="updateLandMsg" ref="landTypeSelection"></LandTypeSelection>
	</div>
</template>

<script>
import {
	CreateRecord,
	GetCropType,
	GetDiseaseType,
	GetSeverity,
	GetPestType,
	UploadDroughtImage,
	UploadDiseaseImage,
	UploadPestImage,
	GetRecord,
	UpdateRecord,
	DeleteRecordById,
} from "../api/apis";
import {
	formatLandMsg
} from "../utils/formatLandMsg";
import LandTypeSelection from "./LandTypeSelection";
import {readFileAsDataURL} from "../utils/htmlUtils";
import {Dirs, UploadImage} from "../api/apis";
import DpdForm from "./DpdForm";
import MyCard from "./MyCard";
const drawerTypes = {
	disease: 'disease',
	pest: 'pest',
	drought: 'drought'
};
const UploadImageMethod = {
	[drawerTypes.disease]: UploadDiseaseImage,
	[drawerTypes.pest]: UploadPestImage,
	[drawerTypes.drought]: UploadDroughtImage,
};
let tmpObj = {};

export default {
	name: "AddOnePointDetail",
	components: {MyCard, DpdForm, LandTypeSelection},
	data() {
		return {
			edit: false,

			drawerTypes,
			drawerSetting: {
				visible: false,
				type: 'disease',
			},
			dialogVisible: false,
			formData: {
				landMsg: {
					landTypeId: -1,
					// [天然林,用材林]
					attributeValues: {
					},
					landTypeList: [],
					attributeValueList: {
					}
				},
				"cropType": "",
				"cropVariety": "",
				"diseaseSeverity": "",
				"diseaseType": "",
				"droughtSeverity": "",
				"id": -1,
				"lat": 0,
				"lng": 0,
				"pestSeverity": "",
				"pestType": "",
				"surveyTime": 0,
			},
			dpdForm: {
				[drawerTypes.disease]: [
					{
						name: 'diseaseType',
						value: '',
						options: [],
						optionKey: {},
						label: this.$lang.get('病害类型'),
					},
					{
						name: 'diseaseSeverity',
						value: '',
						options: [],
						optionKey: {},
						label: this.$lang.get('病害程度'),
					},
				],
				[drawerTypes.pest]: [
					{
						name: 'pestType',
						value: '',
						options: [],
						optionKey: {},
						label: this.$lang.get('虫害类型'),
					},
					{
						name: 'pestSeverity',
						value: '',
						options: [],
						optionKey: {},
						label: this.$lang.get('虫害程度'),
					},
				],
				[drawerTypes.drought]: [
					{
						name: 'droughtSeverity',
						value: '',
						options: [],
						optionKey: {},
						label: this.$lang.get('干旱程度'),
					},
				]
			},

			pestTypes: [],
			pestSeverity: [],
			diseaseTypes: [],
			diseaseSeverity: [],
			droughtSeverity: [],
			cropTypes: [],
			pestTypeOptions: [],
		}
	},
	methods: {
		deleteRecord() {
			this.$confirm(this.$lang.get('此操作将永久删除该记录, 是否继续?'), this.$lang.get('提示'), {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				DeleteRecordById(this.formData.id).then(() => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					this.edit = false;
					this.closeAndSave();
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		openLandTypeSelection() {
			if (this.edit)
				this.$refs.landTypeSelection.open(this.formData.landMsg)
		},
		updateChange(obj,tar) {
			for (let i in obj) {
				this.formData[i] = obj[i];
			}
			for (let i in this.dpdForm[tar]) {
				this.dpdForm[tar][i].value = obj[this.dpdForm[tar][i].name];
			}
		},
		createRecord(id) {
			if (id) {
				GetRecord(id).then(obj => {
					this.formData.id = id;
					this.formData.lng = obj.lng;
					this.formData.lat = obj.lat;
					this.formData.cropType = obj.cropType;
					this.formData.diseaseType = obj.diseaseType;
					this.dpdForm[drawerTypes.disease][0].value = obj.diseaseType;
					this.formData.diseaseSeverity = obj.diseaseSeverity;
					this.dpdForm[drawerTypes.disease][1].value = obj.diseaseSeverity;

					this.formData.pestType = obj.pestType;
					this.dpdForm[drawerTypes.pest][0].value = obj.pestType;
					this.formData.pestSeverity = obj.pestSeverity;
					this.dpdForm[drawerTypes.pest][1].value = obj.pestSeverity;

					this.formData.droughtSeverity = obj.droughtSeverity;
					this.dpdForm[drawerTypes.drought][0].value = obj.droughtSeverity;

					let d = new Date();
					if (obj.surveyTime) {
						d.setTime(obj.surveyTime);
						this.formData.surveyTime = d;
					}
					if (obj.landMsg) {
						// this.formData.landMsg
						formatLandMsg(JSON.parse(obj.landMsg),this.$lang.$lang_type).then(lm => {
							for (let i in lm) {
								this.$set(this.formData.landMsg,i,lm[i]);
							}
						});
					} else {
						this.formData.landMsg = {
							landTypeId: -1,
								// [天然林,用材林]
								attributeValues: {
							},
							landTypeList: [],
								attributeValueList: {
							}
						};
					}

					tmpObj = {
						[drawerTypes.disease]: obj.diseaseImgRecordList,
						[drawerTypes.pest]: obj.pestImgRecordList,
						[drawerTypes.drought]: obj.droughtImgRecordList,
					}
					this.$parent.setNewMarker({lat:obj.lat,lng: obj.lng});

					// if (obj.diseaseImgRecordList instanceof Array) {
					// 	this.image.disease.splice(0,this.image.disease.length,...obj.diseaseImgRecordList);
					// } else {
					// 	this.image.disease.splice(0,this.image.disease.length);
					// }
					// if (obj.pestImgRecordList instanceof Array) {
					// 	this.image.pest.splice(0,this.image.pest.length,...obj.pestImgRecordList);
					// } else {
					// 	this.image.pest.splice(0,this.image.pest.length);
					// }
					// if (obj.droughtImgRecordList instanceof Array) {
					// 	this.image.drought.splice(0,this.image.drought.length,...obj.droughtImgRecordList);
					// } else {
					// 	this.image.drought.splice(0,this.image.drought.length);
					// }
				});
			} else {
				CreateRecord({
					lat: this.formData['lat'],
					lng: this.formData['lng'],
					surveyTime: (new Date()).getTime(),
				}).then(id => {
					this.formData.id = id;
					this.createRecord(id);
				});
			}
		},
		newForm({lat,lng,update,id}) {
			this.formData['lat'] = (lat||0).toFixed(7);
			this.formData['lng'] = (lng||0).toFixed(7);
			if (!update) {
				this.createRecord(id);
				// this.formData['cropType'] = '';
				// this.formData['cropVariety'] = '';
				// this.formData['diseaseSeverity'] = '';
				// this.formData['diseaseType'] = '';
				// this.formData['droughtSeverity'] = '';
				// this.formData['id'] = -1;
				// this.formData['pestSeverity'] = '';
				// this.formData['pestType'] = '';
				this.formData['surveyTime'] = new Date();
			}
		},
		setNow() {
			if (this.edit)
				this.formData.surveyTime = new Date();
			// this.saving = false;
		},
		updateLandMsg(lm) {
			this.formData.landMsg = lm;
			this.updateRecord();
		},// todo
		handleAvatarSuccess(type,response) {
			// console.log(response, file, fileList)
			return UploadImage(response.raw,Dirs[type]).then((ret) => {
				return UploadImageMethod[type](this.formData.id,ret).then(() => {
					return readFileAsDataURL(response.raw).then(url => {
						return {
							url: url,
							file_path: ret,
						}
					});
				});
			});
		},
		updateRecord() {
			let obj = {
				// "createTime": "2022-09-09T02:04:00.464Z",
				"cropType": this.formData.cropType,
				"cropVariety": this.formData.cropVariety,
				"diseaseSeverity": this.formData.diseaseSeverity,
				"diseaseType": this.formData.diseaseType,
				"droughtSeverity": this.formData.droughtSeverity,
				"id": this.formData.id,
				"landMsg": JSON.stringify({
					landTypeId: this.formData.landMsg.landTypeId,
					attributeValues: this.formData.landMsg.attributeValues,
				}),
				"lat": this.formData.lat,
				"lng": this.formData.lng,
				"pestSeverity": this.formData.pestSeverity,
				"pestType": this.formData.pestType,
				"surveyTime": this.formData.surveyTime.getTime(),
			};
			for (let i in obj) {
				if (typeof obj[i] === 'undefined') {
					delete obj[i];
				}
			}
			return UpdateRecord(obj).then(() => {
				this.$message({
					message: '提交成功',
					type: 'success'
				});
				return '';
			});
		},
		closeAndSave() {
			let updateOver = () => {
				this.dialogVisible = false;
				this.$parent.showForm = false;
				this.$parent.removeMarker();
				this.$parent.ifr.style.height = '100%';
			}
			if (!this.edit) {
				updateOver();
			} else {
				this.updateRecord().then(() => {
					updateOver();
				});
			}
		}
	},
	watch: {
		'drawerSetting.visible'() {
			if (this.drawerSetting.visible) {
				setTimeout(() => {
					for (let i in tmpObj) {
						this.$refs[`dpd_${i}`].setImage(tmpObj[i]);
					}
					tmpObj = {};
				},500);
			} else {
				if (!this.edit) return;
				this.updateRecord();
			}
		}
	},
	mounted() {
		// todo ： 假装这里是双语
		GetCropType().then(o => {
			o.forEach(_o => {
				this.cropTypes.push({
					id: _o.id,
					label: _o[`name${this.$lang.$lang_type}`], // todo 这里要改
				})
			});
		});
		GetDiseaseType().then(o => {
			o.forEach(_o => {
				// this.diseaseTypes.push({
				this.dpdForm[drawerTypes.disease][0].options.push({
					id: _o.id,
					label: _o[`name${this.$lang.$lang_type}`], // todo 这里要改
				})
				this.dpdForm[drawerTypes.disease][0].optionKey[_o.id] = _o[`name${this.$lang.$lang_type}`];
			});
		});
		GetPestType().then(o => {
			o.forEach(_o => {
				// this.pestTypes.push({
				this.dpdForm[drawerTypes.pest][0].options.push({
					id: _o.id,
					label: _o[`name${this.$lang.$lang_type}`], // todo 这里要改
				})
				this.dpdForm[drawerTypes.pest][0].optionKey[_o.id] = _o[`name${this.$lang.$lang_type}`];
			});
		});
		// 这里不知大需不需要裂开
		GetSeverity().then(o => {
			o.forEach(_o => {
				// this.pestSeverity.push({
				this.dpdForm[drawerTypes.pest][1].options.push({
					id: _o.id,
					label: _o[`name${this.$lang.$lang_type}`], // todo 这里要改
				});
				// this.droughtSeverity.push({
				this.dpdForm[drawerTypes.drought][0].options.push({
					id: _o.id,
					label: _o[`name${this.$lang.$lang_type}`], // todo 这里要改
				});
				// this.diseaseSeverity.push({
				this.dpdForm[drawerTypes.disease][1].options.push({
					id: _o.id,
					label: _o[`name${this.$lang.$lang_type}`], // todo 这里要改
				});
				this.dpdForm[drawerTypes.pest][1].optionKey[_o.id] = _o[`name${this.$lang.$lang_type}`];
				this.dpdForm[drawerTypes.disease][1].optionKey[_o.id] = _o[`name${this.$lang.$lang_type}`];
				this.dpdForm[drawerTypes.drought][0].optionKey[_o.id] = _o[`name${this.$lang.$lang_type}`];
			});
		});
		window.$aop = this;
	}
}
</script>

<style>
	.my-form {
		padding: 10px;
	}
	.my-form div label {
		font-weight: bold;
		color: black;
	}

	.aop_my_drawer{
		position: fixed;
		top: 30%;
		bottom: 0;
		height: 70%;
		width: 100%;
		z-index: 1000;
		background: white;
	}
</style>
