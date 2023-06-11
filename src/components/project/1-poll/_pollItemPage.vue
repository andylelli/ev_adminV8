<template>
	<f7-page stacked name="pollitem">
		<!-- Nav bar-->
		<f7-navbar>
			<nav-back-link
				:page="'poll'"
				:id="getProject.project_id"
			></nav-back-link>
			<f7-nav-title>
				<div v-html="getPollitem.pollitem_name"></div
			></f7-nav-title>
			<nav-bars></nav-bars>
		</f7-navbar>
		<!-- Main section-->
		<!-- Name -->
		<segment header="Name">
			<field-edit-text
				type="single"
				:id="this.getPollitem.pollitem_id"
				table="pollitem"
				fieldname="name"
			></field-edit-text>
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
		<!-- Sheet Modals-->
		<sheet-edit
			table="pollitem"
			:alias="this.getProject.project_name"
		></sheet-edit>
	</f7-page>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { getDevice } from "framework7";
const device = getDevice();

import login from "../../../mixins/login";
import misc from "../../../mixins/misc";
import deleteItem from "../../../mixins/deleteItem";

import navBackLink from "../../misc/nav/navBackLink.vue";
import navBars from "../../misc/nav/navBars.vue";

import segment from "../../misc/segment.vue";
import fieldEditText from "../../misc/fieldEditText.vue";
import fieldEditLongText from "../../misc/fieldEditLongText.vue";
import imageLoad from "../../misc/imageLoad.vue";
import generalButton from "../../misc/generalButton.vue";
import sheetEdit from "../../sheet/sheetEdit.vue";

export default {
	data() {
		return {
			id: parseInt(this.f7route.params.pollitemId),
			desktop: device.desktop,
			previousPage: "poll",
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
		fieldEditLongText,
		imageLoad,
		generalButton,
		sheetEdit,
	},
	mixins: [login, misc, deleteItem],
	computed: {
		getProject() {
			var item = {
				table: "project",
				key: "id",
				id: this.getPoll.poll_projectid,
				type: "single",
			};
			var data = store.getters.getData(item);
			if (data) {
				return data;
			} else return false;
		},
		getPoll() {
			var item = {
				table: "poll",
				key: "id",
				id: this.getPollitem.pollitem_pollid,
				type: "single",
			};
			var data = store.getters.getData(item);
			if (data) {
				return data;
			} else {
				return false;
			}
		},
		getPollitem() {
			var item = {
				table: "pollitem",
				key: "id",
				id: this.id,
				type: "single",
			};
			var data = store.getters.getData(item);
			if (data) {
				return data;
			} else {
				return false;
			}
		},
	},
	methods: {
		deleteItem() {
			this.deleteItemButton(
				this.getPollitem.pollitem_id,
				"pollitem",
				this.getPollitem.pollitem_name
			);
		},
	},
	mounted() {
		f7ready((f7) => {
			this.$watch(
				"getPollitem",
				function (newValue, oldValue) {
					if (this.getPollitem) {
						new Date();
						var unixtime = Date.now() / 1000;

						var item = {};
						item.table = "pollitem";
						item.json = this.getPollitem;

						store.dispatch("updateItemDB", item);

						localStorage.admin_update_pollitem_time = unixtime;
					}
				},
				{ deep: true }
			);
		});
	},
};
</script>

<style scoped>
</style>
