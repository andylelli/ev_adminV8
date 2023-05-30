<template>
	<div>
		<f7-block-header>SHOP</f7-block-header>
		<f7-list list>
			<f7-list-item title="Set shop?">
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'shopping-bag']"
						/>
					</f7-icon>
				</template>
				<f7-toggle
					:checked="this.isChecked()"
					color="custom-color"
					@toggle:change="toggle($event)"
				></f7-toggle>
			</f7-list-item>
		</f7-list>
	</div>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";
import { Dom7 } from "framework7";
var $$ = Dom7;

import misc from "../../../mixins/misc";

export default {
	name: "directoryentry-settings-shop",
	data() {
		return {};
	},
	props: {
		projectid: Number,
	},
	computed: {
		getDirectory() {
			var item = {
				table: "directory",
				key: "projectid",
				id: this.projectid,
				type: "single",
			};
			return store.getters.getData(item);
		},
	},
	methods: {
		isChecked() {
			if (this.getDirectory.directory_shopid === 1) {
				return true;
			} else {
				return false;
			}
		},
		toggle(event) {
			new Date();
			var unixtime = Date.now() / 1000;

			var value;
			if (event === true) {
				value = 1;
			} else {
				value = 0;
			}
			var item = {};
			item.table = "directory";
			item.json = this.getDirectory;
			item.json.directory_shopid = value;
			item.json.directory_unixtime = unixtime;
			store.dispatch("updateItemApp", item);
		},
	},
	mounted() {},
};
</script>

<style scoped>
</style>