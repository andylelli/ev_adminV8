<template>
	<div>
		<div class="list no-margin-top no-margin-bottom">
			<ul>
				<li>
					<div class="item-content">
						<div class="item-media">
							<i class="icon">
								<font-awesome-icon
									class="fa-fw custom-colour"
									style="font-size: 20px"
									:icon="['fal', 'info']"
								/>
							</i>
						</div>
						<div class="item-inner">
							<div class="item-title">Icon</div>
							<div
								class="item-after"
								@click="openProjectIconSheet()"
							>
								<font-awesome-icon
									class="fa-fw custom-colour"
									style="font-size: 26px"
									:icon="getIcon()"
								/>
							</div>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import store from "../../vuex/store.js";

export default {
	name: "project-icon",
	data() {
		return {};
	},
	props: ["id"],
	inject: ["eventBus"],
	computed: {
		getItem() {
			var item = {
				table: "project",
				key: "id",
				id: this.id,
				type: "single",
			};
			var data = store.getters.getData(item);
			if (data) {
				return data;
			}
		},
		getValue() {
			if (this.getItem) {
				return this.getItem.project_appicon;
			}
		},
	},
	methods: {
		getIcon() {
			const icon = this.getItem.project_appicon.split(" ");
			return icon;
		},
		openProjectIconSheet() {
			this.eventBus.emit("project-icon");
		},
	},
	mounted() {},
};
</script>

<style scoped>
</style>