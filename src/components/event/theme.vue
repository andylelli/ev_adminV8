<template>
	<div>
		<f7-block-header>THEME</f7-block-header>
		<f7-list list class="no-margin-bottom no-hairline">
			<f7-list-item :title="'Use in dark mode'" class="no-hairline">
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
					color="custom-color"
					@toggle:change="toggle($event)"
				></f7-toggle>
			</f7-list-item>
		</f7-list>
	</div>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import misc from "../../mixins/misc";

export default {
	name: "theme",
	data() {
		return {
			eventid: store.state.eventid,
		};
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
			store.dispatch("updateItemDB", item);
		},
	},
	mounted() {
		f7ready((f7) => {
			console.log();
		});
	},
};
</script>

<style>
</style>