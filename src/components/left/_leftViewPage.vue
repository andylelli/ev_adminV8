<template>
	<f7-page class="bg-color-primary">
		<left-menu></left-menu>		
	</f7-page>
</template>

<script>
import leftMenu from "./leftMenu.vue";

import actionsEvent from "../misc/actionsEvent.vue";
import sheetQrScanner from "../sheet/sheetQrScanner.vue";
import sheetNewEvent from "../sheet/sheetNewEvent.vue";
import sheetUpdateAvailable from "../sheet/sheetUpdateAvailable.vue";

export default {
	data() {
		return {};
	},
	components: {
		leftMenu,
		actionsEvent,
		sheetQrScanner,
		sheetNewEvent,
		sheetUpdateAvailable,		
	},
	computed: {},
	methods: {},
	mounted() {},
};
</script>

<style></style>