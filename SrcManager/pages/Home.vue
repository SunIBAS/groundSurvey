<template>
	<el-container style="position: absolute;height: 100%;width: 100%;">
		<el-header class="top-bar">
			{{$lang.get("后台管理平台")}}
			<div style="float: right">
				<el-button type="text" class="lang-select-btn" style="color: white;" @click="changeLang">
					<span :class="currentLang===langOption[0].type ? 'current' : ''">{{langOption[0].text}}</span> /
					<span :class="currentLang===langOption[1].type ? 'current' : ''">{{langOption[1].text}}</span> </el-button>
				<el-button type="text" style="color: white;">退出登录</el-button>
			</div>
		</el-header>
		<el-container>
			<el-aside class="menus-slider" width="300px">
				<el-menu
					@select="openPage"
					:default-active="activateMenu"
					class="el-menu-vertical-demo">
					<template v-for="m in menus">
						<el-menu-item :index="m.id" :key="m.id">{{m.label}}</el-menu-item>
					</template>
				</el-menu>
			</el-aside>
			<el-main style="padding: 0;display: flex;flex-direction: column;">
				<div class="tag-nav">
					<template v-for="(c,ind) in comps">
						<el-tag :key="c.id" style="cursor: pointer;" @click="changePage(c,ind)" @close="closePage(c,ind)"
								:effect="c.visible ? 'dark' : 'plain'" closable>{{c.label}}</el-tag>
					</template>
				</div>
				<div class="main-content">
					<template v-for="c in comps">
						<component :is="c.component" :key="c.id" v-show="c.visible"></component>
					</template>
				</div>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
import {
	systemLangOptions
} from "../../src/utils/Lang";
import Welcome from "./Welcome";
import LandType from "./LandType";
import DisaterType from "./DisaterType";
export default {
	name: "Home",
	components: {DisaterType, LandType, Welcome},
	data() {
		return {
			currentLang: this.$lang.$lang_type,
			langOption: (function () {
				let opts = [];
				for (let i in systemLangOptions) {
					opts.push(systemLangOptions[i]);
				}
				return opts;
			})(),
			activateMenu: '1',
			menus: [
				{
					label: '首页',
					component: 'Welcome',
					id: '1',
				},
				{
					label: "土地类型",
					component: 'LandType',
					id: '2',
				},
				{
					label: "灾害类型",
					component: 'DisaterType',
					id: '3',
				}
			],
			comps: [
				{
					id: '1',
					component: 'Welcome',
					visible: true,
					label: '首页',
				},
				{
					id: '2',
					component: 'LandType',
					visible: false,
					label: "土地类型",
				}
			],
		}
	},
	methods: {
		hideAllPage() {
			for (let i = 0;i < this.comps.length;i++) {
				this.comps[i].visible = false;
			}
		},
		changePage(comps,ind) {
			if (this.comps[ind].visible) {
				return;
			}
			this.hideAllPage();
			this.comps[ind].visible = true;
			this.activateMenu = this.comps[ind].id;
		},
		closePage(comps,ind) {
			if (!this.comps[ind].visible) {
				this.comps.splice(ind,1);
				return;
			}
			if (this.comps.length > 1) {
				this.hideAllPage();
				this.comps.splice(ind,1);
				this.comps[0].visible = true;
				this.activateMenu = this.comps[0].id;
				return;
			} else if (this.comps[ind].id === '1') {
				return;
			} else {
				this.comps.splice(ind,1);
				this.openPage('',this.menus[0]);
				this.activateMenu = this.menus[0].id;
			}
		},
		openPage(id,menuItem) {
			if (id) {
				for (let i = 0;i < this.menus.length;i++) {
					if (this.menus[i].id === id) {
						menuItem = this.menus[i];
						break;
					}
				}
			}
			if (menuItem) {
				for (let i = 0;i < this.comps.length;i++) {
					if (this.comps[i].id === menuItem.id) {
						this.changePage(this.comps[i],i);
						menuItem = null;
						break;
					}
				}
				if (menuItem) {
					this.hideAllPage();
					this.comps.push({
						label: menuItem.label,
						id: menuItem.id,
						visible: true,
						component: menuItem.component
					});
				}
			}
		},
		changeLang() {
			// changeLang
			let type = this.langOption[0].type;
			if (this.currentLang === this.langOption[0].type) {
				type = this.langOption[1].type;
			}
			this.$lang.setType(type);
			console.log(type);
			setTimeout(() => {
				window.location.reload();
			},500);
		}
	},
	mounted() {
		// this.currentLang = this.$lang.$lang_type;
		window.$Home = this;
	}
}
</script>

<style>
	.menus-slider>.el-menu {
		border-right: none;
		background: #f4f4f4;
		font-weight: bold;
	}
	.menus-slider>.el-menu .el-menu {
		border-right: none;
		background: #f4f4f4;
	}
	.menus-slider>.el-menu .el-menu-item:hover {
		background: rgba(3, 172, 244, 0.15);
		color: #2196f3;
	}
	.menus-slider>.el-menu .el-menu-item.is-active {
		color: #2196f3;
	}
	.top-bar {
		background: #0078d7;
		line-height: 60px;
		font-size: 20px;
		color: white;
	}
	.menus-slider {
		background: #f4f4f4;
		border-right: 1px solid #e9e9e9;
	}
	.tag-nav {
		width: 100%;
		height: 53px;
		padding: 10px;
		box-sizing: border-box;
		border-bottom: 1px solid #e9e9e9;
	}
	.tag-nav>span {
		margin-right: 5px;
	}
	.main-content {
		height: calc(100% - 53px);
		width: 100%;
		padding: 5px;
		box-sizing: border-box;
	}
	.lang-select-btn {
		color: white;
		margin-right: 10px;
	}
	.lang-select-btn>span {
		color: lightgray;
	}
	.lang-select-btn>span .current {
		color: white !important;
	}
</style>
