<template>
	<f7-block class="text-align-center">
		<a v-if="link == true" class="link external" target="_blank" :href="QRCodeValue">
			<qrcode-vue :value="QRCodeValue" :size="size" :margin="margin"></qrcode-vue>
		</a>
		<qrcode-vue v-else :value="QRCodeValue" :size="size" :margin="margin"></qrcode-vue>
	</f7-block>
</template>

<script>
import store from "../../vuex/store.js";

import QrcodeVue from "qrcode.vue";

export default {
	name: "qr-code",
	data() {
		return {
			size: 200,
			margin: 2
		};
	},
	props: ["table", "id", "link"],
	components: {
		QrcodeVue,
	},
	computed: {
		getQRCode() {
			var item = {
				table: this.table,
				key: "id",
				id: this.id,
				type: "single",
			};
			return store.getters.getData(item);
		},
		QRCodeImage() {
			if (this.getQRCode) {
				return this.getQRCode[this.table + "_qrcode_image"];
			}
		},
		QRCodeValue() {
			if (this.getQRCode) {
				return this.getQRCode[this.table + "_qrcode_value"];
			}
		},
	},
	methods: {},
	mounted() { },
};
</script>

<!-- <style scoped>

</style>-->