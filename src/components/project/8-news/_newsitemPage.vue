<template>
	<f7-page stacked name="newsitem" @page:beforeout="clearForm()">
		<!-- Nav bar-->
		<f7-navbar>
			<nav-back-link :page="'news'" :id="this.project_id"></nav-back-link>
			<f7-nav-title
				><div v-if="getEvent" v-html="this.getProject.project_name"></div
			></f7-nav-title>
			<nav-bars></nav-bars>
		</f7-navbar>
		<!-- Main section-->
		<div>
			<!-- Title -->
			<f7-block-header>TITLE</f7-block-header>
			<f7-text-editor
				style="--f7-text-editor-height: 40px"
				placeholder="Title..."
				mode="popover"
				:buttons="[['bold', 'italic', 'underline']]"
				:value="setValue('title')"
				@texteditor:change="change($event, 'title')"
			></f7-text-editor>

			<!-- Category -->
			<f7-block-header>CATEGORY</f7-block-header>
			<f7-list inline-labels class="no-margin-top">
				<f7-list-input
					inline-labels
					type="select"
					placeholder="Choose..."
					class="post-target"
					:value="value.category"
					@change="change($event.target.value, 'category')"
				>
					<option value="0">Choose</option>
					<option
						v-for="item in this.getDirectoryentries"
						:key="item.directoryentry_id"
						:value="item.directoryentry_id"
						v-html="item.directoryentry_name"
					></option>
				</f7-list-input>
			</f7-list>

			<!-- Message -->
			<f7-block-header>MESSAGE</f7-block-header>
			<f7-text-editor
				class="margin-bottom"
				style="--f7-text-editor-height: 150px"
				placeholder="Message..."
				mode="popover"
				:buttons="[['bold', 'italic', 'underline']]"
				:value="setValue('detail')"
				@texteditor:change="change($event, 'message')"
			></f7-text-editor>
		</div>

		<!-- Submit -->
		<div v-show="this.allowSubmit === true" style="margin-top: 50px">
			<general-button
				@generalButtonAction="submit()"
				:label="buttonAction()"
				width="200"
				type="fill"
			></general-button>
		</div>
	</f7-page>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";
import { getDevice, Dom7 } from "framework7";

const device = getDevice();
var $$ = Dom7;

import login from "../../../mixins/login";
import misc from "../../../mixins/misc";
import fetch from "../../../mixins/fetch";
import newItem from "../../../mixins/newItem";
import deleteItem from "../../../mixins/deleteItem";

import navBackLink from "../../misc/nav/navBackLink.vue";
import navBars from "../../misc/nav/navBars.vue";

import segment from "../../misc/segment.vue";
import generalButton from "../../misc/generalButton.vue";

