<template>
	<div style="
			padding-top: 12px;
			position: absolute;
			bottom: 10px;
			width: 100%;
			z-index: 99999 !important;
		">
		<div v-if="getKey" class="card card-outline padding" style="
				background-color: rgba(30, 30, 30, 0.8);
				backdrop-filter: blur(3px);
			">
			<table >
				<tr>
					<td width="33%" @click="toggleMarkers(this.keyProjects[0])" v-if="getKey[0]" v-html="getKey[0]">
					</td>
					<td width="33%" @click="toggleMarkers(this.keyProjects[1])" v-if="getKey[1]" v-html="getKey[1]">
					</td>
					<td width="33%" @click="toggleMarkers(this.keyProjects[2])" v-if="getKey[2]" v-html="getKey[2]">
					</td>
				</tr>
				<tr>
					<td width="33%" @click="toggleMarkers(this.keyProjects[3])" v-if="getKey[3]" v-html="getKey[3]">
					</td>
					<td width="33%" @click="toggleMarkers(this.keyProjects[4])" v-if="getKey[4]" v-html="getKey[4]">
					</td>
					<td width="33%" @click="toggleMarkers(this.keyProjects[5])" v-if="getKey[5]" v-html="getKey[5]">
					</td>
				</tr>
				<tr>
					<td width="33%" @click="toggleMarkers(this.keyProjects[6])" v-if="getKey[6]" v-html="getKey[6]">
					</td>
					<td width="33%" @click="toggleMarkers(this.keyProjects[7])" v-if="getKey[7]" v-html="getKey[7]">
					</td>
					<td width="33%" @click="toggleMarkers(this.keyProjects[8])" v-if="getKey[8]" v-html="getKey[8]">
					</td>
				</tr>
				<tr>
					<td width="33%" @click="toggleMarkers(this.keyProjects[9])" v-if="getKey[9]" v-html="getKey[9]">
					</td>
					<td width="33%" @click="toggleMarkers(this.keyProjects[10])" v-if="getKey[10]" v-html="getKey[10]">
					</td>
					<td width="33%" @click="toggleMarkers(this.keyProjects[11])" v-if="getKey[11]" v-html="getKey[11]">
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
import store from "../../../vuex/store.js";

export default {
	name: "map-key",
	data() {
		return {};
	},
	props: {
		mapProjectid: Number,
	},
	inject: ["eventBus"],
	computed: {
		getMarkers() {
			var obj = {
				type: "map",
				id: this.mapProjectid,
			};
			return store.getters.getMarkers(obj);
		},
		getKey() {
			var keyArr = this.getMarkers;
			var key_list = [];
			var project_list = [];

			if (keyArr) {
				var directoryArr = store.state.directory;
				var projectArr = store.state.project;

				var item = {};

				keyArr.forEach(function (m) {
					var directoryid = m.directoryentry_directoryid;

					var find = directoryArr.filter(function (result) {
						return result.directory_id === directoryid;
					});

					var colour = find[0].directory_colourid;
					var projectid = find[0].directory_projectid;

					var find = projectArr.filter(function (result) {
						return result.project_id === projectid;
					});

					var name = find[0].project_name;
					var id = find[0].project_id;

					item =
						`<div class='display-flex justify-content-flex-start padding-bottom-half'>` +
						"<img height='28' src='/admin/static/images/pindrop-" +
						colour +
						".svg'>" +
						"<div class='padding-left-half' style='color:white;'>" +
						name +
						"</div>";
					key_list.push(item);
					project_list.push(id);
				});

				var keyDuplicatesRemoved = key_list.filter(
					(a, b) => key_list.indexOf(a) === b
				);

				var projectDuplicatesRemoved = project_list.filter(
					(a, b) => project_list.indexOf(a) === b
				);

				this.keyProjects = projectDuplicatesRemoved;

				return keyDuplicatesRemoved;
			}
		},
	},
	methods: {
		toggleMarkers(projectid) {
			if (this.toggleId == projectid) {
				this.closePopups(this.toggleId);
				this.toggleId = null;
			} else {
				this.closePopups();
				if (projectid != 0) {
					this.openPopups(projectid);
				} else {
					this.openCustomPopups();
				}
				this.toggleId = projectid;
			}
		},
		openPopups(projectid) {
			this.eventBus.emit("open-popups", projectid);
			return;
		},
		openCustomPopups() {
			this.eventBus.emit("open-custom-popups");
			return;
		},
		closePopups() {
			this.eventBus.emit("close-popups");
			return;
		},
	},
	mounted() { },
};
</script>

<style scoped>
table {
	border: 0px;
	font-family: arial, sans-serif;
	border-collapse: collapse;
	width: 100%;
}

td,
tr {
	border: 0px;
	text-align: left;
	padding-top: 4px;
	padding-bottom: 4px;
}
</style>