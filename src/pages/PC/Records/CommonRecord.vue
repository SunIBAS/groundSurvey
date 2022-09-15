<template>
	<el-dialog
		:visible.sync="dialogVisible"
		:fullscreen="true"
		:modal="false"
		:before-close="updateAllInfo2Main"
		:show-close="true">
		<div slot="title" class="">
			{{title}}&nbsp;&nbsp;
		</div>

		<div v-if="list.length">
			<el-card class="box-card" v-for="(l,ind) in list" :key="ind" style="margin-bottom: 10px;">
				<div slot="header" class="clearfix">
					<span># {{ind + 1}}</span>
					<el-button style="float: right; padding: 3px 0" type="text" @click="deleteRecord(ind)">删除</el-button>
					<el-button style="float: right; padding: 3px 0" type="text" @click="editRecord(ind)">编辑</el-button>
				</div>
				<div>
					lat: {{l.latitude}}
				</div>
				<div>
					lng: {{l.longitude}}
				</div>
				<div v-for="k in formSetting" :key="k.name">
					<div style="margin-bottom: 5px;">
						<div v-if="k.type === FieldType.input">
							{{k.label}} : {{l[k.name]}}
						</div>
						<div v-else-if="k.type === FieldType.table">
							<el-collapse>
								<el-collapse-item v-for="vind in l[k.name].values[0].length" :key="`${vind}`"
									:title="`样方 #${vind}`" :name="`${vind}`">
									<div v-for="(f,kind) in k.fields" :key="kind">{{k.labels[kind]}}&nbsp;&nbsp;&nbsp;&nbsp;{{l[k.name].values[kind][vind - 1]}}</div>
								</el-collapse-item>
							</el-collapse>
						</div>
						<div v-else-if="k.type === FieldType.image">
							<div>{{k.label}}</div>
							<div v-if="l[k.name + 'Url']">
								<img :src="l[k.name + 'Url']" alt="" style="max-width: 100%;">
							</div>
							<div v-else-if="l[k.name]">
								<el-button @click="showImage(ind,k.name,-1)">显示图片</el-button>
							</div>
							<div v-else>
								<span style="color: #2196f3;">没有上传图片</span>
							</div>
						</div>
						<div v-else-if="k.type === FieldType.imageArray">
							<div>{{k.label}}</div>
							<div v-if="l[k.name] && l[k.name].length" style="display: flex;">
								<div v-for="(url,sind) in l[k.name]" :key="sind"  style="width: 24%;padding-right: 1%;">
									<div v-if="l[k.name + 'Url'] && l[k.name + 'Url'][sind]">
										<img :src="l[k.name + 'Url'][sind]" :key="ind" alt="" style="max-width: 100%;">
									</div>
									<div v-else>
										<el-button @click="showImage(ind,k.name,sind)">
											<i class="el-icon-search"></i>
										</el-button>
									</div>
								</div>
							</div>
							<div v-else>
								<span style="color: #2196f3;">没有上传图片</span>
							</div>
						</div>
					</div>
				</div>
			</el-card>
		</div>
		<div v-else>
			<el-card class="box-card">
				暂无数据
			</el-card>
		</div>
		<div>
			<div class="pin">
				<i @click="createEmptyForm" class="el-icon-plus"></i>
			</div>
		</div>

		<el-dialog
			:visible.sync="formDialogVisible"
			:fullscreen="true"
			:modal="false"
			:show-close="true">
			<div slot="title" class="">
				添加
			</div>
			<el-form label-position="top" label-width="80px">
				<el-form-item label="坐标">
					<el-row :gutter="20" style="margin: auto 0px !important;">
						<el-col :span="4" style="text-align: center;">lat</el-col>
						<el-col :span="7">
							<el-input v-model.number="form.latitude"></el-input>
						</el-col>
						<el-col :span="4" style="text-align: center;">lng</el-col>
						<el-col :span="7">
							<el-input v-model.number="form.longitude"></el-input>
						</el-col>
						<el-col :span="2" style="text-align: center;">
							<i class="el-icon-refresh" @click="refreshLocation"></i>
						</el-col>
					</el-row>
				</el-form-item>
				<!-- input -->
				<el-form-item :label="labels[k]"
							  v-for="(v,k) in form.input" :key="k">
					<el-input v-model="form.input[k]" :type="inputType[k]"></el-input>
				</el-form-item>
				<!-- table -->
				<el-form-item :label="labels[k]"
							  v-for="(v,k) in form.table" :key="k">
					<div style="padding-left: 40px;">
						<el-button type="text" @click="addOneTableRecord(v,k)">添加</el-button>
						<el-collapse>
							<el-collapse-item v-for="vind in v.values[0].length" :key="`${vind}`"
											  :title="`样方 #${vind}`" :name="`${vind}`">
								<div v-for="(f,kind) in v.fields" :key="kind">{{v.labels[kind]}}&nbsp;&nbsp;&nbsp;&nbsp;{{v.values[kind][vind - 1]}}</div>
							</el-collapse-item>
						</el-collapse>
					</div>
				</el-form-item>
				<!-- image -->
				<el-form-item :label="labels[k]"
							  v-for="(v,k) in form.image" :key="k">
					<el-upload
						class="avatar-uploader"
						:auto-upload="false"
						action=""
						:show-file-list="false"
						:on-change="(resp) => handleAvatarSuccess(resp,k)">
						<img style="padding: 0 10px;max-width: calc(100% - 10px);" v-if="tmp[k]" :src="tmp[k]" class="avatar">
						<i style="padding: 0 10px;" v-else class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
				</el-form-item>
				<!-- imageArray -->
				<el-form-item :label="labels[k]"
							  v-for="(v,k) in form.imageArray" :key="k">
					<div>
						<img class="avatar-uploader" v-for="(img,ind) in tmp[k]" :key="ind" :src="img"
							 style="padding: 0 10px;max-width: calc(25% - 20px);"/>
						<img @click="$refs.upload[0].$refs['upload-inner'].handleClick()"
							src="data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAIsAAACKCAYAAACaRblaAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAGdYAABnWARjRyu0AAAJ2SURBVHhe7dsxihZQDIVR978kGzuXYSEiwoAgIggiv9hKCBm4ipmc4vTh3a99r378fDxgQiyMiYUxsTAmFsbEwphYGBMLY2JhTCyMiYUxsTD2omP5+u374/Wbt//M0+cv5R0vhViCxLKYWLLEEiSWxcSSJZYgsSwmliyxBIllMbFkiSVILIuJJUssQWJZTCxZYgkSy2JiyRJLkFgWE0uWWILEsphYssQSJJbFxJIlliCxLCaWLLEEiWUxsWSJJUgsi4klSyxBYllMLFliCRLLYmLJEkuQWBYTS5ZYgsSymFiyxBIklsXEkiWWILEsJpYssQSJZTGxZIklSCyLiSVLLEFi+UP1SOxU7dsRy2HVvh2xHFbt2xHLYdW+HbEcVu3bEcth1b4dsRxW7dsRy2HVvh2xHFbt2xHLYdW+HbEcVu3bEcth1b4dsRxW7dsRy2HVvh2xHFbt2xHLYdW+HbEcVu3bEcth1b4dsRxW7dsRy2HVvh2xHFbt2xHLYdW+HbEcVu3bEcth1b4dsRxW7dsRy2HVvh2xHFbt23l2LL//827x4dNT+Uh/y7v3H8s7/lfVvp1nx7KJj/FZYgkSy2JiyRJLkFgWE0uWWILEsphYssQSJJbFxJIlliCxLCaWLLEEiWUxsWSJJUgsi4klSyxBYllMLFliCRLLYmLJEkuQWBYTS5ZYgsSymFiyxBIklsXEkiWWILEsJpYssQSJZTGxZIklSCyLiSVLLEFiWUwsWWIJEstiYskSS5BYFhNLlliCxLKYWLLEEiSWxcSSJZYgsSwmlqwXHQtZYmFMLIyJhTGxMCYWxsTCmFgYEwtjYmFMLAw9Hr8AIbhQ6UpB1jUAAAAASUVORK5CYII=" alt=""  style="padding: 0 10px;max-width: calc(25% - 20px);"/>
						<el-upload style="display: none;" ref="upload"
							class="avatar-uploader"
							:auto-upload="false"
							action=""
							:show-file-list="false"
							:on-change="(resp) => handleAvatarSuccess(resp,k)">

