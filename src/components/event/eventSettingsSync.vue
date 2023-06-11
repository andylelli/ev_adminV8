<template>
	<div>
		<f7-block-header>SYNCRONISATION</f7-block-header>
		<f7-list list>
			<f7-list-item title="Auto put data updates to server">
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'sync']"
						/>
					</f7-icon>
				</template>
				<f7-toggle
					:checked="this.isChecked()"
					color="custom-color"
					@toggle:change="toggleAutoSync($event)"
				></f7-toggle>
			</f7-list-item>
			<f7-list-item
				title="Put data updates to server"
				@click="putUpdates()"
				style="cursor: pointer"
			>
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'upload']"
						/>
					</f7-icon>
				</template>
			</f7-list-item>
			<f7-list-item
				title="Get data updates from server"
				@click="getUpdates()"
				style="cursor: pointer"
			>
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'download']"
						/>
					</f7-icon>
				</template>
			</f7-list-item>
		</f7-list>
	</div>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import autoSync from "../../mixins/autoSync";
import login from "../../mixins/login";
import misc from "../../mixins/misc";

export default {
	name: "event-settings-sync",
	data() {
		return {
			userid: store.state.userid,
			eventid: store.state.eventid,
		};
	},
	mixins: [autoSync, login, misc],
	computed: {
		getEvent() {
			if (store.state.event.length > 0) {
				return store.state.event[0];
			} else {
				return false;
			}
		},
	},
	methods: {
		putUpdates() {
			var vue = this;
			var message =
				"This will upload all pending changes to the server and make them visible to other administrators and app users. Are you sure?";
			f7.dialog.confirm(message, function () {
				f7.preloader.show();
				vue.syncPutToWebServer(null, true, null);
			});
		},
		getUpdates() {
			var vue = this;
			var table = store.getters.getTableNames("remote");

			var message =
				"This will get any updates made by other administrators from the server. Are you sure?";
			f7.dialog.confirm(message, function () {
				f7.preloader.show();
				localStorage.admin_counter = 0;
				var total = table.length * 2;

				var tables = false;
				var fullSync = false;
				var getDeletes = true;
				vue.syncGetFromWebServer(
					vue.eventid,
					tables,
					fullSync,
					getDeletes
				);

				vue.loadCounter(total);
			});
		},
		isChecked() {
			if (this.getEvent.event_autosync === 1) {
				return true;
			} else {
				return false;
			}
		},
		toggleAutoSync(event) {
			var value;
			if (event === true) {
				value = 1;
			} else {
				value = 0;
			}

			new Date();
			var unixtime = Date.now() / 1000;
			var item = {};
			item.table = "event";
			item.json = this.getEvent;
			item.json.event_autosync = value;
			item.json.event_unixtime = unixtime;
			store.dispatch("updateItemApp", item);

			if (value == 0) {
				var vue = this;
				setTimeout(function () {
					vue.syncPutToWebServer(null, null, null);
				}, 2000);
			}
		},
	},
	mounted() {},
};
</script>

<!-- <style scoped>

</style>-->