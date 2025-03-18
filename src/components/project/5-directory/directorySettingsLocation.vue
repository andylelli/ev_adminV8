<template>
	<f7-list list class="no-margin-top">
		<f7-list-item title="Location">
			<template #media>
				<f7-icon>
					<font-awesome-icon
						class="fa-fw custom-colour"
						style="font-size: 20px"
						:icon="['fal', 'image']"
					/>
				</f7-icon>
			</template>
			<f7-toggle
				:checked="this.isChecked()"
				@toggle:change="toggle($event)"
			></f7-toggle>
		</f7-list-item>
	</f7-list>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7 } from "framework7-vue";

import misc from "../../../mixins/misc";

export default {
	name: "directory-settings-location",
	data() {
		return {
			table: "directory",
		};
	},
	props: ["projectid"],
	mixins: [misc],
	inject: ["eventBus"],
	computed: {
		getItem() {
			var item = {
				table: this.table,
				key: "projectid",
				id: this.projectid,
				type: "single",
			};
			return store.getters.getData(item);
		},
	},
	methods: {
		isChecked() {
			if (this.getItem[this.table + "_locationid"] === 1) {
				return true;
			} else {
				return false;
			}
		},
		async toggle(event) {

			var value;
			if (event === true) {
				value = 1;
			} else {
				value = 0;
			}

			new Date();
			var unixtime = Date.now() / 1000;

			var item = {};
			item.table = this.table;
			item.json = this.getItem;
			item.json[this.table + "_locationid"] = value;
			item.json[this.table + "_unixtime"] = unixtime;
			await store.dispatch("updateItemApp", item);
		},
	},
	mounted() {},
};
</script>

<style>

</style>