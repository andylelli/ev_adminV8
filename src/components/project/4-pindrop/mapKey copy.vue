<template>
	<div>
		<f7-block-header>KEY</f7-block-header>
		<div v-if="getKey" class="card card-outline padding">
			<div class="row">
				<div
					@click="toggleMarkers(this.keyProjects[0])"
					class="col-50 medium-25"
					v-if="getKey[0]"
					v-html="getKey[0]"
				></div>
				<div
					@click="toggleMarkers(this.keyProjects[1])"
					class="col-50 medium-25"
					v-if="getKey[1]"
					v-html="getKey[1]"
				></div>
				<div
					@click="toggleMarkers(this.keyProjects[2])"
					class="col-50 medium-25"
					v-if="getKey[2]"
					v-html="getKey[2]"
				></div>
				<div
					@click="toggleMarkers(this.keyProjects[3])"
					class="col-50 medium-25"
					v-if="getKey[3]"
					v-html="getKey[3]"
				></div>
			</div>
			<div class="row">
				<div
					@click="toggleMarkers(this.keyProjects[4])"
					class="col-50 medium-25"
					v-if="getKey[4]"
					v-html="getKey[4]"
				></div>
				<div
					@click="toggleMarkers(this.keyProjects[5])"
					class="col-50 medium-25"
					v-if="getKey[5]"
					v-html="getKey[5]"
				></div>
				<div
					@click="toggleMarkers(this.keyProjects[6])"
					class="col-50 medium-25"
					v-if="getKey[6]"
					v-html="getKey[6]"
				></div>
				<div
					@click="toggleMarkers(this.keyProjects[7])"
					class="col-50 medium-25"
					v-if="getKey[7]"
					v-html="getKey[7]"
				></div>
			</div>
			<div class="row">
				<div
					@click="toggleMarkers(this.keyProjects[8])"
					class="col-50 medium-25"
					v-if="getKey[8]"
					v-html="getKey[8]"
				></div>
				<div
					@click="toggleMarkers(this.keyProjects[9])"
					class="col-50 medium-25"
					v-if="getKey[9]"
					v-html="getKey[9]"
				></div>
				<div
					@click="toggleMarkers(this.keyProjects[10])"
					class="col-50 medium-25"
					v-if="getKey[10]"
					v-html="getKey[10]"
				></div>
				<div
					@click="toggleMarkers(this.keyProjects[11])"
					class="col-50 medium-25"
					v-if="getKey[11]"
					v-html="getKey[11]"
				></div>
			</div>
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
						"<div class='padding-left-half'>" +
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
	mounted() {},
};
</script>

<!-- <style scoped>

</style>-->