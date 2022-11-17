<template>
	<el-dialog
		:visible.sync="dialogVisible"
		:fullscreen="true"
		:modal="false"
		:show-close="true">
		<div slot="title">
			<el-button type="primary"
					   @click="refreshRecords()">{{$lang.get('刷新')}}</el-button>
			<!-- hbuilder 表示是 app 端，onlyOffline 表示已经断网  --->
			<!-- 只有 app 端的 非 断网 才能切换线上线下记录  --->
			<el-button type="success" v-show="hbuilder && !onlyOffline && !offline"
					   @click="changAsLocalRecord()">{{$lang.get('查看')}}&nbsp;&nbsp;&nbsp;{{$lang.get('离线记录')}}</el-button>
			<el-button type="success" v-show="hbuilder && !onlyOffline && offline"
					   @click="changAsOnlineRecord()">{{$lang.get('查看')}}&nbsp;&nbsp;&nbsp;{{$lang.get('线上记录')}}</el-button>
			<div style="margin-top: 10px;">
				{{$lang.get('历史记录')}}&nbsp;&nbsp;&nbsp;
				<span style="color: #009688" v-show="!offline">{{$lang.get('来自服务器')}}</span>
				<span style="color: #009688" v-show="offline">{{$lang.get('来自本地')}}</span>
			</div>
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
	// GetRecordList,
	DeleteRecordById,
} from './../api/UpperApi';
import {
	GetRecordList as PureGetRecordList,
	// DeleteRecordById,
} from "./../api/apis";
import {
	GetRecordList as NativeGetRecordList,
} from "./../api/nativeApi";
import {
	Ts2Sting
} from "./../utils/time";

let GetRecordList = PureGetRecordList;

export default {
	name: "RecordList",
	data() {
		return {
			dialogVisible: false,
			total: 0,
			page: 1,
			pageSize: 10,
			currentList: [],
			hbuilder: false,
			offline : false,
			onlyOffline: false,
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
						updateTime: _.updateTime ? _.updateTime.split('.000+')[0] : '',
						surveyTime: _.surveyTime ? Ts2Sting(_.surveyTime) : '',//(_.surveyTime || '+').split('+')[0],
						createTime: _.createTime ? _.createTime.split('.000+')[0] : '',
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
			}).catch(e => {
                console.log(e);
				this.$message({
					type: 'info',
					message: this.$lang.get('已取消删除')
				});
			});
		},
		loadMainRecordById(id,edit) {
			this.$emit('loadMainRecordById',id,edit,this.offline);
		},
		changAsLocalRecord() {
			this.offline = true;
			GetRecordList = NativeGetRecordList;
			this.refreshRecords();
		},
		changAsOnlineRecord() {
			this.offline = false;
			GetRecordList = PureGetRecordList;
			this.refreshRecords();
		}
	},
	mounted() {
		this.hbuilder = window.hbuilder;
		if (window.hbuilder && window.offline) {
			GetRecordList = NativeGetRecordList;
			this.offline = true;
			this.onlyOffline = true;
		}
		this.getRecords();
		window.$RecordList = this;
	}
}
</script>

<style scoped>

</style>
