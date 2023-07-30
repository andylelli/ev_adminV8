<template>
	<f7-actions id="actions-event" :opened="isActionsOpen">
		<f7-actions-group>
			<f7-actions-label>Select event</f7-actions-label>
			<f7-actions-button color="black" v-for="event in this.getEventslist" :key="event.event_id" @click="downloadEvent(event.event_id)">
				<div v-html="decode(event.event_name)"></div>
			</f7-actions-button>
		</f7-actions-group>
		<f7-actions-group>
			<f7-actions-button @click="newEvent()" color="black">
				New event
			</f7-actions-button>
		</f7-actions-group>
	</f7-actions>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { Dom7 } from "framework7";
var $$ = Dom7;

import login from "../../mixins/login";
import misc from "../../mixins/misc";
import fetch from "../../mixins/fetch";

import escape from "../../js/config/escape.js";

export default {
	name: "actions-event",
	data() {
		return {
			userid: "",
			eventid: "",
			isActionsOpen: false,
			page: "",
		};
	},
	props: ["loggedin"],
	mixins: [login, misc, fetch],
	computed: {
		getEventslist() {
			return store.getters.getEventslist();
		},
		actionsOpenState() {
			return this.isActionsOpen;
		},
	},
	methods: {
		newEvent() {
			f7.sheet.open("#new-event");
		},
		decode(str) {
			return escape.decodeXML(str);
		},
		async downloadEvent(eventid) {
			f7.preloader.show();

			// Set event ID
			localStorage.admin_eventid = parseInt(eventid);

			// Set admin user credentials
			await store.dispatch("setUserCredentials");

			// Parameters
			var url = store.state.url + "api/get/update/event/" + eventid + "/0";
			var method = "GET";
			var data = null;

			// Get Data
			await this.fetch(url, method, data, this.success, this.failure);
		},
		success(response) {
			// Clear page history
			f7.views.main.router.clearPreviousHistory();

			// Prepare to download from remote DB
			this.initiateAppFromRemoteDB();

			// Start progress bar
			this.progress(eventid);

			// Get data from server
			var eventid = response[0].data[0].event_id;
			var tables = false;
			var fullSync = true;
			var getDeletes = false;
			this.syncGetFromWebServer(eventid, tables, fullSync, getDeletes);

			// Clear history from app
			f7.views.main.router.clearPreviousHistory();

			// Set app initialisation to true
			store.dispatch("setInitiated");

			// Close actions list
			f7.sheet.close("#actions-event", true);
		},
		error() {
			// Event no longer exists so remove from events list
			var eventsList = store.getters.getEventslist();
			var index = eventsList.indexOf(eventid);
			eventsList.splice(index, 1);
			store.dispatch("setEventsList", eventsList);

			// Tell user
			var message = "This event no longer exists.";
			f7.dialog.alert(message);
		},
	},
	mounted() {
		var vue = this;
		f7ready((f7) => {
			if (parseInt(localStorage.admin_userid) > 0 && localStorage.eventsList) {
				vue.events = JSON.parse(localStorage.eventsList);
			}
		});
	},
};
</script>

<style scope>

</style>
