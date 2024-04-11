<template>
	<!-- Swipe to close demo sheet -->
	<f7-sheet id="sheet-project-icon" style="height: 90%; --f7-sheet-bg-color: #fff" swipe-to-close backdrop>
		<div class="sheet-modal-inner">
			<div class="page-content">
				<f7-block-title></f7-block-title>
				<div class="list simple-list">
					<ul>
						<li v-for="(icon, i) in this.icons" :key="i" class="item-link sheet-close">
							<div @click="setIcon(icon.style, icon.name)" class="text-align-center">
								<div style="margin-top: 5px">
									<font-awesome-icon class="fa-fw custom-colour" style="font-size: 32px" :icon="[icon.style, icon.name]" />
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</f7-sheet>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

export default {
	name: "sheet-project-icon",
	data() {
		return {
			projectid: "",
			icons: [{
					style: "fal",
					name: "music-alt",
				},
				{
					style: "fal",
					name: "utensils",
				},
				{
					style: "fal",
					name: "speaker",
				},
				{
					style: "fal",
					name: "toilet-paper-alt",
				},
				{
					style: "fal",
					name: "megaphone",
				},
				{
					style: "fal",
					name: "info",
				},
				{
					style: "fal",
					name: "long-arrow-alt-right",
				},
				{
					style: "fal",
					name: "exclamation",
				},
				{
					style: "fal",
					name: "poll",
				},
				{
					style: "fal",
					name: "qrcode",
				},
				{
					style: "fal",
					name: "trophy-alt",
				},
				{
					style: "fal",
					name: "film",
				},
				{
					style: "fal",
					name: "eye-slash",
				},
				{
					style: "fal",
					name: "moon",
				},
				{
					style: "fal",
					name: "stop-circle",
				},
				{
					style: "fal",
					name: "cloud-download-alt",
				},
				{
					style: "fal",
					name: "poll",
				},
				{
					style: "fal",
					name: "treasure-chest",
				},
				{
					style: "fal",
					name: "map-marker-times",
				},
				{
					style: "fal",
					name: "user-friends",
				},
				{
					style: "fal",
					name: "map-marked",
				},
				{
					style: "fal",
					name: "image",
				},
				{
					style: "fal",
					name: "file-alt",
				},
				{
					style: "fal",
					name: "camera",
				},
				{
					style: "fal",
					name: "text",
				},
				{
					style: "fal",
					name: "user",
				},
				{
					style: "fal",
					name: "clock",
				},
				{
					style: "fal",
					name: "calendar",
				},
				{
					style: "fal",
					name: "pen",
				},
				{
					style: "fal",
					name: "trash",
				},
				{
					style: "fal",
					name: "sync",
				},
				{
					style: "fal",
					name: "map-marker-plus",
				},
				{
					style: "fal",
					name: "compass",
				},
				{
					style: "fal",
					name: "shopping-bag",
				},
				{
					style: "fal",
					name: "receipt",
				},
				{
					style: "fal",
					name: "podcast",
				},
				{
					style: "fal",
					name: "crosshairs",
				},
				{
					style: "fal",
					name: "map-marker-alt",
				},
				{
					style: "fal",
					name: "plus",
				},
				{
					style: "fal",
					name: "award",
				},
				{
					style: "fal",
					name: "book",
				},
				{
					style: "fal",
					name: "map",
				},
				{
					style: "fal",
					name: "cog",
				},
				{
					style: "fal",
					name: "users",
				},
				{
					style: "fal",
					name: "times",
				},
				{
					style: "fal",
					name: "check",
				},
			],
		};
	},
	mixins: [],
	inject: ["eventBus"],
	computed: {
		getProject() {
			var item = {
				table: "project",
				key: "id",
				id: this.projectid,
				type: "single",
			};
			var project = store.getters.getData(item);

			return project;
		}
	},
	methods: {
		setIcon(style, name) {
			var icon = style + " " + name;
			new Date();
			var unixtime = Date.now() / 1000;
			var item = {};
			item.table = "project";
			item.json = this.getProject;
			item.json.project_appicon = icon;
			item.json.project_unixtime = unixtime;
			store.dispatch("updateItemApp", item);
		},
		setIconStyle() {
			if (f7.theme == "aurora") {
				return "height:24px; padding-top:5px; padding-bottom:2px;";
			} else {
				return "height:36px; padding-top:5px; padding-bottom:2px;";
			}
		},
		setProjectId(projectid) {
			this.projectid = projectid;
		},
	},
	mounted() {
		// Event - Project icon
		var vue = this;
		vue.eventBus.on("project-icon", (projectid) => {

			vue.setProjectId(projectid);

			f7.sheet.open("#sheet-project-icon", true);
		});	
	},
};
</script>

<style scoped>
@media (min-width: 1024px) {
	.sheet-modal {
		margin-left: 25%;
		width: 50% !important;
	}
}
</style>
