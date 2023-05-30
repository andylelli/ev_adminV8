<template>
	<f7-page stacked name="edit-long-text">
		<!-- Nav bar-->
		<f7-navbar>
			<nav-back-link></nav-back-link>
			<f7-nav-title> <div v-html="this.name()"></div></f7-nav-title>
			<nav-bars></nav-bars>
		</f7-navbar>
		<!-- Main section-->
		<div>
			<f7-block-header>{{
				this.placeholder().toUpperCase()
			}}</f7-block-header>
			<f7-text-editor
				placeholder="Enter text..."
				:buttons="[
					[
						'bold',
						'italic',
						'underline',
						'h1',
						'h2',
						'h3',
						'alignCenter',
						'unorderedList',
					],
				]"
				:value="value()"
				@texteditor:change="change($event)"
			></f7-text-editor>
		</div>
		<segment v-show="changed == true">
			<general-button
				class="padding-top padding-bottom"
				label="UPDATE"
				width="200"
				type="fill"
				@generalButtonAction="submit()"
			></general-button>
		</segment>
	</f7-page>
</template>

<script>
import store from "../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import login from "../../mixins/login";
import misc from "../../mixins/misc";

import navBackLink from "../misc/nav/navBackLink.vue";
import navBars from "../misc/nav/navBars.vue";

import generalButton from "../misc/generalButton.vue";

import params from "../../js/config/params.js";
import escape from "../../js/config/escape.js";

export default {
	data() {
		return {
			table: this.f7route.params.table,
			fieldname: this.f7route.params.fieldname,
			id: parseInt(this.f7route.params.id),
			buttonActive: false,
			textEditorValue: "",
			changed: false,
		};
	},
	props: {
		f7route: Object,
	},
	components: {
		navBackLink,
		navBars,
		generalButton
	},
	mixins: [login, misc],
	computed: {
		buttonClass() {
			if (this.changed === true) {
				return "button button-round button-fill button-large";
			} else {
				return "button button-round button-large";
			}
		},
		getItem() {
			var item = {
				table: this.table,
				key: "id",
				id: this.id,
				type: "single",
			};
			return store.getters.getData(item);
		},
	},
	methods: {
		value() {
			var field = this.table + "_" + this.fieldname;
			return escape.decodeXML(this.getItem[field]);
		},
		name() {
			var name = this.table + "_name";
			return this.getItem[name];
		},
		placeholder() {
			var vue = this;
			var findTable = params.filter(function (result) {
				return result.table === vue.table;
			});
			var findField = findTable[0].fields.filter(function (result) {
				return result.name === vue.fieldname;
			});
			var placeholder = findField[0].placeholder;
			return placeholder;
		},
		change(value) {
			this.changed = true;
			this.textEditorValue = value;
		},
		submit() {
			new Date();
			var unixtime = Date.now() / 1000;
			var json = {
				id: this.id,
				table: this.table,
				fieldname: this.fieldname,
				value: this.textEditorValue,
				unixtime: unixtime,
			};
			store.dispatch("updateEditLongTextApp", json);
			this.changed = false;

			var toast = f7.toast.create({
				text: "Saved!",
				position: "center",
				closeTimeout: 1000,
			});
			toast.open();
		},
	},
	mounted() {},
};
</script>

<style scoped>
</style>
