<template>
	<f7-page stacked id="empty" name="empty">
		<general-nav-bar title="" noBackLink></general-nav-bar>
	</f7-page>
</template>

<script>
import { f7, f7ready } from "framework7-vue";

import generalNavBar from "./nav/generalNavBar.vue";

export default {
	data() {
		return {};
	},
	components: {
		generalNavBar,
	},
	computed: {},
	methods: {},
	mounted() {
		f7.sheet.open("#actions-event", true);
	},
};
</script>

<style scoped>
</style>
