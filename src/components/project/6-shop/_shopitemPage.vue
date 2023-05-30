<template>
	<f7-page stacked name="shopitem">
		<!-- Nav bar-->
		<f7-navbar>
			<nav-back-link
				:page="'shop'"
				:id="this.getProject.project_id"
			></nav-back-link>
			<f7-nav-title
				><div v-html="this.getShopitem.shopitem_name"></div
			></f7-nav-title>
			<nav-bars></nav-bars>
		</f7-navbar>
		<!-- Main section-->	
		<segment header="Name">
			<field-edit-text
				type="single"
				:id="this.getShopitem.shopitem_id"
				table="shopitem"
				fieldname="name"
			></field-edit-text>
		</segment>
		<segment v-if="this.getShop.shop_imageid === 1" :header="this.getShopitem.shopitem_name + ' Image'">
			<image-load
				:id="this.getShopitem.shopitem_id"
				table="shopitem"
			></image-load>
		</segment>		
		<segment header="Item Details">
			<field-edit-text
				type="first"
				:id="this.getShopitem.shopitem_id"
				table="shopitem"
				fieldname="text"
			></field-edit-text>
			<field-edit-text
				type="last"
				:id="this.getShopitem.shopitem_id"
				table="shopitem"
				fieldname="price"
			></field-edit-text>
		</segment>
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
			table="shopitem"
			:alias="this.getProject.project_name"
		></sheet-edit>
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
import imageLoad from "../../misc/imageLoad.vue";
import fieldEditText from "../../misc/fieldEditText.vue";
import generalButton from "../../misc/generalButton.vue";

import sheetEdit from "../../sheet/sheetEdit.vue";

export default {
	data() {
		return {
			id: parseInt(this.f7route.params.shopitemId),
			desktop: device.desktop,
			previousPage: "shop",			
		};
	},
	components: {
		navBackLink,
		navBars,
		segment,
		imageLoad,
		fieldEditText,
		generalButton,		
		sheetEdit,
	},
	mixins: [login, misc, fetch, newItem, deleteItem],
	computed: {
		getProject() {
			var item = {
				table: "project",
				key: "id",
				id: this.getShop.shop_projectid,
				type: "single",
			};
			var data = store.getters.getData(item);
			if (data) {
				return data;
			} else return false;
		},
		getShop() {
			var item = {
				table: "shop",
				key: "id",
				id: this.getShopitem.shopitem_shopid,
				type: "single",
			};
			var data = store.getters.getData(item);
			if (data) {
				return data;
			} else {
				return false;
			}
		},
		getShopitem() {
			var item = {
				table: "shopitem",
				key: "id",
				id: this.id,
				type: "single",
			};
			var data = store.getters.getData(item);
			if (data) {
				return data;
			} else {
				return false;
			}
		},
	},
	methods: {
		deleteItem() {
			this.deleteItemButton(
				this.getShopitem.shopitem_id,
				"shopitem",
				this.getShopitem.shopitem_name
			);
		},		
	},
	mounted() {
		f7ready((f7) => {
			this.$watch(
				"getShopitem",
				function (newValue, oldValue) {
					if (this.getShopitem) {
						new Date();
						var unixtime = Date.now() / 1000;

						var item = {};
						item.table = "shopitem";
						item.json = this.getShopitem;
						console.log(item);

						store.dispatch("updateItemDB", item);

						localStorage.admin_update_shopitem_time = unixtime;
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
