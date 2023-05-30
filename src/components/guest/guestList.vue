<template>
	<div>
		<f7-block-header>GUESTS</f7-block-header>
		<f7-list class="ripple-color-primary no-margin-top no-padding-top">
			<f7-list-item
				class="item-link"
				v-for="item in this.getGuests"
				:key="item.guest_id"
				swipeout
				:link="'/guest-detail/' + item.guest_id + '/'"
				:title="item.guest_firstname + ' ' + item.guest_lastname"
			>
				<template #media>
					<f7-icon>
						<font-awesome-icon
							class="fa-fw custom-colour"
							style="font-size: 20px"
							:icon="['fal', 'user']"
						/> </f7-icon
				></template>
				<f7-swipeout-actions right>
					<f7-swipeout-button
						:color="'red'"
						@click="
							deleteItem(item.guest_id, 'guest', item.guest_email)
						"
					>
						<font-awesome-icon
							:id="'swipeout-guest-delete-' + item.guest_id"
							style="font-size: 24px; display: block"
							:icon="['fal', 'trash']"
						/>
						<font-awesome-icon
							:id="'swipeout-guest-spinner-' + item.guest_id"
							class="fa-spin"
							style="
								font-size: 22px;
								margin-left: -3px;
								display: none;
							"
							:icon="['fal', 'sync']"
						/>
						<font-awesome-icon
							:id="'swipeout-guest-tick-' + item.guest_id"
							style="font-size: 24px; display: none"
							:icon="['fal', 'check']"
						/>
						<font-awesome-icon
							:id="'swipeout-guest-error-' + item.guestid"
							style="font-size: 24px; display: none"
							:icon="['fal', 'times']"
						/>
					</f7-swipeout-button>
				</f7-swipeout-actions>
			</f7-list-item>
		</f7-list>
	</div>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import { Dom7 } from "framework7";
var $$ = Dom7;

import login from "../../mixins/login";
import misc from "../../mixins/misc";
import fetch from "../../mixins/fetch";
import deleteItem from "../../mixins/deleteItem";

export default {
	name: "guest-list",
	data() {
		return {
			eventid: parseInt(localStorage.admin_eventid),
			icon: "delete",
			iconDelete: ["fal", "times"],
			iconSpinner: ["fas", "sync"],
			iconDone: ["fal", "check"],
		};
	},
	mixins: [login, misc, fetch, deleteItem],
	computed: {
		getGuests() {
			var find = store.state.guest.filter(function (result) {
				return result.guest_role === 2;
			});
			if (find.length > 0) {
				return find;
			}
		},
	},
	methods: {},
	mounted() {
		f7ready((f7) => {
			$$(".item-link").addClass("ripple-color-primary");
		});
	},
};
</script>

<style scoped>
.ripple-color-primary {
	--f7-theme-color-ripple-color: rgba(var(--f7-theme-color-rgb), 0.15);
}
</style>