<!--							<i style="padding: 0 10px;" class="el-icon-plus avatar-uploader-icon"></i>-->
						</el-upload>
					</div>
				</el-form-item>
				<el-form-item style="margin-top: 5px;">
					<el-button @click="submitForm" style="width: 100%;">提交</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>

		<el-dialog
			:visible.sync="formTableDialogVisible"
			:fullscreen="true"
			:modal="false"
			:show-close="true">
			<el-form label-position="top" label-width="80px">
				<el-form-item v-for="(_,ind) in tableForm.form" :key="`${ind}`" :label="tableForm.table.labels[ind]">
					<el-input v-model="tableForm.form[ind]" :type="tableForm.table.types[ind]"></el-input>
				</el-form-item>
			</el-form>
			<el-form>
				<el-button @click="submitOneTableItem()">提交</el-button>
			</el-form>
		</el-dialog>
	</el-dialog>
</template>

<script>
import {
	FieldType,
	InputType
} from "./CommonRecordConst";
import {readFileAsDataURL} from "../../../utils/htmlUtils";
import {
	getPosition
} from "../../../utils/getGeoLocation";
import {
	requestImage
} from "../../../api/request";
// import MyImage from "../../../components/image";
import {
	runPromiseByArrReturnPromise
} from "../../../utils/sailPromise";

