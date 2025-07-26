<template>
	<f7-sheet id="qr-scanner" style="height: 94%; --f7-sheet-bg-color: #fff" swipe-to-close backdrop @sheet:open="openScanner()" @sheet:closed="closeScanner()">
		<f7-page-content>
			<f7-navbar>
				<f7-nav-title>QR Scanner</f7-nav-title>
			</f7-navbar>
			<f7-block>
				<div align="center">
					<qrcode-stream v-if="isScannerActive" @decode="onDecode"></qrcode-stream>
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
			value: 1,
		};
	},
	inject: ["eventBus"],
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
		},
		closeScanner() {
			this.scannerActive = false;
			this.page = null;
			this.id = null;
		},
		onDecode(decodedString) {
			if (decodedString) {
				console.log("QR code found - " + decodedString);
				if (this.page == "scoreboard") {
					this.scoreboardScanned(decodedString);
				}
			}
		},
		async scoreboardScanned(qrcode) {
			console.log(qrcode);
			var urlParams = this.getParams(qrcode);
			var email = encodeURIComponent(urlParams.email);
			var uniqueId = encodeURIComponent(urlParams.uniqueid);

			if (email) {
				f7.dialog.preloader("QR code found...");
				f7.sheet.close("#qr-scanner");

				// Parameters
				var url =
					store.state.url +
					"api/get/scan/scoreboard" +
					"/" +
					this.eventid +
					"/" +
					this.id +
					"/" +
					this.value +
					"/" +
					uniqueId;

				var method = "GET";

				var data = null;

				//Get data
				await this.fetch(url, method, data, this.success, this.failure);
			}
		},
		success() {
			var points;
			if (this.value == 1) {
				points = "point";
			} else {
				points = "points";
			}

			var vue = this;
			setTimeout(function() {
				f7.dialog.close();
				f7.dialog.alert(vue.value + " " + points + " added", "Evara");
			}, 2000);

			var tables = [];
			tables.push("scoreboardscore");

			var fullSync = false;
			var getDeletes = true;
			this.syncGetFromWebServer(this.eventid, tables, fullSync, getDeletes);
		},
		failure() {
			setTimeout(function() {
				f7.dialog.alert(response.message, "Evaria");
			}, 2000);
		},
	},

	mounted() {
		var vue = this;
		f7ready((f7) => {
			vue.eventBus.on("open-qr-scanner", (obj) => {
				vue.page = obj.page;
				vue.id = obj.id;
				f7.sheet.open("#qr-scanner");
			});
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
