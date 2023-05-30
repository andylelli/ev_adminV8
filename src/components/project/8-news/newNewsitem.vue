<template>
	<f7-list list>
		<f7-list-item
			:link="'/newsitem/new/' + this.projectid + '/'"
			:title="title"
			style="font-size: 14px"
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
import store from "../../../vuex/store.js";

export default {
	name: "new-newsitem",
	data() {},
	props: {
		projectid: Number,
	},
	mixins: [],
	computed: {
		title() {
			if (this.getProject) {
				var title = "POST NEW MESSAGE";
				return title.toUpperCase();
			}
		},
		getProject() {
			var item = {
				table: "project",
				key: "id",
				id: this.projectid,
				type: "single",
			};
			return store.getters.getData(item);
		},
	},
	methods: {},
	mounted() {},
};
</script>

<style scoped>
.ripple-color-primary {
	--f7-theme-color-ripple-color: rgba(var(--f7-theme-color-rgb), 0.15);
}
</style>