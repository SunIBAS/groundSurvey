<template>
	<div>
		<div style="margin-bottom: 5px;">
			<el-button type="primary" size="mini" v-show="table===constType.attribute" @click="table=constType.landtype">返回</el-button>
			<el-button type="primary" size="mini" v-show="table===constType.attribute"
					   @click="tableAction(-1,{id:-1},constType.attribute,constMethod.add)">添加属性</el-button>
			<el-button type="primary" size="mini" v-show="table===constType.landtype"
					   @click="tableAction(-1,{id:-1},constType.landtype,constMethod.add)">添加类型</el-button>
		</div>
		<el-table v-show="table === constType.landtype"
			:data="tableData"
			style="width: 100%;margin-bottom: 20px;"
			row-key="id"
			border
			:tree-props="{ children: 'subLandType' }">
			<el-table-column
				prop="id"
				label="id"
				width="150">
			</el-table-column>
			<el-table-column
				prop="nameChs"
				label="中文">
			</el-table-column>
			<el-table-column
				prop="nameEn"
				label="English">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button
						v-show="scope.row.level === 2"
						size="mini"
						type="primary"
						@click="updateAttribute(scope.$index, scope.row)">编辑属性</el-button>
					<el-button
						v-show="scope.row.level === 1"
						size="mini"
						type="primary"
						@click="tableAction(scope.$index, scope.row,constType.landtype,constMethod.add)">添加</el-button>
<!--					<el-button-->
<!--						size="mini"-->
<!--						type="warning"-->
<!--						@click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
					<el-button
						size="mini"
						type="danger"
						@click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-table v-show="table === constType.attribute"
			:data="attributeTableData"
			style="width: 100%;margin-bottom: 20px;"
			row-key="id"
			border
			:tree-props="{ children: 'attributeValues' }">
			<el-table-column
				prop="id"
				label="id"
				width="150">
			</el-table-column>
			<el-table-column
				prop="nameChs"
				label="中文">
			</el-table-column>
			<el-table-column
				prop="nameEn"
				label="English">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button
						v-show="scope.row.level === 1"
						size="mini"
						type="primary"
						@click="tableAction(scope.$index, scope.row, constType.attributeValue, constMethod.add)">添加属性值</el-button>
<!--					<el-button-->
<!--						size="mini"-->
<!--						type="warning"-->
<!--						@click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
					<el-button
						size="mini"
						type="danger"
						@click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog title="添加" width="400px" :close-on-click-modal="false" :close-on-press-escape="false"
				   :visible.sync="editForm.openDialog">
			<el-form label-position="left" label-width="80px">
				<el-form-item label="中文">
					<el-input v-model="editForm.nameChs"></el-input>
				</el-form-item>
				<el-form-item label="英文">
					<el-input v-model="editForm.nameEn"></el-input>
				</el-form-item>
			</el-form>
			<el-button style="width: 100%" type="primary" @click="submitForm">提交</el-button>
		</el-dialog>
	</div>
</template>

<script>

