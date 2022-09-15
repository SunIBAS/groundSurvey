<template>
	<component :is="comp"/>
</template>

<script>
import Login from "./../src/pages/User/Login";
import {
	Storage
} from "../src/utils/storage";
import Home from "./pages/Home";

export default {
	name: "EmptyApp",
	components: {
		Home,
		// App,
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
			this.comp = 'Home';
		} else {
			this.comp = 'Login';
		}
	}
}
</script>

<style scoped>

</style>
