<template>
	<div>
		<f7-block-header>QR CODE</f7-block-header>
		<f7-block>
			<div align="center">
				<a class="link external" target="_blank" :href="qrValue">
					<qrcode-vue :value="qrValue" :size="size" :margin="margin"></qrcode-vue>
				</a>
			</div>
		</f7-block>
	</div>
</template>

<script>
import store from "../../vuex/store.js";

import QrcodeVue from "qrcode.vue";

export default {
	name: "event-settings-qr-code",
	data() {
		return {
			size: 200,
			margin: 2,
			url: "https://www.evaria.io/public/app/",
		};
	},
	components: {
		QrcodeVue,
	},
	mixins: [],
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
		getQrCode() {
			var item = {
				table: "qrcode",
				key: "eventid",
				id: store.state.eventid,
				type: "single",
			};
			return store.getters.getData(item);
		},
		getSplashColour() {
			var splashColour = store.getters.getLookup("splashcolour");
			if (splashColour == false) {
				return "000000";
			}
			else {
				return splashColour;
			}
		},
		eventNameHyphen() {

			var raw = this.getEvent.event_name; // or your input string
			console.log("RAW: " + raw);
			var encoded = encodeURIComponent(raw);
			console.log("ENCODED: " + encoded);
			var hyphenated = encoded.replace(/'/g, '%27').replace(/%20/g, '-').toLowerCase();
			console.log("HYPHENATED: " + hyphenated);

			return hyphenated;
		},
		qrValue() {
			return this.url + this.eventNameHyphen + "/" + this.getEvent.event_id + "/" + this.getSplashColour + "/browser";
		},
	},
	methods: {},
	mounted() { },
};
</script>

<!--<style scoped>

</style>-->