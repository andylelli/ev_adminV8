<template>
	<f7-page name="login" style="margin-top: 120px">
		<div align="center">
			<img src="/admin/static/images/evaria_small.jpg" width="200" />
		</div>
		<div style="max-width: 400px; margin: auto">
			<f7-list class="login">
				<f7-list-input
					label="EMAIL"
					type="text"
					placeholder="Your email"
					:value="email"
					@input="email = $event.target.value"
				></f7-list-input>
				<f7-list-input
					label="PASSWORD"
					type="password"
					placeholder="Your password"
					:value="password"
					@input="password = $event.target.value"
				></f7-list-input>
			</f7-list>
			<div class="login-button" style="margin-top: 50px">
				<general-button
					class="margin-top margin-bottom"
					@generalButtonAction="login()"
					label="ENTER"
					width="200"
					colour="black"
					type="fill"
				></general-button>
			</div>
			<div class="register-button" style="margin-top: 50px">
				<general-button
					class="margin-top margin-bottom"
					@generalButtonAction="openSheetRegister()"
					label="REGISTER"
					width="200"
					colour="black"
				></general-button>
			</div>
			<div class="logged-in" style="margin-top: 150px">
				<general-button
					class="margin-top margin-bottom"
					@generalButtonAction="openActionsEvent()"
					label="SELECT EVENT"
					width="200"
					colour="black"
					type="fill"
				></general-button>
				<general-button
					class="margin-top margin-bottom"
					@generalButtonAction="logout()"
					label="LOG OUT"
					width="200"
					colour="black"
				></general-button>
			</div>
		</div>
		<actions-event></actions-event>
		<sheet-register></sheet-register>
	</f7-page>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";
import { getDevice, Dom7 } from "framework7";

const device = getDevice();
var $$ = Dom7;

import login from "../../mixins/login";
import misc from "../../mixins/misc";

import sheetNew from "../sheet/sheetNew.vue";
import actionsEvent from "../misc/actionsEvent.vue";
import generalButton from "../misc/generalButton.vue";
import sheetRegister from "../sheet/sheetRegister.vue";

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
	mixins: [login, misc],
	components: {
		sheetNew,
		actionsEvent,
		generalButton,
		sheetRegister,
	},
	inject: ["eventBus"],
	computed: {
		actionsOpenState() {
			return this.isActionsOpen;
		},
	},
	methods: {
		async login() {
			// Attempt to logoin
			f7.preloader.show();
			var response = await this.userLogin();
			f7.preloader.hide();

			// If response was successful show list of events to open
			if (response !== false) {
				var array = [];
				for (var i = 0; i < response.events.length; i++) {
					var json = response.events[i];
					json.event_userid = response.user.user_id;
					array.push(json);
				}
				store.dispatch("setEventsList", array);
				$$(".login").hide();
				$$(".login-button").hide();
				$$(".register-button").hide();
				$$(".logged-in").show();
				this.openActionsEvent();
			} else {
				f7.dialog.alert("Login details incorrect");
			}
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
	beforeMounted() {},
	mounted() {
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

