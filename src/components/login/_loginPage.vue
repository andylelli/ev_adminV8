<template>
	<f7-page name="login" style="margin-top: 120px">
		<div align="center">
			<img src="/admin/static/images/evaria_admin.png" width="200" />
		</div>
		<div style="max-width: 400px; margin: auto">
			<f7-list class="login">
				<f7-list-input label="EMAIL" type="text" placeholder="Your email" :value="email"
					@input="email = $event.target.value"></f7-list-input>
				<f7-list-input label="PASSWORD" type="password" placeholder="Your password" :value="password"
					@input="password = $event.target.value"></f7-list-input>
			</f7-list>
			<div class="login-button" style="margin-top: 50px">
				<general-button class="margin-top margin-bottom" @generalButtonAction="login()" label="ENTER"
					width="200" colour="black" type="fill"></general-button>
			</div>
			<div class="register-button" style="margin-top: 50px">
				<general-button class="margin-top margin-bottom" @generalButtonAction="openSheetRegister()"
					label="REGISTER" width="200" colour="black"></general-button>
			</div>
			<div class="logged-in" style="margin-top: 150px">
				<general-button class="margin-top margin-bottom" @generalButtonAction="openActionsEvent()"
					label="SELECT EVENT" width="200" colour="black" type="fill"></general-button>
				<general-button class="margin-top margin-bottom" @generalButtonAction="logout()" label="LOG OUT"
					width="200" colour="black"></general-button>
			</div>
		</div>
		<actions-event></actions-event>
	</f7-page>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";
import { getDevice, Dom7 } from "framework7";

const device = getDevice();
var $$ = Dom7;

import login from "../../mixins/login";
import fetch from "../../mixins/fetch";
import misc from "../../mixins/misc";

import sheetNew from "../sheet/sheetNew.vue";
import actionsEvent from "../misc/actionsEvent.vue";
import generalButton from "../misc/generalButton.vue";

export default {
	data() {
		return {
			// Login screen data
			user: "",
			email: "",
			password: "",
			token: "",
			userid: "",
			eventid: "",
			url: ""
		};
	},
	mixins: [login, misc, fetch],
	components: {
		sheetNew,
		actionsEvent,
		generalButton
	},
	inject: ["eventBus"],
	computed: {
		actionsOpenState() {
			return this.isActionsOpen;
		},
	},
	methods: {
		async login() {
			// Parameters
			let url = store.state.url + 'api/post/login';
			var data = { email: this.email, password: this.password, token: this.token };
			var method = 'POST';

			// Post data
			await this.fetch(url, method, data, this.success, this.failure);
		},
		success(response) {

			// Set local storage
			localStorage.admin = true;
			localStorage.admin_counter = 0;
			localStorage.admin_email = response.user_email;
			localStorage.admin_token = response.user_token;
			localStorage.admin_userid = response.user_id;

			// Set role
			if (response.user_role == 3) {
				localStorage.admin_role = "admin";
			}

			// Set User credentials in Store
			store.dispatch("setUserCredentials");

			// Retuen user details
			console.log('User successfully logged in');

			// If response was successful show list of events to open
			if (response !== false) {

				// Add user id to eventslist
				for (var i = 0; i < response.eventslist.length; i++) {
					response.eventslist[i].event_userid = response.user_id;
				}

				// Send events list to Store
				store.dispatch("setEventsList", response.eventslist);

				// Show / hide login elements
				$$(".login").hide();
				$$(".login-button").hide();
				$$(".register-button").hide();
				$$(".logged-in").show();

				// Open Actions sheet
				this.openActionsEvent();
			} else {
				// Show error alert
				f7.dialog.alert("Login details incorrect");
			}

		},
		failure(response) {
			// Show error message
			this.toast(response.message);
			return false;
		},
		logout() {
			f7.preloader.show();
			this.userLogout();
			f7.preloader.hide();
		},
		openActionsEvent() {
			f7.sheet.open("#actions-event", true);
		},
		openSheetRegister() {
			f7.sheet.open("#sheet-register", true);
		},
	},
	beforeMounted() { },
	mounted() {

		console.log("App mounted")
		// Check if an event change has been detected (only applicable to desktop)
		if (localStorage.admin_reload_needed == "true") {
			console.log("Event change detected, reloading page");
			setTimeout(() => {
				// Remove the reload flag from localStorage
				localStorage.removeItem("admin_reload_needed");
				// Reload the page to reflect the changes
				window.location.reload();
			}, 500);
		}

		f7ready((f7) => {

			f7.setColorTheme("#2b2b2b");

			var params = this.getParams(window.location.href);
			this.email = params.email;
			store.dispatch("setDevice");

			if (store.state.userid > 0) {
				var events = JSON.parse(localStorage.eventsList);
				store.dispatch("setEventsList", events);
				$$(".login").hide();
				$$(".login-button").hide();
				$$(".register-button").hide();
				$$(".logged-in").show();
			} else {
				$$(".logged-in").hide();
			}
		});
	},
};
</script>

<style>
.ios {
	--f7-label-text-color: #2b2b2b !important;
}

:root {
	--f7-md-primary: #2b2b2b !important;
	--f7-ios-primary: #2b2b2b !important;
}
</style>
