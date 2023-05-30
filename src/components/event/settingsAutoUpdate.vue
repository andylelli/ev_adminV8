<template>
	<div>
		<f7-block-header>APP UPDATES</f7-block-header>
		<f7-list list class="no-margin-bottom no-hairline">
			<f7-list-item
				:title="'Automatically install updates'"
				class="no-hairline"
			>
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'cloud-download-alt']"
						/>
					</f7-icon>
				</template>
				<f7-toggle
					:checked="this.isChecked()"
					color="custom-color"
					@toggle:change="toggle($event)"
				></f7-toggle>
			</f7-list-item>
		</f7-list>
		<f7-list
			v-if="this.pendingUpdate === true"
			id="auto-update"
			inline-labels
			class="no-margin-top"
			:style="'position: relative; top: -1px;' + maxHeight()"
		>
			<f7-list-item title="Update available">
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'long-arrow-alt-right']"
						/>
					</f7-icon>
				</template>
				<f7-button fill class="color-green" @click="getUpdate()"
					>INSTALL</f7-button
				>
			</f7-list-item>
		</f7-list>
	</div>
</template>

<script>
import store from "../../vuex/store.js";

import misc from "../../mixins/misc";
import login from "../../mixins/login";

export default {
	name: "settings-auto-update",
	data() {
		return {
			eventid: parseInt(localStorage.admin_eventid),
		};
	},
	mixins: [misc, login],
	computed: {
		toggleState() {
			return store.getters.getLookup("auto-update");
		},
		pendingUpdate() {
			return store.getters.getLookup("update-pending");
		},
	},
	methods: {
		getUpdate() {
			var vue = this;
			var message =
				"This will erase all you favourites and will require you to log back in again. We recommend you only install the update when you have a good signal or network connection. Tap 'Confirm' to go ahead or 'Cancel' to install later from the Settings page.";

			f7.dialog.confirm(message, function () {
				vue.deleteCache(this.eventid);
				vue.userLogout();
			});
		},
		maxHeight() {
			var height;
			if (this.toggleState === true) {
				height = 0;
			} else {
				height = "96px";
			}
			var z =
				"max-height:" +
				height +
				"; overflow: hidden; transition: max-height 0.4s ease-out";
			return z;
		},
		isChecked() {
			if (this.toggleState === false) {
				return false;
			} else {
				return true;
			}
		},
		toggle(event) {
			var id = "auto-update";

			if (this.pendingUpdate === true) {
				this.accordianSlide(id, 0);
			}

			new Date();
			var unixtime = Date.now() / 1000;

			var item = {
				json: {
					lookup_id: "auto-update",
					lookup_value: event,
					lookup_eventid: this.eventid,
					lookup_unixtime: unixtime,
				},
			};

			store.dispatch("deleteLookupApp", item.json.lookup_id);
			store.dispatch("deleteLookupDB", item.json.lookup_id);

			store.dispatch("insertLookupApp", item);
			store.dispatch("insertLookupDB", item);
		},
	},
	mounted() {},
};
</script>

<style scoped>
@media (min-width: 1024px) {
	.sheet-modal {
		margin-left: 25%;
		width: 50% !important;
	}
}
</style>