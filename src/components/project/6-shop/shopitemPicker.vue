<template>
	<f7-sheet
		class="c3-item-picker"
		style="height: auto;"
		swipe-to-close
		backdrop
		@sheet:open="sheetOpen()"
	>
		<f7-page-content>
			<f7-block class="no-margin">
				<div
					class="display-flex padding justify-content-space-between align-items-center"
				>
					<div style="font-size: 18px"><b>Total:</b></div>
					<div style="font-size: 22px">
						<b v-html="'&pound;' + this.totalCartPrice"></b>
					</div>
				</div>
			</f7-block>
			<f7-block class="no-margin-top" style="border: 1px solid #f6f6f6">
				<div
					class="block-title block-title-medium margin-top text-align-center"
					v-html="this.item.name"
				></div>
				<div></div>
				<div
					class="block-title block-title-medium margin-top text-align-center"
				>
					<img :src="this.item.image" width="60" />
				</div>
				<div
					class="block-header text-align-center"
					v-html="this.item.text"
				></div>
				<div class="margin-bottom text-align-center">
					<div
						class="block margin-top text-align-center"
						v-html="this.itemPickerCalculation"
					></div>
					<div
						class="block-title block-title-medium margin-top text-align-center"
						v-html="this.itemPickerPrice"
					></div>
				</div>
			</f7-block>
			<f7-block>
				<div align="center">
					<f7-stepper
						large
						fill
						id="c3-stepper-input"
						@stepper:change="setQuantity"
					></f7-stepper>
				</div>
				<f7-block id="remove-done">
					<f7-row>
						<f7-col>
							<f7-button large fill @click="orderRemove()">
								REMOVE
							</f7-button>
						</f7-col>
						<f7-col>
							<f7-button large fill @click="orderDone()">
								DONE
							</f7-button>
						</f7-col>
					</f7-row>
				</f7-block>
				<f7-block id="cancel-add">
					<f7-row>
						<f7-col>
							<f7-button large fill @click="orderCancel()">
								CANCEL
							</f7-button>
						</f7-col>
						<f7-col>
							<f7-button large fill @click="orderAdd()">
								ADD
							</f7-button>
						</f7-col>
					</f7-row>
				</f7-block>
			</f7-block>
		</f7-page-content>
	</f7-sheet>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

export default {
	name: "shopitem-picker",
	data() {
		return {
			projectid: parseInt(this.f7route.params.projectId),
		};
	},
	computed: {
		item() {
			if (store.state.shopitempicker.length > 0) {
				return store.state.shopitempicker[0];
			} else {
				var item = {
					name: "",
					text: "",
					price: 0,
					quantity: 0,
				};
				return item;
			}
		},
		itemPickerPrice() {
			let itemTotal =
				"&pound;" +
				parseFloat(this.item.price * this.item.quantity).toFixed(2);
			return itemTotal;
		},
		itemPickerCalculation() {
			let text =
				this.item.quantity +
				" x " +
				this.item.name +
				" @ " +
				"&pound;" +
				parseFloat(this.item.price).toFixed(2);
			return text;
		},
		shopcart() {
			var shopid = this.shopId();
			var shopcart = store.getters.getShopcart(shopid);
			return shopcart;
		},
		totalCartPrice() {
			var subtotal = 0;
			var total = 0;
			if (this.shopcart.length > 0) {
				this.shopcart.forEach(function (item) {
					subtotal = parseFloat(item.price) * parseInt(item.quantity);
					total = total + subtotal;
				});

				total = total.toFixed(2);
			} else {
				total = total.toFixed(2);
			}

			return total;
		},
	},
	methods: {
		pickItemModalCheck() {
			var vue = this;
			var state = $(".c3-item-picker").hasClass("modal-in");
			var oldState = state;

			window.setInterval(function () {
				var state = $$(".c3-item-picker").hasClass("modal-in");
				var newState = state;

				if (newState !== oldState) {
					//Reinstate backdrop if order cart is open
					var cartsheet = f7.sheet.get(".c3-shopcart");
					var opened = cartsheet.$el.hasClass("modal-in");
					if (opened === true) {
						$$(".sheet-backdrop").addClass("backdrop-in");
					}

					oldState = newState;
				}
			}, 10);
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
		checkIfItemIsInCart(item) {
			var find = store.state.shopcart.filter(function (result) {
				return result.id === item.id && result.shopid === item.shopid;
			});
			if (find.length > 0) {
				return find[0];
			} else {
				return false;
			}
		},
		setQuantity(value) {
			this.item.quantity = value;
			var isInCart = this.checkIfItemIsInCart(this.item);
			if (isInCart !== false) {
				store.dispatch("updateCart", this.item);
			}
		},
		sheetOpen() {
			var picker = f7.stepper.get(".stepper");
			var item = this.checkIfItemIsInCart(this.item);

			if (item) {
				this.item.quantity = item.quantity;
				picker.setValue(this.item.quantity);
				$("#remove-done").show();
				$("#cancel-add").hide();
			}

			// IF order item is NOT already in cart ADD
			else {
				picker.setValue(0);
				$("#remove-done").hide();
				$("#cancel-add").show();
			}
		},
		orderCancel() {
			//Close item picker sheet
			f7.sheet.close(".c3-item-picker", true);
		},
		orderRemove() {
			//Close item picker sheet
			f7.sheet.close(".c3-item-picker", true);

			//Remove item from cart and picker
			store.dispatch("removeItemFromCart", this.item);
			store.dispatch("removeItemFromPicker", this.item);
		},
		orderAdd() {
			//Add to basket
			var picker = f7.stepper.get(".stepper");
			if (picker.value > 0) {
				//Add item to cart
				store.dispatch("addItemToCart", this.item);

				//Remove item from picker
				store.dispatch("removeItemFromPicker", this.item);

				//Close order item sheet
				f7.sheet.close(".c3-item-picker", true);
			}
		},
		orderDone() {
			//Close sheet
			f7.sheet.close(".c3-item-picker", true);

			//Remove item from picker
			store.dispatch("removeItemFromPicker", this.item);

			//Remove zero quantity ites from cart
			store.dispatch("removeZeroQuantityFromCart", this.item);
		},
	},
	mounted() {
		f7ready((f7) => {
			console.log("Shop item picker sheet loaded.");
		});
		this.pickItemModalCheck();
	},
};
</script>

<!-- <style scoped>

</style>-->