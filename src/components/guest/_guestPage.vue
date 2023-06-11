<template>
	<f7-page stacked name="guest">
		<!-- Nav bar-->
		<f7-navbar>
			<nav-back-link></nav-back-link>
			<f7-nav-title>Guests</f7-nav-title>
			<nav-bars></nav-bars>
		</f7-navbar>
		<!-- Main section-->
		<guest-list></guest-list>
		<new-guest></new-guest>
		<sheet-new table="guest"></sheet-new>
	</f7-page>
</template>

<script>
import store from "../../vuex/store.js";

import login from "../../mixins/login";
import misc from "../../mixins/misc";

import navBackLink from "../misc/nav/navBackLink.vue";
import navBars from "../misc/nav/navBars.vue";

import sheetNew from "../sheet/sheetNew.vue";

import newGuest from "./newGuest.vue";
import guestList from "./guestList.vue";

export default {
	data() {
		return {
			event: store.state.event,
		};
	},
	components: { navBackLink, navBars, sheetNew, guestList, newGuest },
	mixins: [login, misc],
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
	},
	methods: {
		eventName() {
			return this.event.event_name;
		},
	},
	mounted() {},
};
</script>

<style scoped>
</style>
