<template>
	<!-- Swipe to close demo sheet -->
	<f7-sheet
		class="sheet-update-available"
		style="height: 14%; --f7-sheet-bg-color: #111111"
		backdrop
	>
		<f7-page-content>
			<f7-block style="margin-top: 25px; margin-bottom: 0px;">
				<div class="display-flex display-flex-row align-content-center" style="padding-top: 10px;">
					<div
						style="width: 25%"
						class="text-color-white"
						@click="updateLater()"
					>
						<f7-button fill class="color-red">LATER</f7-button>
					</div>
					<div align="center"
						style="width: 50%; padding-top: 3px;"
						class="text-color-white"
					>
						NEW UPDATE AVAILABLE!
					</div>
					<div
						style="width: 25%"
						class="text-color-white"
						@click="getUpdate()"
					>
						<f7-button fill class="color-green">UPDATE</f7-button>
					</div>
				</div>
			</f7-block>
		</f7-page-content>
	</f7-sheet>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import misc from "../../mixins/misc";
import login from "../../mixins/login";

export default {
	name: "sheet-update-available",
	data() {
		return {
			eventid: parseInt(localStorage.admin_eventid),
		};
	},
	mixins: [misc, login],
	computed: {},
	methods: {
		updateLater() {
			new Date();
			var unixtime = Date.now() / 1000;

			var item = {
				json: {
					lookup_id: "update-pending",
					lookup_value: true,
					lookup_eventid: this.eventid,
					lookup_unixtime: unixtime,
				},
			};
			
			store.dispatch("insertLookupApp", item);
			store.dispatch("insertLookupDB", item);

			f7.sheet.close(".sheet-update-available");
		},
		getUpdate() {
			var vue = this;
			var confirm = false;
			var message =
				"This will erase all your favorites and require you to log back in again. We recommend you only install the update when you have a good signal or network connection. Tap 'Confirm' to go ahead or 'Cancel' to install later from the Settings page.";

			var cache = store.state.cache; // Get cache from store state
			var title = f7.params.name; // Get title from F7 params

			f7.dialog.confirm(message, title, function () {
				// Show confirmation dialog
				navigator.serviceWorker
					.getRegistrations()
					.then(function (registrations) {
						// Get service worker registrations
						for (let registration of registrations) {
							registration.unregister(); // Unregister service worker
						}

						vue.deleteCache(cache); // Delete cache
						vue.userLogout(); // Log out user

						confirm = true; // Set confirmation flag
					});
			});
			if (confirm === false) {
				// If confirmation is false
				this.updateLater(); // Schedule update for later installation
			}
		},
	},
	beforeMounted() {},
	mounted() {
		f7ready((f7) => {
			var sheetUpdateAvailable = f7.sheet.create({
				el: ".sheet-update-available",
			});
			//f7.sheet.open(".sheet-update-available");
			sheetUpdateAvailable.params.closeByBackdropClick = false;
		});
	},
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