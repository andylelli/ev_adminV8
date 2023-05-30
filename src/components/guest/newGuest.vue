<template>
	<f7-list list>
		<f7-list-item
			link
			title="NEW GUEST"
			style="font-size: 14px"
			class="no-chevron"
			@click="newGuest()"
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
	name: "new-guest",
	data() {
		return {};
	},
	inject: ["eventBus"],
	mixins: [],
	computed: {},
	methods: {
		newGuest() {
			var json = {
				table: "guest",
			};
			this.eventBus.emit("new-guest", json);
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