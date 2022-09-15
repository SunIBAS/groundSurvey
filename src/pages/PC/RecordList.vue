<template>
	<el-dialog
		:visible.sync="dialogVisible"
		:fullscreen="true"
		:modal="false"
		:show-close="true">
		<div slot="title">
			<el-button type="text" @click="refreshRecords()">刷新</el-button>
		</div>
		<template v-for="(l,ind) in currentList">
			<el-card class="box-card" :key="ind" style="margin-bottom: 10px;">
				<div slot="header" class="clearfix">
					<span>#{{ind + 1 + (page - 1) * pageSize}}</span>
					<el-button style="float: right; padding: 3px 0" type="text" @click="loadMainRecordById(l.id)">编辑</el-button>
				</div>
				<div> 创建时间&nbsp;&nbsp;&nbsp;{{l.createTime}} </div>
				<div> 调查时间&nbsp;&nbsp;&nbsp;{{l.surveyTime}} </div>
				<div> 更新时间&nbsp;&nbsp;&nbsp;{{l.updateTime}} </div>
				<div> 农作物类型&nbsp;&nbsp;&nbsp;{{l.cropType}} </div>
				<div> 农作物品种&nbsp;&nbsp;&nbsp;{{l.cropVariety}} </div>
			</el-card>
		</template>
		<el-pagination
			background
			:current-page.sync="page"
			@current-change="getRecords"
			:hide-on-single-page="true"
			layout="prev, pager, next"
			:page-size="pageSize"
			:total="total">
		</el-pagination>
	</el-dialog>
</template>

<script>
import {
	GetRecordByPage
} from "../../api/selection";

export default {
	name: "RecordList",
	data() {
		return {
			dialogVisible: false,
			total: 0,
			page: 1,
			pageSize: 10,
			currentList: [],
		}
	},
	methods: {
		refreshRecords() {
			this.page = 1;
			this.getRecords();
		},
		getRecords() {
			console.log(`page = ${this.page}`)
			GetRecordByPage(this.page,this.pageSize).then(({total,data}) => {
				this.total = total;
				this.currentList.splice(0,this.currentList.length,...data.map(_ => {
					return {
						..._,
						updateTime: _.updateTime.split('+')[0],
						surveyTime: (_.surveyTime || '+').split('+')[0],
						createTime: _.createTime.split('+')[0],
					}
				}));
			})
		},
		loadMainRecordById(id) {
			this.$emit('loadMainRecordById',id);
		}
	},
	mounted() {
		this.getRecords();
		window.$RecordList = this;
	}
}
</script>

<style scoped>

</style>
