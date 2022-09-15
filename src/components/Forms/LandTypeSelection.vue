<template>
	<el-dialog
		:visible.sync="dialogVisible"
		:fullscreen="true"
		:show-close="false">
		<div slot="title" class="">
			土地类型&nbsp;&nbsp;
			<span v-if="showType === constType.landtype">类型</span>
			<span v-else>属性</span>
			<el-button v-show="showType === constType.attribute" type="text" @click="showType = constType.landtype" style="float: right;">返回&nbsp;&nbsp;类型</el-button>
		</div>
		<div v-show="showType === constType.landtype">
			<div v-for="(formOpt,ind) in landTypeSelections" :key="ind">
				<el-divider content-position="left">{{formOpt[`name${lang}`]}}</el-divider>
				<el-tag v-for="(opt,oind) in formOpt.subLandType"
						:key="oind" style="margin-right: 5px;" @click="showAttribute(formOpt,opt)"
						:type="opt.id === landMsg.landTypeId ? 'success' : ''">{{opt[`name${lang}`]}}</el-tag>
			</div>
		</div>
		<div v-show="showType === constType.attribute">
			<el-breadcrumb separator="/" style="width: 100%;">
				<el-breadcrumb-item v-for="lt in landMsg.landTypeList" :key="lt">
					<el-button type="text">{{lt}}</el-button>
				</el-breadcrumb-item>
			</el-breadcrumb>
			<div v-for="(formOpt,ind) in attributeSelections" :key="ind">
				<el-divider content-position="left">{{formOpt[`name${lang}`]}}</el-divider>
				<el-tag v-for="(opt,oind) in formOpt.attributeValues" ref="tag"
						:key="oind" style="margin-right: 5px;" @click="selectAttribute(formOpt,opt)"
						:type="opt.id === landMsg.attributeValues[formOpt.landAttrId] ? 'success' : ''">{{opt[`value${lang}`]}}</el-tag>
			</div>
			<el-button @click="selectOver" style="width: 100%;">提交</el-button>
		</div>
	</el-dialog>
</template>

<script>
import {
	getLandType,
	getLandAttribute,
} from "../../api/selection";
const constType = {
	attribute: 'attribute',
	attributeValue: 'attributeValue',
	landtype: 'landType',
};
export default {
	name: "LandTypeSelection",
	data() {
		return {
			lang: this.$lang.$lang_type,
			dialogVisible: false,
			constType,
			showType: constType.landtype,
			landTypeSelections: [],
			attributeSelections: [],
			landMsg: {
				landTypeId: -1,
				// [天然林,用材林]
				attributeValues: {},
				landTypeList: [],
				attributeValueList: {}
			},
		}
	},
	methods: {
		open(landMsg) {
			this.dialogVisible = true;
			this.landMsg = landMsg;
			this.showType = constType.landtype;
		},
		showAttribute(pObj,cObj) {
			if (this.landMsg.landTypeId !== cObj.id) {
				this.landMsg.attributeValues = {};
				this.landMsg.attributeValueList = {};
			}
			this.landMsg.landTypeId = cObj.id;
			this.landMsg.landTypeList = [pObj[`name${this.lang}`],cObj[`name${this.lang}`]];
			this.showType = constType.attribute;
			getLandAttribute(cObj.id).then(attributeSelections => {
				// console.log(attributeSelections)
				this.attributeSelections = attributeSelections;
				attributeSelections.forEach(abs => {
					if (!(abs.landAttrId in this.landMsg.attributeValues)) {
						this.$set(this.landMsg.attributeValues,abs.landAttrId,'');
						this.$set(this.landMsg.attributeValueList,abs[`name${this.lang}`],'/');
					}
				});
			});
		},
		// 选择属性的值
		selectAttribute(pObj,cObj) {
			this.$set(this.landMsg.attributeValues,pObj.landAttrId,cObj.id);
			this.$set(this.landMsg.attributeValueList,pObj[`name${this.lang}`],cObj[`value${this.lang}`]);
		},
		// 选好属性值后提示选择结束，返回上一个页面
		selectOver() {
			this.$emit('updateLandMsg',this.landMsg);
			this.dialogVisible = false;
		}
	},
	mounted() {
		getLandType().then(landType => {
			this.landTypeSelections = landType;
		});
		window.$LandTypeSelection = this;
	}
}
</script>

<style scoped>

</style>
