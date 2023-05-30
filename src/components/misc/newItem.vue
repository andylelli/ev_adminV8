<template>
	<f7-list list>
		<f7-list-item
			link
			:title="title"
			style="font-size: 14px"
			class="no-chevron"
			@click="newItem()"
		>
			<template #media>
				<f7-icon>
					<font-awesome-icon
						class="fa-fw custom-colour"
						style="font-size: 20px"
						:icon="['fal', 'plus']"
					/>
				</f7-icon>
			</template>
		</f7-list-item>
	</f7-list>
</template>

<script>
export default {
	name: "new-item",
	data() {
		return {};
	},
	props: ["table", "name"],
	mixins: [],
	inject: ["eventBus"],
	computed: {
		title() {
			var title = "NEW " + this.name + " ITEM";
			return title.toUpperCase();
		},
	},
	methods: {
		newItem() {
			var json = {
				displayName: this.name + " ITEM",
			};
			this.eventBus.emit("new-" + this.table, json);
		},
	},
	mounted() {},
};
</script>

<style scoped>
.ripple-color-primary {
	--f7-theme-color-ripple-color: rgba(var(--f7-theme-color-rgb), 0.15);
}
</style>