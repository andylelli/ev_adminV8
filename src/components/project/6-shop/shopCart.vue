<template>
  <f7-sheet
    class="c3-shopcart"
    style="height: auto;"
    swipe-to-close
    backdrop
  >
    <f7-page-content>
      <div class="swipe-handler"></div>
      <f7-block class="no-margin">
        <div
          class="display-flex padding justify-content-space-between align-items-center"
        >
          <div style="font-size: 18px"><b>Total:</b></div>
          <div style="font-size: 22px">
            <b v-html="'&pound;' + this.totalCartPrice"></b>
          </div>
        </div>
        <div
          v-if="this.shopCart.length > 0"
          class="block-title block-title-medium margin-top"
        >
          Your order:
        </div>
        <div
          v-else
          class="block-title block-title-medium margin-top text-align-center"
        >
          (Empty)
        </div>
        <f7-list style="margin-top: 0px">
          <f7-list-item
            v-for="(item, index) in this.shopCart"
            :key="index"
            :title="cartItemTitle(item.id)"
            :footer="cartItemFooter(item.id)"
            :after="cartItemTotal(item.id)"
            @click="openPicker(item)"
          >
          </f7-list-item>
        </f7-list>
        <div
          v-if="this.shopCart.length > 0"
          class="padding-horizontal padding-bottom"
        >
          <a
            @click="pay()"
            class="button button-large button-fill"
            >PAY</a
          >
        </div>
        <div v-else class="padding-bottom margin-bottom"></div>
      </f7-block>
    </f7-page-content>
  </f7-sheet>
</template>

<script>
import store from "../../../vuex/store.js";

import { f7, f7ready } from "framework7-vue";

import newItem from "../../../mixins/newItem";
import misc from "../../../mixins/misc";
import fetch from "../../../mixins/fetch";

export default {
  name: "shopcart",
  data() {
    return {
      userid: parseInt(localStorage.user_userid),
      eventid: parseInt(localStorage.id),   
      projectid: parseInt(this.f7route.params.projectId),
			apptype: "user",      
			appurl: store.state.url,
			validate: store.state.validate,      
    };
  },
  mixins: [newItem, misc, fetch],  
  computed: {
    shopCart() {
      var shopid = this.shopId();
      var shopcart = store.getters.getShopcart(shopid);
      return shopcart;
    },
    totalCartPrice() {
      var subtotal = 0;
      var total = 0;

      if (this.shopCart.length > 0) {
        this.shopCart.forEach(function (item) {
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
    orderModalCheck() {
      var vue = this;
      var state = $$(".c3-shopcart").hasClass("modal-in");
      var oldState = state;

      window.setInterval(function () {
        var state = $$(".c3-shopcart").hasClass("modal-in");
        var newState = state;

        if (newState !== oldState) {
          //Reinstate backdrop if order cart is open
          var cartsheet = app.sheet.get(".c3-orderhistory");
          var opened = cartsheet.$el.hasClass("modal-in");
          if (opened === true) {
            $$(".sheet-backdrop").addClass("backdrop-in");
          }

          oldState = newState;
        }
      }, 10);
    },
    shopCartItem(id) {
      var shopid = this.shopId();
      var json = {
        shopid: shopid,
        id: id,
      };
      var shopcartitem = store.getters.getShopCartItem(json);
      return shopcartitem;
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
    cartItemTotal(id) {
      var item = this.shopCartItem(id);
      let itemTotal = "£" + parseFloat(item.price * item.quantity).toFixed(2);
      return itemTotal;
    },
    cartItemTitle(id) {
      var item = this.shopCartItem(id);
      let str = item.name + " x " + item.quantity;
      return str;
    },
    cartItemFooter(id) {
      var item = this.shopCartItem(id);
      let str = item.text + " @ £" + parseFloat(item.price).toFixed(2);
      return str;
    },
    openPicker(item) {
      store.dispatch("setPickerItem", item);
      f7.sheet.open(".c3-item-picker", true);
    },
    pay() {
      new Date();
      var unixtime = Date.now() / 1000;

      var newOrder = {
        header: {
          id: "444555",
          shopid: this.shopId(),
          eventid: this.eventid,
          unixtime: unixtime,
        },
        lineitems: this.shopCart,
      };
      f7.dialog.preloader("Sending order...");

      var result = this.newItem(newOrder, "order", false);

      var vue = this;
      setTimeout(function(){ 
      store.dispatch("emptyCart", vue.shopCart);
      f7.sheet.close(".c3-shopcart", true);
      }, 1500);      
    },
  },
  mounted() {
    f7ready((f7) => {
      console.log("Shopping cart sheet loaded.");
    });
    //this.orderModalCheck();
  },
};
</script>

<!-- <style scoped>

</style>-->