<template>
	<div :style="styles" :class="classes">
		<el-button type="text" v-if="!url" @click="updateImage">{{$lang.get('查看图片')}}</el-button>
		<img v-else :src="url" alt="" style="width: 100%;height: 100%;">
	</div>
</template>

<script>
import {
	requestImage
} from "../api/UpperApi";
// import {
// 	requestImage
// } from "../api/request";

export default {
	name: "MyImage",
	props: {
		host: {
			default() {
				return '';
			}
		},
		src: {
			default() {
				return '';
			}
		},
		styles: {
			default() {
				return {}
			}
		},
		classes: {
			default() {
				return ""
			}
		}
	},
	data() {
		return {
			url: '',
		}
	},
	methods: {
		updateImage() {
			if (this.src) {
				requestImage(`${this.host}${this.src}`).then(url => {
					this.url = url;
				});
			}
		}
	},
	watch: {
		src() {
			// this.updateImage();
			this.url = '';
		}
	},
	mounted() {
		// this.updateImage();
	}
}
</script>

<style scoped>

</style>