const constType = {
	attribute: 'attribute',
	attributeValue: 'attributeValue',
	landtype: 'landType',
}
const constMethod = {
	add: 'add',
	update: 'update',
}
import {
	getLandType,
	addLandType,
	getLandAttribute,
	addLandTypeAttributeValue,
	addLandTypeAttribute,
} from "../../src/api/selection";
const getIndexFromArrayById = (arr,id) => {
	for (let i = 0;i < arr.length;i++) {
		if (arr[i].id === id) {
			return i;
		}
	}
	return -1;
};
let expId = (function () {
	let id = 0;
	return function () {
		id++;
		return `[假设]:${id}`;
	}
})();
export default {
	name: "LandType",
	data() {
		return {
			constType,
			constMethod,
			tableData: [],
			attributeTableData: [],
			table: 'landType',
			editForm: {
				landTypeId: '',
				id: '',
				openDialog: false,
				target: 'landType',
				method: 'add',
				nameChs:'',
				nameEn: '',
				parentId: '',
				info: {
					ind: -1,
					row: {}
				},
			},
		}
	},
	methods: {
		reloadLandType() {
			this.table = 'landType';
			getLandType().then(obj => {
				obj = obj.map(o => {
					return {
						id: o.id,
						level: 1,
						"nameChs": o.nameChs,
						"nameEn": o.nameEn,
						subLandType: o.subLandType.map(oo => {
							return {
								level: 2,
								"id": oo.id,
								"nameChs": oo.nameChs,
								"nameEn": oo.nameEn,
								"parentId": oo.parent,
								"createTime": oo.createTime,
								"updateTime": oo.updateTime
							}
						}),
					};
				});
				console.log(obj);
				this.tableData.splice(0,this.tableData.length,...obj);
			});
		},
		loadAttribute(id) {
			this.editForm.landTypeId = id;
			this.table = constType.attribute;
			getLandAttribute(id).then(obj => {
				obj = obj.map(o => {
					return {
						id: o.landAttrId,
						level: 1,
						'nameChs': o.nameChs,
						'nameEn': o.nameEn,
						attributeValues: o.attributeValues.map(oo => {
							return {
								level: 2,
								id: `${o.landAttrId}-${oo.id}`,
								'nameChs': oo.valueChs,
								'nameEn': oo.valueEn,
							}
						})
					}
				});
				this.attributeTableData.splice(0, this.attributeTableData.length, ...obj);
			})
		},
		updateAttribute(ind,row) {
			this.loadAttribute(row.id);
		},
		handleEdit(ind,row) {
			console.log(ind);
			console.log(row);
		},
		handleDelete() {},
		handleAdd(ind,row) {
			this.editForm.parentId = row.id;
			console.log(ind);
			console.log(row);
			this.editForm.openDialog = true;
		},
		tableAction(ind,row,target,method) {
			this.editForm.info.ind = ind;
			this.editForm.info.row = row;
			console.group('table action');
			console.log(ind);
			console.log(row);
			console.log(target);
			console.log(method);
			console.groupEnd();
			this.editForm.target = target;
			this.editForm.method = method;
			if (method === this.constMethod.add) {
				// 添加一定是添加一个子（或者一个根），只有两种情况
				this.editForm.id = '';
				this.editForm.parentId = row.id;
				this.editForm.nameChs = '';
				this.editForm.nameEn = '';
			} else if (method === this.constMethod.update) {
				// 修改只修改文字部分
				this.editForm.id = row.id;
				this.editForm.parentId = '';
				this.editForm.nameChs = row.nameChs;
				this.editForm.nameEn = row.nameEn;
			}
			// this.openEditDialog(target,method);
			this.editForm.openDialog = true;
		},
		submitForm() {
			if (this.editForm.target === constType.attribute) {
				if (this.editForm.method === constMethod.add) {
					addLandTypeAttribute(this.editForm.nameChs,this.editForm.nameEn).then(o => {
						console.log(o);
						this.attributeTableData.push({
							id: expId(),
							level: 1,
							'nameChs': this.editForm.nameChs,
							'nameEn': this.editForm.nameEn,
							attributeValues: []
						});
						this.editForm.openDialog = false;
					})
				}
			} else if (this.editForm.target === constType.attributeValue) {
				addLandTypeAttributeValue(this.editForm.parentId,this.editForm.landTypeId,this.editForm.nameChs,this.editForm.nameEn).then(o => {
					console.log(o);
					let id = getIndexFromArrayById(this.tableData,this.editForm.parentId);
					if (id === -1) {
						throw new Error("id == -1");
					}
					this.tableData[id].attributeValues.push({
						level: 2,
						id: expId(),
						'nameChs': this.editForm.nameChs,
						'nameEn': this.editForm.nameEn,
					});
					this.editForm.openDialog = false;
				});
			} else if (this.editForm.target === constType.landtype) {
				if (this.editForm.method === constMethod.add) {
					// 添加土地类型
					addLandType(this.editForm.nameChs,this.editForm.nameEn,this.editForm.parentId).then(o => {
						console.log(o);
						// 假设这里返回了一个 id，将这一项加入到表格中
						if (this.editForm.parentId === -1) {
							this.tableData.push({
								id: expId(),
								level: 1,
								nameChs: this.editForm.nameChs,
								nameEn: this.editForm.nameEn,
								subLandType: []
							});
						} else {
							let id = getIndexFromArrayById(this.tableData,this.editForm.parentId);
							if (id === -1) {
								throw new Error("id == -1");
							}
							this.tableData[id].subLandType.push({
								level: 2,
								"id": expId(),
								"nameChs": this.editForm.nameChs,
								"nameEn": this.editForm.nameEn,
								"parentId": this.editForm.parentId,
							})
						}
						this.editForm.openDialog = false;
					});
				}
			}
		},
	},
	mounted() {
		this.reloadLandType();
	}
}
</script>

<style scoped>

</style>
