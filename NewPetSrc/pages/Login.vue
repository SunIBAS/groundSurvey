<template>
	<div class="background">
		<el-row :gutter="10">
			<el-col :xs="1" :sm="3" :md="8" :lg="8" :xl="9">&nbsp;</el-col>
			<el-col :xs="22" :sm="18" :md="8" :lg="8" :xl="6"
					class="login-form">
				<el-form ref="form" :model="form" style="padding: 10px;box-sizing: border-box;">
					<el-form-item label="用户名">
						<el-input v-model="form.username"></el-input>
					</el-form-item>
					<el-form-item label="密码">
						<el-input v-model="form.password"></el-input>
					</el-form-item>
					<el-form-item label="确认密码" v-show="type==='register'">
						<el-input v-model="form.rePassword"></el-input>
					</el-form-item>
					<el-form-item v-show="type === 'login'">
						<el-button type="primary" @click="toLogin">登录</el-button>
						<el-button type="text" style="float:right;" @click="type='register'"><i class="el-icon-right"></i>注册</el-button>
					</el-form-item>
					<el-form-item v-show="type === 'register'">
						<el-button type="primary" @click="register">注册</el-button>
						<el-button type="text" style="float:right;" @click="type='login'"><i class="el-icon-right"></i>登录</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			<el-col :xs="1" :sm="3" :md="8" :lg="8" :xl="9">&nbsp;</el-col>
		</el-row>
	</div>
</template>

<script>
import {
	login,
	register
} from "../api/UserApi";
import {
	Storage
} from "../utils/storage";

export default {
	name: "Login",
	data() {
		return {
			type: 'login',
			form: {
				username: '',
				password: '',
				rePassword: '',
			}
		}
	},
	methods: {
		toLogin() {
			login(this.form.username,this.form.password)
				.then(obj => {
					if (obj) {
						Storage.set_user_info(obj);
						location.reload();
					}
				});
		},
		register() {
			if (this.form.password === this.form.rePassword) {
				register(this.form.username,this.form.password).then(() => {
					this.$message({
						offset: 100,
						type: 'success',
						message: '注册成功'
					});
					this.form.username = '';
					this.form.password = '';
					this.form.rePassword = '';
					this.type = 'login';
				});
			} else {
				this.$message({
					offset: 100,
					type: 'error',
					message: '密码不一致'
				});
			}
		}
	}
}
</script>

<style>
.login-form {
	border: 1px solid #dcdfe6;
	border-radius: 4px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	margin-top: 20vh;
	background: white;
}
.background {
	width: 100vw;
	height: 120vh;
	overflow: hidden;
	background: #f5f5f5;
	background-image: linear-gradient(45deg, #fff 25%, transparent 0, transparent 75%, #fff 0), linear-gradient(45deg, #fff 25%, transparent 0, transparent 75%, #fbfbfb 0);
	background-position: 0 0, 50px 50px;
	background-size: 100px 100px;
}
</style>
