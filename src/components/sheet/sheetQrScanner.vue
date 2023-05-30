<template>
	<f7-sheet
		id="qr-scanner"
		style="height: 94%; --f7-sheet-bg-color: #fff"
		swipe-to-close
		backdrop
		@sheet:open="openScanner()"
		@sheet:closed="closeScanner()"
	>
		<f7-page-content>
			<f7-navbar>
				<f7-nav-title>QR Scanner</f7-nav-title>
			</f7-navbar>
			<f7-block>
				<div align="center">
					<qrcode-stream
						v-if="isScannerActive"
						@decode="onDecode"
					></qrcode-stream>
				</div>
			</f7-block>
		</f7-page-content>
	</f7-sheet>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import {
	QrcodeStream,
	QrcodeDropZone,
	QrcodeCapture,
} from "vue3-qrcode-reader";

import login from "../../mixins/login";
import fetch from "../../mixins/fetch";
import misc from "../../mixins/misc";

export default {
	name: "sheet-qr-scanner",
	data() {
		return {
			page: null,
			id: null,
			scannerActive: false,
		};
	},
	mixins: [login, fetch, misc],
	components: {
		QrcodeStream,
		QrcodeDropZone,
		QrcodeCapture,
	},
	computed: {
		eventid() {
			return store.getters.getEventID();
		},
		isScannerActive() {
			return this.scannerActive;
		},
	},
	methods: {
		openScanner() {
			this.scannerActive = true;
			var obj = store.getters.getQRScanner();
			this.page = obj.page;
			this.id = obj.id;
		},
		closeScanner() {
			this.scannerActive = false;
			store.dispatch("clearQRScanner");
		},
		onDecode(decodedString) {
			console.log("QR code found - " + decodedString);
			if (this.page == "scoreboard") {
				this.scoreboardScanned(decodedString);
			}
		},
		async scoreboardScanned(qrcode) {
			var urlParams = this.getParams(qrcode);
			var value = 1;
			var email = encodeURIComponent(urlParams.email);
			var uniqueId = encodeURIComponent(urlParams.uniqueid);

			if (email) {
				var url =
					store.state.url +
					"api/get/scan/scoreboard" +
					"/" +
					this.eventid +
					"/" +
					this.id +
					"/" +
					value +
					"/" +
					email +
					"/" +
					uniqueId +
					"/" +					
					store.state.token;

				var points;
				if (value == 1) {
					points = "point";
				} else {
					points = "points";
				}

				f7.dialog.preloader("QR code found...");
				f7.sheet.close("#qr-scanner");

				var method = "GET";
				var response = await this.fetch(url, method);

				//Check if the network is too slow
				if (this.networkError(response) == true) {
					return false;
				}

				if (response.status == "success") {
					setTimeout(function () {
						f7.dialog.close();
						f7.dialog.alert(
							value + " " + points + " added",
							"Evara"
						);
					}, 2000);

					var tables = [];
					tables.push("scoreboardscore");

					var fullSync = false;
					var getDeletes = true;
					this.syncGetFromWebServer(
						this.eventid,
						tables,
						fullSync,
						getDeletes
					);
				} else {
					setTimeout(function () {
						f7.dialog.alert(response.message, "Evaria");
					}, 2000);
				}
			}
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
