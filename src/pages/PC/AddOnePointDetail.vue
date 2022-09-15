<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:fullscreen="true"
			:show-close="false">
			<div slot="title" class="">
				填写信息&nbsp;&nbsp;
				<span v-if="step === 1">基础信息</span>
				<span v-else>样地信息</span>
				<el-button v-show="step === 2" type="text" @click="step=1" style="float: right;">返回&nbsp;&nbsp;基础信息</el-button>
			</div>
			<div v-show="step === 1">
				<el-form ref="form" :model="form" label-width="120px" label-position="top">
					<el-form-item label="坐标">
						<el-row :gutter="20" style="margin: auto 0px !important;">
							<el-col :span="4" style="text-align: center;">lat</el-col>
							<el-col :span="7">
								<el-input v-model.number="form.latitude" @change="saving = false;"></el-input>
							</el-col>
							<el-col :span="4" style="text-align: center;">lng</el-col>
							<el-col :span="7">
								<el-input v-model.number="form.longitude" @change="saving = false;"></el-input>
							</el-col>
							<el-col :span="2" style="text-align: center;">
								<i class="el-icon-refresh" @click="refreshLocation"></i>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item label="调查时间">
						<el-row :gutter="5" style="margin: auto 0px !important;">
							<el-col :span="10">
								<el-date-picker style="width: 100%"
												v-model="form.surveyTime"
												type="date"
												@change="saving = false"
												placeholder="选择日期">
								</el-date-picker>
							</el-col>
							<el-col :span="10">
								<el-time-picker style="width: 100%"
												@change="saving = false"
												v-model="form.surveyTime"
												placeholder="任意时间点">
								</el-time-picker>
							</el-col>
							<el-col :span="4">
								<el-button type="text" @click="setNow">Now</el-button>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item label="土地类型">
						<div style="border: 1px solid;border-radius: 5px;padding: 5px;" @click="$refs.landTypeSelection.open(form.landMsg)">
							<div v-if="form.landMsg.landTypeId !== -1">
								<el-breadcrumb separator="/" style="width: 100%;">
									<el-breadcrumb-item v-for="lt in form.landMsg.landTypeList" :key="lt">
										<el-button type="text">{{lt}}</el-button>
									</el-breadcrumb-item>
								</el-breadcrumb>
								<div>
									<el-tag v-for="(v,k) in form.landMsg.attributeValueList" type="success" :key="k" style="margin-right: 4px;">
										{{k}}：{{v ? v : '/'}}
									</el-tag>
								</div>
							</div>
							<div v-else>
								<el-button style="width: 100%;" type="text" @click="$refs.landTypeSelection.open(form.landMsg)">请选择</el-button>
							</div>
						</div>
					</el-form-item>
					<el-form-item label="作物">
						<el-input placeholder="作物类型" v-model="form.cropType" @change="saving = false;"></el-input>
						<div style="width: 100%;height: 2px;"></div>
						<el-input placeholder="作物品种" v-model="form.cropVariety" @change="saving = false;"></el-input>
					</el-form-item>
					<el-form-item label="备注">
						<el-input @change="saving = false;"
								  type="textarea"
								  :rows="3"
								  placeholder="..."
								  v-model="form.note">
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-button style="width: 100%" @click="step = 2">样地调查数据填写</el-button>
					</el-form-item>
					<el-form-item>
						<el-button-group style="width: 100%;">
							<el-button type="primary" @click="updateMainRecord" style="width: 50%;">保存</el-button>
							<el-button type="danger" @click="exitThisPage" style="width: 50%;">退出</el-button>
						</el-button-group>
					</el-form-item>
				</el-form>
			</div>
			<div v-show="step === 2">
				<el-form label-width="120px" label-position="top">
					<el-form-item label="样地冠层图片">
						<el-upload
							class="avatar-uploader"
							:auto-upload="false"
							action=""
							:show-file-list="false"
							:on-change="handleAvatarSuccess">
