<template>
	<f7-block class="text-align-center">
		<a class="link external" target="_blank" :href="QRCodeValue">
			<img :src="QRCodeImage" />
		</a>
	</f7-block>
</template>

<script>
import store from "../../vuex/store.js";

export default {
	name: "qr-code",
	data() {
		return {};
	},
	props: ["table", "id", "link"],
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
	mounted() {},
};
</script>

<!-- <style scoped>

</style>-->