<template>
	<el-dialog
		:visible.sync="dialogVisible"
		:fullscreen="true"
		:modal="false"
		:show-close="true">
		<div slot="title">
			<el-button type="text" @click="refreshRecords()">{{$lang.get('刷新')}}</el-button>
		</div>
		<template v-for="(l,ind) in currentList">
			<el-card class="box-card" :key="ind" style="margin-bottom: 10px;">
				<div slot="header" class="clearfix">
					<span>#{{l.id}}</span>
					<div style="float: right;">
<!--						<el-button style="padding: 3px 0" type="text" @click="deleteRecord(l.id)">删除</el-button>-->
						<el-button style="padding: 3px 0" type="text"
								   @click="deleteRecord(l.id)">{{$lang.get('删除')}}</el-button>
						<el-button style="padding: 3px 0" type="text"
								   @click="loadMainRecordById(l.id,true)">{{$lang.get('编辑')}}</el-button>
						<el-button style="padding: 3px 0" type="text"
								   @click="loadMainRecordById(l.id,false)">{{$lang.get('查看')}}</el-button>
					</div>
				</div>
				<div> {{$lang.get('创建时间')}}&nbsp;&nbsp;&nbsp;{{l.createTime}} </div>
				<div> {{$lang.get('调查时间')}}&nbsp;&nbsp;&nbsp;{{l.surveyTime}} </div>
				<div> {{$lang.get('更新时间')}}&nbsp;&nbsp;&nbsp;{{l.updateTime}} </div>
<!--				<div> 农作物类型&nbsp;&nbsp;&nbsp;{{l.cropType}} </div>-->
<!--				<div> 农作物品种&nbsp;&nbsp;&nbsp;{{l.cropVariety}} </div>-->
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
	GetRecordList,
	DeleteRecordById,
} from "./../api/apis";
import {
	Ts2Sting
} from "../../src/utils/time";

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
			GetRecordList(this.page,this.pageSize).then(({total,data}) => {
				this.total = total;
				this.currentList.splice(0,this.currentList.length,...data.map(_ => {
					return {
						..._,
						updateTime: _.updateTime.split('.000+')[0],
						surveyTime: Ts2Sting(_.surveyTime),//(_.surveyTime || '+').split('+')[0],
						createTime: _.createTime.split('.000+')[0],
					}
				}));
			})
		},
		deleteRecord(id) {
			this.$confirm(this.$lang.get('此操作将永久删除该记录, 是否继续?'), this.$lang.get('提示'), {
				confirmButtonText: this.$lang.get('确定'),
				cancelButtonText: this.$lang.get('取消'),
				type: 'warning'
			}).then(() => {
				DeleteRecordById(id).then(() => {
					this.$message({
						type: 'success',
						message: this.$lang.get('删除成功!')
					});
					this.refreshRecords();
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: this.$lang.get('已取消删除')
				});
			});
		},
		loadMainRecordById(id,edit) {
			this.$emit('loadMainRecordById',id,edit);
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