<!--							<img style="padding: 0 10px;max-width: 100%;" v-if="form.spCanopyImg" :src="`http://172.20.109.115:8080${form.spCanopyImg}`" class="avatar">-->
<!--							<MyImage :styles="{padding: '0 10px',maxWidth: '100%'}" v-if="form.spCanopyImg"-->
<!--									 host="http://172.20.109.115:8080"-->
<!--								   :src="form.spCanopyImg" classes="avatar"></MyImage>-->
							<img v-if="form.spCanopyImgUrl" style="padding: 0 10px;max-width: 100%;" :src="form.spCanopyImgUrl" alt="">
							<MyImage :styles="{padding: '0 10px',maxWidth: '100%'}" v-else-if="form.spCanopyImg"
								   :src="form.spCanopyImg" classes="avatar"></MyImage>
<!--							<img style="padding: 0 10px;max-width: 100%;" v-if="form.spCanopyImg" :src="`http://172.20.109.115:8080${form.spCanopyImg}`" class="avatar">-->
							<i style="padding: 0 10px;" v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</el-form-item>
					<el-form-item>
						<el-badge style="width: 100%;" :value="form.environmentFactorRecord.length" class="item">
							<el-button style="width: 100%;"
									   @click="openAndSetList(componentNameMap.environmentFactorRecord)">环境要素</el-button>
							<EnvironmentFactor
								@updateRecordImage="obj => updateRecordImage(componentNameMap.environmentFactorRecord,obj)"
								@updateRecord="obj => updateRecord(componentNameMap.environmentFactorRecord,obj)"
								@deleteRecord="id => deleteRecord(componentNameMap.environmentFactorRecord,id)"
								:ref="componentNameMap.environmentFactorRecord"></EnvironmentFactor>
						</el-badge>
					</el-form-item>
					<el-form-item>
						<el-badge style="width: 100%;" :value="form.diseaseSysSurveyRecord.length" class="item">
							<el-button style="width: 100%;"
									   @updateRecordImage="obj => updateRecordImage(componentNameMap.diseaseSysSurveyRecord,obj)"
									   @click="openAndSetList(componentNameMap.diseaseSysSurveyRecord)">病害系统调查表</el-button>
							<DiseaseSysSurveyRecord
								@updateRecord="obj => updateRecord(componentNameMap.diseaseSysSurveyRecord,obj)"
								@deleteRecord="id => deleteRecord(componentNameMap.diseaseSysSurveyRecord,id)"
								:ref="componentNameMap.diseaseSysSurveyRecord"></DiseaseSysSurveyRecord>
						</el-badge>
					</el-form-item>
					<el-form-item>
						<el-badge style="width: 100%;" :value="form.diseaseSamCollRecord.length" class="item">
							<el-button style="width: 100%;"
									   @click="openAndSetList(componentNameMap.diseaseSamCollRecord)">病害样本采集</el-button>
							<DiseaseSamCollRecord
								@updateRecordImage="obj => updateRecordImage(componentNameMap.diseaseSamCollRecord,obj)"
								@updateRecord="obj => updateRecord(componentNameMap.diseaseSamCollRecord,obj)"
								@deleteRecord="id => deleteRecord(componentNameMap.diseaseSamCollRecord,id)"
								:ref="componentNameMap.diseaseSamCollRecord"></DiseaseSamCollRecord>
						</el-badge>
					</el-form-item>
					<el-form-item>
						<el-badge style="width: 100%;" :value="form.diseaseDataCollUAVRecord.length" class="item">
							<el-button style="width: 100%;"
									   @click="openAndSetList(componentNameMap.diseaseDataCollUAVRecord)">机地病害采样表</el-button>
							<DiseaseDataCollUavRecord
								@updateRecordImage="obj => updateRecordImage(componentNameMap.diseaseDataCollUAVRecord,obj)"
								@updateRecord="obj => updateRecord(componentNameMap.diseaseDataCollUAVRecord,obj)"
								@deleteRecord="id => deleteRecord(componentNameMap.diseaseDataCollUAVRecord,id)"
								:ref="componentNameMap.diseaseDataCollUAVRecord"></DiseaseDataCollUavRecord>
						</el-badge>
					</el-form-item>
					<el-form-item>
						<el-badge style="width: 100%;" :value="form.pestCollRecordVo.length" class="item">
							<el-button style="width: 100%;"
									   @click="openAndSetList(componentNameMap.pestCollRecordVo)">虫害采集</el-button>
							<PestCollRecord
								@updateRecordImage="obj => updateRecordImage(componentNameMap.pestCollRecordVo,obj)"
								@updateRecord="obj => updateRecord(componentNameMap.pestCollRecordVo,obj)"
								@deleteRecord="id => deleteRecord(componentNameMap.pestCollRecordVo,id)"
								:ref="componentNameMap.pestCollRecordVo"></PestCollRecord>
						</el-badge>
					</el-form-item>
					<el-form-item>
						<el-badge style="width: 100%;" :value="form.pestSurveyUAVRecordVo.length" class="item">
							<el-button style="width: 100%;"
									   @click="openAndSetList(componentNameMap.pestSurveyUAVRecordVo)">机地虫害调查表</el-button>
							<PestSurveyUavRecord
								@updateRecordImage="obj => updateRecordImage(componentNameMap.pestSurveyUAVRecordVo,obj)"
								@updateRecord="obj => updateRecord(componentNameMap.pestSurveyUAVRecordVo,obj)"
								@deleteRecord="id => deleteRecord(componentNameMap.pestSurveyUAVRecordVo,id)"
								:ref="componentNameMap.pestSurveyUAVRecordVo"></PestSurveyUavRecord>
						</el-badge>
					</el-form-item>
					<el-form-item>
						<el-badge style="width: 100%;" :value="form.soilMoistureCollRecords.length" class="item">
							<el-button style="width: 100%;"
									   @click="openAndSetList(componentNameMap.soilMoistureCollRecords)">土壤湿度采集</el-button>
							<SoilMoistureCollRecord
								@updateRecordImage="obj => updateRecordImage(componentNameMap.soilMoistureCollRecords,obj)"
								@updateRecord="obj => updateRecord(componentNameMap.soilMoistureCollRecords,obj)"
								@deleteRecord="id => deleteRecord(componentNameMap.soilMoistureCollRecords,id)"
								:ref="componentNameMap.soilMoistureCollRecords"></SoilMoistureCollRecord>
						</el-badge>
					</el-form-item>
					<el-form-item>
						<el-badge style="width: 100%;" :value="form.wheatYieldCollRecords.length" class="item">
							<el-button style="width: 100%;"
									   @click="openAndSetList(componentNameMap.wheatYieldCollRecords)">作物(小麦)产量采集</el-button>
							<WheatYieldCollRecord
								@updateRecordImage="obj => updateRecordImage(componentNameMap.wheatYieldCollRecords,obj)"
								@updateRecord="obj => updateRecord(componentNameMap.wheatYieldCollRecords,obj)"
								@deleteRecord="id => deleteRecord(componentNameMap.wheatYieldCollRecords,id)"
								:ref="componentNameMap.wheatYieldCollRecords"></WheatYieldCollRecord>
						</el-badge>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
		<LandTypeSelection @updateLandMsg="updateLandMsg" ref="landTypeSelection"></LandTypeSelection>
	</div>
