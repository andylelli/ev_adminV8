<template>
	<f7-list list class="no-margin-top">
		<f7-list-item title="Display images?">
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
import store from "../../vuex/store.js";

export default {
	name: "show-image",
	data() {
		return {};
	},
	props: ["table", "id", "title"],
	computed: {
		getItem() {
			var item = {
				table: this.table,
				key: "projectid",
				id: this.id,
				type: "single",
			};
			return store.getters.getData(item);
		},
	},
	methods: {
		isChecked() {
			if (this.getItem[this.table + "_imageid"] === 1) {
				return true;
			} else {
				return false;
			}
		},
		toggle(event) {
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
			item.json[this.table + "_imageid"] = value;
			item.json[this.table + "_unixtime"] = unixtime;
			store.dispatch("updateItemApp", item);
		},
	},
	mounted() {},
};
</script>

<style>

</style>