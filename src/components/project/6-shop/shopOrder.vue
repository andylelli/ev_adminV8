<template>
	<f7-sheet
		class="c3-order"
		style="height: auto;"
		swipe-to-close
		backdrop
	>
		<f7-page-content>
			<div class="swipe-handler"></div>
			<f7-block class="no-margin">
				<div
					class="block-title block-title-medium margin-top"
					v-html="'Order No. ' + this.getOrder.order_id"
				></div>
				<div
					class="display-flex padding justify-content-space-between align-items-center"
				>
					<div style="font-size: 18px"><b>Total:</b></div>
					<div style="font-size: 22px">
						<b v-html="'&pound;' + this.totalOrderPrice"></b>
					</div>
				</div>
				<div class="block-title block-title-medium margin-top">
					Your order:
				</div>
				<f7-list style="margin-top: 0px">
					<f7-list-item
						v-for="(item, index) in this.getOrderLineitems"
						:key="index"
						:title="orderItemTitle(item)"
						:footer="orderItemFooter(item)"
						:after="orderItemTotal(item)"
					>
					</f7-list-item>
				</f7-list>
				<div class="padding-horizontal padding-bottom">
					<a
						@click="sendToCart()"
						class="button button-large button-fill"
						>REORDER</a
					>
				</div>
			</f7-block>
		</f7-page-content>
	</f7-sheet>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import newItem from "../../../mixins/newItem";
import misc from "../../../mixins/misc";
import login from "../../../mixins/login";

export default {
	name: "shop-order",
	data() {
		return {
			eventid: parseInt(localStorage.id),
			projectid: parseInt(this.f7route.params.projectId),
		};
	},
	mixins: [newItem, misc, login],
	computed: {
		totalOrderPrice() {
			var subtotal = 0;
			var total = 0;
			var lineitems = this.getOrderLineitems;
			var len = lineitems.length;

			if (len > 0) {
				for (var i = 0; i < len; i++) {
					var shopitemid = lineitems[i].orderdetail_shopitemid;
					var shopitem = this.shopItem(shopitemid);
					subtotal =
						parseFloat(shopitem.shopitem_price) *
						parseInt(lineitems[i].orderdetail_quantity);
					total = total + subtotal;
				}
				total = total.toFixed(2);
				return total;
			}
		},
		getOrder() {
			var shoporder = store.state.shoporder;
			var shopid = this.shopId();

			var find = shoporder.filter(function (result) {
				return result.shopid === shopid;
			});
			if (find.length > 0) {
				var orderid = find[0].orderid;
				var order = store.state.order;
				var find = order.filter(function (result) {
					return result.order_id === orderid;
				});
				return find[0];
			} else {
				return false;
			}
		},
		getOrderLineitems() {
			var shoporder = store.state.shoporder;
			var shopid = this.shopId();

			var find = shoporder.filter(function (result) {
				return result.shopid === shopid;
			});
			if (find.length > 0) {
				var orderid = find[0].orderid;
				var orderdetail = store.state.orderdetail;
				var find = orderdetail.filter(function (result) {
					return result.orderdetail_orderid === orderid;
				});
				return find;
			} else {
				return false;
			}
		},
	},
	methods: {
		orderItemTotal(orderitem) {
			var shopitemid = orderitem.orderdetail_shopitemid;
			var shopitem = store.state.shopitem;

			var find = shopitem.filter(function (result) {
				return result.shopitem_id === shopitemid;
			});
			var item = find[0];
			let str =
				"£" +
				parseFloat(
					item.shopitem_price * orderitem.orderdetail_quantity
				).toFixed(2);
			return str;
		},
		orderItemTitle(orderitem) {
			var shopitemid = orderitem.orderdetail_shopitemid;
			var shopitem = store.state.shopitem;

			var find = shopitem.filter(function (result) {
				return result.shopitem_id === shopitemid;
			});
			var item = find[0];
			let str =
				item.shopitem_name + " x " + orderitem.orderdetail_quantity;
			return str;
		},
		orderItemFooter(orderitem) {
			var shopitemid = orderitem.orderdetail_shopitemid;
			var shopitem = store.state.shopitem;

			var find = shopitem.filter(function (result) {
				return result.shopitem_id === shopitemid;
			});
			var item = find[0];
			let str =
				item.shopitem_text +
				" @ £" +
				parseFloat(item.shopitem_price).toFixed(2);
			return str;
		},
		openPicker(item) {
			store.dispatch("setPickerItem", item);
			f7.sheet.open(".c3-item-picker", true);
		},
		shopId() {
			var projectid = this.projectid;
			var find = store.state.shop.filter(function (result) {
				return result.shop_projectid === parseInt(projectid);
			});
			if (find.length > 0) {
				return find[0].shop_id;
			} else {
				return false;
			}
		},
		shopItem(id) {
			var shopitem = store.state.shopitem;
			var find = shopitem.filter(function (result) {
				return result.shopitem_id === id;
			});
			if (find.length > 0) {
				return find[0];
			}
		},
		sendToCart() {
			new Date();
			var unixtime = Date.now() / 1000;

			var lineitems = this.getOrderLineitems;
			var items = [];
			var shopid = this.shopId();
			var vue = this;
			lineitems.forEach(function (lineitem) {
				var shopitem = vue.shopItem(lineitem.orderdetail_shopitemid);

				var item = {
					id: lineitem.orderdetail_shopitemid,
					name: shopitem.shopitem_name,
					text: shopitem.shopitem_text,
					price: shopitem.shopitem_price,
					quantity: lineitem.orderdetail_quantity,
					shopid: shopid,
				};
				items.push(item);
			});
			store.dispatch("addItemsToCart", items);
			f7.sheet.close(".c3-orderhistory", true);
			f7.sheet.close(".c3-order", true);
			setTimeout(function () {
				f7.sheet.open(".c3-shopcart", true);
			}, 500);
		},
	},
	mounted() {
		f7ready((f7) => {
			console.log("Directory entry list loaded successfully");
		});
	},
};
</script>

<!-- <style scoped>

</style>-->