</template>

<script>
import {
	// createInvestRecord,
	getInvestRecordById,
	updateInvestRecord,
	Dirs,
	uploadImage
} from "../../api/selection";
// import {
// 	Ts2Sting
// } from "../../utils/time";
import LandTypeSelection from "../../components/Forms/LandTypeSelection";
import {
	formatLandMsg
} from "../../utils/formatLandMsg";
import {
	readFileAsDataURL
} from "../../utils/htmlUtils";
import MyImage from "../../components/image";
import EnvironmentFactor from "./Records/EnvironmentFactor";
import DiseaseSysSurveyRecord from "./Records/DiseaseSysSurveyRecord";
import DiseaseDataCollUavRecord from "./Records/DiseaseDataCollUavRecord";
import DiseaseSamCollRecord from "./Records/DiseaseSamCollRecord";
import PestCollRecord from "./Records/PestCollRecord";
import PestSurveyUavRecord from "./Records/PestSurveyUavRecord";
import SoilMoistureCollRecord from "./Records/SoilMoistureCollRecord";
import WheatYieldCollRecord from "./Records/WheatYieldCollRecord";
import {getPosition} from "../../utils/getGeoLocation";

let savingTimeoutHandle = null;
const componentNameMap = {
	'environmentFactorRecord': 'environmentFactorRecord',
	'diseaseSysSurveyRecord': 'diseaseSysSurveyRecord',
	'diseaseSamCollRecord': 'diseaseSamCollRecord',
	'diseaseDataCollUAVRecord': 'diseaseDataCollUAVRecord',
	'pestCollRecordVo': 'pestCollRecordVo',
	'pestSurveyUAVRecordVo': 'pestSurveyUAVRecordVo',
	'soilMoistureCollRecords': 'soilMoistureCollRecords',
	'wheatYieldCollRecords': 'wheatYieldCollRecords',
};
export default {
	name: "AddOnePointDetail",
	components: {
		WheatYieldCollRecord,
		SoilMoistureCollRecord,
		PestSurveyUavRecord,
		PestCollRecord,
		DiseaseSamCollRecord,
		DiseaseDataCollUavRecord, DiseaseSysSurveyRecord, EnvironmentFactor, MyImage, LandTypeSelection},
	data() {
		return {
			saving: true,
			componentNameMap,
			lang: this.$lang.$lang_type,
			dialogVisible: false,
			step: 1,
			id: 1,
			userId: 3,
			form: {
				latitude: 0,
				longitude: 0,
				surveyTime: new Date(),
				landMsg: {
					landTypeId: -1,
					// [天然林,用材林]
					attributeValues: {
					},
					landTypeList: [],
					attributeValueList: {
					}
				},
				cropType: '',	 // 作物类型
				cropVariety: '', // 作物品种
				note: '',
				spCanopyImg: '',
				spCanopyImgUrl: '',
				diseaseSysSurveyRecord: [], // 病害系统调查表
				diseaseSamCollRecord: [], //	病害样本采集表
				pestCollRecordVo: [], //	虫害采集表Vo
				diseaseDataCollUAVRecord: [], //	机-地病害数据采集表
				pestSurveyUAVRecordVo: [], //	机-地虫害调查表Vo
				soilMoistureCollRecords: [], // 土壤湿度采集表
				wheatYieldCollRecords: [], // 小麦产量采集表
				environmentFactorRecord: [], // 环境要素
			}
		}
	},
	methods: {
		setNow() {
			this.form.surveyTime = new Date();
			this.saving = false;
		},
		// todo
		handleAvatarSuccess(response, file, fileList) {
			console.log(response, file, fileList)
			readFileAsDataURL(response.raw).then(url => {
				this.form.spCanopyImgUrl = url;
			});
			uploadImage(response.raw,Dirs.MainRecord).then((ret) => {
				let obj = {
					id: this.id,
					"spCanopyImg": ret,
				}
				updateInvestRecord(obj,(this.form.surveyTime || {getTime(){return 0}}).getTime()).then(() => {
					this.$message({
						offset: 100,
						message: '提交成功',
						type: 'success'
					});
				});
			});
		},
		updateLandMsg(lm) {
			this.form.landMsg = lm;
		},
		// 向服务器更新记录
		updateMainRecord() {
			let obj = {
				"cropType": this.form.cropType,
				"cropVariety": this.form.cropVariety,
				"id": this.id,
				"landMsg": JSON.stringify({
					landTypeId: this.form.landMsg.landTypeId,
					attributeValues: this.form.landMsg.attributeValues,
				}),
				"latitude": this.form.latitude,
				"longitude": this.form.longitude,
				"note": this.form.note,
				// "spCanopyImg": "string",
				// "surveyTime": Ts2Sting(this.form.surveyTime)
			};
			return updateInvestRecord(obj,this.form.surveyTime.getTime()).then(() => {
				this.saving = true;
				if (savingTimeoutHandle) {
					clearTimeout(savingTimeoutHandle);
				}
				this.$message({
					offset: 100,
					message: '提交成功',
					type: 'success'
				});
				return '';
			});
		},
		openAndSetList(name) {
			if (name in componentNameMap) {
				this.$refs[componentNameMap[name]].id = this.id;
				this.$refs[componentNameMap[name]].show();
				this.$refs[componentNameMap[name]].setList(this.form[componentNameMap[name]]);
			}
		},
		updateRecord(name,obj) {
			let key = componentNameMap[name];
			if (key) {
				let found = false;
				for (let i = 0;i < this.form[key].length;i++) {
					if (this.form[key][i].id === obj.id) {
						this.form[key][i] = obj;
						found = true;
						break;
					}
				}
				if (!found) {
					this.form[key].push(obj);
				}
			}
		},
		deleteRecord(name,id) {
			let key = componentNameMap[name];
			if (key) {
				for (let i = 0;i < this.form[key].length;i++) {
					if (this.form[key][i].id === id) {
						this.form[key].splice(i,1);
						break;
					}
				}
			}
		},
		refreshLocation() {
			getPosition().then(latlng => {
				this.form.longitude = latlng.lng;
				this.form.latitude = latlng.lat;
			});
		},
		exitThisPage() {
			if (!this.saving) {
				if (savingTimeoutHandle) {
					clearTimeout(savingTimeoutHandle);
				}
				this.saving = true;
				this.updateMainRecord().then(() => {
					this.dialogVisible = false;
				});
			}
			this.dialogVisible = false;
		},
		loadMainRecord(cb) {
			getInvestRecordById(this.id).then(obj => {
				this.saving = false;
				this.form.environmentFactorRecord = obj.environmentFactorRecord || [];
				this.form.diseaseSysSurveyRecord = obj.diseaseSysSurveyRecord || [];
				this.form.diseaseSamCollRecord = obj.diseaseSamCollRecord || [];
				this.form.diseaseDataCollUAVRecord = obj.diseaseDataCollUAVRecord || [];
				this.form.pestSurveyUAVRecordVo = obj.pestSurveyUAVRecordVo || [];
				this.form.pestCollRecordVo = obj.pestCollRecordVo || [];
				this.form.soilMoistureCollRecords = obj.soilMoistureCollRecords || [];
				this.form.wheatYieldCollRecords = obj.wheatYieldCollRecords || [];
				this.form.cropVariety = obj.cropVariety;
				this.form.cropType = obj.cropType;
				this.form.longitude = obj.longitude;
				this.form.latitude = obj.latitude;
				this.form.note = obj.note;
				this.form.spCanopyImg = obj.spCanopyImg;
				this.form.spCanopyImgUrl = "";
				this.id = obj.id;
				this.userId = obj.userId;
				formatLandMsg(JSON.parse(obj.landMsg),this.lang).then(lm => {
					for (let i in lm) {
						this.$set(this.form.landMsg,i,lm[i]);
					}
				});
				cb();
			});
		},
		updateRecordImage(name,obj) {
			console.log(name);
			console.log(obj);
			let key = componentNameMap[name];
			if (key) {
				let mapObj = {};
				obj.forEach(o => {
					mapObj[o.id] = o;
				});
				if (this.form[key] instanceof Array) {
					for (let ind = 0;ind < this.form[key].length;ind++) {
						let cobj = mapObj[this.form[key][ind].id];
						for (let cobjKey in cobj) {
							this.$set(this.form[key][ind],cobjKey,cobj[cobjKey]);
						}
					}
				}
			}
		}
	},
	watch: {
		saving() {
			console.log(`watch saving = ${this.saving}`);
			if (!this.saving) {
				if (savingTimeoutHandle) {
					clearTimeout(savingTimeoutHandle);
				}
				savingTimeoutHandle = setTimeout(() => {
					this.updateMainRecord();
				},5000);
			}
		}
	},
	mounted() {
		window.$AddOnePointDetail = this;
	}
}
</script>

<style>
</style>