export default {
	data() {
		return {
			userid: parseInt(localStorage.admin_userid),
			eventid: parseInt(localStorage.admin_eventid),
			desktop: device.desktop,
			projectid: parseInt(this.f7route.params.projectId),
			newsitemid: parseInt(this.f7route.params.newsitemId),
			table: "newsitem",
			buttonActive: false,
			value: {
				title: null,
				message: null,
			},
			changed: {
				title: false,
				category: false,
				message: false,
			},
		};
	},
	props: {
		f7route: Object,
	},
	components: {
		navBackLink,
		navBars,
		segment,
		generalButton,
	},
	mixins: [login, misc, fetch, newItem, deleteItem],
	computed: {
		allowSubmit() {
			if (this.action == "NEW") {
				var changed = this.changed;
				var allChanged = true;

				var fields = ["title", "category", "message"];
				fields.forEach((field) => {
					if (changed[field] === false) {
						allChanged = false;
					}
				});
				return allChanged;
			} else {
				var changed = this.changed;
				var update = false;

				var fields = ["title", "category", "message"];
				fields.forEach((field) => {
					if (changed[field] === true) {
						update = true;
					}
				});
				return update;
			}
		},
		action() {
			if (this.f7route.params.newsitemId) {
				return "UPDATE";
			} else {
				return "NEW";
			}
		},
		getDirectoryentries() {
			var item = {
				table: "directoryentry",
				key: "eventid",
				id: this.eventid,
				type: "multiple",
			};
			return store.getters.getData(item);
		},
		getProject() {
			var item = {
				table: "project",
				key: "id",
				id: this.projectid,
				type: "single",
			};
			this.previousId = this.projectid;
			return store.getters.getData(item);
		},
		getNewsitem() {
			if (this.action == "UPDATE") {
				var item = {
					table: this.table,
					key: "id",
					id: this.newsitemid,
					type: "single",
				};

				var data = store.getters.getData(item);
				if (data) {
					return data;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},
	},
	methods: {
		isSelected(id) {
			if (id == this.getNewsitem.newsitem_directoryentryid) {
				return true;
			}
		},
		setValue(field) {
			if (this.getNewsitem) {
				console.log(field);
				return this.getNewsitem["newsitem_" + field];
			}
		},		
		change(value, type) {
			if (type == "category") {
				value = parseInt(value);
			}
			this.value[type] = value;
			this.changed[type] = true;
		},
		deleteItem() {
			this.deleteItemButton(
				this.getNewsitem.newsitem_id,
				this.table,
				this.getNewsitem.newsitem_title
			);
		},
		buttonAction() {
			if (this.action == "NEW") {
				return "POST";
			} else {
				return "UPDATE";
			}
		},
		clearForm() {
			this.value.title = null;
			this.value.category = null;
			this.value.message = null;
			this.changed.title = false;
			this.changed.category = false;
			this.changed.message = false;
		},
		submit() {
			if (this.allowSubmit === true) {
				if (this.action == "NEW") {
					var json = {
						userid: this.userid,
						eventid: this.eventid,
						title: this.value.title,
						detail: this.value.message,
						projectid: this.projectid,
						directoryentryid: this.value.category,
						table: this.table,
					};

					var displayName = this.getProject.project_name;

					this.newItem(json, this.table, true, displayName);

					this.allowSubmit = false;
				} else {
					var item = {
						table: this.table,
						key: "id",
						id: this.newsitemid,
						type: "single",
					};
					var newsitem = store.getters.getData(item);

					newsitem.newsitem_title = this.value.title;
					newsitem.newsitem_detail = this.value.message;
					newsitem.newsitem_directoryentryid = this.value.category;

					this.updateNewsitem(newsitem);

					this.allowSubmit = false;
				}
			}
		},
		async updateNewsitem(json) {
			var url = store.state.url;
			var url = url + "api/post/update/newsitem";

			var post = [];
			post.push(json);

			f7.preloader.show();

			// Send login post to server
			var method = "POST";
			var response = await this.fetch(url, method, post);

			//Check if the network is too slow
			if (this.networkError(response) == true) {
				return false;
			}

			//console.log(response);

			if (response[0].status == "success") {
				new Date();
				var unixtime = Date.now() / 1000;

				var item = {};
				item.table = this.table;
				item.json = post[0];
				item.json.newsitem_unixtime = unixtime;

				store.dispatch("updateItemApp", item);
				store.dispatch("updateItemDB", item);

				f7.preloader.hide();

				$$(".page-previous").remove();

				var toast = f7.toast.create({
					text: "Post updated!",
					position: "center",
					closeTimeout: 1500,
				});
				toast.open();

				var vue = this;
				var view = f7.views.current;

				var url = "/news/" + vue.projectid + "/";
				view.router.back(url, { ignoreCache: true });
			} else {
				f7.preloader.hide();
				f7.dialog.alert(response[0].message);
			}
		},
	},
	mounted() {
		var vue = this;
		f7ready((f7) => {
			if (this.action == "UPDATE" && this.getNewsitem) {
				vue.value.title = this.getNewsitem.newsitem_title;
				vue.value.category = this.getNewsitem.newsitem_directoryentryid;
				vue.value.message = this.getNewsitem.newsitem_detail;
				vue.changed.title = false;
				vue.changed.category = false;
				vue.changed.message = false;				
			}
		});
	},
};
</script>

<style scoped>
</style>
