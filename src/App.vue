<template>
	<div id="app">
		<div id="mapdiv" ref="ifr">
		</div>
		<component :is="pageName" @changeOS="changeOS" :ifr="$refs.ifr"></component>
	</div>
</template>

<script>
// import {
// 	OS,
// 	checkOS
// } from "./utils/checkOS";
import PCIndex from "./pages/PC/PCIndex";
// import MobilIndex from "./pages/Mobile/MobilIndex";

let ifr = null;
export default {
	name: 'App',
	components: {
		PCIndex,
		// MobilIndex
	},
	data() {
		return {
			pageName: '',
		}
	},
	created() {
		// <iframe :src="iframeUrl" style="flex: 1;border: none;" @load="iframeLoad"></iframe>
		ifr = document.createElement('iframe');
		ifr.style.width = '100%';
		ifr.style.height = '100%';
		ifr.style.border = 'none';
		ifr.src = './mapIframe.html';
		setTimeout(() => {
			this.$refs.ifr.appendChild(ifr);
		},1000);
	},
	methods: {
		changeOS(tar) {
			if (tar === 'pc') {
				this.pageName = 'PCIndex'
			}
		}
	},
	mounted() {
		let id = setInterval(() => {
			if (ifr && ifr.contentWindow && ifr.contentWindow.map) {
				console.log(ifr.contentWindow.map);
				clearInterval(id);
				this.$set(this.$addin,'$map',ifr.contentWindow.map);
				this.$set(this.$addin,'$leafletAPI',ifr.contentWindow.leafletAPI);
				// this.$map = ifr.contentWindow.map;
				// this.$leafletAPI = ifr.contentWindow.leafletAPI;
				this.pageName = 'PCIndex';
				// checkOS().then(osName => {
				// 	switch (osName) {
				// 		case OS.PC:
				// 			// this.pageName = 'PCIndex';
				// 			break;
				// 		case OS.Android:
				// 		case OS.Apple:
				// 			// this.pageName = 'MobilIndex';
				// 			break;
				// 		default:
				// 			this.pageName = 'PCIndex';
				//
				// 	}
				// })
			}
		},500);
		window.$this = this;
	}
}
</script>

<style>
#mapdiv {
	z-index: -1;
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
}
/*滚动条的宽度*/
::-webkit-scrollbar {
	width: 0px;
}

/*滚动条里面小方块*/
::-webkit-scrollbar-thumb {
	border-radius: 2px;
	box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
	background: rgba(0, 0, 0, 0.2);
}

/*滚动条里面轨道*/
::-webkit-scrollbar-track {
	box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
	border-radius: 0;
	background: rgba(0, 0, 0, 0.1);
}
</style>
