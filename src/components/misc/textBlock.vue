<template>
	<div>
		<f7-block
			v-if="getItemText"
			strong
			inset
			class="custom-background-tint text-color-white"
		>
			<p v-html="this.getItemText"></p>
		</f7-block>
	</div>
</template>

<script>
import store from "../../vuex/store.js";

import misc from "../../mixins/misc";

import { f7, f7ready } from "framework7-vue";

import escape from "../../js/config/escape.js";

export default {
	name: "text-block",
	data() {
		return {};
	},
	props: {
		table: String,
		id: Number,
		fieldname: String		
	},
	mixins: [misc],
	computed: {
		getItemText() {
			var item = {
				table: this.table,
				key: "id",
				id: this.id,
				type: "single",
			};
			var item = store.getters.getData(item);
			if (item) {
				var text = item[this.table + "_" + this.fieldname];
				var textDecode = escape.decodeXML(text);
				return textDecode;
			}
		},
	},
	mounted() {
		f7ready((f7) => {});
	},
};
</script>

<!-- <style scoped>

</style>-->