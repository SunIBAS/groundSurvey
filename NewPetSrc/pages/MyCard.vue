<template>
	<div style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);padding: 10px;border-radius: 4px">
		<div class="my-card-title">{{title}}</div>
		<div>
			<el-button v-if="edit" @click="$emit('open')" type="text">{{$lang.get('编辑')}}</el-button>
			<el-button v-else @click="$emit('open')" type="text">{{$lang.get('查看')}}</el-button>
		</div>
		<div v-for="o in options" :key="o.name">
			<div class="my-card-option-title">{{o.label}}</div>
			<div class="my-card-option-content">&nbsp;&nbsp;&nbsp;{{o.optionKey[o.value]}}</div>
		</div>
<!--		<div>-->
<!--			<div class="my-card-option-title">图片数量</div>-->
<!--			<div class="my-card-option-content">&nbsp;&nbsp;&nbsp;2</div>-->
<!--		</div>-->
	</div>
</template>

<script>
export default {
	name: "MyCard",
	props: {
		edit: {
			type: Boolean,
			require: true,
		},
		title: {
			type: String,
			require: true,
		},
		options: {
			type: Array,
			require: true,
		}
	}
}
</script>

<style>
.my-card-title {
	font-weight: normal;
	font-size: 15px;
	color: black;
}
.my-card-option-title {
	line-height: 20px;
	font-weight: normal;
	font-size: 12px;
	color: black;
}
.my-card-option-content {
	line-height: 16px;
	font-weight: normal;
	font-size: 10px;
	color: dimgray;
}
</style>
