<template>
	<f7-page stacked name="huntitem">
		<div v-if="this.getHuntitem">
			<!-- Nav bar-->
			<f7-navbar>
				<nav-back-link
					:page="'hunt'"
					:id="this.getProject.project_id"
				></nav-back-link>
				<f7-nav-title
					><div
						v-html="this.getHuntitem.huntitem_name"
					></div
				></f7-nav-title>
				<nav-bars></nav-bars>
			</f7-navbar>
			<!-- Main section-->
			<segment header="Name">
				<field-edit-text
					type="single"
					:id="this.getHuntitem.huntitem_id"
					table="huntitem"
					fieldname="name"
				></field-edit-text>
			</segment>
			<segment
				v-if="this.getHunt.hunt_imageid === 1"
				:header="this.getHuntitem.huntitem_name + ' Image'"
			>
				<image-load
					:id="this.getHuntitem.huntitem_id"
					table="huntitem"
				></image-load>
			</segment>
			<segment header="Text">
				<field-edit-long-text
					type="single"
					:id="this.getHuntitem.huntitem_id"
					table="huntitem"
					fieldname="text"
				></field-edit-long-text>
			</segment>
			<segment header="QR Code">
				<qr-code
					table="huntitem"
					link="false"
					:id="this.getHuntitem.huntitem_id"
				></qr-code>
			</segment>
			<!-- Delete-->
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
				table="huntitem"
				:alias="this.getProject.project_name"
			></sheet-edit>
		</div>
	</f7-page>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { getDevice } from "framework7";
const device = getDevice();

import misc from "../../../mixins/misc";
import deleteItem from "../../../mixins/deleteItem";
import fetch from "../../../mixins/fetch";

import navBackLink from "../../misc/nav/navBackLink.vue";
import navBars from "../../misc/nav/navBars.vue";

import segment from "../../misc/segment.vue";
import fieldEditText from "../../misc/fieldEditText.vue";
import fieldEditLongText from "../../misc/fieldEditLongText.vue";
import imageLoad from "../../misc/imageLoad.vue";
import qrCode from "../../misc/qrCode.vue";
import generalButton from "../../misc/generalButton.vue";

import sheetEdit from "../../sheet/sheetEdit.vue";

export default {
	data() {
		return {
			id: parseInt(this.f7route.params.huntitemId),
			desktop: device.desktop,
			previousPage: "hunt",
		};
	},
	components: {
		navBackLink,
		navBars,
		segment,
		fieldEditText,
		fieldEditLongText,
		imageLoad,
		qrCode,
		generalButton,
		sheetEdit,
	},
	props: {
		f7route: Object,
	},
	mixins: [misc, deleteItem, fetch],
	computed: {
		getHuntitem() {
			var item = {
				table: "huntitem",
				key: "id",
				id: this.id,
				type: "single",
			};
			var data = store.getters.getData(item);
			if (data) {
				return data;
			}
		},
		getHunt() {
			if (this.getHuntitem) {
				var item = {
					table: "hunt",
					key: "id",
					id: this.getHuntitem.huntitem_huntid,
					type: "single",
				};
				return store.getters.getData(item);
			}
		},
		getProject() {
			if (this.getHunt) {
				var item = {
					table: "project",
					key: "id",
					id: this.getHunt.hunt_projectid,
					type: "single",
				};
				return store.getters.getData(item);
			}
		},
	},
	methods: {
		deleteItem() {
			this.deleteItemButton(
				this.getHuntitem.huntitem_id,
				"huntitem",
				this.getHuntitem.huntitem_name
			);
		},
	},
	mounted() {
		f7ready((f7) => {
			this.$watch(
				"getHuntitem",
				function (newValue, oldValue) {
					if (this.getHuntitem) {
						new Date();
						var unixtime = Date.now() / 1000;

						var item = {};
						item.table = "huntitem";
						item.json = this.getHuntitem;

						store.dispatch("updateItemDB", item);

						localStorage.admin_update_huntitem_time = unixtime;
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