// let test = [
// 	{
// 		key: '',
//		array: false,
// 		url: '' => ['']
// 	},
// 	{
// 		key: '',
//		array: true,
// 		url: []
// 	}
// ]
const urls2imgs = urls => {
	let ret = [];
	return runPromiseByArrReturnPromise(urls => {
		if (typeof urls.url === 'string') {
			urls.url = [urls.url];
		}
		let obj = {
			key: urls.key,
			array: urls.array,
			url: []
		};
		return runPromiseByArrReturnPromise(url => {
			return requestImage(url).then(imgUrl => obj.url.push(imgUrl));
		},urls.url).then(() => {
			ret.push(obj);
			return '';
		});
	},urls).then(() => {
		return ret;
	});
}

export default {
	// components: {MyImage},
	props: {
		title: {},
		formSetting: {
			required: true,
		}
	},
	name: "CommonRecord",
	data() {
		return {
			InputType,
			FieldType,
			dialogVisible: false,
			formDialogVisible: false,
			formTableDialogVisible: false,
			list: [],
			labels: {},
			form: {
				_update_: -1,
				id: null,
				"latitude": 0,
				"longitude": 0,
				input: {},
				image: {},
				imageArray: {},
				table: {}
			},
			tableForm: {
				key: null,
				table: {},
				form: [],
			},
			tmp: {},
			inputType: {},
		}
	},
	methods: {
		createEmptyForm() {
			this.form._update_ = -1;
			this.$parent.createRecord().then(id => {
				this.form.id = id;
				for (let i in this.form) {
					for (let j in this.form[i]) {
						delete this.form[i][j];
					}
				}
				for (let i in this.labels) {
					delete this.labels[i];
				}
				for (let i in this.tmp) {
					delete this.tmp[i];
				}
				for (let i in this.inputType) {
					delete this.inputType[i];
				}
				for (let i in this.formSetting) {
					this.$set(this.labels,this.formSetting[i].name,this.formSetting[i].label);
					switch (this.formSetting[i].type) {
						case FieldType.input:
							this.$set(this.form.input,this.formSetting[i].name,'');
							this.$set(this.inputType,this.formSetting[i].name,this.formSetting[i].inputType);
							break;
						case FieldType.table:
							this.$set(this.form.table,this.formSetting[i].name,this.formSetting[i].createEmpty());
							break;
						case FieldType.image:
							this.$set(this.form.image,this.formSetting[i].name,'');
							this.$set(this.tmp,this.formSetting[i].name,'');
							break;
						case FieldType.imageArray:
							this.$set(this.form.imageArray,this.formSetting[i].name,[]);
							this.$set(this.tmp,this.formSetting[i].name,[]);
							break;
					}
				}
				this.formDialogVisible = true;
				this.refreshLocation();
			})
		},
		handleAvatarSuccess(response, key) {
			let oneFs = this.formSetting.filter(fs => fs.name === key);
			// console.log(oneFs);
			if (oneFs.length === 1) {
				oneFs = oneFs[0];
				oneFs.uploadPromise(response.raw,this.form.id).then(surl => {
					readFileAsDataURL(response.raw).then(url => {
						if (oneFs.type === FieldType.image) {
							this.form.image[key] = surl;
							// this.tmp[key] = surl;
							this.tmp[key] = url;
						} else if (oneFs.type === FieldType.imageArray) {
							// this.tmp[key].push(surl);
							this.form.imageArray[key].push(surl);
							this.tmp[key].push(url);
						}
					});
				})
			}
		},
		submitForm() {
			// this.list.push()
			let obj = {
				id: this.form.id,
				...this.form.input,
				...this.form.image,
				...this.form.imageArray,
				"latitude": this.form.latitude,
				"longitude": this.form.longitude,
			};
			for (let i in this.form.table) {
				obj = Object.assign(obj,{
					...this.form.table[i].toForm(),
				});
			}
			for (let i in this.tmp) {
				obj[i + 'Url'] = this.tmp[i];
			}
			this.$parent.updateRecord(obj).then(() => {
				obj = Object.assign(obj,this.form.table);
				if (this.form._update_ !== -1) {
					this.list.splice(this.form._update_,1,obj);
				} else {
					// for (let i in this.tmp) {
					// 	obj[i] = this.tmp[i];
					// }
					this.list.push({
						...obj,
						...this.form.image,
						...this.form.imageArray,
					});
				}
				this.formDialogVisible = false;
			})
		},
		refreshLocation() {
			getPosition().then(latlng => {
				this.form.longitude = latlng.lng;
				this.form.latitude = latlng.lat;
			});
		},
		deleteRecord(ind) {
			this.$parent.deleteRecord(this.list[ind].id).then(() => {
				this.list.splice(ind,1);
			});
		},
		editRecord(ind) {
			let obj = this.list[ind];
			for (let i in this.form) {
				for (let j in this.form[i]) {
					delete this.form[i][j];
				}
			}
			for (let i in this.labels) {
				delete this.labels[i];
			}
			for (let i in this.tmp) {
				delete this.tmp[i];
			}
			for (let i in this.inputType) {
				delete this.inputType[i];
			}
			let reqImage = [];
			for (let i in this.formSetting) {
				this.$set(this.labels,this.formSetting[i].name,this.formSetting[i].label);
				switch (this.formSetting[i].type) {
					case FieldType.input:
						this.$set(this.form.input,this.formSetting[i].name,obj[this.formSetting[i].name]);
						this.$set(this.inputType,this.formSetting[i].name,this.formSetting[i].inputType);
						break;
					case FieldType.table:
						this.$set(this.form.table,this.formSetting[i].name,obj[this.formSetting[i].name]);
						// this.$set(this.inputType,this.formSetting[i].name,this.formSetting[i].inputType);
						break;
					case FieldType.image:
						this.$set(this.form.image,this.formSetting[i].name,obj[this.formSetting[i].name]);
						if (obj[this.formSetting[i].name + 'Url']) {
							this.$set(this.tmp,this.formSetting[i].name,obj[this.formSetting[i].name + 'Url']);
						} else {
							reqImage.push({
								url: obj[this.formSetting[i].name],
								array: false,
								key: this.formSetting[i].name,
							});
							this.$set(this.tmp,this.formSetting[i].name,obj[this.formSetting[i].name]);
						}
						break;
					case FieldType.imageArray:
						this.$set(this.form.imageArray,this.formSetting[i].name,obj[this.formSetting[i].name]);
						if (obj[this.formSetting[i].name + 'Url']) {
							this.$set(this.tmp,this.formSetting[i].name,obj[this.formSetting[i].name + 'Url']);
						} else {
							reqImage.push({
								url: JSON.parse(JSON.stringify(obj[this.formSetting[i].name])),
								array: true,
								key: this.formSetting[i].name,
							});
							this.$set(this.tmp,this.formSetting[i].name,obj[this.formSetting[i].name]);
						}
						break;
				}
			}
			this.form.latitude = obj.latitude;
			this.form.longitude = obj.longitude;
			this.form.id = obj.id;
			this.formDialogVisible = true;
			this.form._update_ = ind;

			reqImage = reqImage.filter(ri => {
				if (ri.array) {
					return ri.url && ri.url.length;
				} else {
					return ri.url;
				}
			})
			if (reqImage.length) {
				let loading = this.$loading({
					fullscreen: true
				});
				urls2imgs(reqImage).then(ret => {
					loading.close();
					ret.forEach(o => {
						if (o.array) {
							this.$set(this.tmp,o.key,o.url);
							this.$set(this.list[ind],o.key + 'Url',o.url);
						} else {
							this.$set(this.tmp,o.key,o.url[0]);
							this.$set(this.list[ind],o.key + 'Url',o.url[0]);
						}
					})
				})
			}
		},
		showImage(ind,key,imgInd) {
			if (this.list[ind] && this.list[ind][key]) {
				if (imgInd !== -1) {
					console.log(imgInd);
					requestImage(this.list[ind][key][imgInd]).then(url => {
						if (!this.list[ind][key + 'Url']) {
							this.$set(this.list[ind],key + 'Url',[]);
							this.list[ind][key].forEach(() => {
								this.list[ind][key + 'Url'].push(false);
							})
						}
						// this.list[ind][key + 'Url'][imgInd] = url;
						this.$set(this.list[ind][key + 'Url'],imgInd,url);
					})
				} else {
					requestImage(this.list[ind][key]).then(url => {
						this.$set(this.list[ind],`${key}Url`,url);
					})
				}
			}
		},
		addOneTableRecord(kk,key) {
			this.$set(this.tableForm,'key',key);
			this.$set(this.tableForm,'table',kk);
			this.$set(this.tableForm,'form',kk.createEmptyForm());
			this.formTableDialogVisible = true;
			// console.log(kk);
		},
		submitOneTableItem() {
			this.form.table[this.tableForm.key].insertOneRecord(this.tableForm.form);
			this.formTableDialogVisible = false;
		},
		updateAllInfo2Main(done) {
			let fs = ['id'];
			for (let i in this.formSetting) {
				if (this.formSetting[i].type === FieldType.image || this.formSetting[i].type === FieldType.imageArray) {
					fs.push(this.formSetting[i].name);
				}
			}
			this.$parent.$emit('updateRecordImage', this.list.map(_ => {
				let obj = {};
				fs.forEach(f => {
					obj[f] = JSON.parse(JSON.stringify(_[f]));
				})
				return obj;
			}));
			done();
		}
	},
	mounted() {
		window.$CommonRecord = this;
	}
}
</script>

<style scoped>
.pin {
	text-align: center;
	width: 60px;
	height: 60px;
	border-radius: 30px;
	background: white;
	box-shadow: 0 2px 4px rgba(0, 0, 0, .08), 0 0 6px rgba(0, 0, 0, .07);
	position: fixed;
	bottom: 20px;
	right: 20px;
	cursor: pointer;
}
.pin i {
	font-size: 40px;
	line-height: 60px;
	color: orange;
}
</style>
