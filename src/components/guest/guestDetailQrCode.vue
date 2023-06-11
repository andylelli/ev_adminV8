<template>
	<div>
		<f7-block class="block text-align-center">
			<a class="link external" target="_blank" :href="qrCodeValue">
				<img :src="qrCodeImage" />
			</a>
		</f7-block>
	</div>
</template>

<script>
import store from "../../vuex/store.js";

import { Dom7 } from 'framework7';
var $$ = Dom7;

import login from "../../mixins/login";
import misc from "../../mixins/misc";

export default {
	name: "guest-detail-qr-code",
	data() {
		return {
			userid: store.state.userid,
			eventid: store.state.eventid,
		};
	},
	mixins: [login, misc],
	props: {
		guestid: Number,
	},
	computed: {
		getGuestQRCode() {
			var item = {
				table: "qrcode",
				key: "guestid",
				id: this.guestid,
				type: "single",
			};
			var item = store.getters.getData(item);
			if (item) {
				return true;
			} else {
				return false;
			}
		},
		qrCodeImage() {
			var item = {
				table: "qrcode",
				key: "guestid",
				id: this.guestid,
				type: "single",
			};
			var item = store.getters.getData(item);
			if (item) {
				return item.qrcode_image;
			}
		},
		qrCodeValue() {
			var item = {
				table: "qrcode",
				key: "guestid",
				id: this.guestid,
				type: "single",
			};
			var item = store.getters.getData(item);
			if (item) {
				return item.qrcode_value;
			}
		},
	},
	methods: {},
	created() {
		if (this.getGuestQRCode === false) {
			this.getQRCode(this.guestid, "guest");
		}
	},
	mounted() {},
};
</script>

<!-- <style scoped>

</style>-->