<template>
	<f7-page stacked name="news">
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
			<general-settings page="news" :projectid="projectid"></general-settings>
		</segment>
		<!-- Main section-->
		<list
			v-if="getProject && getNews"
			:title="getProject.project_name"
			table="newsitem"
			:icon="['fal', 'megaphone']"
			:id="getNews.news_id"
			:projectid="this.projectid"
			sortable="false"
			sort-time="true"
		></list>
		<new-newsitem :projectid="this.projectid"></new-newsitem>
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
import sheetNew from "../../sheet/sheetNew.vue";

import newNewsitem from "./newNewsitem.vue";

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
		list,
		sheetNew,
		newNewsitem,
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
			var data = store.getters.getData(item);
			if (data) {
				return data;
			}
		},
		getNews() {
			var item = {
				table: "news",
				key: "projectid",
				id: this.projectid,
				type: "single",
			};
			var data = store.getters.getData(item);
			if (data) {
				return data;
			}
		},
		getNewsitems() {
			if (this.getNews) {
				var item = {
					table: "newsitem",
					key: "newsid",
					id: this.getNews.news_id,
					type: "multiple",
				};
				var data = store.getters.getData(item);
				if (data) {
					return data;
				}
			}
		},
	},
	methods: {
		setItem(directoryentryid) {
			return directoryentryid;
		},
		setTime(unixtime) {
			return unixtime;
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
				"getNews",
				function (newValue, oldValue) {
					if (this.getNews) {
						new Date();
						var unixtime = Date.now() / 1000;

						var item = {};
						item.table = "news";
						item.json = this.getNews;

						store.dispatch("updateItemDB", item);

						localStorage.admin_update_news_time = unixtime;
					}
				},
				{ deep: true }
			);
			this.$watch(
				"getNewsitems",
				function (newValue, oldValue) {
					if (this.getNewsitems) {
						new Date();
						var unixtime = Date.now() / 1000;

						var item = {};
						item.table = "newsitem";
						item.json = this.getNewsitems;

						store.dispatch("updateItemDB", item);

						localStorage.admin_update_newsitem_time = unixtime;
					}
				},
				{ deep: true }
			);			
		});
	},
};
</script>