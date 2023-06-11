<template>
	<f7-page
		stacked
		name="shop"
	>
		<f7-navbar>
			<nav-back-link :page="'main'" :id="eventid"></nav-back-link>
			<f7-nav-title v-if="getProject"
				><div v-html="getProject.project_name"></div
			></f7-nav-title>
			<f7-nav-right>
				<font-awesome-icon
					@click="openShopcart()"
					style="
						margin-right: 5px;
						font-size: 24px;
						color: rgba(var(--f7-theme-color-rgb), 1);
					"
					:icon="['fal', 'shopping-bag']"
				/>
				<f7-badge
					v-if="this.cartQuantity !== false"
					class="custom-background-colour"
				>
					<div v-html="this.cartQuantity"></div>
				</f7-badge>
			</f7-nav-right>
		</f7-navbar>
		<image-load table="project" :id="getProject.project_id"></image-load>
		<list
			table="shopitem"
			:id="getShop.shop_id"
			:image="getShop.shop_imageid"
			title="true"
			after="price"
			text="text"
			shop="true"
			chevron="false"
			favourite="false"
			sortable="true"
		></list>
		<shopitem-picker></shopitem-picker>
		<shop-cart></shop-cart>
		<shop-order-history></shop-order-history>
		<shop-order></shop-order>
	</f7-page>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import login from "../../../mixins/login";
import misc from "../../../mixins/misc";

import navBackLink from "../../misc/nav/navBackLink.vue";
import navBars from "../../misc/nav/navBars.vue";
import imageLoad from "../../misc/imageLoad.vue";

import list from "../../misc/list.vue";
import shopitemPicker from "./shopitemPicker.vue";
import shopCart from "./shopCart.vue";
import shopOrderHistory from "./shopOrderHistory.vue";
import shopOrder from "./shopOrder.vue";

export default {
	data() {
		return {
			eventid: store.state.eventid,
			role: store.state.role,
			projectid: parseInt(this.f7route.params.projectId),
		};
	},
	components: {
		navBackLink,
		navBars,
		imageLoad,
		list,
		shopitemPicker,
		shopCart,
		shopOrderHistory,
		shopOrder,
	},
	mixins: [login, misc],
	computed: {
		getProject() {
			var item = {
				table: "project",
				key: "id",
				id: this.projectid,
				type: "single",
			};
			return store.getters.getData(item);
		},
		getShop() {
			var item = {
				table: "shop",
				key: "projectid",
				id: this.projectid,
				type: "single",
			};
			return store.getters.getData(item);
		},
		cartQuantity() {
			var quantity = store.getters.getCartQuantity(this.getShop.shop_id);
			if (quantity) {
				return quantity;
			} else {
				return false;
			}
		},
	},
	methods: {
		openShopcart() {
			f7.sheet.open(".c3-shopcart", true);
		},
	},
	mounted() {
		f7ready((f7) => {});
	},
};
</script>
