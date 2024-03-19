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
			url: "https://www.evaria.io/user/index.html?name=",
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
		eventNameHyphen() {

			return this.getEvent.event_name.replace(/\s+/g, '-').toLowerCase();
		},
		qrValue() {
			return this.url + this.eventNameHyphen + "&id=" + this.getEvent.event_id;
		},
	},
	methods: {},
	mounted() {},
};
</script>

<!--<style scoped>

</style>-->