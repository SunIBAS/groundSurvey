<template>
	<component :is="comp"/>
</template>

<script>
import App from "./App";
import Login from "./pages/Login";
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
		Storage.get_user_info().then(userinfo => {
			if (userinfo) {
				this.comp = 'App';
				window.onbeforeunload = function() {
					return 'really?';
				}
			} else {
				this.comp = 'Login';
			}
		});
	}
}
</script>

<style scoped>

</style>
