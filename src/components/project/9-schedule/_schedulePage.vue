<template>
	<f7-page stacked name="schedule">
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
			<general-settings page="schedule" :projectid="projectid"></general-settings>
		</segment>
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

export default {
	data() {
		return {
			eventid: store.state.eventid,			
			projectid: parseInt(this.f7route.params.projectId),
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
	},
	mixins: [misc],
	computed: {
		getProject() {
			var item = {
				table: "project",
				key: "id",
				id: this.projectid,
				type: "single",
			};
			return store.getters.getData(item);
		},
		getSchedule() {
			var item = {
				table: "schedule",
				key: "projectid",
				id: this.projectid,
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
						item.json.project_unixtime = unixtime;

						store.dispatch("updateItemDB", item);

						localStorage.admin_update_project_time = unixtime;
					}
				},
				{ deep: true }
			);
			this.$watch(
				"getSchedule",
				function (newValue, oldValue) {
					if (this.getSchedule) {
						new Date();
						var unixtime = Date.now() / 1000;

						var item = {};
						item.table = "schedule";
						item.json = this.getSchedule;

						store.dispatch("updateItemDB", item);

						localStorage.admin_update_schedule_time = unixtime;
					}
				},
				{ deep: true }
			);
		});
	},
};
</script>
