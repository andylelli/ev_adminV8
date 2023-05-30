<template>
	<f7-page stacked name="schedule-settings">
		<!-- Nav bar-->
		<f7-navbar>
			<nav-back-link></nav-back-link>
			<f7-nav-title v-if="getProject">
				<div v-html="this.getProject.project_name + ' - Settings'"></div
			></f7-nav-title>
			<nav-bars></nav-bars>
		</f7-navbar>
		<!-- Main section-->
		<div v-if="getProject">
			<!-- Name -->
			<segment header="Name">
				<field-edit-text
					type="single"
					:id="this.getProject.project_id"
					table="project"
					fieldname="name"
					title="Name"
				></field-edit-text>
			</segment>
			<!-- Icon -->
			<segment header="Icon">
				<project-icon :id="this.getProject.project_id"></project-icon>
			</segment>
			<!-- Delete -->
			<segment v-if="this.desktop == true" >
				<general-button
					class="margin-bottom"
					@generalButtonAction="deleteItem()"
					label="DELETE"
					width="200"
					colour="red"
					type="fill"
				></general-button>
			</segment>
			<!-- Sheet Modals -->
			<sheet-edit table="project"></sheet-edit>
			<sheet-project-icon
				:projectid="this.projectid"
			></sheet-project-icon>
		</div>
	</f7-page>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";
import { Dom7 } from "framework7";
var $$ = Dom7;

import { getDevice } from "framework7";
const device = getDevice();

import deleteItem from "../../../mixins/deleteItem";
import misc from "../../../mixins/misc";
import fetch from "../../../mixins/fetch";

import navBackLink from "../../misc/nav/navBackLink.vue";
import navBars from "../../misc/nav/navBars.vue";

import segment from "../../misc/segment.vue";
import fieldEditText from "../../misc/fieldEditText.vue";
import projectIcon from "../../misc/projectIcon.vue";
import sheetEdit from "../../sheet/sheetEdit.vue";
import generalButton from "../../misc/generalButton.vue";
import sheetProjectIcon from "../../sheet/sheetProjectIcon.vue";

export default {
	data() {
		return {
			projectid: parseInt(this.f7route.params.projectId),
			desktop: device.desktop,
			previousPage: "main",
		};
	},
	props: {
		f7route: Object,
	},
	components: {
		navBackLink,
		navBars,
		segment,
		fieldEditText,
		projectIcon,
		generalButton,
		sheetEdit,
		sheetProjectIcon,
	},
	mixins: [deleteItem, misc, fetch],
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
		getSchedule() {
			var item = {
				table: "schedule",
				key: "projectid",
				id: this.projectid,
				type: "single",
			};
			var data = store.getters.getData(item);
			if (data) {
				return data;
			}
		},
	},
	methods: {
		deleteItem() {
			this.deleteItemButton(
				this.getProject.project_id,
				"project",
				this.getProject.project_name
			);
		},
	},
	mounted() {},
};
</script>

<style scoped>
</style>
