<template>
	<!-- Swipe to close demo sheet -->
	<f7-sheet id="qr-code" style="height: 94%; --f7-sheet-bg-color: #fff" swipe-to-close backdrop @sheet:open="getQRCode()">
		<f7-page-content>
			<f7-navbar>
				<f7-nav-title>QR</f7-nav-title>
			</f7-navbar>
			<f7-block>
				<div align="center">
					<qrcode-vue :value="qrImage" :size="size" :margin="margin"></qrcode-vue>
				</div>
			</f7-block>
		</f7-page-content>
	</f7-sheet>
</template>

<script>
import store from "../../vuex/store.js";

import QrcodeVue from "qrcode.vue";

import { f7, f7ready } from "framework7-vue";

export default {
	name: "sheet-qrcode",
	data() {
		return {
			size: 300,
			margin: 2,
		};
	},
	components: {
		QrcodeVue,
	},
	mixins: [],
	computed: {
		// Set the email for generating QR code
		setEmail() {
			return store.getters.getEmail(); // Get the email from the store getters
		},
		qrImage() {
			var splashColour = store.getters.getLookup("splashcolour");
			var name;
			if (this.email) {
				name = this.email.substring(0, this.email.indexOf("@")); // Extract name from email
			}
			let eventid = parseInt(localStorage.user_eventid); // Get the event ID from local storage
			let value =
				this.url +
				"app/" + name + "/" + eventid + "/" + splashColour; // Construct the URL for the QR code
			console.log(value);
			return value; // Return the URL for generating the QR code image
		},
	},
	methods: {
	},
	mounted() {
		f7ready((f7) => {
			f7.sheet.create({
				el: "#qr-code",
				closeByBackdropClick: true,
				swipeToClose: true,
				backdrop: true,
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
