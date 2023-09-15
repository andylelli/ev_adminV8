<template>
	<div>
		<!-- Logo -->
		<div align="left">
			<img @click="openHomePage()" src="/admin/static/images/evaria_small.png" width="100" style="margin-left: 20px" />
		</div>
		<!-- Event name -->
		<f7-block-title medium class="text-color-white no-margin-top">
			<div @click="openHomePage()" class="link" style="font-size: 26px">
				{{ this.getEventName }}
			</div>
		</f7-block-title>
		<!-- Projects list -->
		<f7-list class="margin-top margin-bottom ripple-color-primary text-color-white list-divider">
			<f7-list-item link v-for="item in this.items" :key="item.project_id" :position="item.project_position" class="bg-color-primary no-chevron" @click="openPage(item.project_typeid, item.project_id)">
				{{ item.project_name }}
			</f7-list-item>
		</f7-list>
		<!-- QR Scanner -->
		<f7-list class="margin-top margin-bottom  ripple-color-primary text-color-white list-divider">
			<f7-list-item class="bg-color-primary no-chevron" link @click="openQRScanner()">QR Scanner</f7-list-item>
		</f7-list>
		<!-- Event functions -->
		<f7-list class="margin-top margin-bottom  ripple-color-primary text-color-white list-divider">
			<!-- Change event -->
			<f7-list-item class="bg-color-primary no-chevron" link @click="changeEvent()">Change Event</f7-list-item>
			<!-- New event -->
			<f7-list-item class="bg-color-primary no-chevron" link @click="newEvent()">New Event</f7-list-item>
		</f7-list>
		<!-- Log out -->
		<f7-list style="cursor: pointer" class="margin-top margin-bottom ripple-color-primary text-color-white">
			<f7-list-item class="bg-color-primary" @click="logout()">Logout</f7-list-item>
		</f7-list>
		<!-- User details -->
		<f7-block style="margin-top margin-bottom" class="text-color-white">
			<div v-html="getUserDetails()"></div>
		</f7-block>
	</div>
</template>
  
<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import misc from "../../mixins/misc";
import login from "../../mixins/login";
import fetch from "../../mixins/fetch";

import params from "../../js/config/params.js";

export default {
	name: "left-menu",
	data() {
		return {};
	},
	mixins: [misc, login, fetch],
	computed: {
		showQrscanner() {
			return this.isScannerActive;
		},
		getEvent() {
			var item = {
				table: "event",
				key: "id",
				id: this.getEventID,
				type: "single",
			};
			var data = store.getters.getData(item);
			if (data) {
				return data;
			}
		},
		getEventName() {
			if (this.getEvent) {
				return this.getEvent.event_name;
			}
		},
		getEventID() {
			var eventid = store.getters.getEventID();
			if (eventid) {
				return eventid;
			}
		},
		items() {
			if (this.getEventID) {
				var item = {
					table: "project",
					key: "eventid",
					id: this.getEventID,
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
		openHomePage() {
			var link = "/main/" + this.getEventID + "/";
			f7.views.main.router.navigate(link);
			setTimeout(function() {
				f7.views.main.router.clearPreviousHistory();
			}, 500);
			f7.panel.close(".panel-left");
		},
		openPage(typeid, projectid) {
			var table = this.typeidToName(typeid);
			var paramsTable = params.filter(function(result) {
				return result.table == table;
			});
			var linkSuffix = paramsTable[0].linkSuffix;
			var link = "/" + table + "/" + projectid + linkSuffix;
			f7.views.main.router.navigate(link);
			f7.panel.close(".panel-left");
		},
		changeEvent() {
			//If online then get latest events list
			if (localStorage.network == "online") {
				this.getEvents();
			}
			//Else open existing events list
			else {
				f7.sheet.open("#actions-event", true);
			}
		},
		newEvent() {
			f7.sheet.open("#new-event");
		},
		openQRScanner() {
			f7.sheet.open("#qr-scanner");
		},
		logout() {
			f7.preloader.show();
			this.userLogout();
		},
		getUserDetails() {
			var email = localStorage.admin_email;
			var type = "Administrator";

			return (
				"User: " +
				email +
				"<br/>Role: " +
				type +
				"<br/><br/>Version: " +
				store.state.version
			);
		},
		async getEvents() {
			f7.preloader.show();
			//Get events data
			var urlEvent = store.state.url + "api/get/events";
			var method = "GET";
			var response = await this.fetch(urlEvent, method);

			//Process response
			if (response[0].status == "success") {
				var eventsList = response[0]["data"];
				await store.dispatch("setEventsList", eventsList);
			} else {
				console.log("Error getting events.");
			}

			// Open events list sheet
			f7.preloader.hide();
			f7.sheet.open("#actions-event", true);
		},
	},
	mounted() {},
};
</script>

<style>

</style>