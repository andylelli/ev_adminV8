<template>
	<!-- Swipe to close demo sheet -->
	<f7-sheet
		class="c3-sheet-huntitem"
		style="height: 94%; --f7-sheet-bg-color: #2b2b2b"
		swipe-to-close
		backdrop
	>
		<f7-page-content>
			<f7-navbar
				v-if="getHuntitem"
				:title="getHuntitem.huntitem_name"
			></f7-navbar>
			<div v-if="getHuntitem">
				<image-load
					table="huntitem"
					:id="getHuntitem.huntitem_id"
				></image-load>
				<text-block
					table="huntitem"
					:id="getHuntitem.huntitem_id"
					fieldname="text"
				></text-block>
			</div>
		</f7-page-content>
	</f7-sheet>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import imageLoad from "../../misc/imageLoad.vue";
import textBlock from "../../misc/textBlock.vue";

export default {
	name: "sheet-huntitem",
	data() {
		return {
			id: null,
		};
	},
	inject: ["eventBus"],
	components: {
		imageLoad,
		textBlock,
	},
	computed: {
		getHuntitem() {
			var item = {
				table: "huntitem",
				key: "id",
				id: this.id,
				type: "single",
			};
			var huntitem = store.getters.getData(item);
			return huntitem;
		},
	},
	methods: {},
	beforeMounted() {},
	mounted() {
		f7.sheet.create({
			el: "#qr-code",
			closeByBackdropClick: true,
			swipeToClose: true,
			backdrop: true,
		});

		//Event - Sheet huntitem
		this.eventBus.on("sheet-huntitem", (id) => {
			this.id = id;
			f7.sheet.open(".c3-sheet-huntitem", true);
		});
		this.eventBus.eventsListeners['sheet-huntitem'].splice(1);
	},
};
</script>
