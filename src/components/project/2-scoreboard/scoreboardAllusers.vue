<template>
	<f7-list list class="no-margin-top">
		<f7-list-item title="Show all users?">
			<template #media>
				<f7-icon>
					<font-awesome-icon
						class="fa-fw custom-colour"
						style="font-size: 20px"
						:icon="['fal', 'users']"
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
</template>

<script>
import store from "../../../vuex/store.js";

export default {
	name: "scoreboard-allusers",
	data() {
		return {};
	},
	props: {
		projectid: Number,
	},
	computed: {
		getScoreboard() {
			var item = {
				table: "scoreboard",
				key: "projectid",
				id: this.projectid,
				type: "single",
			};
			return store.getters.getData(item);
		},
	},
	methods: {
		isChecked() {
			if (this.getScoreboard.scoreboard_allusers === 1) {
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
			item.table = "scoreboard";
			item.json = this.getScoreboard;
			item.json.scoreboard_allusers = value;
			item.json.scoreboard_unixtime = unixtime;
			store.dispatch("updateItemApp", item);
		},
	},
	mounted() {},
};
</script>

<style scoped>
</style>