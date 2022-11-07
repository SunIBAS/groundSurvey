<template>
	<div>
		<div class="left-bottom" @click="dialogTableVisible = true">
			<!--设置-->
			<i class="el-icon-setting"></i>
		</div>
		<el-dialog title="设置 / Setting" width="90%" :visible.sync="dialogTableVisible">
			<el-form label-position="top" class="setting-form">
				<el-form-item label="语言 / Language">
					<el-radio-group v-model="form.lang">
						<el-radio v-for="k in systemLangOptions"
								  :key="k.type"
								  :label="k.type">{{k.text}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="离线地图 / Offline Map" v-show="$addin.hbuilder">
					<el-button type="text" @click="openMapDownload">查看 / Show</el-button>
				</el-form-item>
				<el-form-item v-show="login">
					<el-button style="width: 100%;" @click="logout">退出登录 / Logout</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import {
	systemLangOptions
} from './../utils/Lang'
import {
	Storage
} from "../utils/storage";
import {
	logout
} from "../api/UserApi";

export default {
	name: "Setting",
	data() {
		return {
			dialogTableVisible: false,
			systemLangOptions,
			form: {
				lang: 'Chs'
			},
			login: false
		}
	},
	methods: {
		logout() {
			window.onbeforeunload = null;
			logout().then(() => {
				Storage.set_user_info(null);
				location.reload();
			});
		},
		reloadAndSetLang() {
			window.onbeforeunload = null;
			this.$lang.setType(this.form.lang);
			setTimeout(() => {
				location.reload();
			},100);
		},
		openMapDownload() {
			window.open_downloadDom();
		}
	},
	watch: {
		'form.lang'() {
			if (this.form.lang !== this.$lang.$lang_type) {
				this.$confirm('语言切换需要重新载入页面, 是否继续?<br/>If language is change, the page should be reload, so ?', '提示 / Tip', {
					dangerouslyUseHTMLString: true,
					confirmButtonText: '确定 / Yes, to reload.',
					cancelButtonText: '取消 / No.',
					type: 'warning'
				}).then(() => {
					this.reloadAndSetLang();
				}).catch(() => {
					this.form.lang = this.$lang.$lang_type;
				});
			}
		}
	},
	mounted() {
		this.form.lang = this.$lang.$lang_type;
		Storage.get_user_info().then(token => {
			this.login = token;
		});
	}
}
</script>

<style>
.left-bottom {
	font-size: 30px;
	line-height: 50px;
	text-align: center;
	position: fixed;
	left: 10px;
	bottom: 20px;
	width: 50px;
	height: 50px;
	background: white;
	border-radius: 60px;
	border: 2px solid white;
	background-size: 100%;
	cursor: pointer;
}
.setting-form .el-form-item .el-form-item__label {
	font-weight: bold;
	color: black;
}
</style>
