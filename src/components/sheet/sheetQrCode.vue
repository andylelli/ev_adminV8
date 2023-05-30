<template>
	<!-- Swipe to close demo sheet -->
	<f7-sheet
		id="qr-code"
		style="height: 94%; --f7-sheet-bg-color: #fff"
		swipe-to-close
		backdrop
	>
		<f7-page-content>
			<f7-navbar>
				<f7-nav-title>QR</f7-nav-title>
			</f7-navbar>
			<f7-block>
				<div align="center">
					<img :src="this.qrImage" />
				</div>
			</f7-block>
		</f7-page-content>
	</f7-sheet>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

export default {
	name: "sheet-qrcode",
	data() {
		return {};
	},
	mixins: [],
	computed: {
		qrImage() {
			var eventid = store.state.eventid;
			var item = {
				table: "qrcode",
				key: "eventid",
				id: eventid,
				type: "single",
			};
			var data = store.getters.getData(item);
			if (data) {
				return data.qrcode_image;
			}
		},
	},
	methods: {},
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
