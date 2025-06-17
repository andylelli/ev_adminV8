<template>
	<f7-page stacked name="map">
		<!-- Nav bar-->
		<f7-navbar>
			<nav-back-link :page="'main'" :id="this.eventid"></nav-back-link>
			<f7-nav-title v-if="getProject">
				<div v-html="getProject.project_name"></div
			></f7-nav-title>
			<nav-bars></nav-bars>
		</f7-navbar>
		<!-- General section-->
		<segment header="General">
			<general-settings
				page="pindrop"
				:projectid="mapProjectId"
			></general-settings>
		</segment>
		<!-- Main section-->
		<map-display
			:map-projectid="mapProjectId"
			:projectid="projectId"
			:directoryentryid="directoryentryId"
		></map-display>
		<map-key :map-projectid="mapProjectId"></map-key>
	</f7-page>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { Dom7 } from "framework7";
var $$ = Dom7;

import misc from "../../../mixins/misc";

import navBackLink from "../../misc/nav/navBackLink.vue";
import navBars from "../../misc/nav/navBars.vue";

import segment from "../../misc/segment.vue";
import generalSettings from "../../misc/generalSettings.vue";

import mapDisplay from "./mapDisplay.vue";
import mapKey from "./mapKey.vue";

export default {
	data() {
		return {
			eventid: store.state.eventid,			
			mapProjectId: parseInt(this.f7route.params.mapProjectId),
			projectId: parseInt(this.f7route.params.projectId),
			directoryentryId: parseInt(this.f7route.params.directoryentryId),			
			lookup: store.state.lookup,
		};
	},
	props: {
		f7route: Object,
	},
	components: {
		navBackLink,
		navBars,
		segment,
		generalSettings,
		mapDisplay,
		mapKey
	},
	mixins: [misc],
	computed: {
		getProject() {
			var item = {
				table: "project",
				key: "id",
				id: this.mapProjectId,
				type: "single",
			};
			return store.getters.getData(item);
		},
		getPindrop() {
			var item = {
				table: "pindrop",
				key: "projectid",
				id: this.mapProjectId,
				type: "single",
			};
			return store.getters.getData(item);
		},
	},
	methods: {},
	mounted() {
		f7ready((f7) => {
			this.$watch(
				"getProject",
				function (newValue, oldValue) {
					if (this.getProject) {
						new Date();
						var unixtime = Date.now() / 1000;

						var item = {};
						item.table = "project";
						item.json = this.getProject;

						store.dispatch("updateItemDB", item);

						localStorage.admin_update_project_time = unixtime;
					}
				},
				{ deep: true }
			);
			this.$watch(
				"getPindrop",
				function (newValue, oldValue) {
					if (this.getPindrop) {
						new Date();
						var unixtime = Date.now() / 1000;

						var item = {};
						item.table = "pindrop";
						item.json = this.getPindrop;

						store.dispatch("updateItemDB", item);

						localStorage.admin_update_pindrop_time =
							Date.now() / 1000;
					}
				},
				{ deep: true }
			);
		});
	},
};
</script>
