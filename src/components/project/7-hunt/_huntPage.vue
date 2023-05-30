<template>
	<f7-page stacked name="hunt" @page:beforein="closeSortable()">
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
				page="hunt"
				:projectid="projectid"
			></general-settings>
		</segment>
		<!-- Main section-->
		<list
			v-if="getProject && getHunt"
			:title="getProject.project_name"
			table="huntitem"
			:icon="['fal', 'treasure-chest']"
			:id="getHunt.hunt_id"
			sortable="true"
		></list>
		<new-item table="huntitem" :name="getProject.project_name"></new-item>
		<!-- Sheet Modals-->
		<sheet-new table="huntitem" :projectid="projectid"></sheet-new>
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
import list from "../../misc/list.vue";
import newItem from "../../misc/newItem.vue";

import sheetNew from "../../sheet/sheetNew.vue";

export default {
	data() {
		return {
			eventid: store.state.eventid,			
			projectid: parseInt(this.f7route.params.projectId),
			lookup: store.state.lookup,
		};
	},
	components: {
		navBackLink,
		navBars,
		segment,
		generalSettings,
		list,
		newItem,
		sheetNew,
	},
	props: {
		f7route: Object,
	},
	mixins: [misc],
	inject: ["eventBus"],	
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
		getHunt() {
			var item = {
				table: "hunt",
				key: "projectid",
				id: this.projectid,
				type: "single",
			};
			return store.getters.getData(item);
		},
	},
	methods: {
		closeSortable() {
			this.eventBus.emit("close-sortable");
		},
	},
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
				"getHunt",
				function (newValue, oldValue) {
					if (this.getHunt) {
						new Date();
						var unixtime = Date.now() / 1000;

						var item = {};
						item.table = "hunt";
						item.json = this.getHunt;

						store.dispatch("updateItemDB", item);

						localStorage.admin_update_hunt_time = unixtime;
					}
				},
				{ deep: true }
			);
		});
	},
};
</script>

