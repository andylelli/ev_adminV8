<template>
	<f7-swipeout-actions right>
		<f7-swipeout-button
			:color="'red'"
			@click="deleteListItem(item.id, table, item.name)"
		>
			<font-awesome-icon
				:id="'swipeout-' + this.table + '-delete-' + this.item.id"
				style="font-size: 24px; display: block"
				:icon="['fal', 'trash']"
			/>
			<font-awesome-icon
				:id="'swipeout-' + this.table + '-spinner-' + this.item.id"
				class="fa-spin"
				style="font-size: 22px; margin-left: -3px; display: none"
				:icon="['fal', 'sync']"
			/>
			<font-awesome-icon
				:id="'swipeout-' + this.table + '-tick-' + this.item.id"
				style="font-size: 24px; display: none"
				:icon="['fal', 'check']"
			/>
			<font-awesome-icon
				:id="'swipeout-' + this.table + '-error-' + this.item.id"
				style="font-size: 24px; display: none"
				:icon="['fal', 'times']"
			/>
		</f7-swipeout-button>
	</f7-swipeout-actions>
</template>

<script>
import deleteItem from "../../mixins/deleteItem";
import misc from "../../mixins/misc";
import fetch from "../../mixins/fetch";

export default {
	name: "swipeout-actions",
	data() {
		return {};
	},
	props: ["item", "table"],
	mixins: [deleteItem, misc, fetch],
	computed: {},
	methods: {
		deleteListItem(id, table, name) {
			this.deleteItem(id, table, name);
		},
	},
	mounted() {
	},
};
</script>

<style scoped>
</style>