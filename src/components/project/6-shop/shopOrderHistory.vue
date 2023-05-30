<template>
	<f7-sheet
		class="c3-orderhistory"
		style="height: auto;"
		swipe-to-close
		backdrop
	>
		<f7-page-content>
			<div class="block-title block-title-medium margin-top margin-bottom">Order History</div>
			<f7-list>
				<f7-list-item
					v-for="(item, index) in this.orderHistory"
					:key="index"
					:title="orderNumber(item.order_id)"
					:after="'£' + orderTotal(item.order_id)"
					:footer="
						orderInfo(
							item.order_id,
							item.order_shopid,
							item.order_datetime
						)
					"
					@click="selectOrder(item.order_id)"
				>
				</f7-list-item>
			</f7-list>
		</f7-page-content>
	</f7-sheet>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

export default {
	name: "shop-order-history",
	data() {
		return {
			projectid: parseInt(this.f7route.params.projectId),
		};
	},
	computed: {
		orderHistory() {
			var shopid = this.shopId();
			var orderhistory = store.getters.getOrderHistory(shopid);
			return orderhistory;
		},
	},
	methods: {
		selectOrder(orderid) {
			var json = {
				orderid: orderid,
				shopid: this.shopId(),
			};
      		store.dispatch("setOrder", json);
			f7.sheet.open(".c3-order", true);			  
		},
		orderNumber(orderid) {
			return "Order No. " + orderid;
		},
		orderTotal(orderid) {
			var total = 0;
			var orderdetail = store.state.orderdetail;
			var shopitems = store.state.shopitem;

			orderdetail.forEach(function (item) {
				if (item.orderdetail_orderid == orderid) {
					var find = shopitems.filter(function (result) {
						return (
							result.shopitem_id === item.orderdetail_shopitemid
						);
					});

					var price = find[0].shopitem_price;
					var subtotal = item.orderdetail_quantity * price;
					total += subtotal;
				}
			});

			var value = parseFloat(total).toFixed(2);

			return value;
		},
		orderInfo(orderid, shopid, unixtime) {
			var shopname = this.getShopName(shopid);
			var datetime = this.unixtimeConversion(unixtime);
			return shopname + " - " + datetime;
		},
		unixtimeConversion(unixtime) {
			var a = new Date(unixtime * 1000);
			var months = [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec",
			];
			var year = a.getFullYear();
			var month = months[a.getMonth()];
			var date = a.getDate();
			var hour = "0" + a.getHours();
			var min = "0" + a.getMinutes();
			var sec = "0" + a.getSeconds();

			var time =
				date +
				" " +
				month +
				" " +
				year +
				" " +
				hour.substr(-2) +
				":" +
				min.substr(-2) +
				":" +
				sec.substr(-2);

			return time;
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
		getShopName(shopid) {
			var find = store.state.shop.filter(function (result) {
				return result.shop_id === shopid;
			});
			var projectid = find[0].shop_projectid;

			if (projectid != null) {
				var project = store.state.project;
				var find = project.filter(function (result) {
					return result.project_id === projectid;
				});
				var shopname = find[0].project_name;
			}
			return shopname;
		},
	},
	mounted() {
		f7ready((f7) => {
			console.log("Shop order history component loaded successfully");
		});
	},
};
</script>

<!-- <style scoped>

</style>-->