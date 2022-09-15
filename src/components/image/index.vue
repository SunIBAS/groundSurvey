<template>
	<img :src="url" alt="" :style="styles" :class="classes">
</template>

<script>
import {
	requestImage
} from "../../api/request";

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
			this.updateImage();
		}
	},
	mounted() {
		this.updateImage();
	}
}
</script>

<style scoped>

</style>
