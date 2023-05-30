<template>
	<div>
		<f7-block-header>QR CODE</f7-block-header>
		<f7-block v-if="getQrCode" class="block text-align-center">
			<a class="link external" target="_blank" :href="getQrCode.qrcode_value">
				<img :src="getQrCode.qrcode_image" />
			</a>
		</f7-block>
	</div>
</template>

<script>
import store from "../../vuex/store.js";

export default {
	name: "event-settings-qr-code",
	data() {
		return {};
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
		}		
	},
	methods: {

	},
	mounted() {
	},
};
</script>

<!-- <style scoped>

</style>-->