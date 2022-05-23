<template>
	<div id="app">
		<component :is="pageName"></component>
	</div>
</template>

<script>

import {
	OS,
	checkOS
} from "./utils/checkOS";
import PCIndex from "./pages/PC/PCIndex";
import MobilIndex from "./pages/Mobile/MobilIndex";
export default {
	name: 'App',
	components: {
		PCIndex,
		MobilIndex
	},
	data() {
		return {
			pageName: ''
		}
	},
	beforeCreate() {
		checkOS().then(osName => {
			switch (osName) {
				case OS.PC:
					this.pageName = 'PCIndex';
					break;
				case OS.Android:
				case OS.Apple:
					this.pageName = 'MobilIndex';
					break;
				default:
					this.pageName = 'PCIndex';

			}
		})
	}
}
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
