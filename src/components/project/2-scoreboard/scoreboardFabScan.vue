<template>
	<f7-fab position="center-bottom" @click="openSheetQrScanner()">
		<font-awesome-icon style="font-size: 26px; color: white;" :icon="['fal', 'camera']" />
	</f7-fab>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

export default {
	name: "scoreboard-fab-scan",
	data() {
		return {};
	},
	props: ["projectid"],
	inject: ["eventBus"],
	computed: {
		getScoreboard() {
			var item = {
				table: "scoreboard",
				key: "projectid",
				id: this.projectid,
				type: "single",
			};
			var data = store.getters.getData(item);
			if (data) {
				return data;
			} else return false;
		},
		isLive() {
			var isLive = this.getScoreboard.scoreboard_live;
			if (isLive == 1) {
				return true;
			} else {
				return false;
			}
		},
	},
	methods: {
		openSheetQrScanner() {
			var page = "scoreboard";
			var id = this.getScoreboard.scoreboard_id;

			var obj = {
				page: page,
				id: id,
			};

			this.eventBus.emit("open-qr-scanner", obj);
		},
	},
	mounted() {},
};
</script>

<style>
.fab > a {
	background-color: var(--f7-ios-primary-shade);
	filter: brightness(200%);
}
</style>