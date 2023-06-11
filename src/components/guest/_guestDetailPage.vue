<template>
	<f7-page stacked name="guest-detail">
			<!-- Nav bar -->
			<f7-navbar>
				<nav-back-link></nav-back-link>
				<f7-nav-title>{{
					getGuest.guest_firstname + " " + getGuest.guest_lastname
				}}</f7-nav-title>
				<nav-bars></nav-bars>
			</f7-navbar>
			<!-- Main -->
			<segment header="Guest">
				<guest-detail :guestid="guestid"></guest-detail>
			</segment>
			<segment header="QR Code">
				<guest-detail-qr-code :guestid="guestid"></guest-detail-qr-code>
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
			<sheet-edit table="guest"></sheet-edit>
	</f7-page>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { Dom7 } from "framework7";
var $$ = Dom7;

import { getDevice } from "framework7";
const device = getDevice();

import login from "../../mixins/login";
import misc from "../../mixins/misc";
import deleteItem from "../../mixins/deleteItem";

import navBackLink from "../misc/nav/navBackLink.vue";
import navBars from "../misc/nav/navBars.vue";

import segment from "../misc/segment.vue";
import generalButton from "../misc/generalButton.vue";

import guestDetail from "./guestDetail.vue";
import guestDetailQrCode from "./guestDetailQrCode.vue";

import sheetEdit from "../sheet/sheetEdit.vue";

export default {
	data() {
		return {
			event: store.state.event,
			guestid: parseInt(this.f7route.params.guestId),
			desktop: device.desktop,
			previousPage: "guest",
		};
	},
	components: {
		navBackLink,
		navBars,
		segment,
		guestDetail,
		guestDetailQrCode,
		generalButton,
		sheetEdit,
	},
	props: {
		f7route: Object,
	},
	mixins: [login, misc, deleteItem],
	computed: {
		initiated() {
			return store.state.initiated;
		},
		getEvent() {
			var item = {
				table: "event",
				key: "id",
				id: store.state.eventid,
				type: "single",
			};
			return store.getters.getData(item);
		},
		getGuest() {
			var item = {
				table: "guest",
				key: "id",
				id: this.guestid,
				type: "single",
			};
			var data = store.getters.getData(item);
			if (data) {
				return data;
			}
		},
	},
	methods: {
		eventName() {
			return this.event.event_name;
		},
		deleteItem() {
			this.deleteItemButton(
				this.getGuest.guest_id,
				"guest",
				this.getGuest.guest_firstname +
					" " +
					this.getGuest.guest_lastname
			);
		},
	},
	mounted() {
		f7ready((f7) => {
			this.$watch(
				"getGuest",
				function (newValue, oldValue) {
					if (this.getGuest) {
						new Date();
						var unixtime = Date.now() / 1000;

						var item = {};
						item.table = "guest";
						item.json = this.getGuest;
						item.json.guest_unixtime = unixtime;

						store.dispatch("updateItemDB", item);

						localStorage.admin_update_guest_time = unixtime;
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
