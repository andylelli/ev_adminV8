<template>
	<div>
		<f7-block-header>DARK THEME</f7-block-header>
		<f7-list list class="no-margin-bottom no-hairline">
			<f7-list-item
				:title="'Use dark theme as default'"
				class="no-hairline"
			>
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'moon']"
						/>
					</f7-icon>
				</template>
				<f7-toggle
					:checked="this.isChecked()"
					@toggle:change="toggle($event)"
				></f7-toggle>
			</f7-list-item>
		</f7-list>
	</div>
</template>

<script>
import store from "../../vuex/store.js";

import misc from "../../mixins/misc";

export default {
	name: "dark-theme",
	data() {
		return {};
	},
	mixins: [misc],
	computed: {
		getEvent() {
			if (store.state.event.length > 0) {
				return store.state.event[0];
			} else {
				return false;
			}
		},
	},
	methods: {
		isChecked() {
			if (this.getEvent.event_darktheme === 1) {
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
			item.table = "event";
			item.json = this.getEvent;
			item.json.event_darktheme = value;
			item.json.event_unixtime = unixtime;
			store.dispatch("updateItemApp", item);
		},
	},
	mounted() {},
};
</script>

<style>
</style>