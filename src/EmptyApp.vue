<template>
	<component :is="comp"/>
</template>

<script>
import App from "./App";
import Login from "./pages/User/Login";
import {
	Storage
} from "./utils/storage";

export default {
	name: "EmptyApp",
	components: {
		App,
		Login
	},
	data() {
		return {
			comp: 'div'
		}
	},
	mounted() {
		let userinfo = Storage.get_user_info();
		if (userinfo) {
			this.comp = 'App';
		} else {
			this.comp = 'Login';
		}
	}
}
</script>

<style scoped>

</style>
