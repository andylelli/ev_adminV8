<template>
	<f7-page class="bg-color-primary">
		<left-menu></left-menu>
		<actions-event></actions-event>
		<sheet-qr-scanner></sheet-qr-scanner>
		<sheet-new-event></sheet-new-event>
		<sheet-update-available></sheet-update-available>
		<sheet-backup></sheet-backup>
		<sheet-restore></sheet-restore>
		<sheet-edit></sheet-edit>
		<sheet-new></sheet-new>
		<sheet-register></sheet-register>
		<sheet-project-icon></sheet-project-icon>
		<sheet-directory-colour></sheet-directory-colour>
	</f7-page>
</template>

<script>
import leftMenu from "./leftMenu.vue";

import actionsEvent from "../misc/actionsEvent.vue";
import sheetQrScanner from "../sheet/sheetQrScanner.vue";
import sheetNewEvent from "../sheet/sheetNewEvent.vue";
import sheetUpdateAvailable from "../sheet/sheetUpdateAvailable.vue";
import sheetBackup from "../sheet/sheetBackup.vue";
import sheetRestore from "../sheet/sheetRestore.vue";
import sheetEdit from "..//sheet/sheetEdit.vue";
import sheetNew from "../sheet/sheetNew.vue";
import sheetRegister from "../sheet/sheetRegister.vue";
import sheetProjectIcon from "../sheet/sheetProjectIcon.vue";
import sheetDirectoryColour from "../sheet/sheetDirectoryColour.vue";

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
		sheetBackup,
		sheetRestore,
		sheetEdit,
		sheetNew,
		sheetRegister,
		sheetProjectIcon,
		sheetDirectoryColour,
	},
	computed: {},
	methods: {},
	mounted() {},
};
</script>

<style>

</style>