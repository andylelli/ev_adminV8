<template>
	<div>
		<f7-block-header>FULL DATA LOAD</f7-block-header>
		<f7-list list>
			<f7-list-item
				title="Put all data to server"
				@click="putAllData()"
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
				title="Get all data from server"
				@click="getAllData()"
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
	name: "event-settings-full-load",
	data() {
		return {
			userid: store.state.userid,
			eventid: store.state.eventid,
		};
	},
	mixins: [autoSync, login, misc],
	computed: {
		getEvent() {
			var item = {
				table: "event",
				key: "id",
				id: store.state.eventid,
				type: "single",
			};
			return store.getters.getData(item);
		},
	},
	methods: {
		putAllData() {
			var vue = this;
			var message =
				"This will upload all data to the server for this event, overwrittings what is currently there. Be very careful when doing this. Are you sure?";
			f7.dialog.confirm(message, function () {
				f7.preloader.show();
				vue.syncPutToWebServer(true, null, null);
			});
		},
		getAllData() {
			var vue = this;
			var table = store.getters.getTableNames("remote");

			var message =
				"This will download all data for this event from the server, overwriting what is currently here. Be very careful when doing this. Are you sure?";
			f7.dialog.confirm(message, function () {
				f7.preloader.show();
				localStorage.admin_counter = 0;

				var total = table.length * 2;

				var tables = false;
				var fullSync = true;
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
	},
	mounted() {},
};
</script>

<!-- <style scoped>

</style>-->